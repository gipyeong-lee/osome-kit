import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Calendar from './calendar/assets/js/script'
import './calendar/assets/css/style.css'

class OSCalendar extends Component {
  static propTypes = {
    text: PropTypes.string
  }
  onDragEndTile = (start, end, renderOption) => {
    console.log(start, end)
    console.log('Please implement `onDragEndTile` ')
    Calendar.attachEvent(renderOption.startTileNumber,renderOption.endTileNumber)
  }
  onClickSchedule = (element, event, index) => {
    console.log(event)
    console.log('Please implement `onClickSchedule` ')
  }
  onChangedSchedule = (event, afterEvent) => {
    console.log(event, afterEvent)
  }

  constructor(props) {
    super(props)
    this.onClickSchedule = this.onClickSchedule.bind(this)
  }
  attachEvent(start, end, option) {
    Calendar.attachEvent(start, end, option)
  }

  createSchedule(start, end, eventOption) {
    Calendar.attachEvent(start, end, eventOption)
  }
  moveSchedule(eventId, startDay, endDay) {

  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.options !== nextProps.options){
      Calendar.init('osome-calendar', nextProps.options)  
      return true
    }
    return false
  }
  componentDidMount() {
    console.log(this.props.options)
    Calendar.init('osome-calendar', this.props.options)
    Calendar.onClickSchedule = this.props.onClickSchedule || this.onClickSchedule
    Calendar.onDragEndTile = this.props.onDragEndTile || this.onDragEndTile
    Calendar.onChangedSchedule = this.props.onChangedSchedule || this.onChangedSchedule
  }

  render() {
    const { style, className } = this.props
    return (
      <div id="osome-calendar" style={style} className={className} >
      </div>
    )
  }
}
OSCalendar.propTypes = {
  onClickSchedule: PropTypes.func, // click schedule
  onDragEndTile: PropTypes.func,
  onChangedSchedule: PropTypes.func,
  createSchedule: PropTypes.func,
  attachEvent: PropTypes.func,
  options: PropTypes.object,
  onClickScheduleContent: PropTypes.element
}

export { OSCalendar }