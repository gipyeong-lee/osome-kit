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

const utils = {
    convertGanttNumberToDate: (startNumber, endNumber, eNum) => {
        let startNum = Math.max(startNumber + 1, 1)
        let endNum = Math.min(endNumber + 1, eNum)

        return { startNum: startNum, endNum: endNum }
    },
    convertDateToGanttNumber: (sDate, eDate, indexOfCurrentMonth, eNum) => {
        let _startDate = new Date(sDate)
        let _endDate = new Date(eDate)
        let startMonth = _startDate.getMonth()
        let endMonth = _endDate.getMonth()

        let startDate = _startDate.getDate()
        let endDate = _endDate.getDate()

        let startNum = Math.max(startDate, 0)
        let endNum = Math.min(endDate, eNum)

        if (startMonth === indexOfCurrentMonth - 1 && endMonth === indexOfCurrentMonth + 1) { }
        else if (startMonth < indexOfCurrentMonth && endMonth === indexOfCurrentMonth) {
            // 전달 ~ 이번달
            endNum = Math.min(endDate, endNum)
        }
        else if (startMonth === indexOfCurrentMonth && endMonth > indexOfCurrentMonth) {
            // 이번달 ~ 다음달
            startNum = startDate
        }
        else if (startMonth === indexOfCurrentMonth && endMonth === indexOfCurrentMonth) {
            // 이번달
            startNum = startDate
            endNum = Math.min(endDate, endNum)
        }
        else {
            return
        }
        if (Math.abs(startMonth - indexOfCurrentMonth) > 1) {
            startNum = 0
        }
        if (Math.abs(endMonth - indexOfCurrentMonth) > 1) {
            endNum = endNum
        }

        return { startNum: startNum, endNum: endNum }
    },
    convertDateToNumber: (sDate, eDate, indexOfCurrentMonth, startOfDay, firstTileDate, endOfMonthDate, eNum) => {
        let _startDate = new Date(sDate)
        let _endDate = new Date(eDate)
        let startMonth = _startDate.getMonth()
        let endMonth = _endDate.getMonth()

        let startDate = _startDate.getDate()
        let endDate = _endDate.getDate()

        let startNum = Math.max(startDate - firstTileDate, 0)
        let endNum = Math.min(Number(startOfDay) + endOfMonthDate + endDate - 1, eNum)

        if (startMonth === indexOfCurrentMonth - 1 && endMonth === indexOfCurrentMonth + 1) { }
        else if (startMonth < indexOfCurrentMonth && endMonth === indexOfCurrentMonth) {
            // 전달 ~ 이번달
            endNum = Math.min(Number(startOfDay) + endDate - 1, endNum)
        }
        else if (startMonth === indexOfCurrentMonth && endMonth > indexOfCurrentMonth) {
            // 이번달 ~ 다음달
            startNum = startOfDay + startDate - 1
        }
        else if (startMonth === indexOfCurrentMonth && endMonth === indexOfCurrentMonth) {
            // 이번달
            startNum = startOfDay + startDate - 1
            endNum = Math.min(Number(startOfDay) + endDate - 1, endNum)
        }
        else if (startMonth === indexOfCurrentMonth - 1 && endMonth === indexOfCurrentMonth - 1) {
            // 둘다 저번달
            if (endDate - firstTileDate < 0) {
                return
            }
            endNum = Math.max(endDate - firstTileDate, 0)
        }
        else if (startMonth === indexOfCurrentMonth + 1 && endMonth === indexOfCurrentMonth + 1) {
            // 둘다 다음달
            if (Number(startOfDay) + endOfMonthDate + startDate - 1 > endNum) {
                return
            }
            startNum = Math.min(Number(startOfDay) + endOfMonthDate + startDate - 1, endNum)
        }
        else {
            return
        }
        if (Math.abs(startMonth - indexOfCurrentMonth) > 1) {
            startNum = 0
        }
        if (Math.abs(endMonth - indexOfCurrentMonth) > 1) {
            endNum = endNum
        }

        return { startNum: startNum, endNum: endNum }
    }
}

export default utils