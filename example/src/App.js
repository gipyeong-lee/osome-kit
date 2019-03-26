import React, { Component } from 'react'

import { OSCalendar } from 'osome-kit'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.osCalendar = React.createRef()
  }
  render() {
    return (
      <div>
        <OSCalendar className="hello" ref={this.osCalendar}
          options={{ year: 2019, month: 3 }}
          onDragEndTile={(start, end, renderOption) => {
            this.osCalendar.current.attachEvent(renderOption.startTileNumber, renderOption.endTileNumber, { title: 'This is Title', detail: 'This is Detail', style: { backgroundColor: '#f00' } })
          }} />
      </div>
    )
  }
}
