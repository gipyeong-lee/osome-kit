import utils from '../common/util'

// Prototype extensions are loaded as side effects from util.js import

describe('String.prototype extensions', () => {
  describe('toNumber()', () => {
    it('converts numeric string to number', () => {
      expect('123'.toNumber()).toBe(123)
    })

    it('converts float string to number', () => {
      expect('3.14'.toNumber()).toBe(3.14)
    })

    it('returns NaN for non-numeric string', () => {
      expect(Number.isNaN('abc'.toNumber())).toBe(true)
    })

    it('converts empty string to 0', () => {
      expect(''.toNumber()).toBe(0)
    })
  })

  describe('numOfPercent()', () => {
    it('extracts number from percent string', () => {
      expect('50%'.numOfPercent()).toBe(50)
    })

    it('handles decimal percentages', () => {
      expect('33.5%'.numOfPercent()).toBe(33.5)
    })

    it('handles string without percent sign', () => {
      expect('100'.numOfPercent()).toBe(100)
    })
  })

  describe('numOfPixel()', () => {
    it('extracts number from pixel string', () => {
      expect('100px'.numOfPixel()).toBe(100)
    })

    it('handles decimal pixels', () => {
      expect('14.5px'.numOfPixel()).toBe(14.5)
    })

    it('handles string without px suffix', () => {
      expect('200'.numOfPixel()).toBe(200)
    })
  })
})

describe('Number.prototype extensions', () => {
  describe('toNumber()', () => {
    it('returns the number itself', () => {
      const n = 42
      expect(n.toNumber()).toBe(42)
    })

    it('works with zero', () => {
      const n = 0
      expect(n.toNumber()).toBe(0)
    })

    it('works with negative numbers', () => {
      const n = -5
      expect(n.toNumber()).toBe(-5)
    })
  })

  describe('pad(len)', () => {
    it('pads single digit to 2 characters', () => {
      const n = 5
      expect(n.pad(2)).toBe('05')
    })

    it('does not pad if already long enough', () => {
      const n = 12
      expect(n.pad(2)).toBe('12')
    })

    it('pads to 4 characters', () => {
      const n = 7
      expect(n.pad(4)).toBe('0007')
    })

    it('handles zero', () => {
      const n = 0
      expect(n.pad(2)).toBe('00')
    })
  })
})

describe('Array.prototype.insert', () => {
  it('inserts item at specified index', () => {
    const arr = [1, 2, 3]
    arr.insert(1, 'a')
    expect(arr).toEqual([1, 'a', 2, 3])
  })

  it('inserts at beginning', () => {
    const arr = [1, 2]
    arr.insert(0, 'first')
    expect(arr).toEqual(['first', 1, 2])
  })

  it('inserts at end', () => {
    const arr = [1, 2]
    arr.insert(2, 'last')
    expect(arr).toEqual([1, 2, 'last'])
  })
})

describe('Date.prototype extensions', () => {
  describe('getPrevMonth()', () => {
    it('returns previous month', () => {
      const date = new Date(2023, 5, 15) // June 2023
      const prev = date.getPrevMonth()
      expect(prev.getMonth()).toBe(4) // May
      expect(prev.getFullYear()).toBe(2023)
    })

    it('wraps to previous year from January', () => {
      const date = new Date(2023, 0, 15) // January 2023
      const prev = date.getPrevMonth()
      expect(prev.getMonth()).toBe(11) // December
      expect(prev.getFullYear()).toBe(2022)
    })
  })

  describe('getNextMonth()', () => {
    it('returns next month', () => {
      const date = new Date(2023, 5, 15) // June 2023
      const next = date.getNextMonth()
      expect(next.getMonth()).toBe(6) // July
      expect(next.getFullYear()).toBe(2023)
    })

    it('wraps to next year from December', () => {
      const date = new Date(2023, 11, 15) // December 2023
      const next = date.getNextMonth()
      expect(next.getMonth()).toBe(0) // January
      expect(next.getFullYear()).toBe(2024)
    })
  })

  describe('getLastDate()', () => {
    it('returns 31 for January', () => {
      const date = new Date(2023, 0, 1) // January
      expect(date.getLastDate()).toBe(31)
    })

    it('returns 28 for non-leap February', () => {
      const date = new Date(2023, 1, 1) // February 2023
      expect(date.getLastDate()).toBe(28)
    })

    it('returns 29 for leap year February', () => {
      const date = new Date(2024, 1, 1) // February 2024
      expect(date.getLastDate()).toBe(29)
    })

    it('returns 30 for April', () => {
      const date = new Date(2023, 3, 1) // April
      expect(date.getLastDate()).toBe(30)
    })
  })

  describe('startOfDay()', () => {
    it('returns the day of week for the 1st of the month', () => {
      // January 1, 2023 is a Sunday (0)
      const date = new Date(2023, 0, 15)
      expect(date.startOfDay()).toBe(0)
    })

    it('returns correct day for different month', () => {
      // March 1, 2023 is a Wednesday (3)
      const date = new Date(2023, 2, 10)
      expect(date.startOfDay()).toBe(3)
    })
  })

  describe('endOfDay()', () => {
    it('returns the day of week for the last day of the month', () => {
      // January 31, 2023 is a Tuesday (2)
      const date = new Date(2023, 0, 15)
      expect(date.endOfDay()).toBe(2)
    })
  })

  describe('addDays(n)', () => {
    it('adds positive days', () => {
      const date = new Date(2023, 0, 15) // Jan 15
      const result = date.addDays(5)
      expect(result.getDate()).toBe(20)
      expect(result.getMonth()).toBe(0)
    })

    it('adds days across month boundary', () => {
      const date = new Date(2023, 0, 30) // Jan 30
      const result = date.addDays(5)
      expect(result.getDate()).toBe(4)
      expect(result.getMonth()).toBe(1) // February
    })

    it('subtracts days with negative value', () => {
      const date = new Date(2023, 0, 15) // Jan 15
      const result = date.addDays(-5)
      expect(result.getDate()).toBe(10)
    })
  })

  describe('zeroTimeDate()', () => {
    it('sets hours, minutes, seconds to 0', () => {
      const date = new Date(2023, 5, 15, 14, 30, 45)
      const zeroed = date.zeroTimeDate()
      expect(zeroed.getHours()).toBe(0)
      expect(zeroed.getMinutes()).toBe(0)
      expect(zeroed.getSeconds()).toBe(0)
    })

    it('preserves date components', () => {
      const date = new Date(2023, 5, 15, 14, 30, 45)
      const zeroed = date.zeroTimeDate()
      expect(zeroed.getFullYear()).toBe(2023)
      expect(zeroed.getMonth()).toBe(5)
      expect(zeroed.getDate()).toBe(15)
    })

    it('does not modify original date', () => {
      const date = new Date(2023, 5, 15, 14, 30, 45)
      date.zeroTimeDate()
      expect(date.getHours()).toBe(14)
    })
  })

  describe('midasFormat()', () => {
    it('formats date as MM/DD HH:mm', () => {
      const date = new Date(2023, 0, 5, 9, 7) // Jan 5, 09:07
      expect(date.midasFormat()).toBe('01/05 09:07')
    })

    it('formats double-digit values correctly', () => {
      const date = new Date(2023, 11, 25, 14, 30) // Dec 25, 14:30
      expect(date.midasFormat()).toBe('12/25 14:30')
    })
  })
})

describe('utils.convertGanttNumberToDate', () => {
  it('clamps start to minimum 1', () => {
    const result = utils.convertGanttNumberToDate(-1, 10, 31)
    expect(result.startNum).toBe(1)
  })

  it('clamps end to maximum eNum', () => {
    const result = utils.convertGanttNumberToDate(5, 40, 31)
    expect(result.endNum).toBe(31)
  })

  it('returns correct values when within range', () => {
    const result = utils.convertGanttNumberToDate(4, 14, 31)
    expect(result.startNum).toBe(5) // startNumber + 1
    expect(result.endNum).toBe(15) // endNumber + 1
  })

  it('handles edge case at boundaries', () => {
    const result = utils.convertGanttNumberToDate(0, 30, 31)
    expect(result.startNum).toBe(1)
    expect(result.endNum).toBe(31)
  })
})

describe('utils.convertDateToGanttNumber', () => {
  it('returns undefined when start date is after end tile', () => {
    // Event starts after the visible range
    const result = utils.convertDateToGanttNumber(
      '2023-03-01', '2023-03-15',
      2023, 1, // February (0-indexed month = 1)
      28
    )
    expect(result).toBeUndefined()
  })

  it('returns undefined when end date is before first tile', () => {
    // Event ends before the visible range
    const result = utils.convertDateToGanttNumber(
      '2023-01-01', '2023-01-15',
      2023, 2, // March (0-indexed month = 2)
      31
    )
    expect(result).toBeUndefined()
  })

  it('returns correct range for event within month', () => {
    const result = utils.convertDateToGanttNumber(
      '2023-03-05', '2023-03-10',
      2023, 2, // March
      31
    )
    expect(result).toBeDefined()
    expect(result.startNum).toBe(5)
    expect(result.endNum).toBe(10)
  })

  it('clamps start to 1 when event starts before month', () => {
    const result = utils.convertDateToGanttNumber(
      '2023-02-25', '2023-03-10',
      2023, 2, // March
      31
    )
    expect(result).toBeDefined()
    expect(result.startNum).toBe(1)
    expect(result.endNum).toBe(10)
  })

  it('clamps end to eNum when event extends beyond month', () => {
    const result = utils.convertDateToGanttNumber(
      '2023-03-25', '2023-04-05',
      2023, 2, // March
      31
    )
    expect(result).toBeDefined()
    expect(result.startNum).toBe(25)
    expect(result.endNum).toBe(31)
  })

  it('handles event spanning entire month', () => {
    const result = utils.convertDateToGanttNumber(
      '2023-02-15', '2023-04-15',
      2023, 2, // March
      31
    )
    expect(result).toBeDefined()
    expect(result.startNum).toBe(1)
    expect(result.endNum).toBe(31)
  })
})

describe('utils.convertDateToNumber', () => {
  // Create a mock firstTile element
  let firstTile

  beforeEach(() => {
    firstTile = document.createElement('div')
  })

  it('returns undefined when event is entirely after visible range', () => {
    firstTile.setAttribute('date', '26')
    firstTile.setAttribute('month', '2')
    firstTile.setAttribute('year', '2023')

    const result = utils.convertDateToNumber(
      '2023-05-01', '2023-05-15',
      2023, 2, // March
      3, // startOfDay (Wednesday)
      firstTile,
      31, // endOfMonthDate
      41  // eNum
    )
    expect(result).toBeUndefined()
  })

  it('returns undefined when event is entirely before visible range', () => {
    firstTile.setAttribute('date', '26')
    firstTile.setAttribute('month', '2')
    firstTile.setAttribute('year', '2023')

    const result = utils.convertDateToNumber(
      '2023-01-01', '2023-01-15',
      2023, 2, // March
      3,
      firstTile,
      31,
      41
    )
    expect(result).toBeUndefined()
  })

  it('calculates correct tile numbers for event within month', () => {
    firstTile.setAttribute('date', '26')
    firstTile.setAttribute('month', '2')
    firstTile.setAttribute('year', '2023')

    const result = utils.convertDateToNumber(
      '2023-03-05', '2023-03-10',
      2023, 2, // March
      3, // startOfDay (Wednesday for March 2023)
      firstTile,
      31,
      41
    )
    expect(result).toBeDefined()
    expect(result.startNum).toBe(3 + 5 - 1) // startOfDay + date - 1
    expect(result.endNum).toBe(3 + 10 - 1)
  })
})

describe('HTMLElement.prototype.remove', () => {
  it('removes element from parent', () => {
    const parent = document.createElement('div')
    const child = document.createElement('span')
    parent.appendChild(child)
    expect(parent.children.length).toBe(1)

    child.remove()
    expect(parent.children.length).toBe(0)
  })

  it('returns the removed element', () => {
    const parent = document.createElement('div')
    const child = document.createElement('span')
    parent.appendChild(child)

    const result = child.remove()
    expect(result).toBe(child)
  })
})
