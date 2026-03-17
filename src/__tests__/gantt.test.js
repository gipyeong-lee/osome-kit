/**
 * Tests for OsomeGantt engine (src/gantt/assets/js/script.js)
 */

import '../common/util'

jest.mock('../gantt/assets/css/style.css', () => ({}))

import OsomeGantt from '../gantt/assets/js/script'

describe('OsomeGantt Engine', () => {
  let container

  const defaultOptions = {
    year: 2023,
    month: 10, // October (1-based in gantt engine)
    today: new Date(2023, 9, 15),
    country: 'ko'
  }

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'osome-gantt'
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('iteral (deep merge)', () => {
    it('merges flat object values', () => {
      const result = { a: 1, b: 2 }
      OsomeGantt.iteral(undefined, { a: 10, c: 3 }, result)
      expect(result.a).toBe(10)
      expect(result.b).toBe(2)
      expect(result.c).toBe(3)
    })

    it('merges nested object values', () => {
      const result = { style: { container: { leftWidth: '30%' } } }
      OsomeGantt.iteral(undefined, { style: { container: { leftWidth: '50%' } } }, result)
      expect(result.style.container.leftWidth).toBe('50%')
    })

    it('creates nested objects if they do not exist', () => {
      const result = {}
      OsomeGantt.iteral(undefined, { newProp: { nested: 'value' } }, result)
      expect(result.newProp.nested).toBe('value')
    })

    it('does not overwrite unrelated keys', () => {
      const result = { a: 1, b: { x: 10, y: 20 } }
      OsomeGantt.iteral(undefined, { b: { x: 99 } }, result)
      expect(result.a).toBe(1)
      expect(result.b.x).toBe(99)
      expect(result.b.y).toBe(20)
    })
  })

  describe('randomColor', () => {
    it('returns a valid hex color string', () => {
      const color = OsomeGantt.randomColor()
      expect(color).toMatch(/^#[0-9a-f]{6}$/)
    })
  })

  describe('clear', () => {
    it('clears element innerHTML', () => {
      container.innerHTML = '<div>test content</div>'
      OsomeGantt.clear(container)
      expect(container.innerHTML).toBe('')
    })
  })

  describe('clearFocus', () => {
    it('resets all focus properties', () => {
      OsomeGantt.focus.event = document.createElement('div')
      OsomeGantt.focus.type = 'create'
      OsomeGantt.focus.start = 5
      OsomeGantt.focus.end = 10
      OsomeGantt.focus.current = document.createElement('div')

      OsomeGantt.clearFocus()

      expect(OsomeGantt.focus.event).toBeUndefined()
      expect(OsomeGantt.focus.type).toBeUndefined()
      expect(OsomeGantt.focus.start).toBeUndefined()
      expect(OsomeGantt.focus.end).toBeUndefined()
      expect(OsomeGantt.focus.current).toBeUndefined()
    })
  })

  describe('init', () => {
    it('creates gantt grid container', () => {
      OsomeGantt.init('osome-gantt', defaultOptions, [])
      const gridContainer = document.getElementById('osome-gantt-grid-container')
      expect(gridContainer).not.toBeNull()
    })

    it('creates left container panel', () => {
      OsomeGantt.init('osome-gantt', defaultOptions, [])
      const left = document.getElementById('osome-gantt-grid-left-container')
      expect(left).not.toBeNull()
    })

    it('creates right container panel', () => {
      OsomeGantt.init('osome-gantt', defaultOptions, [])
      const right = document.getElementById('osome-gantt-grid-right-container')
      expect(right).not.toBeNull()
    })

    it('creates handle bar between panels', () => {
      OsomeGantt.init('osome-gantt', defaultOptions, [])
      const handleBar = document.getElementById('osome-gantt-grid-handle-bar')
      expect(handleBar).not.toBeNull()
    })

    it('creates header with day numbers', () => {
      OsomeGantt.init('osome-gantt', defaultOptions, [])
      const headerRow = document.getElementById('osome-gantt-header-day-row')
      expect(headerRow).not.toBeNull()
      // October 2023 has 31 days
      const tiles = headerRow.querySelectorAll('.tile')
      expect(tiles.length).toBe(31)
    })

    it('stores categories', () => {
      const categories = [
        { content: { order: 0, title: 'Task Group', type: 'main', style: { color: 'blue' } }, events: [] }
      ]
      OsomeGantt.init('osome-gantt', defaultOptions, categories)
      expect(OsomeGantt.categories).toBe(categories)
    })

    it('creates category rows in left panel', () => {
      const categories = [
        { content: { order: 0, title: 'Group A', type: 'main', style: {} }, events: [] },
        { content: { order: 1, title: 'Group B', type: 'sub', style: {} }, events: [] }
      ]
      OsomeGantt.init('osome-gantt', defaultOptions, categories)
      const categoryRows = container.querySelectorAll('.osome-gantt-grid-category-row')
      expect(categoryRows.length).toBe(2)
    })

    it('creates right panel rows for each category', () => {
      const categories = [
        { content: { order: 0, title: 'Group A', type: 'main', style: {} }, events: [] },
        { content: { order: 1, title: 'Group B', type: 'sub', style: {} }, events: [] }
      ]
      OsomeGantt.init('osome-gantt', defaultOptions, categories)
      // Includes header day row + 2 category rows
      const rows = container.querySelectorAll('.osome-gantt-grid-row')
      expect(rows.length).toBe(3)
    })

    it('renders events in the grid', () => {
      const categories = [{
        content: { order: 0, title: 'Group A', type: 'main', style: {} },
        events: [{
          id: 1, index: 0, title: 'Task 1',
          startDate: new Date(2023, 9, 5),
          endDate: new Date(2023, 9, 10),
          style: { backgroundColor: '#3388ff', color: '#fff' }
        }]
      }]
      OsomeGantt.init('osome-gantt', defaultOptions, categories)
      const eventBlocks = container.querySelectorAll('.event-block')
      expect(eventBlocks.length).toBeGreaterThan(0)
    })
  })

  describe('createGrid layout', () => {
    it('sets left panel width from options', () => {
      OsomeGantt.init('osome-gantt', {
        ...defaultOptions,
        style: { container: { leftWidth: '25%' } }
      }, [])
      const left = document.getElementById('osome-gantt-grid-left-container')
      expect(left.style.width).toBe('25%')
    })
  })

  describe('attachEvent', () => {
    beforeEach(() => {
      OsomeGantt.init('osome-gantt', defaultOptions, [
        { content: { order: 0, title: 'Group', type: 'main', style: {} }, events: [] }
      ])
    })

    it('does nothing when end < start', () => {
      const eventsBefore = container.querySelectorAll('.event-block').length
      OsomeGantt.attachEvent(0, 10, 5, { index: 99, style: {} })
      const eventsAfter = container.querySelectorAll('.event-block').length
      expect(eventsAfter).toBe(eventsBefore)
    })

    it('does nothing when tiles do not exist', () => {
      const eventsBefore = container.querySelectorAll('.event-block').length
      OsomeGantt.attachEvent(999, 1, 5, { index: 99, style: {} })
      const eventsAfter = container.querySelectorAll('.event-block').length
      expect(eventsAfter).toBe(eventsBefore)
    })
  })

  describe('saveOffset', () => {
    it('saves scroll position', () => {
      OsomeGantt.init('osome-gantt', defaultOptions, [])
      OsomeGantt.saveOffset()
      expect(OsomeGantt.options.offsetY).toBeDefined()
    })
  })

  describe('blur', () => {
    it('clears focus state when focus.start exists', () => {
      const startElement = document.createElement('div')
      startElement.classList.add('dragOver')
      const currentElement = document.createElement('div')
      currentElement.classList.add('dragOverUp')

      OsomeGantt.focus.start = startElement
      OsomeGantt.focus.current = currentElement
      OsomeGantt.focus.type = 'move'

      OsomeGantt.blur({}, OsomeGantt)

      expect(OsomeGantt.focus.type).toBeUndefined()
      expect(OsomeGantt.focus.start).toBeUndefined()
    })

    it('does nothing when focus is empty', () => {
      OsomeGantt.clearFocus()
      OsomeGantt.blur({}, OsomeGantt)
      expect(OsomeGantt.focus.type).toBeUndefined()
    })
  })

  describe('multiple categories', () => {
    it('renders rows for each category', () => {
      const categories = []
      for (let i = 0; i < 5; i++) {
        categories.push({
          content: { order: i, title: `Category ${i}`, type: i === 0 ? 'main' : 'sub', style: {} },
          events: []
        })
      }
      OsomeGantt.init('osome-gantt', defaultOptions, categories)
      const categoryRows = container.querySelectorAll('.osome-gantt-grid-category-row')
      expect(categoryRows.length).toBe(5)
    })

    it('renders events for multiple categories', () => {
      const categories = [
        {
          content: { order: 0, title: 'A', type: 'main', style: {} },
          events: [{
            id: 1, index: 0, title: 'E1',
            startDate: new Date(2023, 9, 1), endDate: new Date(2023, 9, 5),
            style: { backgroundColor: 'red', color: 'white' }
          }]
        },
        {
          content: { order: 1, title: 'B', type: 'sub', style: {} },
          events: [{
            id: 2, index: 0, title: 'E2',
            startDate: new Date(2023, 9, 10), endDate: new Date(2023, 9, 15),
            style: { backgroundColor: 'blue', color: 'white' }
          }]
        }
      ]
      OsomeGantt.init('osome-gantt', defaultOptions, categories)
      const eventBlocks = container.querySelectorAll('.event-block')
      expect(eventBlocks.length).toBe(2)
    })
  })

  describe('different months', () => {
    it('creates 28 day tiles for February 2023', () => {
      OsomeGantt.init('osome-gantt', {
        year: 2023, month: 2, today: new Date(2023, 1, 1), country: 'ko'
      }, [])
      const headerRow = document.getElementById('osome-gantt-header-day-row')
      const tiles = headerRow.querySelectorAll('.tile')
      expect(tiles.length).toBe(28)
    })

    it('creates 29 day tiles for leap year February 2024', () => {
      OsomeGantt.init('osome-gantt', {
        year: 2024, month: 2, today: new Date(2024, 1, 1), country: 'ko'
      }, [])
      const headerRow = document.getElementById('osome-gantt-header-day-row')
      const tiles = headerRow.querySelectorAll('.tile')
      expect(tiles.length).toBe(29)
    })

    it('creates 30 day tiles for April', () => {
      OsomeGantt.init('osome-gantt', {
        year: 2023, month: 4, today: new Date(2023, 3, 1), country: 'ko'
      }, [])
      const headerRow = document.getElementById('osome-gantt-header-day-row')
      const tiles = headerRow.querySelectorAll('.tile')
      expect(tiles.length).toBe(30)
    })

    it('creates 31 day tiles for October', () => {
      OsomeGantt.init('osome-gantt', defaultOptions, [])
      const headerRow = document.getElementById('osome-gantt-header-day-row')
      const tiles = headerRow.querySelectorAll('.tile')
      expect(tiles.length).toBe(31)
    })
  })

  describe('weekend highlighting', () => {
    it('marks Sunday tiles with text-red', () => {
      OsomeGantt.init('osome-gantt', defaultOptions, [])
      // Oct 1, 2023 = Sunday
      const headerRow = document.getElementById('osome-gantt-header-day-row')
      const firstTile = headerRow.querySelector('.tile')
      expect(firstTile.classList.contains('text-red')).toBe(true)
    })
  })

  describe('fixed mode', () => {
    it('does not create handle bar when fixed is true', () => {
      OsomeGantt.init('osome-gantt', {
        ...defaultOptions, fixed: true
      }, [])
      const left = document.getElementById('osome-gantt-grid-left-container')
      const handleBar = left.querySelector('.osome-gantt-grid-handle-bar')
      expect(handleBar).toBeNull()
    })
  })
})
