/*
Extension Class
*/
'use strict'

String.prototype.toNumber = function () {
    return Number(this)
}
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
Number.prototype.toNumber = function () {
    return this
}
Number.prototype.pad = function (len) {
    let s = this.toString();
    if (s.length < len) {
        s = ('0000000000' + s).slice(-len);
    }
    return s;
}
String.prototype.numOfPercent = function () {
    return Number(this.replace('%', ''))
}
String.prototype.numOfPixel = function () {
    return Number(this.replace('px', ''))
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



//
var OsomeGantt = {
    events: [],
    dragging: {
        row: undefined,
        eventId: undefined,
        startNum: undefined,
        days: undefined
    },
    focus: {
        // start,end,last is unique number of tiles.
        current: undefined,
        type: undefined, // create, resize, move
        start: 0,
        end: 0,
        last: 0
    },
    onClickEvent: function () {
        console.log(`onClickEvent`)
    },
    //
    eventOption: {
        height: 20
    },
    //
    options: {
        type: 'row',
        style: {
            grid: {
                width: 800
            },
            row: {
                height: 20
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
        self.clear(_calendarGrid)
        // Create Grid
        self.createGrid(_calendarGrid, _options)
        self.attachGridEvent(_calendarGrid)
        // Create Popup
        // self.createEventPopup(_calendarGrid, _options)
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
    },
    attachEvent: function (row, start, end, eventOption) {
        let self = this
        const tilePrefix = 'back-tile'
        if(start === null || end === null){
            return
        }
        let _eventOption = Object.assign({}, self.eventOption, eventOption)
        let startTile = document.getElementById(`${tilePrefix}-${row}-${start}`)
        let endTile = document.getElementById(`${tilePrefix}-${row}-${end}`)
        self.createEventBlock(row, startTile, endTile, _eventOption)
    },
    createHandler(row, startNum, endNum, eventOption) {
        let _eventHandler = document.createElement('span')
        _eventHandler.className = `event-block-handler-${eventOption.index} resize-handle handler-y`
        _eventHandler.innerHTML = '&nbsp;'
        _eventHandler.setAttribute('event-id', eventOption.index)
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
        _eventBlock.setAttribute('index', eventOption.index)
        _eventBlock.className = `event-block event-block-${row}`
        _eventBlock.style.backgroundColor = eventOption.color
        _eventBlock.style.height = `${eventOption.height}px`
        _eventBlock.style.zIndex = 11
        _eventBlock.setAttribute('event-id', eventOption.index)
        _eventBlock.setAttribute('row', row)
        _eventBlock.setAttribute('startNum', startNum)
        _eventBlock.setAttribute('endNum', endNum)

        let _eventText = document.createElement('span')
        _eventText.classList = "title"
        _eventText.innerText = eventOption.title
        _eventBlock.append(_eventText)
        return _eventBlock
    },
    createEventBlock(row, startTile, endTile, eventOption) {
        const self = this
        const tileWidth = self.options.style.row.height
        const rowTileId = `schedule-row-${row}`

        const _startNum = startTile.getAttribute('number').toNumber()
        const _endNum = endTile.getAttribute('number').toNumber()
        // full date
        // week schedule.
        const totalDays = _endNum - _startNum + 1
        const idx = eventOption.index ||
            self.events.length
        let _event = Object.assign({}, { scheduleId: `${idx}`, index: idx, row: row, startNum: _startNum, endNum: _endNum }, eventOption)
        _event.start = _startNum
        _event.total = totalDays
        self.events.insert(idx, _event)
        const _rowEl = document.getElementById(rowTileId)
        const _eventBlock = self.createBlock(row, _startNum, _endNum, _event)
        const _eventHandler = self.createHandler(row, _startNum, _endNum, _event)
        _eventBlock.append(_eventHandler)

        const left = startTile.style.left
        let size = _endNum - _startNum + 1
        const width = size * tileWidth
        _eventBlock.style.position = 'absolute'
        _eventBlock.style.left = left
        _eventBlock.style.width = `${width}px`

        _rowEl.append(_eventBlock)
    },
    clearSelectedBlock: function (row) {
        let self = this
        const tileClass = `back-tile-${row}`
        const last = self.focus.last
        const tiles = document.getElementsByClassName(tileClass)
        for (const tile of tiles) {
            if (tile.classList.contains('active')) {
                tile.classList.remove('active')
            }
        }
    },
    createEventPopup: function (calendarGrid, options) {

    },
    createRow: function (type, row, style) {
        let self = this
        let height = style.height

        let rowContainer = document.createElement('div')
        if (type === 'schedule') {
            rowContainer.className = `osome-gantt-schedule-row`
        }
        else {
            rowContainer.className = `row osome-gantt-grid-row`
        }
        rowContainer.id = `${type}-row-${row}`
        rowContainer.style.height = `${style.height}px`
        rowContainer.style.top = `${row * height}px`
        rowContainer.setAttribute(`row`, row)
        rowContainer.setAttribute(`type`, type)
        return rowContainer
    },
    createRowTile: function (rowTile, row, days, options) {
        let self = this
        let rightContainerWidth = 0
        for (let i = 0; i < days; i++) {
            const backTile = self.createBackTile("back", row, i, options.style.row)
            rightContainerWidth = (backTile.style.left.numOfPixel() + options.style.row.height)
            rowTile.appendChild(backTile)
        }
        rowTile.style.width = rightContainerWidth
    },
    createBackTile: function (type, row, col, style) {
        const self = this
        let tile = document.createElement('div')
        const offset = col * style.height
        tile.classList = `tile ${type}-tile ${type}-tile-${row}`
        tile.id = `${type}-tile-${row}-${col}`
        tile.style.position = 'absolute'
        tile.style.display = 'block'
        tile.style.zIndex = 10
        tile.style.width = `${style.height}px`
        tile.style.height = `${style.height}px`
        tile.style.left = `${offset}px`
        tile.setAttribute('row', row)
        tile.setAttribute('col', col)
        tile.setAttribute('dayNum', (col + 1))
        tile.setAttribute('number', col)
        if (type === 'day') {
            tile.style.textAlign = 'center'
            tile.textContent = `${col + 1}`
        }
        return tile
    },
    createGrid: function (calendarGrid, options) {
        let self = this
        const defaultLeftRatio = 0.3
        const handleBarWidth = 5
        const leftWidth = Number(options.style.grid.width) * defaultLeftRatio - handleBarWidth
        let offset = 0
        // 
        // 0. create container
        let container = document.createElement('div')
        container.className = 'osome-grid-container'
        let leftContainer = document.createElement('div')
        leftContainer.id = `osome-grid-left-container`
        leftContainer.className = 'osome-grid-inner-container'
        leftContainer.style.left = offset
        leftContainer.style.width = `${leftWidth}px`
        leftContainer.style.height = `100%`
        offset += leftWidth

        let handleBar = document.createElement('div')
        handleBar.id = `osome-grid-container-handle-bar`
        handleBar.className = 'osome-grid-handle-bar'
        handleBar.style.left = `${offset}px`
        handleBar.style.width = `${handleBarWidth}px`
        offset += handleBarWidth

        let rightContainer = document.createElement('div')
        rightContainer.id = `osome-grid-right-container`
        rightContainer.className = 'osome-grid-inner-container'
        rightContainer.style.left = `${offset}px`
        rightContainer.style.height = `100%`

        container.appendChild(leftContainer)
        container.appendChild(handleBar)
        container.appendChild(rightContainer)
        calendarGrid.appendChild(container)

        // 0. create header
        const targetDate = new Date(options.year, options.month - 1, 1)

        const startOfDay = targetDate.startOfDay();

        const currentMonth = options.month
        let endOfMonthDate = targetDate.getLastDate()

        leftContainer.appendChild(self.createRow('left', 0, options.style.row))
        const daysRow = self.createRow('day', 0, options.style.row)
        rightContainer.appendChild(daysRow)
        
        self.focus.last = endOfMonthDate

        let rightContainerWidth = 0
        for (let i = 0; i < endOfMonthDate; i++) {
            const backTile = self.createBackTile("day", 0, i, options.style.row)
            rightContainerWidth = (backTile.style.left.numOfPixel() + options.style.row.height)
            daysRow.appendChild(backTile)
        }

        rightContainer.style.width = `${rightContainerWidth}px`
        // 1. create row
        let i
        let conatinerHeight = 0

        for (i = 1; i < 250; i++) {
            leftContainer.appendChild(self.createRow('left', i, options.style.row))
            let _row = self.createRow('right', i, options.style.row)
            self.createRowTile(_row, i, endOfMonthDate, options)
            rightContainer.appendChild(_row)
            let _rowSchedule = self.createRow('schedule', i, options.style.row)
            rightContainer.appendChild(_rowSchedule)
        }
        conatinerHeight = i * options.style.row.height

        handleBar.style.height = `${conatinerHeight}px`
        rightContainer.style.height = `${conatinerHeight}px`
        leftContainer.style.height = `${conatinerHeight}px`

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
    changeAllEventBlockOpacity(opacity) {
        const blocks = document.getElementsByClassName('event-block')
        for (let block of blocks) {
            block.style.opacity = opacity
            block.style.zIndex = opacity === 1 ? 11 : 9
        }
    },
    draggingStart(self, eventData) {
        const days = eventData.endNum - eventData.startNum
        self.dragging = {
            row: eventData.row,
            eventId: eventData.index,
            startNum: `${eventData.startNum}`,
            days: days
        }
        self.changeAllEventBlockOpacity(0.5)
    },
    draggingEnd(self) {
        if(document.getElementById(`dragImage-${self.dragging.row}-${self.dragging.eventId}`) !== null){
            document.getElementById(`dragImage-${self.dragging.row}-${self.dragging.eventId}`).remove()    
        }
        self.changeAllEventBlockOpacity(1)
        return self
    },

    onBlockDragEnd(self) {
        const _row = self.dragging.row
        const _eventId = self.dragging.eventId
        const _targetTag = self.focus.current
        if(_targetTag.getAttribute('number') === null){
            self.onClickEvent()
            return
        }
        const _number = _targetTag.getAttribute('number').toNumber()
        const _left = _number * self.options.style.row.height
        // move eventId
        const _eventBlock = document.getElementById(`event-block-${_row}-${_eventId}`)
        _eventBlock.style.left = `${_left}px`
        _eventBlock.setAttribute('startNum',_number)
        self.events[_eventId].startNum = _number
        self.draggingEnd(self)
    },
    onBlockDragStart(eventBlock, self, e) {
        const _index = eventBlock.getAttribute('index').toNumber()
        const _row = eventBlock.getAttribute('row')
        let _eventData = self.events[_index]
        _eventData.row = _row
        self.draggingStart(self, _eventData)
        let width = 100 / 7
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')
        canvas.id = `dragImage-${_row}-${_index}`
        canvas.className = 'dragImage'
        canvas.width = 100
        canvas.height = 20
        canvas.style.left = `${e.clientX}px`
        canvas.style.top = `${e.clientY}px`
        context.fillStyle = _eventData.color
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = '#ffffff'
        context.font = 'bold 14px Arial'
        context.fillText(_eventData.title, 10, 14)
        document.body.append(canvas)
    },
    // Drag And Drop
    isHandler(targetTag) {
        return targetTag.classList.contains('handler-y')
    },
    isEventBlock(targetTag) {
        return targetTag.classList.contains('title')
    },
    isContainerHandleBar(targetTag) {
        return targetTag.classList.contains('osome-grid-handle-bar')
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
                self.attachDragAndDropEvent.onMouseDown(self, targetTag.parentNode, e)
            }
            else if (self.isContainerHandleBar(targetTag)) {
                self.attachContainerHandleBarEvent.onMouseDown(self, targetTag, e)
            }
            else {
                self.focus.type = 'create'
                self.attachEventCreate.onMouseDown(self, targetTag)
            }
        }
        calendarGrid.onmousemove = function (e) {
            if (self.focus.type === undefined) {
                return
            }
            const targetTag = document.elementFromPoint(e.clientX, e.clientY)
            if (self.focus.type === 'create') {
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
                const _number = targetTag.getAttribute('number')
                const _startNum = self.focus.start.getAttribute('startNum')

                if (_number === _startNum) {
                    self.draggingEnd(self).onClickEvent()
                }
                else {
                    self.draggingEnd(self).attachDragAndDropEvent.onMouseUp(self, targetTag, e)
                }
            }
            else if (self.focus.type === 'container-resize') {
                self.attachContainerHandleBarEvent.onMouseUp(self, targetTag, e)
            }
            self.clearFocus()
        }
    },
    resizeEventBlock(eventBlock, toTile) {
        let self = this
        let width = self.options.style.row.height
        let _eventBlock = eventBlock
        const eventId = _eventBlock.getAttribute('event-id')

        let _size = toTile.getAttribute('number').toNumber() - eventBlock.getAttribute('startNum').toNumber() + 1
        _eventBlock.style.width = `${_size * width}px`
        self.events[eventId.toNumber()].endNum = toTile.getAttribute('number').toNumber()
        self.syncHandler(eventId, toTile.getAttribute('number'))
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
    eventStart(row, startNum, endNum) {
        const elements = document.getElementsByClassName(`event-block-${row}`)
        for (let element of elements) {
            element.style.zIndex = 9
        }
        if (row !== undefined) {
            const elements = document.getElementsByClassName(`back-tile-${row}`)
            for (let element of elements) {
                element.classList.add('resizing')
            }
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
    syncContainerSize: function (leftWidth) {
        const self = this
        const leftContainerId = 'osome-grid-left-container'
        const rightContainerId = 'osome-grid-right-container'
        const handleBarId = 'osome-grid-container-handle-bar'
        const leftContainer = document.getElementById(leftContainerId)
        const rightContainer = document.getElementById(rightContainerId)
        const handleBar = document.getElementById(handleBarId)
        leftContainer.style.width = `${leftWidth}px`
        handleBar.style.left = `${leftWidth}px`
        const left = (leftWidth + handleBar.style.width.numOfPixel())
        rightContainer.style.left = `${left}px`
    },
    attachDragAndDropEvent: {
        onMouseDown: function (self, targetTag, e) {
            self.focus.start = targetTag
            self.focus.current = targetTag
            self.onBlockDragStart(targetTag, self, e)
        },
        onMouseMove: function (self, targetTag, e) {
            const _bNumber = self.focus.current.getAttribute('number')
            const _number = targetTag.getAttribute('number')
            
            if (_bNumber === _number) {
                return
            }
            const _row = self.dragging.row
            const _tRow = targetTag.getAttribute('row')
            if (_tRow !== _row) {
                return
            }
            const _index = self.dragging.eventId
            let dragImg = document.getElementById(`dragImage-${_row}-${_index}`)
            dragImg.style.left = `${e.clientX}px`
            dragImg.style.top = `${e.clientY}px`
            if (!targetTag.classList.contains('dragOver')) {
                targetTag.classList.add('dragOver')
                self.focus.current.classList.remove('dragOver')
            }
            self.focus.current = targetTag
        },
        onMouseUp: function (self, targetTag) {
            self.focus.current.classList.remove('dragOver')
            self.onBlockDragEnd(self)
        }
    },
    attachContainerHandleBarEvent: {
        onMouseDown: function (self, targetTag, e) {
            self.focus.type = 'container-resize'

        },
        onMouseMove: function (self, targetTag, e) {
            self.syncContainerSize(e.clientX)
        },
        onMouseUp: function (self, targetTag, e) {

        }
    },
    attachResizeEvent: {
        prefix: 'event-block-',
        onMouseDown: function (self, targetTag) {
            const row = targetTag.getAttribute('row')
            const endNum = targetTag.getAttribute('endNum')
            self.focus.start = targetTag
            self.focus.current = document.getElementById(`back-tile-${row}-${endNum}`)
            self.eventStart(row)
        },
        onMouseMove: function (self, targetTag) {
            const eventId = self.focus.start.getAttribute('event-id')
            const row = targetTag.getAttribute('row').toNumber()
            const currentNumber = targetTag.getAttribute('number').toNumber()
            const nextNumber = targetTag.getAttribute('number').toNumber()
            if (nextNumber === null) {
                return
            }
            // 날짜 비교만
            const eventBlock = document.getElementById(`${this.prefix}${row}-${eventId}`)

            if (eventBlock.getAttribute('startNum') === null) {
                return
            }
            const startNum = eventBlock.getAttribute('startNum').toNumber()

            if (startNum <= currentNumber) {
                self.resizeEventBlock(eventBlock, targetTag)
            }

            self.focus.current = targetTag
        },
        onMouseUp: function (self, targetTag) {
            const row = targetTag.getAttribute('row')
            self.eventEnd(row)
            self.clearSelectedBlock(row)
            self.reorderEventBox()
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
                const startNum = start.getAttribute('col')
                const endNum = end.getAttribute('col')
                if (start !== undefined && end !== undefined) {
                    self.attachEvent(row, startNum, endNum, { title: 'This is Title', detail: 'This is Detail', color: self.randomColor() })
                }
            }
        }
    }
}

export default OsomeGantt