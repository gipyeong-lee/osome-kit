/*
Extension Class
*/
'use strict'

import './../css/style.css'
import utils from './../../../common/util'

//
var OsomeCalendar = {
    endNum: 34,
    events: [],
    focus: {
        // start,end,last is unique number of tiles.
        current: undefined,
        type: undefined, // create, resize, move
        start: undefined,
        end: undefined,
        last: undefined
    },
    onDragEndTile: function (start, end, renderOption) {
    },
    onClickSchedule: function (element, category, event, e) {
        console.log('onClickSchedule')
    },
    onChangedSchedule: function (order, before, after) {
    },
    onClickMoreButton: function (element, events) {
        console.log(element, events)
    },
    //
    eventOption: {
        style: {
            height: 20
        }
    },
    eventCounter: {},
    eventRenderCounter: {},
    //
    options: {
        maxEvent: 15,
        style: {
            grid: {
                width: 800
            },
            row: {
                minHeight: 180
            },
            cellHeader: {
                height: 30,
                fontSize: '0.8em',
                textAlign: 'center',
                gap: 30
            },
            todayHeader: {
                backgroundColor: 'red',
                numberColor: 'white',
                titleColor: 'red'
            },
            holidayHeader: {
                backgroundColor: '',
                numberColor: 'white',
                titleColor: 'red'
            }
        },
        country: 'jp',
        days: { ko: ['일', '월', '화', '수', '목', '금', '토'], jp: ['日', '月', '火', '水', '木', '金', '土'] },
        moreButton: { ko: '+ 더보기', jp: '+ もっと見る' },
        today: new Date(),
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        eventPopup: { html: 'test' }
    },
    iteral: function (key, value, result) {
        if (key === undefined) {
            const keys = Object.keys(value)
            keys.map((k) => {
                this.iteral(k, value[k], result)
            })
        }
        else if (typeof value === 'object') {
            const keys = Object.keys(value)
            keys.map((k) => {
                if (!result[key]) {
                    result[key] = {}
                }
                this.iteral(k, value[k], result[key])
            })
        }
        else {
            result[key] = value
        }
    },
    init: function (id = 'osome-cal-calendar', opt = {}, categories = []) {
        let self = this
        self.iteral(undefined, opt, this.options)
        let _options = this.options
        // let _options = Object.assign({}, this.options, opt)
        // self.options = _options
        let _calendarGrid = document.getElementById(id)
        self.categories = categories
        self.clear(_calendarGrid)
        self.createGrid(_calendarGrid, _options)
        self.attachGridEvent(_calendarGrid)
        self.createEvents(_options)
        self.setupMoreButton()
    },
    randomColor: function () {
        return '#' + (Math.random().toString(16) + "000000").substring(2, 8)
    },
    clear: function (element) {
        const self = this
        self.eventCounter = {}
        self.eventRenderCounter = {}
        element.innerHTML = ''
    },
    clearFocus: function () {
        let self = this
        self.focus.type = undefined
        self.focus.end = undefined
        self.focus.start = undefined
        self.focus.current = undefined
        self.clearSelectedBlock()
    },
    attachEvent: function (startNum, endNum, eventOption) {
        let self = this
        const tilePrefix = 'osome-cal-grid-day-tile-'
        let _eventOption = Object.assign({}, self.eventOption, eventOption)
        _eventOption.style = Object.assign({}, self.eventOption.style || {}, eventOption.style || {})
        let startTile = document.getElementById(`${tilePrefix}${startNum}`)
        let endTile = document.getElementById(`${tilePrefix}${endNum}`)
        if (startTile == null || endTile == null) {
            return
        }
        self.createEventBlock(startTile, endTile, _eventOption)
    },
    createHandler(week, startNum, endNum, eventOption) {
        let _eventHandler = document.createElement('span')
        _eventHandler.className = `event-block-handler-${eventOption.order}-${eventOption.index} resize-handle handler-y`
        _eventHandler.innerHTML = '&nbsp;'
        _eventHandler.setAttribute('week', week)
        _eventHandler.setAttribute('startNum', startNum)
        _eventHandler.setAttribute('endNum', endNum)
        _eventHandler.setAttribute('order', eventOption.order)
        _eventHandler.setAttribute('index', eventOption.index)
        return _eventHandler
    },
    createBlock(week, startNum, endNum, eventOption) {
        const self = this
        let _eventBlock = document.createElement('div')
        _eventBlock.draggable = true
        _eventBlock.ondragstart = function (event) {
            self.onBlockDragStart(event, this, self)
        }
        _eventBlock.ondragend = function (event) {
            self.onBlockDragEnd(event, this, self)
        }
        _eventBlock.id = `event-block-${eventOption.order}-${eventOption.index}-${week}`
        _eventBlock.className = `event-block event-block-${eventOption.order}-${eventOption.index}`
        if (eventOption.style !== undefined) {
            for (const [key, value] of Object.entries(eventOption.style)) {
                _eventBlock.style[key] = value
            }
        }
        _eventBlock.setAttribute('order', eventOption.order)
        _eventBlock.setAttribute('index', eventOption.index)
        _eventBlock.setAttribute('week', week)
        _eventBlock.setAttribute('startNum', startNum)
        _eventBlock.setAttribute('startDayNum', 0)
        _eventBlock.setAttribute('endNum', endNum)
        _eventBlock.setAttribute('endDayNum', 6)
        _eventBlock.style.height = `${eventOption.style.height || 20}px`
        _eventBlock.style.marginBottom = `${eventOption.style.marginBottom || 2}px`
        
        
        const startDate = new Date(eventOption.startDate)
        const endDate = new Date(eventOption.endDate)
        
        let _eventText = document.createElement('span')
        _eventText.classList = "title"
        _eventText.innerText = `${eventOption.title} (${startDate.midasFormat()} ~ ${endDate.midasFormat()})`
        _eventText.style.paddingLeft = "5px"
        _eventText.setAttribute('order', eventOption.order)
        _eventText.setAttribute('index', eventOption.index)
        _eventBlock.append(_eventText)
        return _eventBlock
    },
    countEvent(week, number) {
        const self = this
        if (!self.eventCounter[week]) {
            self.eventCounter[week] = { total: 0 }
        }
        if (!self.eventCounter[week][number]) {
            self.eventCounter[week][number] = 0
        }
        self.eventCounter[week][number] += 1
    },

    countWeekEvent(week) {
        const self = this
        if (!self.eventCounter[week]) {
            self.eventCounter[week] = { total: 0 }
        }
        self.eventCounter[week].total += 1
    },
    discountEventCounter(week, startNum, endNum) {
        const self = this
        const tilePrefix = 'osome-cal-grid-day-tile-'
        for (let i = startNum; i <= endNum; i++) {
            if (self.eventCounter[week][i]) {
                self.eventCounter[week][i] -= 1
            }
        }
    },
    renderEventBlock(startTile, endTile, eventOption) {
        const self = this
        const tileWidth = 100 / 7
        const weekPrefix = 'osome-cal-grid-week-'
        const weekSchedulePrefix = 'osome-cal-grid-week-schedule-'
        const _startNum = startTile.getAttribute('number').toNumber()
        const _startDayNum = startTile.getAttribute('dayNum').toNumber()
        const _startWeek = startTile.getAttribute('week').toNumber()
        const _endNum = endTile.getAttribute('number').toNumber()
        const _endWeek = endTile.getAttribute('week').toNumber()
        const _endDayNum = endTile.getAttribute('dayNum').toNumber()
        // full date
        // week schedule.
        const totalDays = _endNum - _startNum + 1
        const idx = eventOption.index
        const order = eventOption.order
        let _event = Object.assign({}, eventOption)
        _event.start = _startNum
        _event.total = totalDays

        self.categories[order].events[idx] = _event
        const eventBlockHeight = self.eventOption.style.height || 20
        const eventBlockMargin = eventOption.style.marginBottom || 2
        for (var i = _startWeek; i <= _endWeek; i++) {
            const _eventBlock = self.createBlock(i, i * 7, (i + 1) * 7 - 1, _event)
            const _eventHandler = self.createHandler(i, _startNum, _endNum, _event)
            _eventBlock.append(_eventHandler)
            const _weekScheduleEl = document.getElementById(`${weekSchedulePrefix}${i}`)
            const _weekEl = document.getElementById(`${weekPrefix}${i}`)

            const _childrenOfweekEl = _weekScheduleEl.childElementCount
            if (_childrenOfweekEl >= Number(self.options.maxEvent)) {

                continue;
            }

            if (i === _startWeek) {
                const left = startTile.style.left
                let size = _endDayNum - _startDayNum + 1
                if (_startWeek !== _endWeek) {
                    size = 7 - _startDayNum
                }
                const width = `${(tileWidth * (size))}%`
                _eventBlock.style.left = left
                _eventBlock.style.width = width
                if (_startWeek !== _endWeek) {
                    _eventBlock.className += " block-right"
                }
                _eventBlock.setAttribute('startNum', _startNum)
                _eventBlock.setAttribute('startDayNum', _startDayNum)
                if (_startWeek === _endWeek) {
                    _eventBlock.setAttribute('endNum', _endNum)
                    _eventBlock.setAttribute('endDayNum', _endDayNum)
                }
                _weekScheduleEl.append(_eventBlock)
                _weekEl.style.height = `${(eventBlockHeight + eventBlockMargin) * (_weekScheduleEl.childNodes.length + 1) + self.options.style.cellHeader.height + self.options.style.cellHeader.gap}px`
            }
            else if (i === _endWeek) {
                const left = 0
                let size = _endDayNum + 1
                const width = `${(tileWidth * (size))}%`
                _eventBlock.style.left = left
                _eventBlock.style.width = width
                _eventBlock.setAttribute('endNum', _endNum)
                _eventBlock.setAttribute('endDayNum', _endDayNum)
                _weekScheduleEl.append(_eventBlock)
                _weekEl.style.height = `${(eventBlockHeight + eventBlockMargin) * (_weekScheduleEl.childNodes.length + 1) + self.options.style.cellHeader.height + self.options.style.cellHeader.gap}px`
            }
            else {
                const left = 0
                let size = 7
                const width = `${(tileWidth * (size))}%`
                _eventBlock.style.left = left
                _eventBlock.style.width = width
                _eventBlock.className += " block-right"
                _weekScheduleEl.append(_eventBlock)
                _weekEl.style.height = `${(eventBlockHeight + eventBlockMargin) * (_weekScheduleEl.childNodes.length + 1) + self.options.style.cellHeader.height + self.options.style.cellHeader.gap}px`
            }
        }
        // self.syncGridHeight()
    },
    createEventBlock(startTile, endTile, eventOption) {
        const self = this
        const tileWidth = 100 / 7
        const weekPrefix = 'osome-cal-grid-week-'
        const weekSchedulePrefix = 'osome-cal-grid-week-schedule-'
        const _startNum = startTile.getAttribute('number').toNumber()
        const _startDayNum = startTile.getAttribute('dayNum').toNumber()
        const _startWeek = startTile.getAttribute('week').toNumber()
        const _endNum = endTile.getAttribute('number').toNumber()
        const _endWeek = endTile.getAttribute('week').toNumber()
        const _endDayNum = endTile.getAttribute('dayNum').toNumber()
        // full date

        // week schedule.
        const totalDays = _endNum - _startNum + 1
        const events = self.categories[order].events || []
        const order = eventOption.order || self.categories.length
        const idx = eventOption.index || events.length

        const eventBlockHeight = self.eventOption.style.height || 20
        const eventBlockMargin = eventOption.style.marginBottom || 2

        let _event = Object.assign({}, { index: idx, order: order }, eventOption)
        _event.start = _startNum
        _event.total = totalDays
        events.insert(idx, _event)
        for (var i = _startWeek; i <= _endWeek; i++) {
            const _eventBlock = self.createBlock(i, i * 7, (i + 1) * 7 - 1, _event)
            const _eventHandler = self.createHandler(i, _startNum, _endNum, _event)
            _eventBlock.append(_eventHandler)
            const _weekScheduleEl = document.getElementById(`${weekSchedulePrefix}${i}`)
            const _weekEl = document.getElementById(`${weekPrefix}${i}`)

            _weekEl.style.height = `${(eventBlockHeight + eventBlockMargin) * (_weekScheduleEl.childNodes.length + 1) + self.options.style.cellHeader.height + self.options.style.cellHeader.gap}px`

            if (i === _startWeek) {
                const left = startTile.style.left
                let size = _endDayNum - _startDayNum + 1
                if (_startWeek !== _endWeek) {
                    size = 7 - _startDayNum
                }
                const width = `${(tileWidth * (size))}%`
                _eventBlock.style.left = left
                _eventBlock.style.width = width
                if (_startWeek !== _endWeek) {
                    _eventBlock.className += " block-right"
                }
                _eventBlock.setAttribute('startNum', _startNum)
                _eventBlock.setAttribute('startDayNum', _startDayNum)
                if (_startWeek === _endWeek) {
                    _eventBlock.setAttribute('endNum', _endNum)
                    _eventBlock.setAttribute('endDayNum', _endDayNum)
                }
                _weekScheduleEl.append(_eventBlock)
            }
            else if (i === _endWeek) {
                const left = 0
                let size = _endDayNum + 1
                const width = `${(tileWidth * (size))}%`
                _eventBlock.style.left = left
                _eventBlock.style.width = width
                _eventBlock.setAttribute('endNum', _endNum)
                _eventBlock.setAttribute('endDayNum', _endDayNum)
                _weekScheduleEl.append(_eventBlock)
            }
            else {
                const left = 0
                let size = 7
                const width = `${(tileWidth * (size))}%`
                _eventBlock.style.left = left
                _eventBlock.style.width = width
                _eventBlock.className += " block-right"
                _weekScheduleEl.append(_eventBlock)
            }
        }
        // self.syncGridHeight()
    },
    clearSelectedBlock: function () {
        let self = this
        const prefix = 'osome-cal-grid-day-tile-'
        const last = self.focus.last
        for (let i = 0; i <= last; i++) {
            const tile = document.getElementById(`${prefix}${i}`)
            if (tile !== null && tile.classList.contains('active')) {
                tile.classList.remove('active')
            }
        }
    },
    createEvents: function (options) {
        const self = this

        const tilePrefix = 'osome-cal-grid-day-tile-'
        const currentMonth = options.month
        const currentYear = options.year
        const indexOfCurrentMonth = currentMonth - 1
        const targetDate = new Date(options.year, indexOfCurrentMonth, 1)

        const startOfDay = targetDate.startOfDay();


        let endOfMonthDate = targetDate.getLastDate()

        const firstTile = document.getElementById(`${tilePrefix}0`)
        self.eventCounter = {}
        self.categories.map((category) => {
            const events = category.events
            events.map((event, idx) => {
                if (event.startDate === undefined || event.endDate === undefined) {
                    console.log(`event must have start, end by Date format`)
                    return
                }

                const num = utils.convertDateToNumber(event.startDate, event.endDate, currentYear, indexOfCurrentMonth, startOfDay, firstTile, endOfMonthDate, self.endNum)
                if (num === undefined) {
                    return
                }

                let startTile = document.getElementById(`${tilePrefix}${num.startNum}`)
                let endTile = document.getElementById(`${tilePrefix}${num.endNum}`)

                event.order = category.content.order
                let prevWeek = -1
                for (let i = num.startNum; i <= num.endNum; i++) {
                    const week = document.getElementById(`${tilePrefix}${i}`).getAttribute('week')
                    self.countEvent(week, i)
                    if (week !== prevWeek) {
                        prevWeek = week
                        self.countWeekEvent(week)
                    }
                }
                self.renderEventBlock(startTile, endTile, event)
            })
        })
    },
    setupMoreButton: function () {
        const self = this
        const tilePrefix = 'osome-cal-grid-day-tile-'
        const cntKeys = Object.keys(self.eventCounter)
        cntKeys.map(key => {
            const counter = self.eventCounter[key]
            const keys = Object.keys(counter)
            keys.filter(k => k !== 'total' && counter.total > self.options.maxEvent).map(k => {
                const cnt = counter[k]
                const tile = document.getElementById(`${tilePrefix}${k}`)
                self.enableMoreButton(tile, cnt)
            })
        })
        self.actuallyRenderEventCount()
    },
    disableMoreButton: function (number) {
        const tilePrefix = 'osome-cal-grid-day-tile-'
        const tile = document.getElementById(`${tilePrefix}${number}`)
        const more_btn = tile.getElementsByClassName('more-btn')[0]
        more_btn.style.display = 'none'
    },
    actuallyRenderEventCount: function () {
        const weekSchedulePrefix = 'osome-cal-grid-week-schedule-'

        // const more_btn = tile.getElementsByClassName('more-btn')[0]
        // more_btn.style.display = 'none'
        const self = this
        const counter = { ...self.eventCounter }
        const weeks = Object.keys(counter)
        weeks.forEach((week) => {
            if (counter[week].total > self.options.maxEvent) {
                const scheduleEl = document.getElementById(`${weekSchedulePrefix}${week}`)
                const children = scheduleEl.children
                for (let i = 0; i < children.length; i++) {
                    const child = children[i]
                    const startNum = Number(child.getAttribute('startNum'))
                    const endNum = Number(child.getAttribute('endNum'))
                    for (let n = startNum; n <= endNum; n++) {
                        counter[week][n] -= 1
                        if (counter[week][n] === 0) {
                            self.disableMoreButton(n)
                        }
                    }
                }
            }
        })
    },
    enableMoreButton: function (tile, count) {
        const self = this
        const more_btn = tile.getElementsByClassName('more-btn')[0]

        const realCount = count
        more_btn.style.display = 'block'
        more_btn.innerText = (self.options.moreButton[self.options.country] || '').replace('{n}', realCount)

    },
    syncGridHeight: function () {
        const wrapper = document.getElementById('osome-cal-grid')
        wrapper.parentNode.style.height = wrapper.style.height
    },
    createCellHeader: function (week, uniqueNum) {
        let cellHeader = document.createElement('div')
        cellHeader.setAttribute('week', week)
        cellHeader.setAttribute('number', uniqueNum)
        cellHeader.style.width = '100%'
        cellHeader.style.display = 'block'
        return cellHeader
    },
    setCellHeaderNumber(cellHeader, textNode, options) {
        const self = this
        let cellNumber = document.createElement('span')
        cellNumber.style.height = `${self.options.style.cellHeader.height}px`
        cellNumber.style.width = `${self.options.style.cellHeader.height}px`
        cellNumber.style.backgroundColor = options.backgroundColor || ''
        cellNumber.style.borderRadius = `50%`
        cellNumber.style.display = 'inline-block'
        cellNumber.style.backgroundColor = options.backgroundColor
        cellNumber.style.textAlign = self.options.style.cellHeader && options.textAlign || 'center'
        cellNumber.style.lineHeight = `${self.options.style.cellHeader.height}px`
        cellNumber.style.fontSize = options.fontSize || '0.9em'
        cellNumber.style.color = options.numberColor
        cellNumber.append(textNode)
        cellHeader.append(cellNumber)
    },
    setCellHeaderTitle(cellHeader, title, options) {
        const self = this

        let cellSubTitle = document.createElement('span')
        cellSubTitle.style.paddingLeft = '10px'
        cellSubTitle.style.marginRight = 'auto'
        cellSubTitle.style.marginLeft = 'auto'
        cellSubTitle.style.color = options.titleColor
        cellSubTitle.style.height = `${self.options.style.cellHeader.height}px`
        cellSubTitle.style.textAlign = self.options.style.cellHeader && self.options.style.cellHeader.textAlign || 'center'
        let subText = document.createTextNode("");
        subText.textContent = title
        cellSubTitle.append(subText)
        cellHeader.append(cellSubTitle)
    },
    setCellMoreButton(cell) {
        const self = this
        const number = cell.getAttribute('number')

        let cellMoreButton = document.createElement('div')
        cellMoreButton.className = 'more-btn'
        cellMoreButton.innerText = "More Button"
        cellMoreButton.style.zIndex = '10'
        cellMoreButton.setAttribute('week', cell.getAttribute('week'))
        cellMoreButton.setAttribute('number', number)
        cellMoreButton.setAttribute('date', cell.getAttribute('date'))
        cellMoreButton.setAttribute('month', cell.getAttribute('month'))
        cell.append(cellMoreButton)
    },
    createGrid: function (calendarGrid, options) {
        let self = this
        let width = 100 / 7
        let _wrapper = document.createElement('div')
        let _grid = document.createElement('div')
        _grid.id = 'osome-cal-grid'
        _grid.className = 'osome-cal-grid'
        
        // _grid.className = 'ui equal width celled grid'
        let _gridHeader = document.createElement("div");
        let _header = document.createElement("div");

        _header.id = 'osome-cal-days'
        _gridHeader.style.width = `100%`
        _gridHeader.style.position = 'relative'
        _gridHeader.style.backgroundColor = 'white'
        _gridHeader.style.zIndex = 20

        _header.style.width = '100%'
        _header.style.position = 'absolute'
        _header.style.backgroundColor = 'rgba(242,242,242,0.2)'
        _header.style.boxSizing = 'border-box'

        let _country = options.country
        let days = options.days[_country]
        let offsetX = 0
        let dayLength = days.length
        days.forEach((day, idx) => {
            let _dayDiv = document.createElement("div")
            _dayDiv.className = 'column day'
            _dayDiv.style.display = 'inline-block'
            _dayDiv.style.width = `${width}%`
            _dayDiv.style.left = `${offsetX}%`
            _dayDiv.style.zIndex = 2
            _dayDiv.style.borderRight = '1px solid lightGray'
            _dayDiv.style.boxSizing = 'border-box'
            _dayDiv.style.textAlign = options.style.cellHeader && options.style.cellHeader.textAlign || 'center'
            if (idx === 0) {
                _dayDiv.className += " text-red"
            }
            else if (idx === dayLength - 1) {
                _dayDiv.className += " text-blue"
            }
            _dayDiv.innerHTML = day
            _header.append(_dayDiv)
            offsetX += width
        })
        _gridHeader.append(_header)
        _gridHeader.style.height = '32px'
        _gridHeader.style.borderBottom = '1px solid lightGray'
        calendarGrid.append(_gridHeader)

        const targetDate = new Date(options.year, options.month - 1, 1)

        const prevMonthObj = targetDate.getPrevMonth()
        const nextMonthObj = targetDate.getNextMonth()
        const prevEndOfMonthDate = prevMonthObj.getLastDate()

        const prevYear = prevMonthObj.getFullYear()
        const prevMonth = prevMonthObj.getMonth() + 1
        const nextYear = nextMonthObj.getFullYear()
        const nextMonth = nextMonthObj.getMonth() + 1

        const startOfDay = targetDate.startOfDay();

        const currentMonth = options.month
        let endOfMonthDate = targetDate.getLastDate()

        let date = 1;
        let nextDate = 1;
        let uniqueNum = 0

        const todayYear = options.today.getFullYear()
        const todayMonth = options.today.getMonth() + 1
        const todayDate = options.today.getDate()

        for (let i = 0; i < 6; i++) {
            // creates a table row
            let row = document.createElement("div");
            row.id = `osome-cal-grid-week-${i}`
            row.style.position = 'relative'
            row.style.width = `100%`
            row.style.minHeight = `${self.options.style.row.minHeight}px`
            row.setAttribute('week', i)
            row.className = "osome-cal-grid-week"
            offsetX = 0
            row.setAttribute('startNumber', uniqueNum)
            //creating individual cells, filing them up with data.
            if (date > endOfMonthDate) {
                break;
            }
            let _rowGrid = document.createElement("div")
            _rowGrid.id = `osome-cal-grid-week-grid-${i}`
            _rowGrid.className = `osome-cal-grid-week-grid`
            let _rowSchedule = document.createElement("div")
            _rowSchedule.id = `osome-cal-grid-week-schedule-${i}`
            _rowSchedule.className = `osome-cal-grid-week-schedule`
            _rowSchedule.style.paddingTop = `${self.options.style.cellHeader.height + 10 + 5}px`
            _rowSchedule.setAttribute('week', i)
            _rowSchedule.setAttribute('start', uniqueNum)
            for (let j = 0; j < 7; j++) {
                let cell = document.createElement("div");
                cell.ondragover = function (event) {
                    self.onScheduleDragOver(event)
                }
                cell.ondragleave = function (event) {
                    self.onScheduleDragLeave(event)
                }
                cell.ondrop = function (event) {
                    self.onScheduleDrop(event, self)
                }
                let cellText = document.createTextNode("");
                let cellHeader = self.createCellHeader(i, uniqueNum)
                cell.style.position = 'absolute'
                row.setAttribute('endNumber', uniqueNum)
                if (i === 0 && j < startOfDay) {
                    self.setCellHeaderNumber(cellHeader, cellText, self.options.style.cellHeader)
                    self.setCellHeaderTitle(cellHeader, "", self.options.style.cellHeader)
                    cellHeader.setAttribute('year', prevYear)
                    cellHeader.setAttribute('month', prevMonth)
                    cellHeader.setAttribute('date', prevEndOfMonthDate - (startOfDay - j) + 1)
                    cell.className = "tile"
                    cell.setAttribute('year', prevYear)
                    cell.setAttribute('month', prevMonth)
                    cell.setAttribute('date', prevEndOfMonthDate - (startOfDay - j) + 1)
                    cell.setAttribute('dayNum', j)
                    cell.setAttribute('week', i)
                    cell.id = `osome-cal-grid-day-tile-${uniqueNum}`
                    cell.setAttribute('number', uniqueNum++)
                    cell.style.width = `${width}%`
                    cell.style.left = `${offsetX}%`

                    cell.style.display = `inline-block`
                    if (j === 0) {
                        cell.className += " text-prev-red"
                    }
                    else if (j === 6) {
                        cell.className += " text-prev-blue"
                    }
                    else {
                        cell.className = "tile prev"
                    }
                    cellText.textContent = `${prevEndOfMonthDate - (startOfDay - j) + 1}`;
                }
                else if (date > endOfMonthDate) {
                    self.setCellHeaderNumber(cellHeader, cellText, self.options.style.cellHeader)
                    self.setCellHeaderTitle(cellHeader, "", self.options.style.cellHeader)
                    cell.className = "tile"
                    cellHeader.setAttribute('year', nextYear)
                    cellHeader.setAttribute('month', nextMonth)
                    cellHeader.setAttribute('date', nextDate)
                    cell.setAttribute('year', nextYear)
                    cell.setAttribute('month', nextMonth)
                    cell.setAttribute('date', nextDate)
                    cell.setAttribute('dayNum', j)
                    cell.setAttribute('week', i)
                    cell.style.width = `${width}%`
                    cell.style.left = `${offsetX}%`
                    cell.style.display = `inline-block`
                    cell.id = `osome-cal-grid-day-tile-${uniqueNum}`
                    cell.setAttribute('number', uniqueNum++)
                    cellText.textContent = nextDate;
                    nextDate++;

                    if (j === 0) {
                        cell.className += " text-prev-red"
                    }
                    else if (j === 6) {
                        cell.className += " text-prev-blue"
                    }
                    else {
                        cell.className = "tile next"
                    }
                }
                else {
                    if (todayYear === options.year && todayMonth === options.month && todayDate === date) {
                        self.setCellHeaderNumber(cellHeader, cellText, self.options.style.todayHeader)
                        self.setCellHeaderTitle(cellHeader, "오늘", self.options.style.todayHeader)
                    } else {
                        self.setCellHeaderNumber(cellHeader, cellText, self.options.style.cellHeader)
                        self.setCellHeaderTitle(cellHeader, "", self.options.style.cellHeader)
                    }

                    cellHeader.setAttribute('year', options.year)
                    cellHeader.setAttribute('month', currentMonth)
                    cellHeader.setAttribute('date', date)
                    cell.className = "tile"
                    cell.setAttribute('year', options.year)
                    cell.setAttribute('month', currentMonth)
                    cell.setAttribute('date', date)
                    cell.setAttribute('dayNum', j)
                    cell.setAttribute('week', i)
                    cell.style.width = `${width}%`
                    cell.style.left = `${offsetX}%`
                    cell.style.display = `inline-block`
                    cell.id = `osome-cal-grid-day-tile-${uniqueNum}`
                    cell.setAttribute('number', uniqueNum++)
                    cellText.textContent = date;
                    date++;

                    if (j === 0) {
                        cell.className += " text-red"
                    }
                    else if (j === 6) {
                        cell.className += " text-blue"
                    }
                }

                offsetX += width

                // cellHeader.append(cellText)
                cell.appendChild(cellHeader);

                _rowGrid.appendChild(cell);
                self.setCellMoreButton(cell)
            }
            _rowSchedule.setAttribute('end', uniqueNum)
            row.append(_rowGrid)
            row.append(_rowSchedule)
            _grid.appendChild(row); // appending each row into calendar body.
        }

        self.endNum = uniqueNum - 1
        self.focus.last = uniqueNum - 1
        calendarGrid.append(_grid)
    },
    renderSelectedBlock() {
        let self = this
        const prefix = 'osome-cal-grid-day-tile-'
        if (self.focus.current === undefined) {
            return
        }
        const startNum = Number(self.focus.start.getAttribute('number'))
        const endNum = Number(self.focus.current.getAttribute('number'))
        const last = Number(self.focus.last)
        for (let i = startNum; i <= endNum; i++) {
            const tile = document.getElementById(`${prefix}${i}`)
            if (!tile.classList.contains('active')) {
                tile.classList.add('active')
            }
        }
        for (let i = (endNum + 1); i <= last; i++) {
            const tile = document.getElementById(`${prefix}${i}`)
            if (tile !== null && tile.classList.contains('active')) {
                tile.classList.remove('active')
            }
        }
    },
    // Drag And Drop
    changeAllEventBlockOpacity(opacity) {
        const blocks = document.getElementsByClassName('event-block')
        for (let block of blocks) {
            block.style.opacity = opacity
        }
    },
    onBlockDragEnd(event, self, parent) {
        const dragImages = document.getElementsByClassName('dragImage')
        parent.changeAllEventBlockOpacity(1)
        for (let dragImg of dragImages) {
            document.body.removeChild(dragImg)
        }
    },
    onBlockDragStart(event, self, parent) {

        const _index = event.target.getAttribute('index').toNumber()
        const _order = event.target.getAttribute('order').toNumber()
        const _eventData = parent.categories[_order].events[_index]

        const dataTransfer = event.dataTransfer
        event.dataTransfer.dropEffect = "move"
        let width = 100 / 7
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')
        canvas.className = 'dragImage'
        canvas.width = 100
        canvas.height = 20
        context.fillStyle = _eventData.color
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = '#ffffff'
        context.font = 'bold 14px Arial'
        context.fillText(_eventData.title, 10, 14)
        document.body.append(canvas)
        //
        parent.changeAllEventBlockOpacity(0.5)
        event.dataTransfer.setData('index', _index)
        event.dataTransfer.setData('order', _order)
        event.dataTransfer.setDragImage(canvas, dataTransfer.offsetX, dataTransfer.offsetY)
    },
    onScheduleDragOver(event) {
        event.dataTransfer.dropEffect = "move"
        event.preventDefault()
        if (!event.target.classList.contains('dragOver')) {
            event.target.classList.add('dragOver')
        }
        // move sheduler
    },
    onScheduleDragLeave(event) {
        event.target.classList.remove('dragOver')
    },
    onScheduleDrop(e, parent) {
        if (e.target.getAttribute('number') === null) {
            return
        }

        e.target.classList.remove('dragOver')
        const order = e.dataTransfer.getData('order').toNumber()
        const index = e.dataTransfer.getData('index').toNumber()
        const startNum = e.target.getAttribute('number').toNumber()
        const week = e.target.getAttribute('week').toNumber()
        const event = parent.categories[order].events[index]
        const beforeEvent = new Object()
        Object.keys(event).map((key) => {
            beforeEvent[key] = event[key]
        })
        const endNum = Math.min(startNum + event.total.toNumber() - 1, parent.endNum - 1)
        const nextEvent = parent.moveSchedule(week, order, index, startNum, endNum, parent)

        const startDate = new Date(nextEvent.startDate)
        beforeEvent.startDate = new Date(beforeEvent.startDate)
        beforeEvent.endDate = new Date(beforeEvent.endDate)
        nextEvent.endDate = startDate.addDays(beforeEvent.total - 1)

        parent.onChangedSchedule(order, beforeEvent, nextEvent)

    },
    moveSchedule(week, order, index, startNum, endNum, parent) {
        const eventBlock = document.getElementById(`event-block-${order}-${index}-${week}`)
        if (eventBlock) eventBlock.remove()
        const event = parent.syncEvent(order, index, startNum, endNum)
        return event
    },
    syncResizeEvent(order, index, startNum, endNum) {
        const self = this
        const tilePrefix = 'osome-cal-grid-day-tile-'
        let event = JSON.parse(JSON.stringify(self.categories[order].events[index]))

        let endTile = document.getElementById(`${tilePrefix}${endNum}`)
        
        const eYear = endTile.getAttribute('year').toNumber()
        const eMonth = Math.max(Number(endTile.getAttribute('month')) - 1, 0)
        const eDate = endTile.getAttribute('date').toNumber()
        
        const originEndDate = new Date(event.endDate)

        const nextEndDate = new Date(eYear, eMonth, eDate)
        nextEndDate.setHours(originEndDate.getHours())
        nextEndDate.setMinutes(originEndDate.getMinutes())

        event.endDate = nextEndDate
        return event
    },
    syncEvent(order, index, startNum, endNum) {
        const self = this
        const tilePrefix = 'osome-cal-grid-day-tile-'
        let event = JSON.parse(JSON.stringify(self.categories[order].events[index]))

        let startTile = document.getElementById(`${tilePrefix}${startNum}`)
        let endTile = document.getElementById(`${tilePrefix}${endNum}`)
        const sYear = startTile.getAttribute('year').toNumber()
        const sMonth = Math.max(Number(startTile.getAttribute('month')) - 1, 0)
        const sDate = startTile.getAttribute('date').toNumber()

        const eYear = endTile.getAttribute('year').toNumber()
        const eMonth = Math.max(Number(endTile.getAttribute('month')) - 1, 0)
        const eDate = endTile.getAttribute('date').toNumber()
        event.start = startNum

        const originStartDate = new Date(event.startDate)
        const originEndDate = new Date(event.endDate)

        const nextStartDate = new Date(sYear, sMonth, sDate)
        nextStartDate.setHours(originStartDate.getHours())
        nextStartDate.setMinutes(originStartDate.getMinutes())

        const nextEndDate = new Date(eYear, eMonth, eDate)
        nextEndDate.setHours(originEndDate.getHours())
        nextEndDate.setMinutes(originEndDate.getMinutes())

        event.startDate = nextStartDate
        event.endDate = nextEndDate
        return event
    },

    // Drag And Drop
    isHandler(targetTag) {
        return targetTag.classList.contains('handler-y')
    },
    isMoreButton(targetTag) {
        return targetTag.classList.contains('more-btn')
    },
    isEventBlock(targetTag) {
        return targetTag.classList.contains('title')
    },
    isTileBlock(targetTag) {
        return targetTag.getAttribute('month') !== null
    },
    cleanNodes(parentNode) {
        while (parentNode.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
    },
    resetAllEventTotal(order) {
        const self = this
        self.categories[order].events.map(event => { return event.total = 0 })
    },
    increaseEventTotal(order, index, increaseTotal) {
        const self = this
        const event = self.categories[order].events[index]
        if (event === undefined) return
        event.total += increaseTotal
        self.categories[order].events[index] = event
    },
    reorderEventBox(order) {
        // event check.
        const self = this
        const weekPrefix = 'osome-cal-grid-week-'
        const scheduleWrappers = document.getElementsByClassName('osome-cal-grid-week-schedule')
        self.resetAllEventTotal(order)
        const eventBlockHeight = self.eventOption.style.height || 20
        const eventBlockMargin = self.eventOption.style.marginBottom || 2

        for (var scheduleWrapper of scheduleWrappers) {
            let sortArray = []
            const children = scheduleWrapper.children

            if (children.length > 0) {
                for (var child of children) {
                    if (child.style.display !== 'none') {
                        const _index = child.getAttribute('index').toNumber()
                        const _order = child.getAttribute('order').toNumber()
                        const startNum = child.getAttribute('startNum').toNumber()
                        const endNum = child.getAttribute('endNum').toNumber()
                        const total = (endNum - startNum + 1)
                        self.increaseEventTotal(_order, _index, total)
                        sortArray.push(child)
                    }
                }

                sortArray.sort(function compare(a, b) {
                    if (a.getAttribute('order').toNumber() < b.getAttribute('order').toNumber())
                        return -1;
                    if (a.getAttribute('order').toNumber() < b.getAttribute('order').toNumber())
                        return 1;
                    return 0
                })
                self.cleanNodes(scheduleWrapper)
                sortArray.forEach((reordedChild) => {
                    scheduleWrapper.appendChild(reordedChild)
                })
                const _weekEl = document.getElementById(`${weekPrefix}${scheduleWrapper.getAttribute('week')}`)
                _weekEl.style.height = `${(eventBlockHeight + eventBlockMargin) * (children.length) + self.options.style.cellHeader.height + self.options.style.cellHeader.gap}px`
            }
        }
    },
    attachGridEvent: function (calendarGrid) {
        let self = this
        calendarGrid.onmousedown = function (e) {
            const targetTag = document.elementFromPoint(e.clientX, e.clientY)
            if (self.isHandler(targetTag)) {
                self.focus.type = 'resize'
                self.attachResizeEvent.onMouseDown(self, targetTag)
            }
            else if (self.isEventBlock(targetTag)) {
                self.focus.type = 'move'
                self.focus.start = targetTag
            }
            else if (self.isMoreButton(targetTag)) {
                const moreEvents = []
                const number = Number(targetTag.getAttribute('number'))
                self.categories.map((category) => {
                    const events = category.events
                    events.map(event => {
                        if (number >= event.start && number <= (event.start + event.total - 1)) {
                            moreEvents.push(event)
                        }
                    })
                })
                self.onClickMoreButton(targetTag, moreEvents)
            }
            else if (self.isTileBlock(targetTag)) {
                self.focus.type = 'create'
                self.attachEventCreate.onMouseDown(self, targetTag)
            }
        }
        calendarGrid.onmousemove = function (e) {
            const targetTag = document.elementFromPoint(e.clientX, e.clientY)
            if (self.focus.type === 'create') {
                self.attachEventCreate.onMouseMove(self, targetTag)
            }
            else if (self.focus.type === 'resize') {
                if (targetTag.getAttribute('number')) {
                    self.attachResizeEvent.onMouseMove(self, targetTag)
                }
            }

        }
        calendarGrid.onmouseup = function (e) {
            const targetTag = document.elementFromPoint(e.clientX, e.clientY)
            if (self.focus.type === 'create') {
                self.attachEventCreate.onMouseUp(self, targetTag)
            }
            else if (self.focus.type === 'resize') {
                self.attachResizeEvent.onMouseUp(self, targetTag)
            }
            else if (self.focus.type === 'move') {
                const _index = targetTag.getAttribute('index').toNumber()
                if (self.focus.start !== undefined) {
                    const _order = self.focus.start.getAttribute('order')
                    self.onClickSchedule(targetTag, self.categories[_order], self.categories[_order].events[_index], e)
                }
            }
        }
    },
    resizeEventBlock(eventBlock, toTile) {
        let self = this
        let _eventBlock = eventBlock
        const endNum = toTile.getAttribute('number')
        const endDayNum = toTile.getAttribute('daynum')
        if (_eventBlock === null || _eventBlock === undefined) {
            const defaultBlock = self.focus.start
            const _index = defaultBlock.getAttribute('index').toNumber()
            const _order = defaultBlock.getAttribute('order').toNumber()
            const week = toTile.getAttribute("week").toNumber()
            const weekSchedulePrefix = 'osome-cal-grid-week-schedule-'
            const _weekScheduleEl = document.getElementById(`${weekSchedulePrefix}${week}`)
            const _event = self.categories[_order].events[_index]

            const _eventHandler = self.createHandler(
                week, defaultBlock.getAttribute('startNum'),
                endNum, _event)
            _eventBlock = self.createBlock(
                week,
                week * 7, endNum,
                _event)
            _eventBlock.style.zIndex = 9
            _eventBlock.setAttribute('endNum', endNum)
            _eventBlock.setAttribute('endDayNum', endDayNum)
            _eventBlock.append(_eventHandler)
            _weekScheduleEl.append(_eventBlock)
            self.reorderEventBox(_order)
        }
        if (_eventBlock.style.display === 'none') {
            _eventBlock.style.display = 'block'
        }
        const index = _eventBlock.getAttribute('index')
        const order = _eventBlock.getAttribute('order')
        const startNum = _eventBlock.getAttribute('startNum')
        const fromTile = document.getElementById(`osome-cal-grid-day-tile-${startNum}`)
        const fromLeft = fromTile.style.left.numOfPercent()
        const toLeft = toTile.style.left.numOfPercent()
        const toWidth = toTile.style.width.numOfPercent()
        _eventBlock.setAttribute('endNum', endNum)
        _eventBlock.setAttribute('endDayNum', endDayNum)
        _eventBlock.style.width = `${(toLeft - fromLeft + toWidth)}%`
        self.syncHandler(order, index, toTile.getAttribute('number'))
    },
    resizeEventBlockToLast(eventBlock) {
        if (eventBlock.style.display === 'none') {
            eventBlock.style.display = 'block'
        }
        const week = eventBlock.getAttribute('week').toNumber()
        const startNum = eventBlock.getAttribute('startNum')
        const toTile = document.getElementById(`osome-cal-grid-day-tile-${(week + 1) * 7 - 1}`)
        const endNum = toTile.getAttribute('number')
        const endDayNum = toTile.getAttribute('daynum')
        const fromTile = document.getElementById(`osome-cal-grid-day-tile-${startNum}`)
        const fromLeft = fromTile.style.left.numOfPercent()
        const toLeft = toTile.style.left.numOfPercent()
        const toWidth = toTile.style.width.numOfPercent()
        eventBlock.style.width = `${(toLeft - fromLeft + toWidth)}%`
        eventBlock.setAttribute('endNum', endNum)
        eventBlock.setAttribute('endDayNum', endDayNum)
        if (!eventBlock.classList.contains("block-right")) {
            eventBlock.classList.add("block-right")
        }
    },
    resizeEventBlockToNone(eventBlock) {
        eventBlock.style.display = 'none'
        prevBlock.classList.remove('block-right')
    },
    syncHandler(order, index, endNum) {
        const handlerClassName = `event-block-handler-${order}-${index}`
        const handlers = document.getElementsByClassName(handlerClassName)
        for (let handler of handlers) {
            handler.setAttribute('endNum', endNum)
        }
    },
    eventStart() {
        const elements = document.getElementsByClassName(`event-block`)
        for (let element of elements) {
            element.style.zIndex = 9
        }
    },
    eventEnd() {
        const elements = document.getElementsByClassName(`event-block`)
        for (let element of elements) {
            element.style.zIndex = 11
        }
    },
    attachResizeEvent: {
        prefix: 'event-block-',
        onMouseDown: function (self, targetTag) {
            const endNum = targetTag.getAttribute('endNum')
            self.focus.start = targetTag
            self.focus.current = document.getElementById(`osome-cal-grid-day-tile-${endNum}`)
            self.eventStart()
        },
        onMouseMove: function (self, targetTag) {
            const _index = self.focus.start.getAttribute('index')
            const _order = self.focus.start.getAttribute('order')
            const _startNum = self.focus.start.getAttribute('startNum')
            const currentNumber = targetTag.getAttribute('number').toNumber()
            const startWeek = Math.floor(self.focus.start.getAttribute('startNum').toNumber() / 7)
            const prevWeek = self.focus.current.getAttribute('week').toNumber()
            const nextNumber = targetTag.getAttribute('number')
            const nextWeek = targetTag.getAttribute('week').toNumber()
            if (nextNumber === null || nextWeek == null || (startWeek > nextWeek)) {
                return
            }

            if (prevWeek === nextWeek) {
                // 날짜 비교만
                const eventBlock = document.getElementById(`${this.prefix}${_order}-${_index}-${prevWeek}`)
                if (eventBlock.getAttribute('startNum') === null) {
                    return
                }
                const startNum = eventBlock.getAttribute('startNum').toNumber()
                if (startNum <= currentNumber) {
                    self.categories[_order].events[_index] = self.syncResizeEvent(_order, _index, _startNum, currentNumber)
                    self.resizeEventBlock(eventBlock, targetTag)
                }
            }
            else if (prevWeek < nextWeek) {
                // 다음 주로
                const currentBlock = document.getElementById(`${this.prefix}${_order}-${_index}-${prevWeek}`)
                const nextBlock = document.getElementById(`${this.prefix}${_order}-${_index}-${nextWeek}`)
                self.resizeEventBlockToLast(currentBlock)
                self.resizeEventBlock(nextBlock, targetTag)
            }
            else if (prevWeek > nextWeek) {
                // 이전 주로
                const currentBlock = document.getElementById(`${this.prefix}${_order}-${_index}-${prevWeek}`)
                const prevBlock = document.getElementById(`${this.prefix}${_order}-${_index}-${nextWeek}`)
                currentBlock.style.display = 'none'
                prevBlock.classList.remove('block-right')
            }
            self.focus.current = targetTag
        },
        onMouseUp: function (self, targetTag) {
            const _index = self.focus.start.getAttribute('index')
            const _order = self.focus.start.getAttribute('order')

            self.onChangedSchedule(_order, self.categories[_order].events[_index], self.categories[_order].events[_index])
            self.eventEnd()
            self.clearFocus()
            self.reorderEventBox(_order)
        }
    },
    attachEventCreate: {
        onMouseDown: function (self, targetTag) {
            if (self.focus.current === undefined) {
                self.eventStart()
                self.focus.current = targetTag
                self.focus.start = targetTag
            }
        },
        onMouseMove: function (self, targetTag) {
            if (self.focus.current !== undefined) {
                if (self.focus.current !== targetTag) {
                    self.focus.current = targetTag
                    self.renderSelectedBlock()
                }
            }
        },
        onMouseUp: function (self, targetTag) {
            if (self.focus.current !== undefined) {
                self.eventEnd()
                self.focus.end = targetTag
                self.focus.current = targetTag

                const start = self.focus.start
                const end = targetTag
                self.clearFocus()

                const startNum = Number(start.getAttribute('week')) * 6 + Number(start.getAttribute('number'))
                const endNum = Number(end.getAttribute('week')) * 6 + Number(end.getAttribute('number'))

                if (start !== undefined && end !== undefined && endNum >= startNum) {
                    const startYear = start.getAttribute('year')
                    const startMonth = start.getAttribute('month').toNumber() - 1
                    const startDate = start.getAttribute('date')
                    const endYear = end.getAttribute('year')
                    const endMonth = end.getAttribute('month').toNumber() - 1
                    const endDate = end.getAttribute('date')
                    const _start = new Date(startYear, startMonth, startDate)
                    const _end = new Date(endYear, endMonth, endDate)
                    const renderOption = { startTileNumber: start.getAttribute('number'), endTileNumber: end.getAttribute('number') }
                    self.onDragEndTile(_start, _end, renderOption)
                }
            }
        }
    }
}
/**
 * onDragEndTile: function (start, end, renderOption) {
    },
    onClickSchedule: function (element, event, index) {
    },
    onChangedSchedule: function (before, after) {
    },
 */
export default OsomeCalendar