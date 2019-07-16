/*
Extension Class
*/
'use strict'
import utils from './../../../common/util'

var OsomeGantt = {
    events: [],
    categories: [],
    dragging: {
        row: undefined,
        index: undefined,
        startNum: undefined,
        endNum: undefined,
        days: undefined,
        status: undefined
    },
    focus: {
        // start,end,last is unique number of tiles.
        event: undefined,
        current: undefined,
        type: undefined, // create, resize, move
        start: 0,
        end: 0,
        last: 0
    },
    onClickEvent: function () {
        console.log(`onClickEvent`)
    },
    onClickSchedule: function (element, category, event, e) {
        console.log('onClickSchedule')
    },
    //
    eventOption: {
        height: 20
    },
    //
    // state: {
    //     leftWidth: '30%'
    // },
    options: {
        type: 'row',
        fixed: false,
        disabled: false,
        style: {
            container: {
                leftWidth: '30%'
            },
            row: {
                height: 40
            },
            eventHeader: {
                width: 100,
                height: 20,
            },
            cellHeader: {
                height: 20,
                gap: 10
            }
        },
        country: 'ko',
        days: { ko: ['일', '월', '화', '수', '목', '금', '토'], jp: ['日', '月', '火', '水', '木', '金', '土'] },
        today: new Date(),
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        handleMin: 5,
        handleMax: 35,
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
    blur: function (e, self) {
        const focus = { ...self.focus }
        if (!focus || !focus.start) {
            return
        }
        focus.current.classList.remove('dragOverUp')
        focus.current.classList.remove('dragOverDown')
        focus.start.classList.remove('dragOver')
        self.clearFocus()
        self.draggingCategoryEnd(self)
        return
    },
    init: function (id = 'osome-gantt', opt = {}, categories = []) {
        let self = this
        self.iteral(undefined, opt, this.options)
        let _options = this.options
        let _ganttGrid = document.getElementById(id)
        self.categories = categories

        self.clear(_ganttGrid)
        self.createGrid(_ganttGrid, _options)
        self.renderEventBlocks(_options)
        self.attachGridEvent(_ganttGrid)

        document.onmouseup = function (e) {
            self.blur(e, self)
        }
        // self.createEvents(_options)
    },
    randomColor: function () {
        return '#' + (Math.random().toString(16) + "000000").substring(2, 8)
    },
    clear: function (element) {
        element.innerHTML = ''
    },
    clearFocus: function () {
        let self = this
        self.focus.event = undefined
        self.focus.type = undefined
        self.focus.end = undefined
        self.focus.start = undefined
        self.focus.current = undefined
    },
    attachEvent: function (row, start, end, eventOption) {
        let self = this
        const tilePrefix = 'back-tile'
        if (end < start) {
            return
        }

        let _eventOption = Object.assign({}, self.eventOption, eventOption)
        let startTile = document.getElementById(`${tilePrefix}-${row}-${start}`)
        let endTile = document.getElementById(`${tilePrefix}-${row}-${end}`)
        if (startTile == null || endTile == null) {
            return
        }
        self.createEventBlock(row, startTile, endTile, _eventOption)
    },
    deleteRow(row) {
        self.onChangedCategory(self.categoires, self.categories.splice(row, 1))
    },
    createHandler(row, startNum, endNum, eventOption) {
        let _eventHandler = document.createElement('span')
        _eventHandler.className = `event-block-handler-${eventOption.index} resize-handle handler-y`
        _eventHandler.innerHTML = '&nbsp;'
        _eventHandler.setAttribute('index', eventOption.index)
        _eventHandler.setAttribute('row', row)
        _eventHandler.setAttribute('startNum', startNum)
        _eventHandler.setAttribute('endNum', endNum)
        _eventHandler.setAttribute('index', eventOption.index)
        return _eventHandler
    },
    createBlock(row, startNum, endNum, eventOption) {
        const self = this
        let _eventBlock = document.createElement('div')

        const delta = self.options.style.row.height

        _eventBlock.id = `event-block-${row}-${eventOption.index}`
        _eventBlock.className = `event-block event-block-${row}`
        _eventBlock.style.backgroundColor = eventOption.color
        _eventBlock.style.height = `${delta}px`
        _eventBlock.style.zIndex = 11
        _eventBlock.setAttribute('index', eventOption.index)
        _eventBlock.setAttribute('row', row)
        _eventBlock.setAttribute('startNum', startNum)
        _eventBlock.setAttribute('endNum', endNum)

        return _eventBlock
    },
    renderEventBlocks(options) {
        const self = this
        const tilePrefix = 'back-tile'
        const _categories = self.categories
        const _length = _categories.length

        const currentMonth = options.month
        const currentYear = options.year
        const indexOfCurrentMonth = currentMonth - 1
        const targetDate = new Date(options.year, indexOfCurrentMonth, 1)
        const prevMonthObj = targetDate.getPrevMonth()

        let endOfMonthDate = targetDate.getLastDate()

        for (let i = 0; i < _length; i++) {
            const _category = _categories[i]
            const _content = _category.content
            const _events = _category.events || []

            const _row = _content.order.toNumber()
            _events.map((event, idx) => {

                const num = utils.convertDateToGanttNumber(event.startDate, event.endDate, currentYear, indexOfCurrentMonth, endOfMonthDate)
                if (num === undefined) {
                    return
                }
                const startTile = document.getElementById(`${tilePrefix}-${_row}-${num.startNum - 1}`)
                const endTile = document.getElementById(`${tilePrefix}-${_row}-${num.endNum - 1}`)
                event.startNum = num.startNum - 1
                event.endNum = num.endNum - 1
                event.color = _content.style.color
                if (startTile !== null && endTile !== null) {
                    self.renderEventBlock(_row, startTile, endTile, event)
                }

            })
        }
    },
    renderEventBlock(row, startTile, endTile, eventOption) {
        const self = this

        const rowTileId = `schedule-row-${row}`

        const _startNum = startTile.getAttribute('number').toNumber()
        const _endNum = endTile.getAttribute('number').toNumber()
        // full date
        // week schedule.
        const totalDays = _endNum - _startNum + 1
        const idx = eventOption.index ||
            self.events.length
        let _event = Object.assign({}, { index: idx, row: row, startNum: _startNum, endNum: _endNum }, eventOption)
        _event.total = totalDays
        self.categories[row].events[idx] = _event
        const _rowEl = document.getElementById(rowTileId)
        const _eventBlock = self.createBlock(row, _startNum, _endNum, _event)

        const _eventHandler = self.createHandler(row, _startNum, _endNum, _event)

        if (!self.options.disabled) {
            _eventBlock.append(_eventHandler)
        }


        const left = startTile.style.left
        let size = _endNum - _startNum + 1
        const width = size * (100 / self.options.endOfMonthDate)

        _eventBlock.style.position = 'absolute'
        _eventBlock.style.left = left
        _eventBlock.style.width = `${width}%`
        if (eventOption.style !== undefined) {
            for (const [key, value] of Object.entries(eventOption.style)) {
                _eventBlock.style[key] = value
            }
        }
        const startDate = new Date(eventOption.startDate)
        const endDate = new Date(eventOption.endDate)


        let _eventText = document.createElement('span')
        _eventText.classList = "title"
        _eventText.innerText = `${eventOption.title} (${startDate.midasFormat()} ~ ${endDate.midasFormat()})`

        _eventText.style.marginLeft = '10px'
        _eventText.style.display = 'block'
        _eventText.style.textOverflow = "ellipsis";
        _eventText.style.color = 'white'
        _eventText.style.whiteSpace = 'nowrap'
        _eventText.style.overflow = 'hidden'
        _eventText.setAttribute('row', row)
        _eventText.setAttribute('order', eventOption.order)
        _eventText.setAttribute('index', eventOption.index)
        _eventBlock.append(_eventText)

        _rowEl.append(_eventBlock)
    },
    createEventBlock(row, startTile, endTile, eventOption) {
        const self = this

        const rowTileId = `schedule-row-${row}`

        const _startNum = startTile.getAttribute('number').toNumber()
        const _endNum = endTile.getAttribute('number').toNumber()
        // full date
        // week schedule.
        const totalDays = _endNum - _startNum + 1

        const idx = eventOption.index || self.categories[row].events.length
        let _event = Object.assign({}, { index: idx, row: row, startNum: _startNum, endNum: _endNum }, eventOption)

        _event.total = totalDays

        self.categories[row].events.insert(idx, _event)
        const _rowEl = document.getElementById(rowTileId)
        const _eventBlock = self.createBlock(row, _startNum, _endNum, _event)
        const _eventHandler = self.createHandler(row, _startNum, _endNum, _event)

        if (!self.options.disabled) {
            _eventBlock.append(_eventHandler)
        }

        const left = startTile.style.left
        let size = _endNum - _startNum + 1
        const width = size * (100 / self.options.endOfMonthDate)

        _eventBlock.style.position = 'absolute'
        _eventBlock.style.left = left
        _eventBlock.style.width = `${width}%`
        if (eventOption.style !== undefined) {
            for (const [key, value] of Object.entries(eventOption.style)) {
                _eventBlock.style[key] = value
            }
        }
        const startDate = new Date(eventOption.startDate)
        const endDate = new Date(eventOption.endDate)

        let _eventText = document.createElement('span')
        _eventText.classList = "title"
        _eventText.innerText = `${eventOption.title} (${startDate.midasFormat()} ~ ${endDate.midasFormat()})`

        _eventText.style.color = 'white'
        _eventText.setAttribute('order', eventOption.order)
        _eventText.setAttribute('index', eventOption.index)
        _eventBlock.append(_eventText)

        _rowEl.append(_eventBlock)
    },
    clearSelectedBlock: function (row) {
        let self = this
        const tileClass = `back-tile-${row}`
        const tiles = document.getElementsByClassName(tileClass)
        for (const tile of tiles) {
            if (tile.classList.contains('active')) {
                tile.classList.remove('active')
            }
        }
    },
    createEventPopup: function (calendarGrid, options) {

    },
    createRow: function (type, row, style, content) {
        let self = this
        let height = style.height

        let rowContainer = document.createElement('div')
        rowContainer.oncontextmenu = () => { return false }
        if (type === 'schedule') {
            rowContainer.className = `osome-gantt-grid-schedule-row`
        }
        else if (type === 'left') {
            rowContainer.className = `row osome-gantt-grid-category-row`
        }
        else {
            rowContainer.className = `row osome-gantt-grid-row`
        }
        rowContainer.id = `${type}-row-${row}`
        rowContainer.style.width = '100%'
        rowContainer.style.textOverflow = 'ellipsis'
        rowContainer.style.whiteSpace = 'nowrap'
        rowContainer.style.overflow = 'hidden'
        rowContainer.style.lineHeight = `${style.height}px`
        rowContainer.style.height = `${style.height}px`
        rowContainer.style.top = `0px`
        if (!isNaN(row)) {
            rowContainer.style.top = `${(row) * (height + 0.4)}px`
        }
        rowContainer.setAttribute(`row`, row)
        rowContainer.setAttribute(`type`, type)
        if (content !== undefined) {
            const type = content.type || 'main'

            const bullet = document.createElement('div')
            bullet.style.display = 'inline-block'
            bullet.style.marginLeft = type === 'main' ? '10px' : '40px'
            bullet.style.float = 'left'
            bullet.style.marginTop = `${self.options.style.row.height / 4}px`
            bullet.style.height = `${self.options.style.row.height / 2}px`
            bullet.style.width = type === 'main' ? `${self.options.style.row.height / 2}px` : `${self.options.style.row.height / 5}px`
            bullet.style.borderRadius = type === 'main' ? `${self.options.style.row.height / 4}px` : 0
            bullet.style.backgroundColor = content.style.color
            bullet.setAttribute('row', row)
            bullet.setAttribute('type', type)

            const text = document.createElement('span')
            text.setAttribute('row', row)
            text.setAttribute('type', type)
            text.style.paddingLeft = '10px'
            text.style.paddingRight = '10px'
            text.innerHTML = content.title
            rowContainer.append(bullet)
            rowContainer.append(text)
        }

        return rowContainer
    },
    createRowTile: function (rowTile, row, days, options, targetDate) {
        let self = this
        let dayDate = targetDate
        for (let i = 0; i < days; i++) {
            dayDate.setDate(i + 1)
            const day = dayDate.getDay()
            const backTile = self.createBackTile("back", row, i, options, day)
            rowTile.appendChild(backTile)
        }

    },
    createBackTile: function (type, row, col, options, day) {
        const self = this
        let tile = document.createElement('div')
        const offset = col * (100 / options.endOfMonthDate)
        tile.classList = `tile ${type}-tile ${type}-tile-${row}`
        tile.id = `${type}-tile-${row}-${col}`
        tile.style.position = 'absolute'
        tile.style.display = 'block'
        tile.style.zIndex = 10
        tile.style.width = `${100 / options.endOfMonthDate}%`
        tile.style.height = `${options.style.row.height}px`
        tile.style.left = `${offset}%`
        tile.setAttribute('row', row)
        tile.setAttribute('col', col)
        tile.setAttribute('dayNum', (col + 1))
        tile.setAttribute('year', options.year)
        tile.setAttribute('month', options.month)
        tile.setAttribute('date', col + 1)
        tile.setAttribute('number', col)

        if (type === 'day') {
            tile.style.textAlign = 'center'
            tile.textContent = `${col + 1}`
            if (day === 0) {
                tile.className += " text-red"
            }
            else if (day === 6) {
                tile.className += " text-blue"
            }
        }
        else if (type === 'today') {
            tile.style.textAlign = 'center'
            const todayTile = document.createElement('span')
            const height = options.style.row.height * 0.5
            todayTile.style.fontSize = `${height * 0.5}px`
            todayTile.style.width = `${height}px`
            todayTile.style.height = `${height}px`
            todayTile.style.lineHeight = `${height}px`
            todayTile.style.margin = 'auto'
            todayTile.style.borderRadius = `${height / 2}px`
            todayTile.style.verticalAlign = 'middle'
            todayTile.style.color = 'white'
            todayTile.style.display = 'inline-block'
            todayTile.style.backgroundColor = options.style.todayHeader && options.style.todayHeader.backgroundColor || 'green'
            todayTile.textContent = col + 1
            tile.append(todayTile)
        }
        else {
            if (day === 0) {
                tile.className += " text-red holiday"

            }
            else if (day === 6) {
                tile.className += " text-blue holiday"
            }
        }
        return tile
    },
    createGrid: function (calendarGrid, options) {
        let self = this
        const currentYear = options.year
        const currentMonth = options.month
        const indexOfCurrentMonth = currentMonth - 1
        const targetDate = new Date(currentYear, indexOfCurrentMonth, 1)
        const today = new Date()
        const todayDate = today.getDate()
        const todayMonth = today.getMonth() + 1
        const todayYear = today.getFullYear()
        let endOfMonthDate = targetDate.getLastDate()

        self.options.endOfMonthDate = endOfMonthDate

        const handleBarWidth = 5

        const rightWidthPercentage = 100 - self.options.style.container.leftWidth.numOfPercent()

        const rowHeight = self.options.style.row.height || 40
        self.options.style.row.height = rowHeight
        // 
        // 0. create container
        let container = document.createElement('div')
        container.className = 'osome-gantt-grid-container'
        container.style.paddingTop = `${rowHeight}px`
        self.container = container

        let headerContainer = document.createElement('div')
        headerContainer.id = `osome-gantt-grid-header-container`
        headerContainer.style.position = 'absolute'
        headerContainer.style.width = 'inherit'
        headerContainer.style.backgroundColor = 'white'
        headerContainer.style.height = `${rowHeight}px`
        headerContainer.style.zIndex = 20
        headerContainer.style.borderBottom = '1px solid lightGray'
        calendarGrid.append(headerContainer)

        let leftContainer = document.createElement('div')
        leftContainer.id = `osome-gantt-grid-left-container`
        leftContainer.className = 'osome-gantt-grid-inner-container'
        leftContainer.style.borderRight = ``
        leftContainer.style.backgroundColor = `transparent`
        leftContainer.style.width = `${self.options.style.container.leftWidth}`

        let handleBar = document.createElement('div')
        handleBar.id = `osome-gantt-grid-handle-bar`
        handleBar.className = 'osome-gantt-grid-handle-bar'
        handleBar.style.right = 0
        handleBar.style.width = `${handleBarWidth}px`
        handleBar.style.top = `0px`


        let rightContainer = document.createElement('div')
        rightContainer.id = `osome-gantt-grid-right-container`
        rightContainer.className = 'osome-gantt-grid-inner-container'
        rightContainer.style.width = `${rightWidthPercentage}%`
        rightContainer.style.left = `${self.options.style.container.leftWidth}`

        container.appendChild(leftContainer)
        container.appendChild(rightContainer)

        calendarGrid.appendChild(container)

        // 0. create header



        // leftContainer.appendChild(self.createRow('left', 'head-left', options.style.row))

        const daysRow = self.createRow('day', 'head-right', options.style.row)
        daysRow.id = `osome-gantt-header-day-row`
        daysRow.style.position = 'absolute'
        daysRow.style.left = `${self.options.style.container.leftWidth}`
        daysRow.style.width = `${rightWidthPercentage}%`
        daysRow.style.borderBottom = 'none'
        headerContainer.appendChild(daysRow)

        self.focus.last = endOfMonthDate
        // Sunday is 0, Monday is 1
        const dayDate = targetDate
        for (let i = 0; i < endOfMonthDate; i++) {
            dayDate.setDate(i + 1)
            const day = dayDate.getDay()
            const isToday = todayYear === currentYear && todayMonth === currentMonth && todayDate === i + 1
            const backTile = self.createBackTile(isToday ? "today" : "day", 0, i, self.options, day)
            daysRow.appendChild(backTile)
        }

        // 1. create row
        let i
        let conatinerHeight = 0

        for (i = 0; i < self.categories.length; i++) {
            const category = self.categories[i]
            if (category.content.enable === false) {
                continue
            }
            leftContainer.appendChild(self.createRow('left', i, options.style.row, category.content))
            let _row = self.createRow('right', i, options.style.row)
            self.createRowTile(_row, i, endOfMonthDate, self.options, targetDate)
            rightContainer.appendChild(_row)
            let _rowSchedule = self.createRow('schedule', i, options.style.row)
            rightContainer.appendChild(_rowSchedule)
        }
        conatinerHeight = i * (options.style.row.height + 0.4)

        rightContainer.style.height = `${conatinerHeight}px`
        leftContainer.style.height = `${conatinerHeight}px`
        if (!self.options.fixed) {
            leftContainer.appendChild(handleBar)
        }
        // 2. create event tile
        // 3. create day tile
        // 4. 
    },
    renderSelectedBlock() {
        let self = this
        const prefix = 'back-tile'
        if (self.focus.current === undefined) {
            return
        }
        const startRow = self.focus.start.getAttribute('row').toNumber()
        const currentRow = self.focus.current.getAttribute('row').toNumber()

        if (startRow !== currentRow) {
            return
        }

        const startCol = self.focus.start.getAttribute('col').toNumber()
        const currentCol = self.focus.current.getAttribute('col').toNumber()

        const last = self.focus.last.toNumber()

        for (let i = startCol; i <= currentCol; i++) {
            const _tile = document.getElementById(`${prefix}-${startRow}-${i}`)
            if (!_tile.classList.contains('active')) {
                _tile.classList.add('active')
            }
        }
        for (let i = (currentCol + 1); i <= last; i++) {
            const _tile = document.getElementById(`${prefix}-${startRow}-${i}`)
            if (_tile !== null && _tile.classList.contains('active')) {
                _tile.classList.remove('active')
            }
        }
    },
    // Drag And Drop
    changeAllEventBlockOpacity(row, opacity, exceptBlock) {
        const blocks = document.getElementsByClassName(`event-block-${row}`)
        for (let block of blocks) {
            if (block === exceptBlock) continue

            block.style.opacity = opacity
            block.style.zIndex = opacity === 1 ? 11 : 9
        }
    },
    draggingCategoryStart(self, row) {
        self.dragging = {
            row: row
        }
    },
    draggingCategoryEnd(self) {
        if (document.getElementById(`dragImage-category-${self.dragging.row}`) !== null) {
            document.getElementById(`dragImage-category-${self.dragging.row}`).remove()
        }
        return self
    },
    draggingStart(self, eventData) {
        const days = eventData.endNum - eventData.startNum
        self.dragging = {
            event: { ...eventData },
            row: eventData.row,
            index: eventData.index,
            startNum: eventData.startNum,
            endNum: eventData.endNum,
            total: eventData.total,
            days: days,
            status: 0
        }
    },
    draggingEnd(self) {
        if (document.getElementById(`dragImage-${self.dragging.row}-${self.dragging.index}`) !== null) {
            document.getElementById(`dragImage-${self.dragging.row}-${self.dragging.index}`).remove()
        }
        self.changeAllEventBlockOpacity(self.dragging.row, 1)

        return self
    },
    onBlockDragEnd(self, e) {
        const _row = self.dragging.row
        const _index = self.dragging.index
        const _startTag = self.focus.start
        const _targetTag = self.focus.current

        if (_targetTag.getAttribute('number') === null) {

            if (_startTag.getAttribute('number') === _targetTag.getAttribute('number')) {
                self.onClickSchedule(_targetTag, self.categories[_row], self.focus.event, e)
            }
            return
        }
        const _startNum = _targetTag.getAttribute('number').toNumber()
        const endOfDate = self.options.endOfMonthDate
        const events = self.categories[_row].events
        const event = { ...events[_index] }
        const _beforeStartDate = new Date(self.dragging.event.startDate)
        const _beforeEndDate = new Date(self.dragging.event.endDate)
        _beforeStartDate.setHours(0)
        _beforeStartDate.setMinutes(0)
        _beforeEndDate.setHours(0)
        _beforeEndDate.setMinutes(0)
        const total = Math.floor((_beforeEndDate.getTime() - _beforeStartDate.getTime()) / 86400000) + 1
        const _endNum = Math.min(_startNum + total - 1, endOfDate - 1)
        const _total = _endNum - _startNum + 1
        const _number = _targetTag.getAttribute('number').toNumber()
        const _size = 100 / self.options.endOfMonthDate
        const _left = _number * _size
        const _width = _total * _size
        // move eventId
        const _eventBlock = document.getElementById(`event-block-${_row}-${_index}`)
        _eventBlock.style.left = `${_left}%`
        _eventBlock.setAttribute('startNum', _number)
        _eventBlock.style.width = `${_width}%`
        /// need check real date

        self.eventEnd(_row)
        const startDate = new Date(self.categories[_row].events[_index].startDate)
        self.dragging.event.startDate = new Date(self.dragging.event.startDate)
        self.dragging.event.endDate = new Date(self.dragging.event.endDate)
        self.categories[_row].events[_index].endDate = startDate.addDays(total - 1)
        self.categories[_row].events[_index].endDate.setHours(self.dragging.event.endDate.getHours())
        self.categories[_row].events[_index].endDate.setMinutes(self.dragging.event.endDate.getMinutes())
        self.onChangedSchedule(self.dragging.row, self.dragging.event, self.categories[_row].events[_index])

        self.dragging = {
            event: undefined,
            row: undefined,
            index: undefined,
            startNum: undefined,
            endNum: undefined,
            days: undefined,
            status: undefined
        }
    },
    syncResizeEvent(order, index, startNum, endNum, total) {
        const self = this
        const tilePrefix = 'back-tile-'
        const date = utils.convertGanttNumberToDate(startNum, endNum, self.options.endOfMonthDate)

        let event = JSON.parse(JSON.stringify(self.categories[order].events[index]))


        let endTile = document.getElementById(`${tilePrefix}${order}-${(date.endNum - 1)}`)

        const eYear = endTile.getAttribute('year').toNumber()
        const eMonth = Math.max(Number(endTile.getAttribute('month')) - 1, 0)
        const eDate = date.endNum

        event.endNum = endNum
        event.total = total

        const originEndDate = new Date(event.endDate)

        const nextEndDate = new Date(eYear, eMonth, eDate)
        nextEndDate.setHours(originEndDate.getHours())
        nextEndDate.setMinutes(originEndDate.getMinutes())

        event.endDate = nextEndDate

        return event
    },
    syncEvent(order, index, startNum, endNum, total) {
        const self = this
        const tilePrefix = 'back-tile-'
        const date = utils.convertGanttNumberToDate(startNum, endNum, self.options.endOfMonthDate)

        let event = JSON.parse(JSON.stringify(self.categories[order].events[index]))

        let startTile = document.getElementById(`${tilePrefix}${order}-${(date.startNum - 1)}`)
        let endTile = document.getElementById(`${tilePrefix}${order}-${(date.endNum - 1)}`)

        const sYear = startTile.getAttribute('year').toNumber()
        const sMonth = Math.max(Number(startTile.getAttribute('month')) - 1, 0)
        const sDate = date.startNum

        const eYear = endTile.getAttribute('year').toNumber()
        const eMonth = Math.max(Number(endTile.getAttribute('month')) - 1, 0)
        const eDate = date.endNum

        event.start = startNum
        event.startNum = startNum
        event.endNum = endNum
        event.total = total

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
    htmlToImg(element, callback) {
        const self = this
        const WIDTH = element.offsetWidth
        var HEIGHT = element.offsetHeight
        var data =
            "<svg xmlns='http://www.w3.org/2000/svg' width='" + WIDTH + "px' height='" + HEIGHT + "px'>" +
            "<foreignObject width='100%' height='100%'>" +
            `<div xmlns='http://www.w3.org/1999/xhtml' style='${element.style.cssText};background-color:white;'>` +
            element.innerHTML +
            "</div>" +
            "</foreignObject>" +
            "</svg>"
        const img = new Image();
        const svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
        const url = window.URL.createObjectURL(svg)
        img.addEventListener("load", function () {
            window.URL.revokeObjectURL(url);
            callback(img)
        })
        img.src = url;
    },
    onBlockDragStart(eventBlock, self, e) {

        const _index = eventBlock.getAttribute('index').toNumber()
        const _row = eventBlock.getAttribute('row')

        let _eventData = self.categories[_row].events[_index]

        _eventData.row = _row
        self.draggingStart(self, _eventData)
        let width = 100 / 7
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')
        canvas.id = `dragImage-${_row}-${_index}`
        canvas.className = 'dragImage'
        canvas.width = eventBlock.style.width.numOfPixel()
        canvas.height = eventBlock.style.height.numOfPixel()
        canvas.style.left = `${e.clientX}px`
        canvas.style.top = `${e.clientY}px`
        context.fillStyle = _eventData.color
        context.fillRect(0, 0, canvas.width, canvas.height)

        document.body.append(canvas)
    },
    onCategoryDragStart(rowEl, self, e) {
        const _row = rowEl.getAttribute('row')
        self.draggingCategoryStart(self, _row)

        if (!self.focus.start.classList.contains('dragOver')) {
            self.focus.start.classList.add('dragOver')
        }
    },
    moveRow(self, e) {
        if (self.focus.start === undefined) {
            return
        }

        const _sourceRowEl = self.focus.start
        const _sRow = _sourceRowEl.getAttribute('row').toNumber()
        const _targetRowEl = self.focus.current
        let _tRow = _targetRowEl.getAttribute('row').toNumber()
        if (_sRow === _tRow) {
            if (document.getElementById(`left-row-${(_tRow + 1)}`)) {
                document.getElementById(`left-row-${(_tRow + 1)}`).classList.remove(`dragOverUp`)
            }
            return
        }
        // trow
        const targetRect = _targetRowEl.getBoundingClientRect()
        const offsetY = e.clientY - targetRect.top
        const height = _targetRowEl.offsetHeight

        let newCategories = JSON.parse(JSON.stringify(self.categories))
        if (_sRow < _tRow) {
            if (offsetY < height / 2) {
                _tRow -= 1
            }
            let _source = newCategories[_sRow]
            for (let i = _sRow; i < _tRow; i++) {
                newCategories[i] = newCategories[i + 1]
                newCategories[i].content.order = i
            }
            newCategories[_tRow] = _source
            newCategories[_tRow].content.order = _tRow

        }
        else if (_sRow > _tRow) {
            if (offsetY > height / 2) {
                _tRow += 1
            }
            let _source = newCategories[_sRow]
            for (let i = _sRow; i > _tRow; i--) {
                newCategories[i] = newCategories[i - 1]
                newCategories[i].content.order = i
            }

            newCategories[_tRow] = _source
            newCategories[_tRow].content.order = _tRow
        }
        self.onChangedCategory(self.categories, newCategories)
    },

    onCategoryDragEnd(self, e) {
        self.focus.current.classList.remove('dragOverUp')
        self.focus.current.classList.remove('dragOverDown')
        self.focus.start.classList.remove('dragOver')

        self.moveRow(self, e)
        self.clearFocus()
        self.draggingCategoryEnd(self)
    },
    // Drag And Drop
    isCategoryRow(targetTag) {
        return targetTag.classList.contains('osome-gantt-grid-category-row') || (targetTag.parentElement && targetTag.parentElement.classList.contains('osome-gantt-grid-category-row'))
    },
    getCategoryRow(targetTag) {
        if (targetTag.classList.contains('osome-gantt-grid-category-row')) return targetTag
        else if (targetTag.parentElement && targetTag.parentElement.classList.contains('osome-gantt-grid-category-row')) {
            return targetTag.parentElement
        }
        else {
            return null
        }
    },
    isRightTile(targetTag) {
        return targetTag.classList.contains('back-tile')
    },
    isHandler(targetTag) {
        return targetTag.classList.contains('handler-y')
    },
    isEventBlock(targetTag) {
        return targetTag.classList.contains('event-block') || (targetTag.parentElement && targetTag.parentElement.classList.contains('event-block'))
    },
    isContainerHandleBar(targetTag) {
        return targetTag.classList.contains('osome-gantt-grid-handle-bar')
    },
    cleanNodes(parentNode) {
        while (parentNode.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
    },

    reorderEventBox() {
        // event check.

    },
    attachGridEvent: function (calendarGrid) {
        let self = this
        calendarGrid.onmousedown = function (e) {
            if (self.options.disabled === true) {
                return
            }
            const targetTag = document.elementFromPoint(e.clientX, e.clientY)
            if (e.which === 3) {
                if (self.isCategoryRow(targetTag)) {
                    self.onMouseRightClick(targetTag, e)
                }
                return
            }
            if (self.isHandler(targetTag)) {
                self.focus.type = 'resize'
                self.attachResizeEvent.onMouseDown(self, targetTag)
            }
            else if (self.isEventBlock(targetTag)) {
                self.focus.type = 'move'
                self.attachDragAndDropEvent.onMouseDown(self, targetTag, e)
            }
            else if (self.isContainerHandleBar(targetTag)) {
                self.attachContainerHandleBarEvent.onMouseDown(self, targetTag, e)
            }
            else if (self.isRightTile(targetTag)) {
                self.focus.type = 'create'
                self.attachEventCreate.onMouseDown(self, targetTag)
            }
            else if (self.isCategoryRow(targetTag)) {
                self.focus.type = 'reorder'
                self.attachDragAndDropCategory.onMouseDown(self, targetTag, e)
            }
        }
        calendarGrid.onmousemove = function (e) {
            if (self.options.disabled === true) {
                return
            }
            if (self.focus.type === undefined) {
                return
            }
            const targetTag = document.elementFromPoint(e.clientX, e.clientY)
            if (self.focus.type === 'create') {
                if (!self.isRightTile(targetTag)) {
                    return
                }
                self.attachEventCreate.onMouseMove(self, targetTag)
            }
            else if (self.focus.type === 'container-resize') {
                self.attachContainerHandleBarEvent.onMouseMove(self, targetTag, e)
            }
            else if (self.focus.type === 'move') {
                self.attachDragAndDropEvent.onMouseMove(self, targetTag, e)
            }
            else if (self.focus.type === 'resize') {
                if (targetTag.getAttribute('number')) {
                    self.attachResizeEvent.onMouseMove(self, targetTag)
                }
            }
            else if (self.focus.type === 'reorder') {
                self.attachDragAndDropCategory.onMouseMove(self, targetTag, e)
            }

        }
        calendarGrid.onmouseup = function (e) {
            if (self.options.disabled === true) {
                return
            }

            const targetTag = document.elementFromPoint(e.clientX, e.clientY)

            if (self.focus.type === 'create') {
                if (!self.isRightTile(targetTag)) {
                    const _row = targetTag.getAttribute('row')
                    self.clearSelectedBlock(_row)
                    self.clearFocus()
                    return
                }
                self.attachEventCreate.onMouseUp(self, targetTag)
            }
            else if (self.focus.type === 'resize') {
                self.attachResizeEvent.onMouseUp(self, targetTag)
            }
            else if (self.focus.type === 'move') {
                const _number = targetTag.getAttribute('number')
                const _row = targetTag.getAttribute('row')
                const _startNum = self.focus.start.getAttribute('startNum')

                if (_number === _startNum) {
                    self.draggingEnd(self).onClickSchedule(targetTag, self.categories[_row], { ...self.focus.event }, e)
                }
                else {
                    self.draggingEnd(self).attachDragAndDropEvent.onMouseUp(self, targetTag, e)
                }
            }
            else if (self.focus.type === 'container-resize') {
                self.attachContainerHandleBarEvent.onMouseUp(self, targetTag, e)
            }
            else if (self.focus.type === 'reorder') {
                self.attachDragAndDropCategory.onMouseUp(self, targetTag, e)
            }
            self.clearFocus()
        }
    },
    increaseEventTotal(order, index, startNum, endNum, increaseTotal) {
        const self = this
        const event = self.categories[order].events[index]

        if (event === undefined) return
        event.total = increaseTotal

        event.startDate = new Date(event.startDate).setDate(startNum + 1)
        event.endDate = new Date(event.endDate).setDate(endNum + 1)
        self.categories[order].events[index] = event
    },
    resizeEventBlock(eventBlock, toTile) {
        let self = this
        let width = self.options.style.row.height
        const _index = eventBlock.getAttribute('index').toNumber()
        const _row = eventBlock.getAttribute('row').toNumber()
        const _event = { ...self.categories[_row].events[_index] }
        const _startNum = _event.startNum
        const _endNum = toTile.getAttribute('number').toNumber()
        let _size = _endNum - _startNum + 1
        const _percentOfWidth = _size / self.options.endOfMonthDate * 100
        eventBlock.style.width = `${_percentOfWidth}%`
        eventBlock.style.height = `${width}px`
        // self.increaseEventTotal(_row, _index, _startNum, _endNum, _size)
        self.categories[_row].events[_index] = self.syncResizeEvent(_row, _index, _startNum, _endNum, _size)
        self.syncHandler(_index, toTile.getAttribute('number'))
    },

    resizeEventBlockToNone(eventBlock) {
        eventBlock.style.display = 'none'
        prevBlock.classList.remove('block-right')
    },
    syncHandler(index, endNum) {
        const handlerClassName = `event-block-handler-${index}`
        const handlers = document.getElementsByClassName(handlerClassName)
        for (let handler of handlers) {
            handler.setAttribute('endNum', endNum)
        }
    },
    eventMoveStart(row) {

    },
    eventStart(row) {
        const self = this
        const elements = document.getElementsByClassName(`event-block-${row}`)
        for (let element of elements) {
            element.style.zIndex = 9
        }
        if (row !== undefined) {
            const events = self.categories[row].events
            events.map((event) => {
                const _startNum = event.startNum
                const _endNum = event.endNum
                for (let i = _startNum; i <= _endNum; i++) {
                    const element = document.getElementById(`back-tile-${row}-${i}`)
                    element.classList.add('resizing')
                }
            })
        }
    },
    eventModify(row) {
        const self = this
        if (row !== undefined) {
            const elements = document.getElementsByClassName(`back-tile-${row}`)
            for (let element of elements) {
                element.classList.remove('resizing')
            }
            const events = self.categories[row].events
            events.map((event) => {
                let _startNum = event.startNum
                let _endNum = event.endNum
                if (event.index === self.dragging.index) {
                    _startNum = self.dragging.startNum
                    _endNum = self.dragging.endNum
                }
                for (let i = _startNum; i <= _endNum; i++) {
                    const element = document.getElementById(`back-tile-${row}-${i}`)
                    element.classList.add('resizing')
                }

            })
        }
    },
    eventEnd(row, startNum, endNum) {
        const elements = document.getElementsByClassName(`event-block`)
        for (let element of elements) {
            element.style.zIndex = 11
        }
        if (row !== undefined) {
            const elements = document.getElementsByClassName(`back-tile-${row}`)
            for (let element of elements) {
                element.classList.remove('resizing')
            }
        }
    },
    syncContainerSize: function (_leftWidth) {
        const self = this

        const bounding = self.container.getBoundingClientRect()
        const containerWidth = bounding.width
        const leftWidth = _leftWidth - bounding.x
        const dayHeaderId = 'osome-gantt-header-day-row'
        const leftContainerId = 'osome-gantt-grid-left-container'
        const rightContainerId = 'osome-gantt-grid-right-container'
        const dayHeaderContainer = document.getElementById(dayHeaderId)
        const leftContainer = document.getElementById(leftContainerId)
        const rightContainer = document.getElementById(rightContainerId)
        const rightWidth = containerWidth - leftWidth
        const leftWidthPercent = leftWidth / containerWidth * 100
        if (leftWidthPercent > self.options.handleMax || leftWidthPercent < self.options.handleMin) {
            return
        }
        leftContainer.style.width = `${leftWidthPercent}%`
        rightContainer.style.left = `${leftWidthPercent}%`
        rightContainer.style.width = `${rightWidth / containerWidth * 100}%`
        dayHeaderContainer.style.left = rightContainer.style.left
        dayHeaderContainer.style.width = rightContainer.style.width
        self.options.style.container.leftWidth = `${leftWidthPercent}%`
        self.onChangeContainer(leftContainer.style.width, rightContainer.style.width)
    },
    onChangedContainer: function(_leftWidth){
        const self = this
        const bounding = self.container.getBoundingClientRect()
        const containerWidth = bounding.width
        const leftWidth = _leftWidth - bounding.x
        self.onCompleteContainerResize(leftWidth / containerWidth * 100, (containerWidth-leftWidth)/ containerWidth * 100)
    },
    attachDragAndDropCategory: {
        leftPrefix: 'left-row-',
        onMouseDown: function (self, targetTag, e) {
            const _tRow = targetTag.getAttribute('row')
            if (_tRow === 'head-left') {
                return
            }
            if (!self.isCategoryRow(targetTag)) {
                return
            }
            self.focus.start = targetTag
            self.focus.current = targetTag
            self.onCategoryDragStart(targetTag, self, e)
        },
        onMouseMove: function (self, _targetTag, e) {
            const _row = self.dragging.row
            const _tRow = _targetTag.getAttribute('row')
            if (!self.focus.start) {
                return
            }
            if (_tRow === 'head-left') {
                return
            }

            if (!self.isCategoryRow(_targetTag)) {
                return
            }

            const targetTag = self.getCategoryRow(_targetTag)
            const targetRect = targetTag.getBoundingClientRect()
            const offsetY = e.clientY - targetRect.top
            const height = targetTag.offsetHeight

            if (offsetY < height / 2) {
                const nextRow = _tRow.toNumber() + 1
                const nextElement = document.getElementById(`${this.leftPrefix}${nextRow}`)
                if (nextElement) nextElement.classList.remove(`dragOverUp`)
                if (!targetTag.classList.contains('dragOverUp')) {
                    targetTag.classList.add('dragOverUp')
                }

            } else {
                if (self.focus.current) self.focus.current.classList.remove('dragOverUp')
                const nextRow = _tRow.toNumber() + 1
                const nextElement = document.getElementById(`${this.leftPrefix}${nextRow}`)
                if (nextElement === null) return
                if (!nextElement.classList.contains(`dragOverUp`)) nextElement.classList.add(`dragOverUp`)
            }

            if (self.focus.current === targetTag) {
                return
            }
            else {
                self.focus.current.classList.remove('dragOverUp')
            }

            self.focus.current = targetTag
        },
        onMouseUp: function (self, targetTag, e) {
            if (!self.focus.start) {
                return
            }
            if (!self.isCategoryRow(targetTag)) {
                self.focus.current.classList.remove('dragOverUp')
                self.focus.current.classList.remove('dragOverDown')
                self.focus.start.classList.remove('dragOver')
                self.clearFocus()
                self.draggingCategoryEnd(self)
                return
            }
            self.onCategoryDragEnd(self, e)
        }
    },

    attachDragAndDropEvent: {
        onMouseDown: function (self, targetTag, e) {
            const row = targetTag.getAttribute('row').toNumber()
            const index = targetTag.getAttribute('index').toNumber()
            self.focus.event = { ...self.categories[row].events[index] }
            self.focus.start = targetTag
            self.focus.current = targetTag
            self.onBlockDragStart(targetTag, self, e)

            if (self.dragging.status === 0) {
                const eventBlock = document.getElementById(`event-block-${self.dragging.row}-${self.dragging.index}`)
                self.changeAllEventBlockOpacity(self.dragging.row, 0.2)
                eventBlock.style.opacity = 1
                self.dragging.status = 1
            }
            // self.eventStart(row)
        },
        onMouseMove: function (self, targetTag, e) {

            const _bNumber = self.focus.current.getAttribute('number')
            const _number = targetTag.getAttribute('number')

            if (_number === null) {
                return
            }
            const _row = self.dragging.row
            const _tRow = targetTag.getAttribute('row')
            if (_tRow !== _row) {
                return
            }

            //
            if (self.dragging.status === 0) {
                const eventBlock = document.getElementById(`event-block-${self.dragging.row}-${self.dragging.index}`)
                self.changeAllEventBlockOpacity(self.dragging.row, 0.2, eventBlock)
                eventBlock.style.opacity = 1
                self.dragging.status = 1
            }

            //
            self.eventModify(_row)
            const _index = self.dragging.index

            const _size = self.categories[_row].events[_index].total.toNumber()
            const _start = _number.toNumber()
            const _endNum = Math.min(_start + _size - 1, self.options.endOfMonthDate - 1)

            self.categories[_row].events[_index] = self.syncEvent(_row, _index, _start, _endNum, _size)

            if (!targetTag.classList.contains('dragOver')) {
                targetTag.classList.add('dragOver')
                self.focus.current.classList.remove('dragOver')
            }
            self.focus.current = targetTag
        },
        onMouseUp: function (self, targetTag, e) {
            self.focus.current.classList.remove('dragOver')
            self.onBlockDragEnd(self, e)

        }
    },
    attachContainerHandleBarEvent: {
        onMouseDown: function (self, targetTag, e) {
            if (self.options.fixed) return

            self.focus.type = 'container-resize'
        },
        onMouseMove: function (self, targetTag, e) {
            if (self.options.fixed) return

            self.syncContainerSize(e.clientX) // 5px is handle bar width
        },
        onMouseUp: function (self, targetTag, e) {
            if (self.options.fixed) return

            self.onChangedContainer(e.clientX)
        }
    },
    attachResizeEvent: {
        prefix: 'event-block-',
        onMouseDown: function (self, targetTag) {
            const row = targetTag.getAttribute('row').toNumber()
            const index = targetTag.getAttribute('index').toNumber()
            const endNum = targetTag.getAttribute('endNum')
            self.focus.event = { ...self.categories[row].events[index] }
            self.focus.start = targetTag
            self.focus.current = document.getElementById(`back-tile-${row}-${endNum}`)
            self.draggingStart(self, self.focus.event)
            self.eventStart(row)
        },
        onMouseMove: function (self, targetTag) {
            const index = self.focus.event.index
            const row = self.focus.event.order
            const startNum = self.focus.event.startNum.toNumber()
            const nextNum = targetTag.getAttribute('number').toNumber()

            if (nextNum === null) {
                return
            }
            if (nextNum < startNum) {
                return
            }

            const eventBlock = document.getElementById(`${this.prefix}${row}-${index}`)

            if (eventBlock === null) {
                return
            }


            self.dragging.endNum = nextNum
            self.resizeEventBlock(eventBlock, targetTag)

            self.eventModify(row)

            self.focus.current = targetTag
        },
        onMouseUp: function (self, targetTag) {
            const row = self.focus.event.order
            self.clearSelectedBlock(row)

            // const startDate = new Date(self.categories[row].events[self.focus.event.index].startDate)
            self.focus.event.startDate = new Date(self.focus.event.startDate)
            self.focus.event.endDate = new Date(self.focus.event.endDate)
            self.categories[row].events[self.focus.event.index].startDate = new Date(self.categories[row].events[self.focus.event.index].startDate)
            self.categories[row].events[self.focus.event.index].endDate = new Date(self.categories[row].events[self.focus.event.index].endDate)
            self.onChangedSchedule(row, self.focus.event, self.categories[row].events[self.focus.event.index])
            self.eventEnd(row)

        }
    },
    attachEventCreate: {
        onMouseDown: function (self, targetTag) {
            if (self.focus.current === undefined) {
                const row = targetTag.getAttribute('row')
                self.eventStart(row)
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

                self.focus.end = targetTag
                self.focus.current = targetTag
                const start = self.focus.start
                const end = targetTag
                const row = start.getAttribute('row')
                self.eventEnd(row)
                self.clearSelectedBlock(row)

                if (start !== undefined && end !== undefined) {
                    const startYear = start.getAttribute('year')
                    const startMonth = start.getAttribute('month').toNumber() - 1
                    const startDate = start.getAttribute('date')
                    const endYear = end.getAttribute('year')
                    const endMonth = end.getAttribute('month').toNumber() - 1
                    const endDate = end.getAttribute('date')
                    const _start = new Date(startYear, startMonth, startDate)
                    const _end = new Date(endYear, endMonth, endDate)
                    const renderOption = { startNumber: start.getAttribute('number'), endNumber: end.getAttribute('number') }

                    if (_start.getDate() > _end.getDate()) {
                        return
                    }
                    self.onDragEndTile(row, _start, _end, renderOption)
                    // self.attachEvent(row, startNum.toNumber(), endNum.toNumber(), { title: self.categories[row].content.title, detail: 'This is Detail', color: self.categories[row].content.style.color })
                }
            }
        }
    }
}

export default OsomeGantt