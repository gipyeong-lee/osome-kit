import React, { Component } from 'react'
import update from 'immutability-helper'
import { OSCalendar, OSGantt } from 'osome-kit'

export default class App extends Component {
  state = {
    calendarType: 'gantt',
    options: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    },
    events: []
  }
  onChangedSchedule = (before, after) => {
    console.log(before, after)
    this.setState(update(this.state, { events: { [before.index]: { $set: after } } }), () => {
      console.log(`onChangedSchedule`, this.state)
    })
  }
  constructor(props) {
    super(props)
    this.osCalendar = React.createRef()
    this.osGantt = React.createRef()
    const events = []
    for (let i = 0; i < 20; i++) {
      events.push({
        "scheduleId": 0,
        "index": 0,
        "title": "This is Title",
        "detail": "This is Detail",
        "style": {
          "color": "#fff",
          "backgroundColor": "#f00"
        },
        "startDate": `2019-04-0${(i % 10)}T15:00:00.000Z`,
        "endDate": `2019-04-0${(2 + i % 10)}T15:00:00.000Z`,
        "eventId": 0,
        "start": 2,
        "total": 2
      })
    }
    this.state.events = events
  }
  componentDidMount() {

  }
  render() {
    return (<div style={{width:'100%'}}>
      <div>
        <div style={{ width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px', display: 'inline-block', cursor: 'pointer', userSelect: 'none' }} onClick={() => {
          const prevMonth = Math.max(Number(this.state.options.month) - 1, 1)
          this.setState(update(this.state, { options: { month: { $set: prevMonth } } }))
        }}>{'<'}</div>
        <div style={{ display: 'inline-block', userSelect: 'none' }} >{this.state.options.month}</div>
        <div style={{ width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px', display: 'inline-block', cursor: 'pointer', userSelect: 'none' }} onClick={() => {
          const nextMonth = Math.min(Number(this.state.options.month) + 1, 12)
          this.setState(update(this.state, { options: { month: { $set: nextMonth } } }))
        }}>{'>'}</div>

        <div style={{ float: 'right', display: 'inline-block' }} onClick={() => {
          this.setState(update(this.state, { calendarType: { $set: 'gantt' } }))
        }}>Gantt</div>
        <div style={{ float: 'right', display: 'inline-block' }} onClick={() => {
          this.setState(update(this.state, { calendarType: { $set: 'calendar' } }))
        }}>Calendar</div>
      </div>
      {this.state.calendarType === 'gantt' ? <OSGantt ref={this.osGantt} events={this.state.events} options={this.state.options}
      /> :
        <OSCalendar className="hello" ref={this.osCalendar}
          options={this.state.options}
          events={this.state.events}
          onChangedSchedule={this.onChangedSchedule}
          onDragEndTile={(start, end, renderOption) => {
            // console.log('push', { title: 'This is Title', detail: 'This is Detail', style: { color: '#fff', backgroundColor: '#f00' }, start: start, end: end })
            const data = { title: 'This is Title', detail: 'This is Detail', style: { color: '#fff', backgroundColor: '#f00' }, startDate: start, endDate: end }
            this.setState(update(this.state, { events: { $push: [data] } }))
            // this.osCalendar.current.attachEvent(renderOption.startTileNumber, renderOption.endTileNumber, { title: 'This is Title', detail: 'This is Detail', style: { color: '#fff', backgroundColor: '#f00' } })
          }} />

      }
    </div>)
  }
}
