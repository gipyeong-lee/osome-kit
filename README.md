<!--
*** Thanks for checking out this README Template. If you have a suggestion that would
*** make this better please fork the repo and create a pull request or simple open
*** an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->





<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for build-url, contributors-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![NPM](https://img.shields.io/npm/v/osome-kit.svg)](https://www.npmjs.com/package/osome-kit)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/gipyeong-lee/osome-kit">
    <img src="images/logo.png" alt="Logo" width="90" height="99">
  </a>

  <h3 align="center">Osome Kit</h3>

  <p align="center">
    An simple react calendar module. pure javascript. no jquery.
    <br />
    <a href="https://github.com/gipyeong-lee/osome-kit"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://gipyeong-lee.github.io/osome-kit/">View Demo</a>
    ·
    <a href="https://github.com/gipyeong-lee/osome-kit/issues">Report Bug</a>
    ·
    <a href="https://github.com/gipyeong-lee/osome-kit/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [1. Before using `osome-kit` please import module.](#1-before-using-osome-kit-please-import-module)
  - [2. Implement below codes in the react render method.](#2-implement-below-codes-in-the-react-render-method)
    - [Calendar](#calendar)
    - [Gantt](#gantt)
  - [Supported Props](#supported-props)
    - [OSCalendar Props](#oscalendar-props)
    - [OSGantt Props](#osgantt-props)
    - [More Info](#more-info)
      - [Options](#options)
      - [Categories](#categories)
      - [Content](#content)
      - [Events](#events)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Reference](#reference)



<!-- ABOUT THE PROJECT -->
## About The Project

<img src="./images/calendar.png" alt="calendar">

<img src="./images/gantt.png" alt="gantt">

This project support you can switching calendar & gantt easily.


<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
```sh
npm install npm@latest -g
```
* react
```sh
npm install --save react react-dom
```

### Installation

1. Npm install
   ```sh
   npm install --save osome-kit
   ```

<!-- USAGE EXAMPLES -->
## Usage
### 1. Before using `osome-kit` please import module.
```js
import { OSCalendar, OSGantt } from 'osome-kit'
```
### 2. Implement below codes in the react render method.
#### Calendar
```js
 <OSCalendar
            options={this.state.options}
            categories={this.state.categories}
            onClickSchedule={this.onClickSchedule}
            onChangedSchedule={this.onChangedSchedule}
            onDragEndTile={(start, end, renderOption) => {
              const order = Math.round(Math.random() * 10) % (this.state.categories.length || 1)
              const category = this.state.categories[order]
              const index = category.events.length
              const data = (category === undefined) ? { title: 'This is Title', detail: 'This is Detail', style: { color: '#fff', backgroundColor: '#f00' }, index: index, order: order, startDate: start, endDate: end } : {
                title: category.content.title, detail: '', style: { color: '#fff', backgroundColor: category.content.style.color }, index: index, order: order, startDate: start, endDate: end
              }
              this.setState(update(this.state, { categories: { [order]: { events: { $push: [data] } } } }))
            }} />
```
#### Gantt
```js
<OSGantt style={{width: '100%', padding: '0'}} ref={this.osGantt} categories={this.state.categories} options={this.state.options}
          onChangedSchedule={this.onChangedSchedule}
          onChangedCategory={this.onChangedCategory}
          onClickSchedule={this.onClickSchedule}
          onDragEndTile={(row, start, end, renderOption) => {
            const category = this.state.categories[row]
            const data = { title: category.content.title, detail: 'This is Detail', style: { color: '#fff', backgroundColor: category.content.style.color }, order: row, startDate: start, endDate: end, index: category.events.length }
            this.setState(update(this.state, { categories: { [row]: { events: { $push: [data] } } } }))
          }}
        />
```
### Supported Props
#### OSCalendar Props
| Prop              | type                               | Description                                                                                |
| ----------------- | ---------------------------------- | ------------------------------------------------------------------------------------------ |
| categories        | object                             | Event data                                                                                 |
| options           | object                             | Calendar's option                                                                          |
| onClickSchedule   | function(element, category, event) | When click schedule block. it will be fired.                                               |
| onChangedSchedule | function(order, event, afterEvent) | When Schedule changed user interaction. such as `move`,`resize` it will be fired.          |
| onClickMoreButton | function(element, events)          | When click more button. ( more button will be appeared when you set maxEvent in `options`) |

#### OSGantt Props
| Prop                      | type                                  | Description                                                                                           |
| ------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| categories                | object                                | Event data (same with above calnedar events)                                                          |
| options                   | object                                | Gantt's option                                                                                        |
| onClickSchedule           | function(element, category, event)    | When click schedule block. it will be fired.                                                          |
| onMouseRightClick         | function(element, event)              | When click mouse right button on left continaer's rows.                                               |
| onDragEndTile             | function(start, end, renderOption)    | When mouse down and up in right container's row tiles it will be fired. (create schedule by dragging) |
| onChangedSchedule         | function(order, event, afterEvent)    | When schedule changed by user interaction. such as `move`,`resize` it will be fired.                  |
| onChangedCategory         | function(categories, afterCategories) | When category changed by user interaction. such as `move category` it will be fired.                  |
| onChangeContainer         | function(left, right)                 | When container size changging. it will be fired every resized time.                                   |
| onCompleteContainerResize | function(left, right)                 | When container's resize finished. it will be fired.                                                   |
#### More Info

##### Options
| Property   | type   | Description                                                                                                                                      |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| type       | string | [Gantt Only] currently only exist 'row', <br>Default `row`                                                                                       |
| fixed      | bool   | [Gantt Only] fixed gantt resizable left, right container. <br>Default `false`                                                                    |
| disabled   | bool   | [Gantt Only] disable all event.                                                                                                                  |
| style      | object | [Gantt & Calendar] style of elements.                                                                                                            |
| country    | string | [Gantt & Calendar] for localizing. <br>Default `ko`                                                                                              |
| days       | object | [Gantt & Calendar] for localizing. <br>Default `{ ko: ['일', '월', '화', '수', '목', '금', '토'], jp: ['日', '月', '火', '水', '木', '金', '土']}`      |
| today      | date   | [Gantt & Calendar] Today's date. <br>Default `new Date()`                                                                                        |
| year       | number | [Gantt & Calendar] Today's year. <br>Default `new Date().getFullYear()`                                                                          |
| month      | number | [Gantt & Calendar] Today's month. <br>Default `new Date().getMonth()`                                                                            |
| handleMin  | number | [Gantt Only] the minimum limit of left container's width percentage number.<br>Default `5` (It mean 5%)                                          |
| handleMax  | number | [Gantt Only] the minimum limit of left container's width percentage number.<br>Default `35` (It mean 35%)                                        |
| maxEvent   | number | [Calendar Only] the limit of schedules can be displayed on calendar grid. if more than this number, more button will be shown.<br>Default `2000` |
| moreButton | object | [Calendar Only] more button text.<br>Default `{ ko: '+ 더보기', jp: '+ もっと見る' }`                                                               |
| refresh    | bool   | [Gantt & Calendar] after categories modified. calendar,gantt reset or saving offset y of scroll offset.                                          |

##### Categories
| Property | type   | Description                                          |
| -------- | ------ | ---------------------------------------------------- |
| content  | object | It is just wrapper key. it includes below properties |
##### Content
| Property | type        | Description                                                                  |
| -------- | ----------- | ---------------------------------------------------------------------------- |
| type     | string      | [Gantt Only] you can set [`main`, `sub`] type of calendar.<br>Default `main` |
| order    | gantt order | [Gantt Only] gantt chart's order                                             |
| style    | object      | [Gantt & Calendar] react style object of calendar                            |
| events   | array       | [Gantt & Calendar] events                                                    |
- In Example
<pre>
content: {
          title: `Calendar ${i}`,
          type: i % 2 ? 'main' : 'sub',
          order: i,
          style: {
            color: self.randomColor(),
            padding: '5px'
          }
        }
</pre>
##### Events
| Property  | type   | Description                                                   |
| --------- | ------ | ------------------------------------------------------------- |
| id        | string | [Gantt & Caldnear] this is schedule `id` key!                 |
| index     | number | [Gantt & Caldnear] this is schedule's index of schedule array |
| title     | string | [Gantt & Calendar] this is schedule title                     |
| style     | object | [Gantt & Calendar] style of schedule block                    |
| startDate | string | [Gantt & Calendar] when the schedule start                    |
| endDate   | string | [Gantt & Calendar] when the schedule end                      |

- In Example
<pre>
{
  "id":`${j}-${i}-schedule`,
  "index": i,
  "title": `${content.title}-Schedule-${i}`,
  "style": {
    "color": "#fff",
    "backgroundColor": content.style.color
  },
  "startDate": `2019-12-${Math.min(sDate, eDate).pad(2)}T00:${Math.min(sDate, eDate).pad(2)}:00.000Z`,
  "endDate": `2019-12-${Math.max(sDate, eDate).pad(2)}T00:00:00.000`,
}
</pre>
___

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/gipyeong-lee/osome-kit/issues) for a list of proposed features (and known issues).


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

GiPyeong Lee - [@gipyeong](https://linkedin.com/in/gipyeong-lee-85734396) - gipyeong.lee@gmail.com

Project Link: [https://github.com/gipyeong-lee/osome-kit](https://github.com/gipyeong-lee/osome-kit)

## Reference
[Best Readme Template](https://github.com/othneildrew/Best-README-Template)
