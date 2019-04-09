import React, { Component } from 'react'

import { OSCalendar } from 'osome-kit'

export default class App extends Component {
  state = {
    month: new Date().getMonth() + 1
  }
  constructor(props) {
    super(props)
    this.osCalendar = React.createRef()
  }
  componentDidMount() {

  }
  render() {

    return (
      <div>
        <div>
          <div style={{ width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px', display: 'inline-block', cursor: 'pointer', userSelect: 'none' }} onClick={() => {
            const prevMonth = Math.max(Number(this.state.month) - 1, 1)
            this.setState(Object.assign({}, this.state, { month: prevMonth }))
          }}>{'<'}</div>
          <div style={{ display: 'inline-block', userSelect: 'none' }} >{this.state.month}</div>
          <div style={{ width: '40px', height: '40px', textAlign: 'center', lineHeight: '40px', display: 'inline-block', cursor: 'pointer', userSelect: 'none' }} onClick={() => {
            const nextMonth = Math.min(Number(this.state.month) + 1, 12)
            this.setState(Object.assign({}, this.state, { month: nextMonth }))
          }}>{'>'}</div>
        </div>
        <OSCalendar className="hello" ref={this.osCalendar}
          options={{ year: 2019, month: this.state.month }}
          onDragEndTile={(start, end, renderOption) => {
            this.osCalendar.current.attachEvent(renderOption.startTileNumber, renderOption.endTileNumber, { title: 'This is Title', detail: 'This is Detail', style: { color: '#fff', backgroundColor: '#f00' } })
          }} />
      </div>
    )
  }
}
