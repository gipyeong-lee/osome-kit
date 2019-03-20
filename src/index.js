import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Calendar from './calendar/assets/js/script'
import './calendar/assets/css/style.css'

export class OSCalendar extends PureComponent {
  static propTypes = {
    text: PropTypes.string
  }
  constructor(props) {
    super(props)

    this.onTileDragEnd = this.onTileDragEnd.bind(this)
    this.onClickSchedule = this.onClickSchedule.bind(this)
  }
  onClickSchedule(event, index) {
    console.log('Please implement `onClickSchedule` ')
  }
  onTileDragEnd(start, end) {
    console.log('Please implement `onTileDragEnd` ')
    // ex. Calendar.attachEvent(start, end, { title: 'This is Title', detail: 'This is Detail', color: '#f00' })
  }
  attachEvent(start, end, option) {
    Calendar.attachEvent(start, end, option)
  }
  onScheduleChanged(event, afterEvent) {
    console.log(event, afterEvent)
  }
  createSchedule(start, end, eventOption) {
    Calendar.attachEvent(start, end, eventOption)
  }
  moveSchedule(eventId, startDay, endDay) {

  }
  componentDidMount() {
    Calendar.init('osome-calendar', this.props.options)
    Calendar.onClickSchedule = this.props.onClickSchedule || this.onClickSchedule
    Calendar.onTileDragEnd = this.props.onTileDragEnd || this.onTileDragEnd
    Calendar.onScheduleChanged = this.props.onScheduleChanged || this.onScheduleChanged
  }

  render() {
    return (
      <div id="osome-calendar" {...this.props} >
      </div>
    )
  }
}
OSCalendar.propTypes = {
  onClickSchedule: PropTypes.func, // click schedule
  onTileDragEnd: PropTypes.func,
  onScheduleChanged: PropTypes.func,
  createSchedule: PropTypes.func,
  onScheduleChanged: PropTypes.func,
  attachEvent: PropTypes.func,
  options: PropTypes.object
}