# chrome-ext-screen-capture

[![Greenkeeper badge](https://badges.greenkeeper.io/RichardLitt/chrome-ext-screen-capture.svg)](https://greenkeeper.io/)
Capture screen from a chrome extension

## Installation

In your `manifest.json` file, include the following: 

```json
"permissions": ["tabs", "<all_urls>"],
"background": {
    "scripts": ["background.js"]
}
```

In your background page, put the following:

```js
require('chrome-ext-screen-capture').backgroundPage()
```

In your content script, the following will return an img url:

```js
var cesc = require('chrome-ext-screen-capture')

cesc.takeScreenshot(function (canvas) {
  /* You can use either a getBoundingClientRect() function or any individual jQuery object */
  var selection = document.getSelection().getRangeAt(0).getBoundingClientRect()
  var imgURL = cesc.renderPreview(selection, canvas, {padding: 20}).toDataURL('image/png')
  console.log('Check this out', imgURL)
})
```

## Acknowledgments

Much of this code was originally sourced from Louis Li and [his post](http://louisrli.github.io/blog/2013/01/16/javascript-canvas-screenshot/). 