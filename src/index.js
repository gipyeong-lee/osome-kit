import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Calendar from './calendar/assets/js/script'
import './calendar/assets/css/style.css'

export class OSCalendar extends PureComponent {
  static propTypes = {
    text: PropTypes.string
  }
  onDragEndTile = (start, end) => {
    console.log('Please implement `onTileDragEnd` ')
  }
  onClickSchedule = (event, index) => {
    console.log('Please implement `onClickSchedule` ')
  }
  onChangedSchedule = (event, afterEvent) => {
    console.log(event, afterEvent)
  }

  constructor(props) {
    super(props)
  }
  attachEvent(start, end, option) {
    Calendar.attachEvent(start, end, option)
  }

  createSchedule(start, end, eventOption) {
    Calendar.attachEvent(start, end, eventOption)
  }
  moveSchedule(eventId, startDay, endDay) {

  }
  componentDidMount() {
    Calendar.init('osome-calendar', this.props.options)
    Calendar.onClickSchedule = this.props.onClickSchedule || this.onClickSchedule
    Calendar.onDragEndTile = this.props.onDragEndTile || this.onDragEndTile
    Calendar.onChangedSchedule = this.props.onChangedSchedule || this.onChangedSchedule
  }

  render() {
    const {style, className} = this.props
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
  options: PropTypes.object
}