import React, { Component } from 'react'
import update from 'immutability-helper'
import { OSCalendar, OSGantt } from 'osome-kit'
Number.prototype.pad = function (len) {
  let s = this.toString();
  if (s.length < len) {
      s = ('0000000000' + s).slice(-len);
  }
  return s;
}

export default class App extends Component {
  state = {
    calendarType: 'gantt',
    options: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    },
    categories: [],
    events: []
  }
  randomColor = () => {
    return '#' + (Math.random().toString(16) + "000000").substring(2, 8)
  }
  onChangedSchedule = (before, after) => {
    this.setState(update(this.state, { events: { [before.index]: { $set: after } } }), () => {
      console.log(`onChangedSchedule`, this.state)
    })
  }
  constructor(props) {
    super(props)
    const self = this
    this.osCalendar = React.createRef()
    this.osGantt = React.createRef()
    const categories = []
    for (let i = 0; i < 25; i++) {
      categories.push({
        content: {
          title: `캘린더 ${i}`,
          type: i % 2 ? 'main' : 'sub',
          enable: true,
          order: i,
          style: {
            color: self.randomColor(),
            padding: '5px'
          }
        },
      })

    }
    const length = categories.length
    for (let j = 0; j < length; j++) {
      const randomLength = Math.round((Math.random() * 4))
      const events = []
      const content = categories[j].content

      for (let i = 0; i < randomLength; i++) {
        const sDate = Math.round((Math.random() * 25))+1
        const eDate = Math.round((Math.random() * 25))+1
        
        events.push({
          "scheduleId": j * 10 + i,
          "index": i,
          "title": "This is Title",
          "detail": "This is Detail",
          "style": {
            "color": "#fff",
            "backgroundColor": content.style.color
          },
          "startDate": `2019-04-${Math.min(sDate,eDate).pad(2)}T15:00:00.000Z`,
          "endDate": `2019-04-${Math.max(sDate,eDate).pad(2)}T15:00:00.000Z`,
          "eventId": j * 10 + i,
          "start": 2,
          "total": 2
        })
      }
      categories[j].events = events
    }
    console.log(categories)
    this.state.categories = categories
  }
  componentDidMount() {

  }
  render() {
    return (<div style={{ width: '100%' }}>
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
      {this.state.calendarType === 'gantt' ? <OSGantt ref={this.osGantt} categories={this.state.categories} options={this.state.options}
        onChangedSchedule={this.onChangedSchedule}
        onDragEndTile={(start, end, renderOption) => {
          // console.log('push', { title: 'This is Title', detail: 'This is Detail', style: { color: '#fff', backgroundColor: '#f00' }, start: start, end: end })
          const data = { title: 'This is Title', detail: 'This is Detail', style: { color: '#fff', backgroundColor: '#f00' }, startDate: start, endDate: end }
          this.setState(update(this.state, { events: { $push: [data] } }))
          // this.osCalendar.current.attachEvent(renderOption.startTileNumber, renderOption.endTileNumber, { title: 'This is Title', detail: 'This is Detail', style: { color: '#fff', backgroundColor: '#f00' } })
        }}
      /> :
        <OSCalendar className="hello" ref={this.osCalendar}
          options={this.state.options}
          categories={this.state.categories}
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
