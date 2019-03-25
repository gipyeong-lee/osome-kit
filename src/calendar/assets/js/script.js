/*
Extension Class
*/
'use strict'

import './../css/style.css'
import PropTypes from 'prop-types'

String.prototype.toNumber = function () {
    return Number(this)
}
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
Number.prototype.toNumber = function () {
    return this
}
HTMLElement.prototype.remove = function () {
    this.parentNode.removeChild(this)
    return this
}
Date.prototype.getPrevMonth = function () {
    let prevMonth = new Date()
    prevMonth.setFullYear(this.getFullYear())
    prevMonth.setMonth(this.getMonth() - 1)
    return prevMonth
}
Date.prototype.getNextMonth = function () {
    let nextMonth = new Date()
    nextMonth.setFullYear(this.getFullYear())
    nextMonth.setMonth(this.getMonth() + 1)
    return nextMonth
}
Date.prototype.getLastDate = function () {
    let nextMonth = new Date()
    nextMonth.setFullYear(this.getFullYear())
    nextMonth.setMonth(this.getMonth() + 1)
    nextMonth.setDate(0)
    return nextMonth.getDate()
}
Date.prototype.startOfDay = function () {
    let copyMonth = new Date()
    copyMonth.setFullYear(this.getFullYear())
    copyMonth.setMonth(this.getMonth())
    copyMonth.setDate(1)
    return copyMonth.getDay()
}
Date.prototype.endOfDay = function () {
    let copyMonth = new Date()
    copyMonth.setFullYear(this.getFullYear())
    copyMonth.setMonth(this.getMonth() + 1)
    copyMonth.setDate(0)
    return copyMonth.getDay()
}

String.prototype.numOfPercent = function () {
    return Number(this.replace('%', ''))
}

Number.prototype.pad = function (len) {
    let s = this.toString();
    if (s.length < len) {
        s = ('0000000000' + s).slice(-len);
    }
    return s;
}

//
var Calendar = {
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
    onClickSchedule: function (element, event, index) {
    },
    onChangedSchedule: function (before, after) {
    },
    //
    eventOption: {
        height: 20
    },
    //
    options: {
        style: {
            grid: {
                width: 800
            },
            row: {
                minHeight: 180
            },
            cellHeader: {
                height: 20,
                gap: 10
            }
        },
        country: 'ko',
        days: { ko: ['일', '월', '화', '수', '목', '금', '토'] },
        today: new Date(),
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        eventPopup: { html: 'test' }
    },
    init: function (id = 'osome-cal-calendar', opt = {}) {
        let self = this
        let _options = Object.assign({}, this.options, opt)
        let _calendarGrid = document.getElementById(id)
        self.createGrid(_calendarGrid, _options)
        self.attachGridEvent(_calendarGrid)
        self.createEventPopup(_calendarGrid, _options)
    },
    randomColor: function () {
        return '#' + (Math.random().toString(16) + "000000").substring(2, 8)
    },
    clear: function (element) {
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
        let startTile = document.getElementById(`${tilePrefix}${startNum}`)
        let endTile = document.getElementById(`${tilePrefix}${endNum}`)
        if (startTile == null || endTile == null) {
            return
        }
        self.createEventBlock(startTile, endTile, _eventOption)
    },
    createHandler(week, startNum, endNum, eventOption) {
        let _eventHandler = document.createElement('span')
        _eventHandler.className = `event-block-handler-${eventOption.index} resize-handle handler-y`
        _eventHandler.innerHTML = '&nbsp;'
        _eventHandler.setAttribute('event-id', eventOption.index)
        _eventHandler.setAttribute('week', week)
        _eventHandler.setAttribute('startNum', startNum)
        _eventHandler.setAttribute('endNum', endNum)
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
        _eventBlock.id = `event-block-${eventOption.index}-${week}`
        _eventBlock.setAttribute('index', eventOption.index)
        _eventBlock.className = `event-block event-block-${eventOption.index}`
        _eventBlock.style.backgroundColor = eventOption.color
        _eventBlock.style.height = `${eventOption.height}px`
        _eventBlock.setAttribute('event-id', eventOption.index)
        _eventBlock.setAttribute('week', week)
        _eventBlock.setAttribute('startNum', startNum)
        _eventBlock.setAttribute('startDayNum', 0)
        _eventBlock.setAttribute('endNum', endNum)
        _eventBlock.setAttribute('endDayNum', 6)

        let _eventText = document.createElement('span')
        _eventText.classList = "title"
        _eventText.innerText = eventOption.title
        _eventText.setAttribute('event-id', eventOption.index)
        _eventBlock.append(_eventText)
        return _eventBlock
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
        const idx = eventOption.index || self.events.length

        let _event = Object.assign({}, { scheduleId: `${idx}`, index: idx }, eventOption)
        _event.start = _startNum
        _event.total = totalDays
        self.events.insert(idx, _event)
        for (var i = _startWeek; i <= _endWeek; i++) {
            const _eventBlock = self.createBlock(i, i * 7, (i + 1) * 7 - 1, _event)
            const _eventHandler = self.createHandler(i, _startNum, _endNum, _event)
            _eventBlock.append(_eventHandler)
            const _weekScheduleEl = document.getElementById(`${weekSchedulePrefix}${i}`)
            const _weekEl = document.getElementById(`${weekPrefix}${i}`)
            _weekEl.style.height = `${eventOption.height * (_weekScheduleEl.childNodes.length + 1) + self.options.style.cellHeader.height + self.options.style.cellHeader.gap}px`
            const swNumber = _weekScheduleEl.getAttribute('startNumber')
            const ewNumber = _weekScheduleEl.getAttribute('endNumber')

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
    createEventPopup: function (calendarGrid, options) {

    },
    syncGridHeight: function () {
        const wrapper = document.getElementById('osome-cal-grid')
        wrapper.parentNode.style.height = wrapper.style.height
    },
    createGrid: function (calendarGrid, options) {
        let self = this
        let width = 100 / 7
        let _grid = document.createElement('div')
        _grid.id = 'osome-cal-grid'
        _grid.style.width = `100%`
        // _grid.className = 'ui equal width celled grid'
        let _divDays = document.createElement("div");
        _divDays.id = 'osome-cal-days'
        _divDays.style.width = `100%`
        _divDays.style.borderTop = 'solid 1px lightgray'
        _divDays.style.borderBottom = 'solid 1px lightgray'
        let _country = options.country
        let days = options.days[_country]
        let offsetX = 0
        days.forEach((day) => {
            let _dayDiv = document.createElement("div")
            _dayDiv.className = 'column'
            _dayDiv.style.display = 'inline-block'
            _dayDiv.style.width = `${width}%`
            _dayDiv.style.left = `${offsetX}%`
            _dayDiv.innerHTML = day
            _divDays.append(_dayDiv)
            offsetX += width
        })
        _grid.append(_divDays)

        const targetDate = new Date(options.year, options.month - 1, 1)
        console.log(targetDate.getMonth())
        const prevMonthObj = targetDate.getPrevMonth()
        console.log(prevMonthObj.getMonth())
        const nextMonthObj = targetDate.getNextMonth()
        console.log(nextMonthObj.getMonth())
        const prevEndOfMonthDate = prevMonthObj.getLastDate()

        const prevYear = prevMonthObj.getFullYear()
        const prevMonth = prevMonthObj.getMonth() + 1
        const nextYear = nextMonthObj.getFullYear()
        const nextMonth = nextMonthObj.getMonth() + 1

        const startOfDay = targetDate.startOfDay();
        console.log(startOfDay)
        const currentMonth = options.month
        let endOfMonthDate = targetDate.getLastDate()

        let date = 1;
        let nextDate = 1;
        let uniqueNum = 0

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
            _rowSchedule.style.paddingTop = `${self.options.style.cellHeader.height + 5}px`
            _rowSchedule.setAttribute('week', i)
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
                let cellHeader = document.createElement('span')
                cellHeader.setAttribute('week', i)
                cellHeader.setAttribute('number', uniqueNum)
                cellHeader.style.width = '100%'
                cellHeader.style.display = 'block'
                let cellText = document.createTextNode("");
                row.setAttribute('endNumber', uniqueNum)
                if (i === 0 && j < startOfDay) {
                    cell.className = "tile prev"
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
                    cellText.textContent = `${prevEndOfMonthDate - (startOfDay - j) + 1}`;
                }
                else if (date > endOfMonthDate) {
                    cell.className = "tile next"
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
                }
                else {
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
                }
                offsetX += width
                if (j === 0) {
                    cell.className += " text-red"
                }
                else if (j === 6) {
                    cell.className += " text-blue"
                }
                cellHeader.append(cellText)
                cell.appendChild(cellHeader);
                _rowGrid.appendChild(cell);
            }
            row.append(_rowGrid)
            row.append(_rowSchedule)
            _grid.appendChild(row); // appending each row into calendar body.
        }
        self.focus.last = uniqueNum
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
        const _eventData = parent.events[_index]
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
        e.target.classList.remove('dragOver')
        const eventId = e.dataTransfer.getData('index').toNumber()
        const startNum = e.target.getAttribute('number').toNumber()
        const event = parent.events[eventId]
        const beforeEvent = JSON.parse(JSON.stringify(event))
        const endNum = Math.min(startNum + event.total.toNumber() - 1, 34)
        parent.moveSchedule(eventId, startNum, endNum, parent)
        parent.onChangedSchedule(beforeEvent, event)
        // parent.reorderEventBox()
    },
    moveSchedule(eventId, startNum, endNum) {
        const tilePrefix = 'osome-cal-grid-day-tile-'
        const event = this.events[eventId]
        const elements = document.getElementsByClassName(`event-block-${eventId}`)
        while (elements.length > 0) elements[0].remove()
        let startTile = document.getElementById(`${tilePrefix}${startNum}`)
        let endTile = document.getElementById(`${tilePrefix}${endNum}`)
        this.events.splice(eventId, 1)
        event.start = startNum
        this.createEventBlock(startTile, endTile, event)

    },
    // Drag And Drop
    isHandler(targetTag) {
        return targetTag.classList.contains('handler-y')
    },
    isEventBlock(targetTag) {
        return targetTag.classList.contains('title')
    },
    cleanNodes(parentNode) {
        while (parentNode.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
    },
    resetAllEventTotal() {
        const self = this
        self.events.map(event => { return event.total = 0 })
    },
    increaseEventTotal(eventId, increaseTotal) {
        const self = this
        const event = self.events[eventId]
        event.total += increaseTotal
        self.events[eventId] = event
    },
    reorderEventBox() {
        // event check.
        const self = this
        const weekPrefix = 'osome-cal-grid-week-'
        const scheduleWrappers = document.getElementsByClassName('osome-cal-grid-week-schedule')
        self.resetAllEventTotal()
        for (var scheduleWrapper of scheduleWrappers) {
            let sortArray = []
            const children = scheduleWrapper.children

            if (children.length > 0) {
                for (var child of children) {
                    if (child.style.display !== 'none') {
                        const eventId = child.getAttribute('event-id')
                        const startNum = child.getAttribute('startNum').toNumber()
                        const endNum = child.getAttribute('endNum').toNumber()
                        const total = (endNum - startNum + 1)
                        sortArray.push(child)
                        self.increaseEventTotal(eventId, total)
                    }
                }

                sortArray.sort(function compare(a, b) {
                    if (a.getAttribute('index').toNumber() < b.getAttribute('index').toNumber())
                        return -1;
                    if (a.getAttribute('index').toNumber() < b.getAttribute('index').toNumber())
                        return 1;
                    return 0
                })
                self.cleanNodes(scheduleWrapper)
                sortArray.forEach((reordedChild) => {
                    scheduleWrapper.appendChild(reordedChild)
                })
                const _weekEl = document.getElementById(`${weekPrefix}${scheduleWrapper.getAttribute('week')}`)
                _weekEl.style.height = `${self.eventOption.height * (children.length + 1) + self.options.style.cellHeader.height + self.options.style.cellHeader.gap}px`
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
            }
            else {
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
                const eventId = targetTag.getAttribute('event-id').toNumber()
                self.onClickSchedule(targetTag, self.events[eventId], eventId)
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
            const week = toTile.getAttribute("week").toNumber()
            const weekSchedulePrefix = 'osome-cal-grid-week-schedule-'
            const _weekScheduleEl = document.getElementById(`${weekSchedulePrefix}${week}`)
            const _event = self.events[defaultBlock.getAttribute('index').toNumber()]

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
            self.reorderEventBox()
        }
        if (_eventBlock.style.display === 'none') {
            _eventBlock.style.display = 'block'
        }
        const eventId = _eventBlock.getAttribute('event-id')
        const startNum = _eventBlock.getAttribute('startNum')
        const fromTile = document.getElementById(`osome-cal-grid-day-tile-${startNum}`)
        const fromLeft = fromTile.style.left.numOfPercent()
        const toLeft = toTile.style.left.numOfPercent()
        const toWidth = toTile.style.width.numOfPercent()
        _eventBlock.setAttribute('endNum', endNum)
        _eventBlock.setAttribute('endDayNum', endDayNum)
        _eventBlock.style.width = `${(toLeft - fromLeft + toWidth)}%`
        self.syncHandler(eventId, toTile.getAttribute('number'))
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
    syncHandler(eventId, endNum) {
        const handlerClassName = `event-block-handler-${eventId}`
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
            const eventId = self.focus.start.getAttribute('event-id')
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
                const eventBlock = document.getElementById(`${this.prefix}${eventId}-${prevWeek}`)
                if (eventBlock.getAttribute('startNum') === null) {
                    return
                }
                const startNum = eventBlock.getAttribute('startNum').toNumber()
                if (startNum <= currentNumber) {
                    self.resizeEventBlock(eventBlock, targetTag)
                }
            }
            else if (prevWeek < nextWeek) {
                // 다음 주로
                const currentBlock = document.getElementById(`${this.prefix}${eventId}-${prevWeek}`)
                const nextBlock = document.getElementById(`${this.prefix}${eventId}-${nextWeek}`)
                self.resizeEventBlockToLast(currentBlock)
                self.resizeEventBlock(nextBlock, targetTag)
            }
            else if (prevWeek > nextWeek) {
                // 이전 주로
                const currentBlock = document.getElementById(`${this.prefix}${eventId}-${prevWeek}`)
                const prevBlock = document.getElementById(`${this.prefix}${eventId}-${nextWeek}`)
                currentBlock.style.display = 'none'
                prevBlock.classList.remove('block-right')
            }
            self.focus.current = targetTag
        },
        onMouseUp: function (self, targetTag) {
            self.eventEnd()
            self.clearFocus()
            self.reorderEventBox()
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
    onClickSchedule: function (event, index) {
    },
    onChangedSchedule: function (before, after) {
    },
 */
export default Calendar