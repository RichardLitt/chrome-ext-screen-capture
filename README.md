# chrome-ext-screen-capture
Capture screen from a chrome extension

This is code borrowed from Louis Li and [his post](http://louisrli.github.io/blog/2013/01/16/javascript-canvas-screenshot/). 

In your `manifest.json` file, include the following: 

```json
"permissions": ["tabs", "<all_urls>"],
"background": {
    "scripts": ["background.js"]
}
```