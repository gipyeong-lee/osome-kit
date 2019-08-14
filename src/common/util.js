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
    prevMonth.setDate(1)
    prevMonth.setFullYear(this.getFullYear())
    prevMonth.setMonth(this.getMonth() - 1)
    return prevMonth
}
Date.prototype.getNextMonth = function () {
    let nextMonth = new Date()
    nextMonth.setDate(1)
    nextMonth.setFullYear(this.getFullYear())
    nextMonth.setMonth(this.getMonth() + 1)
    return nextMonth
}
Date.prototype.getLastDate = function () {
    let nextMonth = new Date()
    nextMonth.setDate(1)
    nextMonth.setFullYear(this.getFullYear())
    nextMonth.setMonth(this.getMonth() + 1)
    nextMonth.setDate(0)
    return nextMonth.getDate()
}
Date.prototype.startOfDay = function () {
    let copyMonth = new Date()
    copyMonth.setDate(1)
    copyMonth.setFullYear(this.getFullYear())
    copyMonth.setMonth(this.getMonth())
    return copyMonth.getDay()
}
Date.prototype.endOfDay = function () {
    let copyMonth = new Date()
    copyMonth.setDate(1)
    copyMonth.setFullYear(this.getFullYear())
    copyMonth.setMonth(this.getMonth() + 1)
    copyMonth.setDate(0)
    return copyMonth.getDay()
}
Date.prototype.addDays = function (n) {
    var result = new Date();
    result.setFullYear(this.getFullYear())
    result.setMonth(this.getMonth())
    result.setHours(this.getHours())
    result.setMinutes(this.getMinutes())
    result.setDate(this.getDate() + n)
    return result;
}

Date.prototype.zeroTimeDate = function () {
    let copy = new Date(this)
    copy.setHours(0)
    copy.setMinutes(0)
    copy.setSeconds(0)
    return copy
}

Date.prototype.midasFormat = function () {
    let month = this.getMonth() + 1
    let date = this.getDate()
    let hours = this.getHours()
    let minutes = this.getMinutes()
    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${month}/${date} ${hours}:${minutes}`
}

const utils = {
    convertGanttNumberToDate: (startNumber, endNumber, eNum) => {
        let startNum = Math.max(startNumber + 1, 1)
        let endNum = Math.min(endNumber + 1, eNum)

        return { startNum: startNum, endNum: endNum }
    },
    convertDateToGanttNumber: (sDate, eDate, currentYear, indexOfCurrentMonth, eNum) => {

        let _startDate = new Date(sDate)
        let _endDate = new Date(eDate)
        let firstTileDate = 1
        let firstTileMonth = indexOfCurrentMonth + 1
        let firstTileYear = currentYear

        let startYear = _startDate.getFullYear()
        let endYear = _endDate.getFullYear()
        let startMonth = _startDate.getMonth() + 1
        let endMonth = _endDate.getMonth() + 1
        let startDate = _startDate.getDate()
        let endDate = _endDate.getDate()
        let startNum = 1
        let endNum = endDate

        let firstTileValue = firstTileYear * 10000 + firstTileMonth * 100 + firstTileDate
        let startDateValue = startYear * 10000 + startMonth * 100 + startDate
        let endDateValue = endYear * 10000 + endMonth * 100 + endDate
        let endTileValue = currentYear * 10000 + (indexOfCurrentMonth + 1) * 100 + eNum

        if (startDateValue > endTileValue) {
            return
        }
        if (endDateValue < firstTileValue) {
            return
        }
        if (endDateValue > endTileValue) {
            endNum = eNum
        }
        if (startDateValue > firstTileValue && startDateValue <= endTileValue) {
            startNum = startDate
        }
        if (endDateValue > firstTileValue && endDateValue < endTileValue) {

            endNum = Math.min(endDate, endNum)
        }
        return { startNum: startNum, endNum: endNum }
    },
    convertDateToNumber: (sDate, eDate, currentYear, indexOfCurrentMonth, startOfDay, firstTile, endOfMonthDate, eNum) => {
        let _startDate = new Date(sDate)
        let _endDate = new Date(eDate)
        let firstTileDate = firstTile.getAttribute('date').toNumber()
        let firstTileMonth = firstTile.getAttribute('month').toNumber()
        let firstTileYear = firstTile.getAttribute('year').toNumber()
        let monthEndDate = new Date(`${currentYear}-${(indexOfCurrentMonth + 1).pad(2)}-${endOfMonthDate}`)
        let endOfMonthDay = monthEndDate.getDay()

        let startYear = _startDate.getFullYear()
        let endYear = _endDate.getFullYear()
        let startMonth = _startDate.getMonth() + 1
        let endMonth = _endDate.getMonth() + 1
        let startDate = _startDate.getDate()
        let endDate = _endDate.getDate()

        let lastTileYear = currentYear
        let lastTileMonth = indexOfCurrentMonth + 2
        let lastTileDate = 6 - endOfMonthDay
        if (lastTileMonth > 12) {
            lastTileYear += 1
            lastTileMonth -= 12
        }

        let firstTileValue = firstTileYear * 10000 + firstTileMonth * 100 + firstTileDate
        let lastTileValue = lastTileYear * 10000 + lastTileMonth * 100 + lastTileDate
        let startDateValue = startYear * 10000 + startMonth * 100 + startDate
        let endDateValue = endYear * 10000 + endMonth * 100 + endDate
        let startMonthValue = currentYear * 10000 + (indexOfCurrentMonth + 1) * 100 + 1
        let endMonthValue = currentYear * 10000 + (indexOfCurrentMonth + 1) * 100 + endOfMonthDate

        let startNum = startOfDay + startDate - 1
        let endNum = Math.min(Number(startOfDay) + endDate - 1, eNum)
        const saturday = 6

        if (startDateValue > lastTileValue) {
            return
        }
        if (endDateValue < firstTileValue) {
            return
        }
        if (startDateValue <= firstTileValue) {
            startNum = 0
        }
        if (endDateValue >= lastTileValue) {
            endNum = eNum
        }
        // prevMonth
        if (startDateValue > firstTileValue && startDateValue < startMonthValue) {
            startNum = _startDate.getDay()
        }
        if (endDateValue > firstTileValue && endDateValue < startMonthValue) {
            endNum = _endDate.getDay()
        }

        // nextMonth
        if (startDateValue > endMonthValue && startDateValue < lastTileValue) {
            startNum = startOfDay + endOfMonthDate + startDate - 1
        }
        if (endDateValue > endMonthValue && endDateValue < lastTileValue) {
            endNum = startOfDay + endOfMonthDate + endDate - 1
        }

        return { startNum: startNum, endNum: endNum }
    }
}

export default utils