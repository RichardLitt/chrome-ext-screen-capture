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

/**
 * Returns a canvas containing a screenshot of $element
 * @param  {object} Should be either jQuery object or getBoundingClientRect()
 * @param  {jQuery object} Should be a $canvas object
 * @param  {object} Currently accepts a padding option only, as int
 * @return {[type]}
 */
var renderPreview = function (element, $screenshotCanvas, options) {
  var width, height, prevTop, prevLeft

  var padding = (options && options.padding) ? options.padding : 0

  /* If a jQuery object */
  if (element instanceof $) {
    width = element.width() + padding
    height = element.height() + padding

    // Calculate the correct position of the element on the canvas
    prevTop = element.offset().top - $screenshotCanvas.data('scrollTop') - (padding / 2)
    prevLeft = element.offset().left - $screenshotCanvas.data('scrollLeft') - (padding / 2)
  /* If a getBoundingClientRect() object */
  } else {
    width = element.width + padding
    height = element.height + padding
    prevTop = element.top - $screenshotCanvas.data('scrollTop') - (padding / 2)
    prevLeft = element.left - $screenshotCanvas.data('scrollLeft') - (padding / 2)
  }

  var previewCanvas = document.createElement('canvas')
  previewCanvas.id = 'rendered'
  previewCanvas.width = width
  previewCanvas.height = height

  var ctx = previewCanvas.getContext('2d')
  ctx.drawImage($screenshotCanvas[0], prevLeft, prevTop, width, height, 0, 0, width, height)

  return previewCanvas
}

module.exports.backgroundPage = exports.backgroundPage = backgroundPage
module.exports.takeScreenshot = exports.takeScreenshot = takeScreenshot
module.exports.renderPreview = exports.renderPreview = renderPreview
