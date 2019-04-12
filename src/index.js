import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OsomeCalendar from './calendar/assets/js/script'
import OsomeGantt from './gantt/assets/js/script'
import './calendar/assets/css/style.css'
import './gantt/assets/css/style.css'

class OSGantt extends Component {
  componentDidMount() {
    
    OsomeGantt.init('osome-gantt', this.props.options, this.props.events)
    OsomeGantt.onClickSchedule = this.props.onClickSchedule || this.onClickSchedule
    OsomeGantt.onDragEndTile = this.props.onDragEndTile || this.onDragEndTile
    OsomeGantt.onChangedSchedule = this.props.onChangedSchedule || this.onChangedSchedule
  }

  render() {
    const { style, className } = this.props
    return (
      <div id="osome-gantt" style={style} className={className} >
      </div>
    )
  }
}

class OSCalendar extends Component {
  onDragEndTile = (start, end, renderOption) => {
    console.log(start, end)
    console.log('Please implement `onDragEndTile` ')
    // Calendar.attachEvent(renderOption.startTileNumber,renderOption.endTileNumber)
  }
  onClickSchedule = (element, event, index) => {
  }
  onChangedSchedule = (event, afterEvent) => {
  }

  constructor(props) {
    super(props)
  }
  attachEvent(start, end, option) {
    Calendar.attachEvent(start, end, option)
  }
  resetEvent(){
    Calendar.init('osome-calendar', options)  
  }
  createSchedule(start, end, eventOption) {
    Calendar.attachEvent(start, end, eventOption)
  }
  moveSchedule(eventId, startDay, endDay) {

  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.options !== nextProps.options){
      Calendar.init('osome-calendar', nextProps.options, nextProps.events)  
      return false
    }
    
    if(this.props.events !== nextProps.events){
      Calendar.init('osome-calendar', nextProps.options, nextProps.events)  
      return false
    }
    return false
  }
  componentDidMount() {
    OsomeCalendar.init('osome-calendar', this.props.options, this.props.events)
    OsomeCalendar.onClickSchedule = this.props.onClickSchedule || this.onClickSchedule
    OsomeCalendar.onDragEndTile = this.props.onDragEndTile || this.onDragEndTile
    OsomeCalendar.onChangedSchedule = this.props.onChangedSchedule || this.onChangedSchedule
  }

  render() {
    const { style, className } = this.props
    return (
      <div id="osome-calendar" style={style} className={className} >
      </div>
    )
  }
}

OSCalendar.defaultProps = {
  events : []
}

OSCalendar.propTypes = {
  onClickSchedule: PropTypes.func, // click schedule
  onDragEndTile: PropTypes.func,
  onChangedSchedule: PropTypes.func,
  createSchedule: PropTypes.func,
  attachEvent: PropTypes.func,
  options: PropTypes.object,
  events: PropTypes.array,
  onClickScheduleContent: PropTypes.element
}

export { OSCalendar, OSGantt }