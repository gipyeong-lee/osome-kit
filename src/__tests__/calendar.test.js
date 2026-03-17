/**
 * Tests for OsomeCalendar engine (src/calendar/assets/js/script.js)
 */

import '../common/util'

jest.mock('../calendar/assets/css/style.css', () => ({}))

import OsomeCalendar from '../calendar/assets/js/script'

describe('OsomeCalendar Engine', () => {
  let container

  const defaultOptions = {
    year: 2023,
    month: 10, // October (1-based in calendar engine)
    today: new Date(2023, 9, 15),
    country: 'ko'
  }

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'osome-calendar'
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('iteral (deep merge)', () => {
    it('merges flat object values', () => {
      const result = { a: 1, b: 2 }
      OsomeCalendar.iteral(undefined, { a: 10, c: 3 }, result)
      expect(result.a).toBe(10)
      expect(result.b).toBe(2)
      expect(result.c).toBe(3)
    })

    it('merges nested object values', () => {
      const result = { style: { color: 'red', size: 10 } }
      OsomeCalendar.iteral(undefined, { style: { color: 'blue' } }, result)
      expect(result.style.color).toBe('blue')
      expect(result.style.size).toBe(10)
    })

    it('creates nested objects if they do not exist', () => {
      const result = {}
      OsomeCalendar.iteral(undefined, { style: { color: 'red' } }, result)
      expect(result.style).toBeDefined()
      expect(result.style.color).toBe('red')
    })
  })

  describe('randomColor', () => {
    it('returns a valid hex color string', () => {
      const color = OsomeCalendar.randomColor()
      expect(color).toMatch(/^#[0-9a-f]{6}$/)
    })

    it('returns different colors on multiple calls', () => {
      const colors = new Set()
      for (let i = 0; i < 10; i++) {
        colors.add(OsomeCalendar.randomColor())
      }
      expect(colors.size).toBeGreaterThan(1)
    })
  })

  describe('clear', () => {
    it('clears element innerHTML', () => {
      container.innerHTML = '<div>test</div>'
      OsomeCalendar.clear('osome-calendar')
      expect(container.innerHTML).toBe('')
    })

    it('resets event counters', () => {
      OsomeCalendar.eventCounter = { '0': 5 }
      OsomeCalendar.eventRenderCounter = { '0': 3 }
      OsomeCalendar.clear('osome-calendar')
      expect(OsomeCalendar.eventCounter).toEqual({})
      expect(OsomeCalendar.eventRenderCounter).toEqual({})
    })
  })

  describe('clearFocus', () => {
    it('resets all focus properties', () => {
      OsomeCalendar.focus.type = 'create'
      OsomeCalendar.focus.start = 5
      OsomeCalendar.focus.end = 10
      OsomeCalendar.focus.current = document.createElement('div')
      OsomeCalendar.focus.event = {}

      OsomeCalendar.clearFocus()

      expect(OsomeCalendar.focus.type).toBeUndefined()
      expect(OsomeCalendar.focus.start).toBeUndefined()
      expect(OsomeCalendar.focus.end).toBeUndefined()
      expect(OsomeCalendar.focus.current).toBeUndefined()
      expect(OsomeCalendar.focus.event).toBeUndefined()
    })
  })

  describe('init', () => {
    it('creates calendar grid (#osome-cal-grid)', () => {
      OsomeCalendar.init('osome-calendar', defaultOptions, [])
      const grid = document.getElementById('osome-cal-grid')
      expect(grid).not.toBeNull()
    })

    it('creates day header (#osome-cal-days)', () => {
      OsomeCalendar.init('osome-calendar', defaultOptions, [])
      const days = document.getElementById('osome-cal-days')
      expect(days).not.toBeNull()
    })

    it('creates 7 day columns in header', () => {
      OsomeCalendar.init('osome-calendar', defaultOptions, [])
      const days = document.getElementById('osome-cal-days')
      const columns = days.querySelectorAll('.column.day')
      expect(columns.length).toBe(7)
    })

    it('displays correct day names for Korean locale', () => {
      OsomeCalendar.init('osome-calendar', defaultOptions, [])
      const days = document.getElementById('osome-cal-days')
      const columns = days.querySelectorAll('.column.day')
      expect(columns[0].innerHTML).toBe('일')
      expect(columns[1].innerHTML).toBe('월')
      expect(columns[6].innerHTML).toBe('토')
    })

    it('creates week rows (osome-cal-grid-week)', () => {
      OsomeCalendar.init('osome-calendar', defaultOptions, [])
      const weeks = container.querySelectorAll('.osome-cal-grid-week')
      expect(weeks.length).toBeGreaterThanOrEqual(4)
      expect(weeks.length).toBeLessThanOrEqual(6)
    })

    it('creates day tiles with unique IDs', () => {
      OsomeCalendar.init('osome-calendar', defaultOptions, [])
      const tile0 = document.getElementById('osome-cal-grid-day-tile-0')
      expect(tile0).not.toBeNull()
      expect(tile0.classList.contains('tile')).toBe(true)
    })

    it('sets correct date attributes on tiles', () => {
      OsomeCalendar.init('osome-calendar', defaultOptions, [])
      // Oct 2023 starts on Sunday (startOfDay=0), so tile-0 = Oct 1
      const tile0 = document.getElementById('osome-cal-grid-day-tile-0')
      expect(tile0.getAttribute('date')).toBe('1')
      expect(tile0.getAttribute('month')).toBe('10')
      expect(tile0.getAttribute('year')).toBe('2023')
    })

    it('stores categories', () => {
      const categories = [
        { content: { order: 0, title: 'Work', type: 'main', style: {} }, events: [] }
      ]
      OsomeCalendar.init('osome-calendar', defaultOptions, categories)
      expect(OsomeCalendar.categories).toBe(categories)
    })

    it('renders events from categories', () => {
      const categories = [
        {
          content: { order: 0, title: 'Work', type: 'main', style: { color: 'blue' } },
          events: [{
            id: 1, index: 0, title: 'Meeting',
            startDate: new Date(2023, 9, 5),
            endDate: new Date(2023, 9, 7),
            style: { backgroundColor: '#3388ff', color: '#fff' }
          }]
        }
      ]
      OsomeCalendar.init('osome-calendar', defaultOptions, categories)
      const eventBlocks = container.querySelectorAll('.event-block')
      expect(eventBlocks.length).toBeGreaterThan(0)
    })

    it('sets endNum based on tile count', () => {
      OsomeCalendar.init('osome-calendar', defaultOptions, [])
      expect(OsomeCalendar.endNum).toBeGreaterThan(0)
    })
  })

  describe('weekend styling', () => {
    it('marks Sunday columns with text-red class', () => {
      OsomeCalendar.init('osome-calendar', defaultOptions, [])
      const days = document.getElementById('osome-cal-days')
      const columns = days.querySelectorAll('.column.day')
      expect(columns[0].classList.contains('text-red')).toBe(true)
    })

    it('marks Saturday columns with text-blue class', () => {
      OsomeCalendar.init('osome-calendar', defaultOptions, [])
      const days = document.getElementById('osome-cal-days')
      const columns = days.querySelectorAll('.column.day')
      expect(columns[6].classList.contains('text-blue')).toBe(true)
    })
  })

  describe('attachEvent', () => {
    beforeEach(() => {
      OsomeCalendar.init('osome-calendar', defaultOptions, [])
    })

    it('does nothing when tiles are null (out of range)', () => {
      const eventsBefore = container.querySelectorAll('.event-block').length
      OsomeCalendar.attachEvent(999, 1000, {
        order: 0, index: 99, style: { backgroundColor: 'red' }
      })
      const eventsAfter = container.querySelectorAll('.event-block').length
      expect(eventsAfter).toBe(eventsBefore)
    })
  })

  describe('multi-week event rendering', () => {
    it('renders events spanning multiple weeks', () => {
      const categories = [{
        content: { order: 0, title: 'Work', type: 'main', style: {} },
        events: [{
          id: 1, index: 0, title: 'Long Event',
          startDate: new Date(2023, 9, 4),
          endDate: new Date(2023, 9, 18),
          style: { backgroundColor: '#3388ff', color: '#fff' }
        }]
      }]
      OsomeCalendar.init('osome-calendar', defaultOptions, categories)
      // Should create blocks spanning multiple weeks
      const blocks = container.querySelectorAll('.event-block-0-0')
      expect(blocks.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('saveOffset', () => {
    it('saves scroll position', () => {
      OsomeCalendar.init('osome-calendar', defaultOptions, [])
      OsomeCalendar.saveOffset()
      expect(OsomeCalendar.options.offsetY).toBeDefined()
    })
  })

  describe('different months', () => {
    it('handles February correctly', () => {
      OsomeCalendar.init('osome-calendar', {
        year: 2023, month: 2, today: new Date(2023, 1, 1), country: 'ko'
      }, [])
      const grid = document.getElementById('osome-cal-grid')
      expect(grid).not.toBeNull()
    })

    it('handles leap year February', () => {
      OsomeCalendar.init('osome-calendar', {
        year: 2024, month: 2, today: new Date(2024, 1, 1), country: 'ko'
      }, [])
      const grid = document.getElementById('osome-cal-grid')
      expect(grid).not.toBeNull()
    })

    it('handles December year boundary', () => {
      OsomeCalendar.init('osome-calendar', {
        year: 2023, month: 12, today: new Date(2023, 11, 1), country: 'ko'
      }, [])
      const grid = document.getElementById('osome-cal-grid')
      expect(grid).not.toBeNull()
    })
  })

  describe('Japanese locale', () => {
    it('displays Japanese day names', () => {
      OsomeCalendar.init('osome-calendar', {
        ...defaultOptions, country: 'jp'
      }, [])
      const days = document.getElementById('osome-cal-days')
      const columns = days.querySelectorAll('.column.day')
      expect(columns[0].innerHTML).toBe('日')
      expect(columns[1].innerHTML).toBe('月')
    })
  })
})
