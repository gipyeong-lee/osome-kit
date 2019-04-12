import React, { Component } from 'react'
import update from 'immutability-helper'
import { OSCalendar } from 'osome-kit'

export default class App extends Component {
  state = {
    options: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    },
    events: []
  }
  onChangedSchedule = (before, after) => {
    this.setState(update(this.state, { events: { [before.index]: { $set: after } } }),()=>{
      console.log(`onChangedSchedule`,this.state)
    })
  }
  constructor(props) {
    super(props)
    this.osCalendar = React.createRef()
  }
  componentDidMount() {

  }
  render() {
    console.log(this.state)
    return (
      <div>
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
        </div>
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
      </div>
    )
  }
}
