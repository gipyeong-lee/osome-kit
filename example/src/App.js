import React, { Component } from 'react'
import update from 'immutability-helper'
import { OSCalendar, OSGantt } from 'osome-kit'

// Number.prototype.pad = function (len) {
//   let s = this.toString();
//   if (s.length < len) {
//     s = ('0000000000' + s).slice(-len);
//   }
//   return s;
// }

export default class App extends Component {
  state = {
    calendarType: 'calender',
    options: {
      style: {
        cellHeader: {
          textAlign: 'left'
        },
        todayHeader: {
          backgroundColor: 'blue',
          numberColor: 'white',
          titleColor: 'red',
          textAlign: 'center'
        }
      },
      year: new Date().getFullYear(),
      month: 12//new Date().getMonth()
    },
    categories: [],
    events: []
  }
  randomColor = () => {
    return '#' + (Math.random().toString(16) + "000000").substring(2, 8)
  }
  
  onClickSchedule = (target, category, event) => {
    console.log(category, event)
  }
  onChangedCategory = (before, after) => {
    console.log(before, after)
    this.setState(update(this.state, { categories: { $set: after } }), () => {
      console.log(`onChangedCategory`, this.state)
    })
  }
  onChangedSchedule = (order, before, after) => {
    console.log(before, after)
    this.setState(update(this.state, { categories: { [order]: { events: { [before.index]: { $set: after } } } } }), () => {
      console.log(`onChangedSchedule`, this.state)
    })
  }
  constructor(props) {
    super(props)
    const self = this
    this.osCalendar = React.createRef()
    this.osGantt = React.createRef()
    const categories = []
    for (let i = 0; i < 10; i++) {

      categories.push({
        content: {
          title: `Calendar ${i}`,
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
      const randomLength = Math.round((Math.random() * 5))
      const events = []
      const content = categories[j].content

      for (let i = 0; i < randomLength; i++) {
        const sDate = Math.round((Math.random() * 25)) + 1
        const eDate = Math.round((Math.random() * 26)) + 1

        events.push({
          order: content.order,
          "id":`${j}-${i}-schedule`,
          "index": i,
          "title": `${content.title}-Schedule-${i}`,
          "detail": "This is Detail",
          "style": {
            "color": "#fff",
            "backgroundColor": content.style.color
          },
          "startDate": `2019-12-${Math.min(sDate, eDate).pad(2)}T00:${Math.min(sDate, eDate).pad(2)}:00.000Z`,
          "endDate": `2019-12-${Math.max(sDate, eDate).pad(2)}T00:00:00.000`,
        })
      }
      categories[j].events = events
    }
    this.state.categories = categories
  }
  componentDidMount() {

  }
  render() {

    return (<div style={{ width: '100%', height: '100%' }}>
      <div style={{ padding: '10px', overflow: 'auto' }}>
        <div style={{ width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px', display: 'inline-block', cursor: 'pointer', userSelect: 'none' }} onClick={() => {
          const prevMonth = Math.max(Number(this.state.options.month) - 1, 1)
          this.setState(update(this.state, { options: { month: { $set: prevMonth } } }))
        }}>{'<'}</div>
        <div style={{ display: 'inline-block', userSelect: 'none' }} >{this.state.options.month}</div>
        <div style={{ width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px', display: 'inline-block', cursor: 'pointer', userSelect: 'none' }} onClick={() => {
          const nextMonth = Math.min(Number(this.state.options.month) + 1, 12)
          this.setState(update(this.state, { options: { month: { $set: nextMonth } } }))
        }}>{'>'}</div>

        <div style={{ float: 'right', display: 'inline-block', marginRight: '10px' }} onClick={() => {
          this.setState(update(this.state, { calendarType: { $set: 'gantt' } }))
        }}>Gantt</div>
        <div style={{ float: 'right', display: 'inline-block', marginRight: '10px' }} onClick={() => {
          this.setState(update(this.state, { calendarType: { $set: 'calendar' } }))
        }}>Calendar</div>
      </div>
      <div class={'no-scroll'} style={{
                        paddingRight: 0,
                        paddingLeft: 0,
                        width: '100%',
                        height: '100%',
                        position: 'absolute'
                      }}>
        {this.state.calendarType === 'gantt' ? <OSGantt style={{width: '100%', padding: '0'}} ref={this.osGantt} categories={this.state.categories} options={this.state.options}
          onChangedSchedule={this.onChangedSchedule}
          onChangedCategory={this.onChangedCategory}
          onClickSchedule={this.onClickSchedule}
          onDragEndTile={(row, start, end, renderOption) => {
            const category = this.state.categories[row]
            const data = { title: category.content.title, detail: 'This is Detail', style: { color: '#fff', backgroundColor: category.content.style.color }, order: row, startDate: start, endDate: end, index: category.events.length }
            this.setState(update(this.state, { categories: { [row]: { events: { $push: [data] } } } }))
          }}
        /> :
          <OSCalendar ref={this.osCalendar}
            style={{width: '100%', padding: '0'}}
            options={this.state.options}
            categories={this.state.categories}
            onClickSchedule={this.onClickSchedule}
            onChangedSchedule={this.onChangedSchedule}
            onDragEndTile={(start, end, renderOption) => {
              const order = Math.round(Math.random() * 10) % (this.state.categories.length || 1)
              const category = this.state.categories[order]
              const index = category.events.length
              // console.log('push', { title: 'This is Title', detail: 'This is Detail', style: { color: '#fff', backgroundColor: '#f00' }, start: start, end: end })
              const data = (category === undefined) ? { title: 'This is Title', detail: 'This is Detail', style: { color: '#fff', backgroundColor: '#f00' }, index: index, order: order, startDate: start, endDate: end } : {
                title: category.content.title, detail: '', style: { color: '#fff', backgroundColor: category.content.style.color }, index: index, order: order, startDate: start, endDate: end
              }
              this.setState(update(this.state, { categories: { [order]: { events: { $push: [data] } } } }))
            }} />

        }
      </div>
    </div>)
  }
}
