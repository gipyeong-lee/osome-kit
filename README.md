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
[![LinkedIn][linkedin-shield]][https://linkedin.com/in/gipyeong-lee-85734396]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/madist/osome-kit">
    <img src="images/logo.png" alt="Logo" width="90" height="99">
  </a>

  <h3 align="center">Osome Kit</h3>

  <p align="center">
    An simple calendar module. pure javascript. no jquery.
    <br />
    <a href="https://github.com/madist/osome-kit"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://madist.github.io/osome-kit/">View Demo</a>
    ·
    <a href="https://github.com/madist/osome-kit/issues">Report Bug</a>
    ·
    <a href="https://github.com/madist/osome-kit/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

<img src="images/calendar.png" alt="Logo">
<img src="images/gantt.png" alt="Logo">

This project is for switching calendar & gantt easily.


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

- Currently, just reference example 

___ 

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/madist/osome-kit/issues) for a list of proposed features (and known issues).


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

GiPyeong Lee - [@gipyeong](https://linkedin.com/in/gipyeong-lee-85734396) - ocsoon.jin@gmail.com

Project Link: [https://github.com/madist/osome-kit](https://github.com/madist/osome-kit)



# osome-kit

> pure javascript calendar react module

[![NPM](https://img.shields.io/npm/v/osome-kit.svg)](https://www.npmjs.com/package/osome-kit) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save osome-kit
```

## Usage

```jsx
import React, { Component } from 'react'

import {OSCalendar} from 'osome-kit'

class Example extends Component {
  render () {
    return (
      <OSCalendar />
    )
  }
}
```