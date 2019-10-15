import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OsomeCalendar from './calendar/assets/js/script'
import OsomeGantt from './gantt/assets/js/script'
import './calendar/assets/css/style.css'
import './gantt/assets/css/style.css'

class OSGantt extends Component {
  onDragEndTile = (start, end, renderOption) => {
    console.log('Please implement `onDragEndTile` ')
    // Calendar.attachEvent(renderOption.startTileNumber,renderOption.endTileNumber)
  }
  onChangeContainer = (left, right) => {
    console.log('onChangeContainer', left, right)
  }
  onCompleteContainerResize = (left, right) => {
    console.log('onCompleteContainerResize', left, right)
  }
  onClickSchedule = (element, category, event) => {
  }
  onChangedCategory = (categories, afterCategories) => {
  }
  onChangedSchedule = (order, event, afterEvent) => {
  }
  onMouseRightClick = (element, event) => {
    console.log(`Mouse Right Button Clicked ${element.getAttribute('row')}`)
  }
  attachEvent(start, end, option) {
    OsomeGantt.attachEvent(start, end, option)
  }
  resetEvent() {
    OsomeGantt.init('osome-gantt', options)
  }
  createSchedule(start, end, eventOption) {
    OsomeGantt.attachEvent(start, end, eventOption)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.options !== nextProps.options) {
      OsomeGantt.init('osome-gantt', nextProps.options, nextProps.categories)
      return true
    }

    if (this.props.categories !== nextProps.categories) {
      OsomeGantt.init('osome-gantt', nextProps.options, nextProps.categories)
      return true
    }
    return false
  }

  componentDidMount() {
    OsomeGantt.init('osome-gantt', this.props.options, this.props.categories)
    OsomeGantt.onClickSchedule = this.props.onClickSchedule || this.onClickSchedule
    OsomeGantt.onMouseRightClick = this.props.onMouseRightClick || this.onMouseRightClick
    OsomeGantt.onDragEndTile = this.props.onDragEndTile || this.onDragEndTile
    OsomeGantt.onChangedSchedule = this.props.onChangedSchedule || this.onChangedSchedule
    OsomeGantt.onChangedCategory = this.props.onChangedCategory || this.onChangedCategory
    OsomeGantt.onChangeContainer = this.props.onChangeContainer || this.onChangeContainer
    OsomeGantt.onCompleteContainerResize = this.props.onCompleteContainerResize || this.onCompleteContainerResize
  }

  render() {
    const { style } = this.props
    return (
      <div id="osome-gantt" style={style} >
      </div>
    )
  }
}

OSGantt.defaultProps = {
  events: [],
  categories: []
}

OSGantt.propTypes = {
  onClickSchedule: PropTypes.func, // click schedule
  onMouseRightClick: PropTypes.func,
  onDragEndTile: PropTypes.func,
  onChangedSchedule: PropTypes.func,
  createSchedule: PropTypes.func,
  attachEvent: PropTypes.func,
  options: PropTypes.object,
  categories: PropTypes.array,
  events: PropTypes.array,
  onClickScheduleContent: PropTypes.element
}

class OSCalendar extends Component {
  onDragEndTile = (start, end, renderOption) => {
    console.log('Please implement `onDragEndTile` ')
    // Calendar.attachEvent(renderOption.startTileNumber,renderOption.endTileNumber)
  }
  onClickSchedule = (element, category, event) => {
  }
  onChangedSchedule = (order, event, afterEvent) => {
  }
  onClickMoreButton = (element, events) => {

  }
  constructor(props) {
    super(props)
  }
  attachEvent(start, end, option) {
    OsomeCalendar.attachEvent(start, end, option)
  }
  resetEvent() {
    OsomeCalendar.init('osome-calendar', options)
  }
  createSchedule(start, end, eventOption) {
    OsomeCalendar.attachEvent(start, end, eventOption)
  }
  moveSchedule(eventId, startDay, endDay) {

  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.options !== nextProps.options) {
      OsomeCalendar.init('osome-calendar', nextProps.options, nextProps.categories)
      return true
    }

    if (this.props.categories !== nextProps.categories) {
      OsomeCalendar.init('osome-calendar', nextProps.options, nextProps.categories)
      return true
    }
    return false
  }
  componentDidMount() {
    OsomeCalendar.init('osome-calendar', this.props.options, this.props.categories)
    OsomeCalendar.onClickSchedule = this.props.onClickSchedule || this.onClickSchedule
    OsomeCalendar.onDragEndTile = this.props.onDragEndTile || this.onDragEndTile
    OsomeCalendar.onChangedSchedule = this.props.onChangedSchedule || this.onChangedSchedule
    OsomeCalendar.onClickMoreButton = this.props.onClickMoreButton || this.onClickMoreButton
  }

  render() {
    const { style } = this.props
    return (
      <div id="osome-calendar" style={style} >
      </div>
    )
  }
}

OSCalendar.defaultProps = {
  categories: []
}

OSCalendar.propTypes = {
  onClickSchedule: PropTypes.func, // click schedule
  onClickMoreButton: PropTypes.func,
  onDragEndTile: PropTypes.func,
  onChangedSchedule: PropTypes.func,
  createSchedule: PropTypes.func,
  attachEvent: PropTypes.func,
  options: PropTypes.object,
  categories: PropTypes.array
}

export { OSCalendar, OSGantt }
