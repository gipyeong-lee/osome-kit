import React, { Component } from 'react'

import { OSCalendar, OSGantt } from 'osome-kit'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.osCalendar = React.createRef()
  }
  render() {
    return (
      <div>
        <OSCalendar style={{width:'100%'}} ref={this.osCalendar} 
        options={{year:2019,month:3}}
        onTileDragEnd={(start, end) => {
            this.osCalendar.current.attachEvent(start, end, { title: 'This is Title', detail: 'This is Detail', color: '#f00' })
        }} />
      </div>
    )
  }
}
