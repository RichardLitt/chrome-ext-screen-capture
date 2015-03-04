/* globals chrome */
var $ = require('jquery')

/* Require and execute this function in your background page */
var backgroundPage = function () {
  chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.name === 'screenshot') {
      chrome.tabs.captureVisibleTab(null, null, function (dataUrl) {
        sendResponse({ screenshotUrl: dataUrl })
      })
    }
    return true
  })
}

/* Takes a screenshot and uses it in a callback as a canvas */
var takeScreenshot = function (callback) {
  chrome.extension.sendMessage({name: 'screenshot'}, function (response) {
    var data = response.screenshotUrl
    var canvas = document.createElement('canvas')
    var img = new Image()
    img.onload = function () {
      canvas.width = $(window).width()
      canvas.height = $(window).height()
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)

      var $canvas = $(canvas)
      $canvas.data('scrollLeft', $(document.body).scrollLeft())
      $canvas.data('scrollTop', $(document.body).scrollTop())

      // Perform callback after image loads
      callback($canvas)
    }
    img.src = data
  })
}

/* Returns a canvas containing a screenshot of $element */
var renderPreview = function ($element, $screenshotCanvas) {
  var previewCanvas = document.createElement('canvas')
  previewCanvas.id = 'rendered'
  previewCanvas.width = $element.width()
  previewCanvas.height = $element.height()

  // Calculate the correct position of the element on the canvas
  var prevTop = $element.offset().top - $screenshotCanvas.data('scrollTop')
  var prevLeft = $element.offset().left - $screenshotCanvas.data('scrollLeft')

  var ctx = previewCanvas.getContext('2d')
  ctx.drawImage($screenshotCanvas[0], prevLeft, prevTop,
    $element.width(), $element.height(),
    0, 0,
    $element.width(), $element.height()
  )

  return previewCanvas
}

module.exports.backgroundPage = exports.backgroundPage = backgroundPage
module.exports.takeScreenshot = exports.takeScreenshot = takeScreenshot
module.exports.renderPreview = exports.renderPreview = renderPreview
