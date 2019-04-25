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
    state: {
        leftWidth: '30%'
    },
    options: {
        type: 'row',
        style: {
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
    init: function (id = 'osome-gantt-calendar', opt = {}, categories = []) {
        let self = this
        let _options = Object.assign({}, this.options, opt)
        let _ganttGrid = document.getElementById(id)

        self.categories = categories
        self.clear(_ganttGrid)
        self.createGrid(_ganttGrid, _options)
        self.renderEventBlocks(_options)
        self.attachGridEvent(_ganttGrid)
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
    insertRow(row) {
        const emptyEvents = {
            "scheduleId": 0,
            "index": 0,
            "title": "This is Title",
            "detail": "This is Detail",
            "style": {
                "color": "#fff",
                "backgroundColor": "#f00"
            },
            "startDate": `2019-04-0${(i % 10)}T15:00:00.000Z`,
            "endDate": `2019-04-0${(2 + i % 10)}T15:00:00.000Z`,
            "eventId": 0,
            "start": 2,
            "total": 2
        }
        const emptyCategory = {
            content: {
                title: ``,
                type: 'empty',
                style: {
                    color: self.randomColor(),
                    padding: '5px'
                }
            }
        }
    },
    deleteRow(row) {

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
        _eventBlock.style.height = `${delta}px`
        _eventBlock.style.zIndex = 11
        _eventBlock.setAttribute('event-id', eventOption.index)
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

        const indexOfCurrentMonth = currentMonth - 1
        const targetDate = new Date(options.year, indexOfCurrentMonth, 1)

        const startOfDay = targetDate.startOfDay();


        let endOfMonthDate = targetDate.getLastDate()

        const firstTileDate = 1

        for (let i = 0; i < _length; i++) {
            const _category = _categories[i]
            const _content = _category.content
            const _events = _category.events || []

            const _row = _content.order.toNumber()
            _events.map((event, idx) => {
                const { startNum, endNum } = utils.convertDateToNumber(event.startDate, event.endDate, indexOfCurrentMonth, startOfDay, firstTileDate, endOfMonthDate, endOfMonthDate)
                console.log(startNum,endNum)
                const startTile = document.getElementById(`${tilePrefix}-${_row}-${startNum}`)
                const endTile = document.getElementById(`${tilePrefix}-${_row}-${endNum}`)
                
                event.color = _content.style.color
                self.renderEventBlock(_row, startTile, endTile, event)
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
        let _event = Object.assign({}, { scheduleId: `${idx}`, index: idx, row: row, startNum: _startNum, endNum: _endNum }, eventOption)
        _event.total = totalDays
        self.categories[row].events[idx] = _event
        const _rowEl = document.getElementById(rowTileId)
        const _eventBlock = self.createBlock(row, _startNum, _endNum, _event)
        const _eventHandler = self.createHandler(row, _startNum, _endNum, _event)
        _eventBlock.append(_eventHandler)

        const left = startTile.style.left
        let size = _endNum - _startNum + 1
        const width = size * (100 / self.options.endOfMonthDate)

        _eventBlock.style.position = 'absolute'
        _eventBlock.style.left = left
        _eventBlock.style.width = `${width}%`

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
        let _event = Object.assign({}, { scheduleId: `${idx}`, index: idx, row: row, startNum: _startNum, endNum: _endNum }, eventOption)

        _event.total = totalDays

        self.categories[row].events.insert(idx, _event)
        const _rowEl = document.getElementById(rowTileId)
        const _eventBlock = self.createBlock(row, _startNum, _endNum, _event)
        const _eventHandler = self.createHandler(row, _startNum, _endNum, _event)
        _eventBlock.append(_eventHandler)

        const left = startTile.style.left
        let size = _endNum - _startNum + 1
        const width = size * (100 / self.options.endOfMonthDate)

        _eventBlock.style.position = 'absolute'
        _eventBlock.style.left = left
        _eventBlock.style.width = `${width}%`

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
        rowContainer.style.lineHeight = `${style.height}px`
        rowContainer.style.height = `${style.height}px`
        rowContainer.style.top = `0px`
        if (!isNaN(row)) {
            rowContainer.style.top = `${(row + 1) * (height + 0.4)}px`
        }
        rowContainer.setAttribute(`row`, row)
        rowContainer.setAttribute(`type`, type)
        if (content !== undefined) {
            const type = content.type || 'main'
            const contentContainer = document.createElement('div')
            const bullet = document.createElement('div')
            bullet.style.display = 'inline-block'
            bullet.style.marginLeft = type === 'main' ? '10px' : '40px'
            bullet.style.float = 'left'
            bullet.style.marginTop = `${self.options.style.row.height / 4}px`
            bullet.style.height = `${self.options.style.row.height / 2}px`
            bullet.style.width = type === 'main' ? `${self.options.style.row.height / 2}px` : `${self.options.style.row.height / 5}px`
            bullet.style.borderRadius = type === 'main' ? `${self.options.style.row.height / 4}px` : 0
            bullet.style.backgroundColor = content.style.color
            const text = document.createElement('span')
            text.style.paddingLeft = '10px'
            text.style.display = 'inline-block'
            text.style.float = 'left'
            text.innerHTML = content.title
            contentContainer.append(bullet)
            contentContainer.append(text)
            rowContainer.append(contentContainer)
        }

        return rowContainer
    },
    createRowTile: function (rowTile, row, days, options) {
        let self = this
        for (let i = 0; i < days; i++) {
            const backTile = self.createBackTile("back", row, i, options.style.row)
            rowTile.appendChild(backTile)
        }

    },
    createBackTile: function (type, row, col, style) {
        const self = this
        let tile = document.createElement('div')
        const offset = col * (100 / self.options.endOfMonthDate)
        tile.classList = `tile ${type}-tile ${type}-tile-${row}`
        tile.id = `${type}-tile-${row}-${col}`
        tile.style.position = 'absolute'
        tile.style.display = 'block'
        tile.style.zIndex = 10
        tile.style.width = `${100 / self.options.endOfMonthDate}%`
        tile.style.height = `${style.height}px`
        tile.style.left = `${offset}%`
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
        const currentMonth = options.month
        const indexOfCurrentMonth = currentMonth - 1
        const targetDate = new Date(options.year, indexOfCurrentMonth, 1)
        let endOfMonthDate = targetDate.getLastDate()

        self.options.endOfMonthDate = endOfMonthDate

        const handleBarWidth = 5
        const parentWidth = calendarGrid.clientWidth


        const rightWidthPercentage = 100 - self.state.leftWidth.numOfPercent()
        const rightWidth = parentWidth * rightWidthPercentage / 100

        let tileWidth = Math.ceil(rightWidth / endOfMonthDate)

        options.style.row.height = tileWidth

        // 
        // 0. create container
        let container = document.createElement('div')
        container.className = 'osome-gantt-grid-container'
        self.container = container


        let leftContainer = document.createElement('div')
        leftContainer.id = `osome-gantt-grid-left-container`
        leftContainer.className = 'osome-gantt-grid-inner-container'
        leftContainer.style.left = 0
        leftContainer.style.borderRight = ``
        leftContainer.style.backgroundColor = `transparent`
        leftContainer.style.width = `${self.state.leftWidth}`

        let handleBar = document.createElement('div')
        handleBar.id = `osome-gantt-grid-handle-bar`
        handleBar.className = 'osome-gantt-grid-handle-bar'
        handleBar.style.right = 0
        handleBar.style.width = `${handleBarWidth}px`
        handleBar.style.top = `${tileWidth}px`


        let rightContainer = document.createElement('div')
        rightContainer.id = `osome-gantt-grid-right-container`
        rightContainer.className = 'osome-gantt-grid-inner-container'
        rightContainer.style.left = `${self.state.leftWidth}`
        rightContainer.style.width = `${rightWidthPercentage}%`

        container.appendChild(leftContainer)

        container.appendChild(rightContainer)
        calendarGrid.appendChild(container)

        // 0. create header



        leftContainer.appendChild(self.createRow('left', 'head-left', options.style.row))
        const daysRow = self.createRow('day', 'head-right', options.style.row)
        rightContainer.appendChild(daysRow)

        self.focus.last = endOfMonthDate

        for (let i = 0; i < endOfMonthDate; i++) {
            const backTile = self.createBackTile("day", 0, i, options.style.row)
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
            self.createRowTile(_row, i, endOfMonthDate, options)
            rightContainer.appendChild(_row)
            let _rowSchedule = self.createRow('schedule', i, options.style.row)
            rightContainer.appendChild(_rowSchedule)
        }
        conatinerHeight = i * (options.style.row.height + 0.4)

        rightContainer.style.height = `${conatinerHeight}px`
        leftContainer.style.height = `${conatinerHeight}px`
        leftContainer.appendChild(handleBar)
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
            row: eventData.row,
            eventId: eventData.index,
            startNum: `${eventData.startNum}`,
            days: days
        }
        self.changeAllEventBlockOpacity(0.5)
    },
    draggingEnd(self) {
        if (document.getElementById(`dragImage-${self.dragging.row}-${self.dragging.eventId}`) !== null) {
            document.getElementById(`dragImage-${self.dragging.row}-${self.dragging.eventId}`).remove()
        }
        self.changeAllEventBlockOpacity(1)
        return self
    },
    onBlockDragEnd(self) {
        const _row = self.dragging.row
        const _eventId = self.dragging.eventId
        const _targetTag = self.focus.current
        if (_targetTag.getAttribute('number') === null) {
            self.onClickEvent()
            return
        }
        const _startNum = _targetTag.getAttribute('number').toNumber()
        const endOfDate = self.options.today.getLastDate()
        const event = self.categories[_row].events[_eventId]
        const total = event.total
        const _endNum = Math.min(_startNum + total - 1, endOfDate - 1)
        const _total = _endNum - _startNum + 1

        const _number = _targetTag.getAttribute('number').toNumber()
        const _size = 100 / self.options.endOfMonthDate
        const _left = _number * _size
        const _width = _total * _size
        // move eventId
        const _eventBlock = document.getElementById(`event-block-${_row}-${_eventId}`)
        _eventBlock.style.left = `${_left}%`
        _eventBlock.setAttribute('startNum', _number)
        _eventBlock.style.width = `${_width}%`
        event.startNum = _startNum
        event.endNum = _endNum
        event.total = _total

        self.draggingEnd(self)
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

        // let canvas = document.createElement('canvas')
        // let context = canvas.getContext('2d')
        // canvas.id = `dragImage-category-${_row}`
        // canvas.className = 'dragImage'
        // canvas.width = rowEl.offsetWidth
        // canvas.height = self.options.style.row.height
        // canvas.style.boxShadow = '3px 4px 2px 0px rgba(0,0,0,0.09)'
        // canvas.style.left = `${e.clientX + 5}px`
        // canvas.style.top = `${e.clientY + 5}px`
        // self.htmlToImg(rowEl, (img) => {
        //     if (self.focus.type === 'reorder') {
        //         context.drawImage(img, 0, 0)
        //         document.body.append(canvas)
        //     }
        // })

        if (!self.focus.start.classList.contains('dragOver')) {
            self.focus.start.classList.add('dragOver')
        }
    },
    moveRow(self, e) {
        if (self.focus.start === undefined) {
            return
        }

        const _parentId = 'osome-gantt-grid-left-container'
        const _parent = document.getElementById(_parentId)
        const _sourceRowEl = self.focus.start
        const _sRow = _sourceRowEl.getAttribute('row').toNumber()
        const _targetRowEl = self.focus.current
        let _tRow = _targetRowEl.getAttribute('row').toNumber()

        const sourceCategoryId = `left-row-${_sRow}`
        const sourceScheduleId = `schedule-row-${_sRow}`
        const _sourceCategoryEl = document.getElementById(sourceCategoryId)
        const _sourceScheduleEl = document.getElementById(sourceScheduleId)
        // trow
        const targetRect = _targetRowEl.getBoundingClientRect()
        const offsetY = e.clientY - targetRect.top
        const height = _targetRowEl.offsetHeight
        const idRegex = /div id="(.*?)-(.*?)-(.*?)-(.*?)"/g
        const rowRegex = /row="(.*?)"/g
        const classRegex = /class="event-block event-block-(.*?)"/g
        if (_sRow < _tRow) {
            if (offsetY < height / 2) {
                _tRow -= 1
            }

            let targetCategoryId = `left-row-${_tRow}`
            let targetScheduleId = `schedule-row-${_tRow}`
            const _targetCategoryEl = document.getElementById(targetCategoryId)
            const _targetScheduleEl = document.getElementById(targetScheduleId)
            const _sourceHtml = _sourceCategoryEl.innerHTML
            let _sourceScheduleHtml = _sourceScheduleEl.innerHTML
            const _source = self.categories[_sRow]
            for (let i = _sRow; i < _tRow; i++) {
                const nextRow = document.getElementById(`left-row-${i + 1}`)
                const beforeRow = document.getElementById(`left-row-${i}`)
                beforeRow.innerHTML = nextRow.innerHTML
                self.categories[i] = self.categories[i + 1]
                const nextSchedule = document.getElementById(`schedule-row-${i + 1}`)
                const beforeSchedule = document.getElementById(`schedule-row-${i}`)
                let nextScheduleHtml = nextSchedule.innerHTML
                nextScheduleHtml = nextScheduleHtml.replace(idRegex, `div id="$1-$2-${i}-$4"`)
                nextScheduleHtml = nextScheduleHtml.replace(rowRegex, `row="${i}"`)
                nextScheduleHtml = nextScheduleHtml.replace(classRegex, `class="event-block event-block-${i}"`)
                beforeSchedule.innerHTML = nextScheduleHtml
            }

            _sourceScheduleHtml = _sourceScheduleHtml.replace(idRegex, `div id="$1-$2-${_tRow}-$4"`)
            _sourceScheduleHtml = _sourceScheduleHtml.replace(rowRegex, `row="${_tRow}"`)
            _sourceScheduleHtml = _sourceScheduleHtml.replace(classRegex, `class="event-block event-block-${_tRow}"`)
            _targetScheduleEl.innerHTML = _sourceScheduleHtml
            _targetCategoryEl.innerHTML = _sourceHtml

            self.categories[_tRow] = _source

        }
        else if (_sRow > _tRow) {
            if (offsetY > height / 2) {
                _tRow += 1
            }
            let targetCategoryId = `left-row-${_tRow}`
            let targetScheduleId = `schedule-row-${_tRow}`
            const _targetCategoryEl = document.getElementById(targetCategoryId)
            const _targetScheduleEl = document.getElementById(targetScheduleId)
            const _sourceHtml = _sourceCategoryEl.innerHTML
            let _sourceScheduleHtml = _sourceScheduleEl.innerHTML
            const _source = self.categories[_sRow]
            for (let i = _sRow; i > _tRow; i--) {
                const nextRow = document.getElementById(`left-row-${i}`)
                const beforeRow = document.getElementById(`left-row-${i - 1}`)
                nextRow.innerHTML = beforeRow.innerHTML
                self.categories[i] = self.categories[i - 1]
                const nextSchedule = document.getElementById(`schedule-row-${i}`)
                const beforeSchedule = document.getElementById(`schedule-row-${i - 1}`)

                let beforeScheduleHtml = beforeSchedule.innerHTML
                beforeScheduleHtml = beforeScheduleHtml.replace(idRegex, `div id="$1-$2-${i}-$4"`)
                beforeScheduleHtml = beforeScheduleHtml.replace(rowRegex, `row="${i}"`)
                beforeScheduleHtml = beforeScheduleHtml.replace(classRegex, `class="event-block event-block-${i}"`)
                nextSchedule.innerHTML = beforeScheduleHtml
            }
            _sourceScheduleHtml = _sourceScheduleHtml.replace(idRegex, `div id="$1-$2-${_tRow}-$4"`)
            _sourceScheduleHtml = _sourceScheduleHtml.replace(rowRegex, `row="${_tRow}"`)
            _sourceScheduleHtml = _sourceScheduleHtml.replace(classRegex, `class="event-block event-block-${_tRow}"`)
            _targetScheduleEl.innerHTML = _sourceScheduleHtml
            _targetCategoryEl.innerHTML = _sourceHtml

            self.categories[_tRow] = _source
        }
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
        return targetTag.classList.contains('osome-gantt-grid-category-row')
    },
    isRightTile(targetTag) {
        return targetTag.classList.contains('tile')
    },
    isHandler(targetTag) {
        return targetTag.classList.contains('handler-y')
    },
    isEventBlock(targetTag) {
        return targetTag.classList.contains('event-block')
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
            else if (self.focus.type === 'reorder') {
                self.attachDragAndDropCategory.onMouseMove(self, targetTag, e)
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
            else if (self.focus.type === 'reorder') {
                self.attachDragAndDropCategory.onMouseUp(self, targetTag, e)
            }

            self.clearFocus()
        }
    },
    resizeEventBlock(eventBlock, toTile) {
        let self = this
        let width = self.options.style.row.height
        const _eventId = eventBlock.getAttribute('event-id').toNumber()
        const _row = eventBlock.getAttribute('row').toNumber()
        const _startNum = self.categories[_row].events[_eventId].startNum
        const _endNum = toTile.getAttribute('number').toNumber()
        let _size = _endNum - _startNum + 1
        const _percentOfWidth = _size / self.options.endOfMonthDate * 100

        eventBlock.style.width = `${_percentOfWidth}%`
        eventBlock.style.height = `${width}px`
        self.categories[_row].events[_eventId] = self.syncEvent(_row, _eventId, _startNum, _endNum)
        self.syncHandler(_eventId, toTile.getAttribute('number'))
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
    syncEvent(row, eventId, startNum, endNum) {
        let event = this.categories[row].events[eventId]

        const sYear = this.options.year
        const sMonth = this.options.month
        const sDate = startNum + 1

        const eYear = this.options.year
        const eMonth = this.options.month
        const eDate = endNum + 1
        event.startNum = startNum
        event.endNum = endNum
        event.total = endNum - startNum + 1
        event.startDate = new Date(sYear, sMonth, sDate)
        event.endDate = new Date(eYear, eMonth, eDate)
        return { ...event }

    },
    syncContainerSize: function (leftWidth) {
        const self = this
        const containerWidth = self.container.offsetWidth
        const leftContainerId = 'osome-gantt-grid-left-container'
        const rightContainerId = 'osome-gantt-grid-right-container'
        const handleBarId = 'osome-gantt-grid-handle-bar'
        const leftContainer = document.getElementById(leftContainerId)
        const rightContainer = document.getElementById(rightContainerId)
        const rightWidth = containerWidth - leftWidth
        leftContainer.style.width = `${leftWidth / containerWidth * 100}%`
        rightContainer.style.left = `${leftWidth / containerWidth * 100}%`
        rightContainer.style.width = `${rightWidth / containerWidth * 100}%`
        self.state.leftWidth = `${leftWidth / containerWidth * 100}%`
    },
    attachDragAndDropCategory: {
        onMouseDown: function (self, targetTag, e) {
            self.focus.start = targetTag
            self.focus.current = targetTag
            self.onCategoryDragStart(targetTag, self, e)
        },
        onMouseMove: function (self, targetTag, e) {
            const _row = self.dragging.row
            const _tRow = targetTag.getAttribute('row')
            // let dragImg = document.getElementById(`dragImage-category-${_row}`)
            // if (dragImg === null || dragImg === undefined) {
            //     return
            // }
            // dragImg.style.left = `${e.clientX + 5}px`
            // dragImg.style.top = `${e.pageY + 5}px`

            if (!targetTag.classList.contains('osome-gantt-grid-category-row')) {
                return
            }
            const targetRect = targetTag.getBoundingClientRect()
            const offsetY = e.clientY - targetRect.top
            const height = targetTag.offsetHeight

            if (offsetY < height / 2) {
                if (targetTag.classList.contains('dragOverDown')) {
                    targetTag.classList.remove('dragOverDown')
                }
                if (!targetTag.classList.contains('dragOverUp')) {
                    targetTag.classList.add('dragOverUp')
                }

            } else {
                if (targetTag.classList.contains('dragOverUp')) {
                    self.focus.current.classList.remove('dragOverUp')
                }
                if (!targetTag.classList.contains('dragOverDown')) {
                    targetTag.classList.add('dragOverDown')
                }
            }

            if (self.focus.current === targetTag) {
                return
            }
            else {
                self.focus.current.classList.remove('dragOverUp')
                self.focus.current.classList.remove('dragOverDown')
            }


            self.focus.current = targetTag
        },
        onMouseUp: function (self, targetTag, e) {
            self.onCategoryDragEnd(self, e)
        }
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
            const startNum = self.categories[row].events[eventId].startNum
            const endNum = self.categories[row].events[eventId].endNum
            const nextNum = targetTag.getAttribute('number').toNumber()

            if (nextNum === null) {
                return
            }
            if (endNum === nextNum || nextNum < startNum) {
                return
            }

            const eventBlock = document.getElementById(`${this.prefix}${row}-${eventId}`)

            if (eventBlock === null) {
                return
            }

            if (startNum <= nextNum) {
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
                    self.attachEvent(row, startNum.toNumber(), endNum.toNumber(), { title: 'This is Title', detail: 'This is Detail', color: self.categories[row].content.style.color })
                }
            }
        }
    }
}

export default OsomeGantt