import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import { OSCalendar, OSGantt } from '../index'

// Mock the internal engines to avoid DOM manipulation side effects
jest.mock('../calendar/assets/js/script', () => ({
  init: jest.fn(),
  attachEvent: jest.fn(),
  onClickSchedule: jest.fn(),
  onDragEndTile: jest.fn(),
  onChangedSchedule: jest.fn(),
  onClickMoreButton: jest.fn()
}))

jest.mock('../gantt/assets/js/script', () => ({
  init: jest.fn(),
  attachEvent: jest.fn(),
  onClickSchedule: jest.fn(),
  onMouseRightClick: jest.fn(),
  onDragEndTile: jest.fn(),
  onChangedSchedule: jest.fn(),
  onChangedCategory: jest.fn(),
  onChangeContainer: jest.fn(),
  onCompleteContainerResize: jest.fn()
}))

// Suppress CSS import errors
jest.mock('../calendar/assets/css/style.css', () => ({}))
jest.mock('../gantt/assets/css/style.css', () => ({}))

const OsomeCalendar = require('../calendar/assets/js/script')
const OsomeGantt = require('../gantt/assets/js/script')

describe('OSCalendar Component', () => {
  const defaultOptions = {
    year: 2023,
    month: 9,
    today: new Date(2023, 9, 1)
  }

  const defaultCategories = [
    {
      content: { order: 0, title: 'Category 1', type: 'main' },
      events: []
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders a div with id "osome-calendar"', () => {
      const renderer = ReactTestRenderer.create(
        <OSCalendar options={defaultOptions} categories={defaultCategories} />
      )
      const tree = renderer.toJSON()
      expect(tree.type).toBe('div')
      expect(tree.props.id).toBe('osome-calendar')
    })

    it('applies custom style prop', () => {
      const style = { width: '100%', height: '500px' }
      const renderer = ReactTestRenderer.create(
        <OSCalendar options={defaultOptions} categories={defaultCategories} style={style} />
      )
      const tree = renderer.toJSON()
      expect(tree.props.style).toEqual(style)
    })

    it('renders empty children', () => {
      const renderer = ReactTestRenderer.create(
        <OSCalendar options={defaultOptions} categories={defaultCategories} />
      )
      const tree = renderer.toJSON()
      expect(tree.children).toBeNull()
    })
  })

  describe('lifecycle', () => {
    it('calls OsomeCalendar.init on mount', () => {
      ReactTestRenderer.create(
        <OSCalendar options={defaultOptions} categories={defaultCategories} />
      )
      expect(OsomeCalendar.init).toHaveBeenCalledWith(
        'osome-calendar', defaultOptions, defaultCategories
      )
    })

    it('binds custom onClickSchedule callback', () => {
      const onClickSchedule = jest.fn()
      ReactTestRenderer.create(
        <OSCalendar
          options={defaultOptions}
          categories={defaultCategories}
          onClickSchedule={onClickSchedule}
        />
      )
      expect(OsomeCalendar.onClickSchedule).toBe(onClickSchedule)
    })

    it('binds custom onDragEndTile callback', () => {
      const onDragEndTile = jest.fn()
      ReactTestRenderer.create(
        <OSCalendar
          options={defaultOptions}
          categories={defaultCategories}
          onDragEndTile={onDragEndTile}
        />
      )
      expect(OsomeCalendar.onDragEndTile).toBe(onDragEndTile)
    })

    it('binds custom onChangedSchedule callback', () => {
      const onChangedSchedule = jest.fn()
      ReactTestRenderer.create(
        <OSCalendar
          options={defaultOptions}
          categories={defaultCategories}
          onChangedSchedule={onChangedSchedule}
        />
      )
      expect(OsomeCalendar.onChangedSchedule).toBe(onChangedSchedule)
    })

    it('binds custom onClickMoreButton callback', () => {
      const onClickMoreButton = jest.fn()
      ReactTestRenderer.create(
        <OSCalendar
          options={defaultOptions}
          categories={defaultCategories}
          onClickMoreButton={onClickMoreButton}
        />
      )
      expect(OsomeCalendar.onClickMoreButton).toBe(onClickMoreButton)
    })

    it('uses default callbacks when no props provided', () => {
      ReactTestRenderer.create(
        <OSCalendar options={defaultOptions} categories={defaultCategories} />
      )
      // Default callbacks should be assigned (they are instance methods)
      expect(OsomeCalendar.onClickSchedule).toBeDefined()
      expect(OsomeCalendar.onDragEndTile).toBeDefined()
      expect(OsomeCalendar.onChangedSchedule).toBeDefined()
      expect(OsomeCalendar.onClickMoreButton).toBeDefined()
    })

    it('re-initializes when options change', () => {
      const renderer = ReactTestRenderer.create(
        <OSCalendar options={defaultOptions} categories={defaultCategories} />
      )
      expect(OsomeCalendar.init).toHaveBeenCalledTimes(1)

      const newOptions = { ...defaultOptions, month: 10 }
      renderer.update(
        <OSCalendar options={newOptions} categories={defaultCategories} />
      )
      expect(OsomeCalendar.init).toHaveBeenCalledTimes(2)
      expect(OsomeCalendar.init).toHaveBeenLastCalledWith(
        'osome-calendar', newOptions, defaultCategories
      )
    })

    it('re-initializes when categories change', () => {
      const renderer = ReactTestRenderer.create(
        <OSCalendar options={defaultOptions} categories={defaultCategories} />
      )

      const newCategories = [
        ...defaultCategories,
        { content: { order: 1, title: 'Category 2', type: 'sub' }, events: [] }
      ]
      renderer.update(
        <OSCalendar options={defaultOptions} categories={newCategories} />
      )
      expect(OsomeCalendar.init).toHaveBeenCalledTimes(2)
    })

    it('does not re-initialize when same props are passed', () => {
      const renderer = ReactTestRenderer.create(
        <OSCalendar options={defaultOptions} categories={defaultCategories} />
      )

      renderer.update(
        <OSCalendar options={defaultOptions} categories={defaultCategories} />
      )
      // init is only called once (on mount)
      expect(OsomeCalendar.init).toHaveBeenCalledTimes(1)
    })
  })

  describe('defaultProps', () => {
    it('has empty categories by default', () => {
      expect(OSCalendar.defaultProps.categories).toEqual([])
    })
  })

  describe('instance methods', () => {
    it('createSchedule delegates to OsomeCalendar.attachEvent', () => {
      const renderer = ReactTestRenderer.create(
        <OSCalendar options={defaultOptions} categories={defaultCategories} />
      )
      const instance = renderer.getInstance()
      instance.createSchedule(1, 5, { title: 'Test' })
      expect(OsomeCalendar.attachEvent).toHaveBeenCalledWith(1, 5, { title: 'Test' })
    })

    it('attachEvent delegates to OsomeCalendar.attachEvent', () => {
      const renderer = ReactTestRenderer.create(
        <OSCalendar options={defaultOptions} categories={defaultCategories} />
      )
      const instance = renderer.getInstance()
      instance.attachEvent(2, 8, { style: {} })
      expect(OsomeCalendar.attachEvent).toHaveBeenCalledWith(2, 8, { style: {} })
    })
  })
})

describe('OSGantt Component', () => {
  const defaultOptions = {
    year: 2023,
    month: 9,
    today: new Date(2023, 9, 1)
  }

  const defaultCategories = [
    {
      content: { order: 0, title: 'Category 1', type: 'main' },
      events: []
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders a div with id "osome-gantt"', () => {
      const renderer = ReactTestRenderer.create(
        <OSGantt options={defaultOptions} categories={defaultCategories} />
      )
      const tree = renderer.toJSON()
      expect(tree.type).toBe('div')
      expect(tree.props.id).toBe('osome-gantt')
    })

    it('applies custom style prop', () => {
      const style = { width: '100%', height: '400px' }
      const renderer = ReactTestRenderer.create(
        <OSGantt options={defaultOptions} categories={defaultCategories} style={style} />
      )
      const tree = renderer.toJSON()
      expect(tree.props.style).toEqual(style)
    })
  })

  describe('lifecycle', () => {
    it('calls OsomeGantt.init on mount', () => {
      ReactTestRenderer.create(
        <OSGantt options={defaultOptions} categories={defaultCategories} />
      )
      expect(OsomeGantt.init).toHaveBeenCalledWith(
        'osome-gantt', defaultOptions, defaultCategories
      )
    })

    it('binds all custom callbacks', () => {
      const callbacks = {
        onClickSchedule: jest.fn(),
        onMouseRightClick: jest.fn(),
        onDragEndTile: jest.fn(),
        onChangedSchedule: jest.fn(),
        onChangedCategory: jest.fn(),
        onChangeContainer: jest.fn(),
        onCompleteContainerResize: jest.fn()
      }

      ReactTestRenderer.create(
        <OSGantt options={defaultOptions} categories={defaultCategories} {...callbacks} />
      )

      expect(OsomeGantt.onClickSchedule).toBe(callbacks.onClickSchedule)
      expect(OsomeGantt.onMouseRightClick).toBe(callbacks.onMouseRightClick)
      expect(OsomeGantt.onDragEndTile).toBe(callbacks.onDragEndTile)
      expect(OsomeGantt.onChangedSchedule).toBe(callbacks.onChangedSchedule)
      expect(OsomeGantt.onChangedCategory).toBe(callbacks.onChangedCategory)
      expect(OsomeGantt.onChangeContainer).toBe(callbacks.onChangeContainer)
      expect(OsomeGantt.onCompleteContainerResize).toBe(callbacks.onCompleteContainerResize)
    })

    it('re-initializes when options change', () => {
      const renderer = ReactTestRenderer.create(
        <OSGantt options={defaultOptions} categories={defaultCategories} />
      )
      expect(OsomeGantt.init).toHaveBeenCalledTimes(1)

      const newOptions = { ...defaultOptions, month: 10 }
      renderer.update(
        <OSGantt options={newOptions} categories={defaultCategories} />
      )
      expect(OsomeGantt.init).toHaveBeenCalledTimes(2)
    })

    it('re-initializes when categories change', () => {
      const renderer = ReactTestRenderer.create(
        <OSGantt options={defaultOptions} categories={defaultCategories} />
      )

      const newCategories = [...defaultCategories]
      newCategories.push({ content: { order: 1, title: 'New', type: 'sub' }, events: [] })
      renderer.update(
        <OSGantt options={defaultOptions} categories={newCategories} />
      )
      expect(OsomeGantt.init).toHaveBeenCalledTimes(2)
    })

    it('does not re-initialize when same props are passed', () => {
      const renderer = ReactTestRenderer.create(
        <OSGantt options={defaultOptions} categories={defaultCategories} />
      )
      renderer.update(
        <OSGantt options={defaultOptions} categories={defaultCategories} />
      )
      expect(OsomeGantt.init).toHaveBeenCalledTimes(1)
    })
  })

  describe('defaultProps', () => {
    it('has empty events and categories by default', () => {
      expect(OSGantt.defaultProps.events).toEqual([])
      expect(OSGantt.defaultProps.categories).toEqual([])
    })
  })

  describe('instance methods', () => {
    it('createSchedule delegates to OsomeGantt.attachEvent', () => {
      const renderer = ReactTestRenderer.create(
        <OSGantt options={defaultOptions} categories={defaultCategories} />
      )
      const instance = renderer.getInstance()
      instance.createSchedule(1, 5, { title: 'Test' })
      expect(OsomeGantt.attachEvent).toHaveBeenCalledWith(1, 5, { title: 'Test' })
    })

    it('attachEvent delegates to OsomeGantt.attachEvent', () => {
      const renderer = ReactTestRenderer.create(
        <OSGantt options={defaultOptions} categories={defaultCategories} />
      )
      const instance = renderer.getInstance()
      instance.attachEvent(2, 8, { style: {} })
      expect(OsomeGantt.attachEvent).toHaveBeenCalledWith(2, 8, { style: {} })
    })
  })
})
