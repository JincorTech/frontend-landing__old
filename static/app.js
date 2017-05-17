(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////             /////    /////
/////             /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
         /////    /////
         /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////
/////    /////    /////    /////

/**
 * ScrollReveal
 * ------------
 * Version : 3.3.4
 * Website : scrollrevealjs.org
 * Repo    : github.com/jlmakes/scrollreveal.js
 * Author  : Julian Lloyd (@jlmakes)
 */

;(function () {
  'use strict'

  var sr
  var _requestAnimationFrame

  function ScrollReveal (config) {
    // Support instantiation without the `new` keyword.
    if (typeof this === 'undefined' || Object.getPrototypeOf(this) !== ScrollReveal.prototype) {
      return new ScrollReveal(config)
    }

    sr = this // Save reference to instance.
    sr.version = '3.3.4'
    sr.tools = new Tools() // *required utilities

    if (sr.isSupported()) {
      sr.tools.extend(sr.defaults, config || {})

      sr.defaults.container = _resolveContainer(sr.defaults)

      sr.store = {
        elements: {},
        containers: []
      }

      sr.sequences = {}
      sr.history = []
      sr.uid = 0
      sr.initialized = false
    } else if (typeof console !== 'undefined' && console !== null) {
      // Note: IE9 only supports console if devtools are open.
      console.log('ScrollReveal is not supported in this browser.')
    }

    return sr
  }

  /**
   * Configuration
   * -------------
   * This object signature can be passed directly to the ScrollReveal constructor,
   * or as the second argument of the `reveal()` method.
   */

  ScrollReveal.prototype.defaults = {
    // 'bottom', 'left', 'top', 'right'
    origin: 'bottom',

    // Can be any valid CSS distance, e.g. '5rem', '10%', '20vw', etc.
    distance: '20px',

    // Time in milliseconds.
    duration: 500,
    delay: 0,

    // Starting angles in degrees, will transition from these values to 0 in all axes.
    rotate: { x: 0, y: 0, z: 0 },

    // Starting opacity value, before transitioning to the computed opacity.
    opacity: 0,

    // Starting scale value, will transition from this value to 1
    scale: 0.9,

    // Accepts any valid CSS easing, e.g. 'ease', 'ease-in-out', 'linear', etc.
    easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)',

    // `<html>` is the default reveal container. You can pass either:
    // DOM Node, e.g. document.querySelector('.fooContainer')
    // Selector, e.g. '.fooContainer'
    container: window.document.documentElement,

    // true/false to control reveal animations on mobile.
    mobile: true,

    // true:  reveals occur every time elements become visible
    // false: reveals occur once as elements become visible
    reset: false,

    // 'always' — delay for all reveal animations
    // 'once'   — delay only the first time reveals occur
    // 'onload' - delay only for animations triggered by first load
    useDelay: 'always',

    // Change when an element is considered in the viewport. The default value
    // of 0.20 means 20% of an element must be visible for its reveal to occur.
    viewFactor: 0.2,

    // Pixel values that alter the container boundaries.
    // e.g. Set `{ top: 48 }`, if you have a 48px tall fixed toolbar.
    // --
    // Visual Aid: https://scrollrevealjs.org/assets/viewoffset.png
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },

    // Callbacks that fire for each triggered element reveal, and reset.
    beforeReveal: function (domEl) {},
    beforeReset: function (domEl) {},

    // Callbacks that fire for each completed element reveal, and reset.
    afterReveal: function (domEl) {},
    afterReset: function (domEl) {}
  }

  /**
   * Check if client supports CSS Transform and CSS Transition.
   * @return {boolean}
   */
  ScrollReveal.prototype.isSupported = function () {
    var style = document.documentElement.style
    return 'WebkitTransition' in style && 'WebkitTransform' in style ||
      'transition' in style && 'transform' in style
  }

  /**
   * Creates a reveal set, a group of elements that will animate when they
   * become visible. If [interval] is provided, a new sequence is created
   * that will ensure elements reveal in the order they appear in the DOM.
   *
   * @param {Node|NodeList|string} [target]   The node, node list or selector to use for animation.
   * @param {Object}               [config]   Override the defaults for this reveal set.
   * @param {number}               [interval] Time between sequenced element animations (milliseconds).
   * @param {boolean}              [sync]     Used internally when updating reveals for async content.
   *
   * @return {Object} The current ScrollReveal instance.
   */
  ScrollReveal.prototype.reveal = function (target, config, interval, sync) {
    var container
    var elements
    var elem
    var elemId
    var sequence
    var sequenceId

    // No custom configuration was passed, but a sequence interval instead.
    // let’s shuffle things around to make sure everything works.
    if (config !== undefined && typeof config === 'number') {
      interval = config
      config = {}
    } else if (config === undefined || config === null) {
      config = {}
    }

    container = _resolveContainer(config)
    elements = _getRevealElements(target, container)

    if (!elements.length) {
      console.log('ScrollReveal: reveal on "' + target + '" failed, no elements found.')
      return sr
    }

    // Prepare a new sequence if an interval is passed.
    if (interval && typeof interval === 'number') {
      sequenceId = _nextUid()

      sequence = sr.sequences[sequenceId] = {
        id: sequenceId,
        interval: interval,
        elemIds: [],
        active: false
      }
    }

    // Begin main loop to configure ScrollReveal elements.
    for (var i = 0; i < elements.length; i++) {
      // Check if the element has already been configured and grab it from the store.
      elemId = elements[i].getAttribute('data-sr-id')
      if (elemId) {
        elem = sr.store.elements[elemId]
      } else {
        // Otherwise, let’s do some basic setup.
        elem = {
          id: _nextUid(),
          domEl: elements[i],
          seen: false,
          revealing: false
        }
        elem.domEl.setAttribute('data-sr-id', elem.id)
      }

      // Sequence only setup
      if (sequence) {
        elem.sequence = {
          id: sequence.id,
          index: sequence.elemIds.length
        }

        sequence.elemIds.push(elem.id)
      }

      // New or existing element, it’s time to update its configuration, styles,
      // and send the updates to our store.
      _configure(elem, config, container)
      _style(elem)
      _updateStore(elem)

      // We need to make sure elements are set to visibility: visible, even when
      // on mobile and `config.mobile === false`, or if unsupported.
      if (sr.tools.isMobile() && !elem.config.mobile || !sr.isSupported()) {
        elem.domEl.setAttribute('style', elem.styles.inline)
        elem.disabled = true
      } else if (!elem.revealing) {
        // Otherwise, proceed normally.
        elem.domEl.setAttribute('style',
          elem.styles.inline +
          elem.styles.transform.initial
        )
      }
    }

    // Each `reveal()` is recorded so that when calling `sync()` while working
    // with asynchronously loaded content, it can re-trace your steps but with
    // all your new elements now in the DOM.

    // Since `reveal()` is called internally by `sync()`, we don’t want to
    // record or intiialize each reveal during syncing.
    if (!sync && sr.isSupported()) {
      _record(target, config, interval)

      // We push initialization to the event queue using setTimeout, so that we can
      // give ScrollReveal room to process all reveal calls before putting things into motion.
      // --
      // Philip Roberts - What the heck is the event loop anyway? (JSConf EU 2014)
      // https://www.youtube.com/watch?v=8aGhZQkoFbQ
      if (sr.initTimeout) {
        window.clearTimeout(sr.initTimeout)
      }
      sr.initTimeout = window.setTimeout(_init, 0)
    }

    return sr
  }

  /**
   * Re-runs `reveal()` for each record stored in history, effectively capturing
   * any content loaded asynchronously that matches existing reveal set targets.
   * @return {Object} The current ScrollReveal instance.
   */
  ScrollReveal.prototype.sync = function () {
    if (sr.history.length && sr.isSupported()) {
      for (var i = 0; i < sr.history.length; i++) {
        var record = sr.history[i]
        sr.reveal(record.target, record.config, record.interval, true)
      }
      _init()
    } else {
      console.log('ScrollReveal: sync failed, no reveals found.')
    }
    return sr
  }

  /**
   * Private Methods
   * ---------------
   */

  function _resolveContainer (config) {
    if (config && config.container) {
      if (typeof config.container === 'string') {
        return window.document.documentElement.querySelector(config.container)
      } else if (sr.tools.isNode(config.container)) {
        return config.container
      } else {
        console.log('ScrollReveal: invalid container "' + config.container + '" provided.')
        console.log('ScrollReveal: falling back to default container.')
      }
    }
    return sr.defaults.container
  }

  /**
   * check to see if a node or node list was passed in as the target,
   * otherwise query the container using target as a selector.
   *
   * @param {Node|NodeList|string} [target]    client input for reveal target.
   * @param {Node}                 [container] parent element for selector queries.
   *
   * @return {array} elements to be revealed.
   */
  function _getRevealElements (target, container) {
    if (typeof target === 'string') {
      return Array.prototype.slice.call(container.querySelectorAll(target))
    } else if (sr.tools.isNode(target)) {
      return [target]
    } else if (sr.tools.isNodeList(target)) {
      return Array.prototype.slice.call(target)
    }
    return []
  }

  /**
   * A consistent way of creating unique IDs.
   * @returns {number}
   */
  function _nextUid () {
    return ++sr.uid
  }

  function _configure (elem, config, container) {
    // If a container was passed as a part of the config object,
    // let’s overwrite it with the resolved container passed in.
    if (config.container) config.container = container
    // If the element hasn’t already been configured, let’s use a clone of the
    // defaults extended by the configuration passed as the second argument.
    if (!elem.config) {
      elem.config = sr.tools.extendClone(sr.defaults, config)
    } else {
      // Otherwise, let’s use a clone of the existing element configuration extended
      // by the configuration passed as the second argument.
      elem.config = sr.tools.extendClone(elem.config, config)
    }

    // Infer CSS Transform axis from origin string.
    if (elem.config.origin === 'top' || elem.config.origin === 'bottom') {
      elem.config.axis = 'Y'
    } else {
      elem.config.axis = 'X'
    }
  }

  function _style (elem) {
    var computed = window.getComputedStyle(elem.domEl)

    if (!elem.styles) {
      elem.styles = {
        transition: {},
        transform: {},
        computed: {}
      }

      // Capture any existing inline styles, and add our visibility override.
      // --
      // See section 4.2. in the Documentation:
      // https://github.com/jlmakes/scrollreveal.js#42-improve-user-experience
      elem.styles.inline = elem.domEl.getAttribute('style') || ''
      elem.styles.inline += '; visibility: visible; '

      // grab the elements existing opacity.
      elem.styles.computed.opacity = computed.opacity

      // grab the elements existing transitions.
      if (!computed.transition || computed.transition === 'all 0s ease 0s') {
        elem.styles.computed.transition = ''
      } else {
        elem.styles.computed.transition = computed.transition + ', '
      }
    }

    // Create transition styles
    elem.styles.transition.instant = _generateTransition(elem, 0)
    elem.styles.transition.delayed = _generateTransition(elem, elem.config.delay)

    // Generate transform styles, first with the webkit prefix.
    elem.styles.transform.initial = ' -webkit-transform:'
    elem.styles.transform.target = ' -webkit-transform:'
    _generateTransform(elem)

    // And again without any prefix.
    elem.styles.transform.initial += 'transform:'
    elem.styles.transform.target += 'transform:'
    _generateTransform(elem)
  }

  function _generateTransition (elem, delay) {
    var config = elem.config

    return '-webkit-transition: ' + elem.styles.computed.transition +
      '-webkit-transform ' + config.duration / 1000 + 's ' +
      config.easing + ' ' +
      delay / 1000 + 's, opacity ' +
      config.duration / 1000 + 's ' +
      config.easing + ' ' +
      delay / 1000 + 's; ' +

      'transition: ' + elem.styles.computed.transition +
      'transform ' + config.duration / 1000 + 's ' +
      config.easing + ' ' +
      delay / 1000 + 's, opacity ' +
      config.duration / 1000 + 's ' +
      config.easing + ' ' +
      delay / 1000 + 's; '
  }

  function _generateTransform (elem) {
    var config = elem.config
    var cssDistance
    var transform = elem.styles.transform

    // Let’s make sure our our pixel distances are negative for top and left.
    // e.g. origin = 'top' and distance = '25px' starts at `top: -25px` in CSS.
    if (config.origin === 'top' || config.origin === 'left') {
      cssDistance = /^-/.test(config.distance)
        ? config.distance.substr(1)
        : '-' + config.distance
    } else {
      cssDistance = config.distance
    }

    if (parseInt(config.distance)) {
      transform.initial += ' translate' + config.axis + '(' + cssDistance + ')'
      transform.target += ' translate' + config.axis + '(0)'
    }
    if (config.scale) {
      transform.initial += ' scale(' + config.scale + ')'
      transform.target += ' scale(1)'
    }
    if (config.rotate.x) {
      transform.initial += ' rotateX(' + config.rotate.x + 'deg)'
      transform.target += ' rotateX(0)'
    }
    if (config.rotate.y) {
      transform.initial += ' rotateY(' + config.rotate.y + 'deg)'
      transform.target += ' rotateY(0)'
    }
    if (config.rotate.z) {
      transform.initial += ' rotateZ(' + config.rotate.z + 'deg)'
      transform.target += ' rotateZ(0)'
    }
    transform.initial += '; opacity: ' + config.opacity + ';'
    transform.target += '; opacity: ' + elem.styles.computed.opacity + ';'
  }

  function _updateStore (elem) {
    var container = elem.config.container

    // If this element’s container isn’t already in the store, let’s add it.
    if (container && sr.store.containers.indexOf(container) === -1) {
      sr.store.containers.push(elem.config.container)
    }

    // Update the element stored with our new element.
    sr.store.elements[elem.id] = elem
  }

  function _record (target, config, interval) {
    // Save the `reveal()` arguments that triggered this `_record()` call, so we
    // can re-trace our steps when calling the `sync()` method.
    var record = {
      target: target,
      config: config,
      interval: interval
    }
    sr.history.push(record)
  }

  function _init () {
    if (sr.isSupported()) {
      // Initial animate call triggers valid reveal animations on first load.
      // Subsequent animate calls are made inside the event handler.
      _animate()

      // Then we loop through all container nodes in the store and bind event
      // listeners to each.
      for (var i = 0; i < sr.store.containers.length; i++) {
        sr.store.containers[i].addEventListener('scroll', _handler)
        sr.store.containers[i].addEventListener('resize', _handler)
      }

      // Let’s also do a one-time binding of window event listeners.
      if (!sr.initialized) {
        window.addEventListener('scroll', _handler)
        window.addEventListener('resize', _handler)
        sr.initialized = true
      }
    }
    return sr
  }

  function _handler () {
    _requestAnimationFrame(_animate)
  }

  function _setActiveSequences () {
    var active
    var elem
    var elemId
    var sequence

    // Loop through all sequences
    sr.tools.forOwn(sr.sequences, function (sequenceId) {
      sequence = sr.sequences[sequenceId]
      active = false

      // For each sequenced elemenet, let’s check visibility and if
      // any are visible, set it’s sequence to active.
      for (var i = 0; i < sequence.elemIds.length; i++) {
        elemId = sequence.elemIds[i]
        elem = sr.store.elements[elemId]
        if (_isElemVisible(elem) && !active) {
          active = true
        }
      }

      sequence.active = active
    })
  }

  function _animate () {
    var delayed
    var elem

    _setActiveSequences()

    // Loop through all elements in the store
    sr.tools.forOwn(sr.store.elements, function (elemId) {
      elem = sr.store.elements[elemId]
      delayed = _shouldUseDelay(elem)

      // Let’s see if we should revealand if so,
      // trigger the `beforeReveal` callback and
      // determine whether or not to use delay.
      if (_shouldReveal(elem)) {
        elem.config.beforeReveal(elem.domEl)
        if (delayed) {
          elem.domEl.setAttribute('style',
            elem.styles.inline +
            elem.styles.transform.target +
            elem.styles.transition.delayed
          )
        } else {
          elem.domEl.setAttribute('style',
            elem.styles.inline +
            elem.styles.transform.target +
            elem.styles.transition.instant
          )
        }

        // Let’s queue the `afterReveal` callback
        // and mark the element as seen and revealing.
        _queueCallback('reveal', elem, delayed)
        elem.revealing = true
        elem.seen = true

        if (elem.sequence) {
          _queueNextInSequence(elem, delayed)
        }
      } else if (_shouldReset(elem)) {
        //Otherwise reset our element and
        // trigger the `beforeReset` callback.
        elem.config.beforeReset(elem.domEl)
        elem.domEl.setAttribute('style',
          elem.styles.inline +
          elem.styles.transform.initial +
          elem.styles.transition.instant
        )
        // And queue the `afterReset` callback.
        _queueCallback('reset', elem)
        elem.revealing = false
      }
    })
  }

  function _queueNextInSequence (elem, delayed) {
    var elapsed = 0
    var delay = 0
    var sequence = sr.sequences[elem.sequence.id]

    // We’re processing a sequenced element, so let's block other elements in this sequence.
    sequence.blocked = true

    // Since we’re triggering animations a part of a sequence after animations on first load,
    // we need to check for that condition and explicitly add the delay to our timer.
    if (delayed && elem.config.useDelay === 'onload') {
      delay = elem.config.delay
    }

    // If a sequence timer is already running, capture the elapsed time and clear it.
    if (elem.sequence.timer) {
      elapsed = Math.abs(elem.sequence.timer.started - new Date())
      window.clearTimeout(elem.sequence.timer)
    }

    // Start a new timer.
    elem.sequence.timer = { started: new Date() }
    elem.sequence.timer.clock = window.setTimeout(function () {
      // Sequence interval has passed, so unblock the sequence and re-run the handler.
      sequence.blocked = false
      elem.sequence.timer = null
      _handler()
    }, Math.abs(sequence.interval) + delay - elapsed)
  }

  function _queueCallback (type, elem, delayed) {
    var elapsed = 0
    var duration = 0
    var callback = 'after'

    // Check which callback we’re working with.
    switch (type) {
      case 'reveal':
        duration = elem.config.duration
        if (delayed) {
          duration += elem.config.delay
        }
        callback += 'Reveal'
        break

      case 'reset':
        duration = elem.config.duration
        callback += 'Reset'
        break
    }

    // If a timer is already running, capture the elapsed time and clear it.
    if (elem.timer) {
      elapsed = Math.abs(elem.timer.started - new Date())
      window.clearTimeout(elem.timer.clock)
    }

    // Start a new timer.
    elem.timer = { started: new Date() }
    elem.timer.clock = window.setTimeout(function () {
      // The timer completed, so let’s fire the callback and null the timer.
      elem.config[callback](elem.domEl)
      elem.timer = null
    }, duration - elapsed)
  }

  function _shouldReveal (elem) {
    if (elem.sequence) {
      var sequence = sr.sequences[elem.sequence.id]
      return sequence.active &&
        !sequence.blocked &&
        !elem.revealing &&
        !elem.disabled
    }
    return _isElemVisible(elem) &&
      !elem.revealing &&
      !elem.disabled
  }

  function _shouldUseDelay (elem) {
    var config = elem.config.useDelay
    return config === 'always' ||
      (config === 'onload' && !sr.initialized) ||
      (config === 'once' && !elem.seen)
  }

  function _shouldReset (elem) {
    if (elem.sequence) {
      var sequence = sr.sequences[elem.sequence.id]
      return !sequence.active &&
        elem.config.reset &&
        elem.revealing &&
        !elem.disabled
    }
    return !_isElemVisible(elem) &&
      elem.config.reset &&
      elem.revealing &&
      !elem.disabled
  }

  function _getContainer (container) {
    return {
      width: container.clientWidth,
      height: container.clientHeight
    }
  }

  function _getScrolled (container) {
    // Return the container scroll values, plus the its offset.
    if (container && container !== window.document.documentElement) {
      var offset = _getOffset(container)
      return {
        x: container.scrollLeft + offset.left,
        y: container.scrollTop + offset.top
      }
    } else {
      // Otherwise, default to the window object’s scroll values.
      return {
        x: window.pageXOffset,
        y: window.pageYOffset
      }
    }
  }

  function _getOffset (domEl) {
    var offsetTop = 0
    var offsetLeft = 0

      // Grab the element’s dimensions.
    var offsetHeight = domEl.offsetHeight
    var offsetWidth = domEl.offsetWidth

    // Now calculate the distance between the element and its parent, then
    // again for the parent to its parent, and again etc... until we have the
    // total distance of the element to the document’s top and left origin.
    do {
      if (!isNaN(domEl.offsetTop)) {
        offsetTop += domEl.offsetTop
      }
      if (!isNaN(domEl.offsetLeft)) {
        offsetLeft += domEl.offsetLeft
      }
      domEl = domEl.offsetParent
    } while (domEl)

    return {
      top: offsetTop,
      left: offsetLeft,
      height: offsetHeight,
      width: offsetWidth
    }
  }

  function _isElemVisible (elem) {
    var offset = _getOffset(elem.domEl)
    var container = _getContainer(elem.config.container)
    var scrolled = _getScrolled(elem.config.container)
    var vF = elem.config.viewFactor

      // Define the element geometry.
    var elemHeight = offset.height
    var elemWidth = offset.width
    var elemTop = offset.top
    var elemLeft = offset.left
    var elemBottom = elemTop + elemHeight
    var elemRight = elemLeft + elemWidth

    return confirmBounds() || isPositionFixed()

    function confirmBounds () {
      // Define the element’s functional boundaries using its view factor.
      var top = elemTop + elemHeight * vF
      var left = elemLeft + elemWidth * vF
      var bottom = elemBottom - elemHeight * vF
      var right = elemRight - elemWidth * vF

      // Define the container functional boundaries using its view offset.
      var viewTop = scrolled.y + elem.config.viewOffset.top
      var viewLeft = scrolled.x + elem.config.viewOffset.left
      var viewBottom = scrolled.y - elem.config.viewOffset.bottom + container.height
      var viewRight = scrolled.x - elem.config.viewOffset.right + container.width

      return top < viewBottom &&
        bottom > viewTop &&
        left > viewLeft &&
        right < viewRight
    }

    function isPositionFixed () {
      return (window.getComputedStyle(elem.domEl).position === 'fixed')
    }
  }

  /**
   * Utilities
   * ---------
   */

  function Tools () {}

  Tools.prototype.isObject = function (object) {
    return object !== null && typeof object === 'object' && object.constructor === Object
  }

  Tools.prototype.isNode = function (object) {
    return typeof window.Node === 'object'
      ? object instanceof window.Node
      : object && typeof object === 'object' &&
        typeof object.nodeType === 'number' &&
        typeof object.nodeName === 'string'
  }

  Tools.prototype.isNodeList = function (object) {
    var prototypeToString = Object.prototype.toString.call(object)
    var regex = /^\[object (HTMLCollection|NodeList|Object)\]$/

    return typeof window.NodeList === 'object'
      ? object instanceof window.NodeList
      : object && typeof object === 'object' &&
        regex.test(prototypeToString) &&
        typeof object.length === 'number' &&
        (object.length === 0 || this.isNode(object[0]))
  }

  Tools.prototype.forOwn = function (object, callback) {
    if (!this.isObject(object)) {
      throw new TypeError('Expected "object", but received "' + typeof object + '".')
    } else {
      for (var property in object) {
        if (object.hasOwnProperty(property)) {
          callback(property)
        }
      }
    }
  }

  Tools.prototype.extend = function (target, source) {
    this.forOwn(source, function (property) {
      if (this.isObject(source[property])) {
        if (!target[property] || !this.isObject(target[property])) {
          target[property] = {}
        }
        this.extend(target[property], source[property])
      } else {
        target[property] = source[property]
      }
    }.bind(this))
    return target
  }

  Tools.prototype.extendClone = function (target, source) {
    return this.extend(this.extend({}, target), source)
  }

  Tools.prototype.isMobile = function () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  /**
   * Polyfills
   * --------
   */

  _requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }

  /**
   * Module Wrapper
   * --------------
   */
  if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    define(function () {
      return ScrollReveal
    })
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollReveal
  } else {
    window.ScrollReveal = ScrollReveal
  }
})();

},{}],2:[function(require,module,exports){
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Siema",[],t):"object"==typeof exports?exports.Siema=t():e.Siema=t()}(this,function(){return function(e){function t(s){if(i[s])return i[s].exports;var r=i[s]={i:s,l:!1,exports:{}};return e[s].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var i={};return t.m=e,t.c=i,t.i=function(e){return e},t.d=function(e,i,s){t.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:s})},t.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(i,"a",i),i},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,i){"use strict";function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n=function(){function e(e,t){for(var i=0;i<t.length;i++){var s=t[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,i,s){return i&&e(t.prototype,i),s&&e(t,s),t}}(),o=function(){function e(t){var i=this;s(this,e),this.config=e.mergeSettings(t),this.selector="string"==typeof this.config.selector?document.querySelector(this.config.selector):this.config.selector,this.selectorWidth=this.selector.offsetWidth,this.innerElements=[].slice.call(this.selector.children),this.currentSlide=this.config.startIndex,this.transformProperty=e.webkitOrNot(),["resizeHandler","touchstartHandler","touchendHandler","touchmoveHandler","mousedownHandler","mouseupHandler","mouseleaveHandler","mousemoveHandler"].forEach(function(e){i[e]=i[e].bind(i)}),this.init()}return n(e,[{key:"init",value:function(){if(window.addEventListener("resize",this.resizeHandler),this.config.draggable&&(this.pointerDown=!1,this.drag={startX:0,endX:0,startY:0,letItGo:null},this.selector.addEventListener("touchstart",this.touchstartHandler,{passive:!0}),this.selector.addEventListener("touchend",this.touchendHandler),this.selector.addEventListener("touchmove",this.touchmoveHandler,{passive:!0}),this.selector.addEventListener("mousedown",this.mousedownHandler),this.selector.addEventListener("mouseup",this.mouseupHandler),this.selector.addEventListener("mouseleave",this.mouseleaveHandler),this.selector.addEventListener("mousemove",this.mousemoveHandler)),null===this.selector)throw new Error("Something wrong with your selector 😭");this.resolveSlidesNumber(),this.selector.style.overflow="hidden",this.sliderFrame=document.createElement("div"),this.sliderFrame.style.width=this.selectorWidth/this.perPage*this.innerElements.length+"px",this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing,this.config.draggable&&(this.selector.style.cursor="-webkit-grab");for(var e=document.createDocumentFragment(),t=0;t<this.innerElements.length;t++){var i=document.createElement("div");i.style.cssFloat="left",i.style.float="left",i.style.width=100/this.innerElements.length+"%",i.appendChild(this.innerElements[t]),e.appendChild(i)}this.sliderFrame.appendChild(e),this.selector.innerHTML="",this.selector.appendChild(this.sliderFrame),this.slideToCurrent(),this.config.onInit.call(this)}},{key:"resolveSlidesNumber",value:function(){if("number"==typeof this.config.perPage)this.perPage=this.config.perPage;else if("object"===r(this.config.perPage)){this.perPage=1;for(var e in this.config.perPage)window.innerWidth>=e&&(this.perPage=this.config.perPage[e])}}},{key:"prev",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments[1];if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;0===this.currentSlide&&this.config.loop?this.currentSlide=this.innerElements.length-this.perPage:this.currentSlide=Math.max(this.currentSlide-e,0),i!==this.currentSlide&&(this.slideToCurrent(),this.config.onChange.call(this),t&&t.call(this))}}},{key:"next",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments[1];if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;this.currentSlide===this.innerElements.length-this.perPage&&this.config.loop?this.currentSlide=0:this.currentSlide=Math.min(this.currentSlide+e,this.innerElements.length-this.perPage),i!==this.currentSlide&&(this.slideToCurrent(),this.config.onChange.call(this),t&&t.call(this))}}},{key:"goTo",value:function(e,t){if(!(this.innerElements.length<=this.perPage)){var i=this.currentSlide;this.currentSlide=Math.min(Math.max(e,0),this.innerElements.length-this.perPage),i!==this.currentSlide&&(this.slideToCurrent(),this.config.onChange.call(this),t&&t.call(this))}}},{key:"slideToCurrent",value:function(){this.sliderFrame.style[this.transformProperty]="translate3d(-"+this.currentSlide*(this.selectorWidth/this.perPage)+"px, 0, 0)"}},{key:"updateAfterDrag",value:function(){var e=this.drag.endX-this.drag.startX,t=Math.abs(e),i=Math.ceil(t/(this.selectorWidth/this.perPage));e>0&&t>this.config.threshold&&this.innerElements.length>this.perPage?this.prev(i):e<0&&t>this.config.threshold&&this.innerElements.length>this.perPage&&this.next(i),this.slideToCurrent()}},{key:"resizeHandler",value:function(){this.resolveSlidesNumber(),this.selectorWidth=this.selector.offsetWidth,this.sliderFrame.style.width=this.selectorWidth/this.perPage*this.innerElements.length+"px",this.slideToCurrent()}},{key:"clearDrag",value:function(){this.drag={startX:0,endX:0,startY:0,letItGo:null}}},{key:"touchstartHandler",value:function(e){e.stopPropagation(),this.pointerDown=!0,this.drag.startX=e.touches[0].pageX,this.drag.startY=e.touches[0].pageY}},{key:"touchendHandler",value:function(e){e.stopPropagation(),this.pointerDown=!1,this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing,this.drag.endX&&this.updateAfterDrag(),this.clearDrag()}},{key:"touchmoveHandler",value:function(e){e.stopPropagation(),null===this.drag.letItGo&&(this.drag.letItGo=Math.abs(this.drag.startY-e.touches[0].pageY)<Math.abs(this.drag.startX-e.touches[0].pageX)),this.pointerDown&&this.drag.letItGo&&(this.drag.endX=e.touches[0].pageX,this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing,this.sliderFrame.style[this.transformProperty]="translate3d("+(this.currentSlide*(this.selectorWidth/this.perPage)+(this.drag.startX-this.drag.endX))*-1+"px, 0, 0)")}},{key:"mousedownHandler",value:function(e){e.preventDefault(),e.stopPropagation(),this.pointerDown=!0,this.drag.startX=e.pageX}},{key:"mouseupHandler",value:function(e){e.stopPropagation(),this.pointerDown=!1,this.selector.style.cursor="-webkit-grab",this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing,this.drag.endX&&this.updateAfterDrag(),this.clearDrag()}},{key:"mousemoveHandler",value:function(e){e.preventDefault(),this.pointerDown&&(this.drag.endX=e.pageX,this.selector.style.cursor="-webkit-grabbing",this.sliderFrame.style.webkitTransition="all 0ms "+this.config.easing,this.sliderFrame.style.transition="all 0ms "+this.config.easing,this.sliderFrame.style[this.transformProperty]="translate3d("+(this.currentSlide*(this.selectorWidth/this.perPage)+(this.drag.startX-this.drag.endX))*-1+"px, 0, 0)")}},{key:"mouseleaveHandler",value:function(e){this.pointerDown&&(this.pointerDown=!1,this.selector.style.cursor="-webkit-grab",this.drag.endX=e.pageX,this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing,this.updateAfterDrag(),this.clearDrag())}},{key:"updateFrame",value:function(){this.sliderFrame=document.createElement("div"),this.sliderFrame.style.width=this.selectorWidth/this.perPage*this.innerElements.length+"px",this.sliderFrame.style.webkitTransition="all "+this.config.duration+"ms "+this.config.easing,this.sliderFrame.style.transition="all "+this.config.duration+"ms "+this.config.easing,this.config.draggable&&(this.selector.style.cursor="-webkit-grab");for(var e=document.createDocumentFragment(),t=0;t<this.innerElements.length;t++){var i=document.createElement("div");i.style.cssFloat="left",i.style.float="left",i.style.width=100/this.innerElements.length+"%",i.appendChild(this.innerElements[t]),e.appendChild(i)}this.sliderFrame.appendChild(e),this.selector.innerHTML="",this.selector.appendChild(this.sliderFrame),this.slideToCurrent()}},{key:"remove",value:function(e,t){if(e<0||e>=this.innerElements.length)throw new Error("Item to remove doesn't exist 😭");this.innerElements.splice(e,1),this.currentSlide=e<=this.currentSlide?this.currentSlide-1:this.currentSlide,this.updateFrame(),t&&t.call(this)}},{key:"insert",value:function(e,t,i){if(t<0||t>this.innerElements.length+1)throw new Error("Unable to inset it at this index 😭");if(this.innerElements.indexOf(e)!==-1)throw new Error("The same item in a carousel? Really? Nope 😭");this.innerElements.splice(t,0,e),this.currentSlide=t<=this.currentSlide?this.currentSlide+1:this.currentSlide,this.updateFrame(),i&&i.call(this)}},{key:"prepend",value:function(e,t){this.insert(e,0),t&&t.call(this)}},{key:"append",value:function(e,t){this.insert(e,this.innerElements.length+1),t&&t.call(this)}},{key:"destroy",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments[1];if(window.removeEventListener("resize",this.resizeHandler),this.selector.style.cursor="auto",this.selector.removeEventListener("touchstart",this.touchstartHandler),this.selector.removeEventListener("touchend",this.touchendHandler),this.selector.removeEventListener("touchmove",this.touchmoveHandler),this.selector.removeEventListener("mousedown",this.mousedownHandler),this.selector.removeEventListener("mouseup",this.mouseupHandler),this.selector.removeEventListener("mouseleave",this.mouseleaveHandler),this.selector.removeEventListener("mousemove",this.mousemoveHandler),e){for(var i=document.createDocumentFragment(),s=0;s<this.innerElements.length;s++)i.appendChild(this.innerElements[s]);this.selector.innerHTML="",this.selector.appendChild(i),this.selector.removeAttribute("style")}t&&t.call(this)}}],[{key:"mergeSettings",value:function(e){var t={selector:".siema",duration:200,easing:"ease-out",perPage:1,startIndex:0,draggable:!0,threshold:20,loop:!1,onInit:function(){},onChange:function(){}},i=e;for(var s in i)t[s]=i[s];return t}},{key:"webkitOrNot",value:function(){var e=document.documentElement.style;return"string"==typeof e.transform?"transform":"WebkitTransform"}}]),e}();t.default=o,e.exports=t.default}])});
},{}],3:[function(require,module,exports){
'use strict';

var _scrollreveal = require('scrollreveal');

var _scrollreveal2 = _interopRequireDefault(_scrollreveal);

var _siema = require('siema');

var _siema2 = _interopRequireDefault(_siema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// scroll
window.sr = (0, _scrollreveal2.default)({
    duration: 300,
    reset: false,
    easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)'
});

// landing
sr.reveal('.js-landing-section', {
    delay: 550,
    duration: 300,
    distance: '80px',
    scale: 1,
    opaicty: 1,
    viewFactor: 0.00001
});

// start
sr.reveal('.start__name', { delay: 300, origin: 'top', distance: '50px' });
sr.reveal('.start__title', { delay: 200, origin: 'top', distance: '50px' });
sr.reveal('.start__step--first', { delay: 400, distance: '50px' });
sr.reveal('.start__step--second', { delay: 500, distance: '50px' });
sr.reveal('.start__step--third', { delay: 600, distance: '50px' });
sr.reveal('.start__divider', { delay: 800, distance: '0px' });
sr.reveal('.start__button', { delay: 800, distance: '100px' });

// steps
sr.reveal('.step-section__number', { delay: 300, distance: '0px' });
sr.reveal('.step-section__title', { delay: 200 });
sr.reveal('.js-screenshot-first', { delay: 200, duration: 700 });
sr.reveal('.js-screenshot-second', { delay: 200, duration: 700 });
sr.reveal('.js-screenshot-third', { delay: 200, duration: 700 });
sr.reveal('.step-section__text', { delay: 200 });
sr.reveal('.screenshot__dots', { delay: 200 });

// footer
sr.reveal('.footer__logo', { delay: 200, origin: 'top', distance: '50px' });
sr.reveal('.footer__description', { delay: 300, origin: 'top', distance: '50px' });
sr.reveal('.footer__try-button', { delay: 400, origin: 'top', distance: '50px' });
sr.reveal('.js-social-network1', { delay: 500, distance: '50px' });
sr.reveal('.js-social-network2', { delay: 600, distance: '50px' });
sr.reveal('.js-social-network3', { delay: 500, distance: '50px' });
sr.reveal('.js-social-network4', { delay: 600, distance: '50px' });
sr.reveal('.js-social-network5', { delay: 700, distance: '50px' });

// siema
var siema = new _siema2.default({
    selector: '.js-slider',
    duration: 500,
    easing: 'cubic-bezier(0.6, 0.2, 0.1, 1)',
    perPage: 1,
    startIndex: 0,
    threshold: 20,
    draggable: false,
    loop: false
});

var dots = [].map.call(document.querySelectorAll('.js-dot'), function (obj) {
    return obj;
});
var slides = [].map.call(document.querySelectorAll('.js-slide'), function (obj) {
    return obj;
});

var setActive = function setActive(collection, index) {
    var element = collection[index];
    var className = element.className;
    collection.map(function (el) {
        return el.classList.remove('active');
    });
    element.classList.toggle('active');
};

setActive(dots, 0);
setActive(slides, 0);

dots.map(function (dot, i) {
    dot.addEventListener('click', function () {
        setActive(dots, i);
        setActive(slides, i);
        return siema.goTo(i);
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfNWExYzgwNWIuanMiXSwibmFtZXMiOlsid2luZG93Iiwic3IiLCJkdXJhdGlvbiIsInJlc2V0IiwiZWFzaW5nIiwicmV2ZWFsIiwiZGVsYXkiLCJkaXN0YW5jZSIsInNjYWxlIiwib3BhaWN0eSIsInZpZXdGYWN0b3IiLCJvcmlnaW4iLCJzaWVtYSIsInNlbGVjdG9yIiwicGVyUGFnZSIsInN0YXJ0SW5kZXgiLCJ0aHJlc2hvbGQiLCJkcmFnZ2FibGUiLCJsb29wIiwiZG90cyIsIm1hcCIsImNhbGwiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJvYmoiLCJzbGlkZXMiLCJzZXRBY3RpdmUiLCJjb2xsZWN0aW9uIiwiaW5kZXgiLCJlbGVtZW50IiwiY2xhc3NOYW1lIiwiZWwiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJ0b2dnbGUiLCJkb3QiLCJpIiwiYWRkRXZlbnRMaXN0ZW5lciIsImdvVG8iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUE7QUFDQUEsT0FBT0MsRUFBUCxHQUFZLDRCQUFhO0FBQ3JCQyxjQUFVLEdBRFc7QUFFckJDLFdBQU8sS0FGYztBQUdyQkMsWUFBUTtBQUhhLENBQWIsQ0FBWjs7QUFNQTtBQUNBSCxHQUFHSSxNQUFILENBQVUscUJBQVYsRUFBaUM7QUFDN0JDLFdBQU8sR0FEc0I7QUFFN0JKLGNBQVUsR0FGbUI7QUFHN0JLLGNBQVUsTUFIbUI7QUFJN0JDLFdBQU8sQ0FKc0I7QUFLN0JDLGFBQVMsQ0FMb0I7QUFNN0JDLGdCQUFZO0FBTmlCLENBQWpDOztBQVNBO0FBQ0FULEdBQUdJLE1BQUgsQ0FBVSxjQUFWLEVBQTBCLEVBQUVDLE9BQU8sR0FBVCxFQUFjSyxRQUFRLEtBQXRCLEVBQTZCSixVQUFVLE1BQXZDLEVBQTFCO0FBQ0FOLEdBQUdJLE1BQUgsQ0FBVSxlQUFWLEVBQTJCLEVBQUVDLE9BQU8sR0FBVCxFQUFjSyxRQUFRLEtBQXRCLEVBQTZCSixVQUFVLE1BQXZDLEVBQTNCO0FBQ0FO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LFNBQVNDLGdCQUFULENBQTBCLFdBQTFCLENBQVosRUFBb0Q7QUFBQSxXQUFPQyxHQUFQO0FBQUEsQ0FBcEQsQ0FBZjs7QUFFQSxJQUFNRSxZQUFZLFNBQVpBLFNBQVksQ0FBQ0MsVUFBRCxFQUFhQyxLQUFiLEVBQXVCO0FBQ3JDLFFBQU1DLFVBQVVGLFdBQVdDLEtBQVgsQ0FBaEI7QUFDQSxRQUFNRSxZQUFZRCxRQUFRQyxTQUExQjtBQUNBSCxlQUFXUCxHQUFYLENBQWU7QUFBQSxlQUFNVyxHQUFHQyxTQUFILENBQWFDLE1BQWIsQ0FBb0IsUUFBcEIsQ0FBTjtBQUFBLEtBQWY7QUFDQUosWUFBUUcsU0FBUixDQUFrQkUsTUFBbEIsQ0FBeUIsUUFBekI7QUFDSCxDQUxEOztBQU9BUixVQUFVUCxJQUFWLEVBQWdCLENBQWhCO0FBQ0FPLFVBQVVELE1BQVYsRUFBa0IsQ0FBbEI7O0FBRUFOLEtBQUtDLEdBQUwsQ0FBUyxVQUFDZSxHQUFELEVBQU1DLENBQU4sRUFBWTtBQUNqQkQsUUFBSUUsZ0JBQUosQ0FBcUIsT0FBckIsRUFBOEIsWUFBTTtBQUNoQ1gsa0JBQVVQLElBQVYsRUFBZ0JpQixDQUFoQjtBQUNBVixrQkFBVUQsTUFBVixFQUFrQlcsQ0FBbEI7QUFDQSxlQUFPeEIsTUFBTTBCLElBQU4sQ0FBV0YsQ0FBWCxDQUFQO0FBQ0gsS0FKRDtBQUtILENBTkQiLCJmaWxlIjoiZmFrZV81YTFjODA1Yi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTY3JvbGxSZXZlYWwgZnJvbSAnc2Nyb2xscmV2ZWFsJztcbmltcG9ydCBTaWVtYSBmcm9tICdzaWVtYSc7XG5cbi8vIHNjcm9sbFxud2luZG93LnNyID0gU2Nyb2xsUmV2ZWFsKHtcbiAgICBkdXJhdGlvbjogMzAwLFxuICAgIHJlc2V0OiBmYWxzZSxcbiAgICBlYXNpbmc6ICdjdWJpYy1iZXppZXIoMC42LCAwLjIsIDAuMSwgMSknLFxufSk7XG5cbi8vIGxhbmRpbmdcbnNyLnJldmVhbCgnLmpzLWxhbmRpbmctc2VjdGlvbicsIHtcbiAgICBkZWxheTogNTUwLFxuICAgIGR1cmF0aW9uOiAzMDAsXG4gICAgZGlzdGFuY2U6ICc4MHB4JyxcbiAgICBzY2FsZTogMSxcbiAgICBvcGFpY3R5OiAxLFxuICAgIHZpZXdGYWN0b3I6IDAuMDAwMDFcbn0pO1xuXG4vLyBzdGFydFxuc3IucmV2ZWFsKCcuc3RhcnRfX25hbWUnLCB7IGRlbGF5OiAzMDAsIG9yaWdpbjogJ3RvcCcsIGRpc3RhbmNlOiAnNTBweCcgfSk7XG5zci5yZXZlYWwoJy5zdGFydF9fdGl0bGUnLCB7IGRlbGF5OiAyMDAsIG9yaWdpbjogJ3RvcCcsIGRpc3RhbmNlOiAnNTBweCcgfSk7XG5zci5yZXZlYWwoJy5zdGFydF9fc3RlcC0tZmlyc3QnLCB7IGRlbGF5OiA0MDAsIGRpc3RhbmNlOiAnNTBweCcgfSk7XG5zci5yZXZlYWwoJy5zdGFydF9fc3RlcC0tc2Vjb25kJywgeyBkZWxheTogNTAwLCBkaXN0YW5jZTogJzUwcHgnIH0pO1xuc3IucmV2ZWFsKCcuc3RhcnRfX3N0ZXAtLXRoaXJkJywgeyBkZWxheTogNjAwLCBkaXN0YW5jZTogJzUwcHgnIH0pO1xuc3IucmV2ZWFsKCcuc3RhcnRfX2RpdmlkZXInLCB7IGRlbGF5OiA4MDAsIGRpc3RhbmNlOiAnMHB4JyB9KTtcbnNyLnJldmVhbCgnLnN0YXJ0X19idXR0b24nLCB7IGRlbGF5OiA4MDAsIGRpc3RhbmNlOiAnMTAwcHgnIH0pO1xuXG4vLyBzdGVwc1xuc3IucmV2ZWFsKCcuc3RlcC1zZWN0aW9uX19udW1iZXInLCB7IGRlbGF5OiAzMDAsIGRpc3RhbmNlOiAnMHB4JyB9KTtcbnNyLnJldmVhbCgnLnN0ZXAtc2VjdGlvbl9fdGl0bGUnLCB7IGRlbGF5OiAyMDAgfSk7XG5zci5yZXZlYWwoJy5qcy1zY3JlZW5zaG90LWZpcnN0JywgeyBkZWxheTogMjAwLCBkdXJhdGlvbjogNzAwIH0pO1xuc3IucmV2ZWFsKCcuanMtc2NyZWVuc2hvdC1zZWNvbmQnLCB7IGRlbGF5OiAyMDAsIGR1cmF0aW9uOiA3MDAgfSk7XG5zci5yZXZlYWwoJy5qcy1zY3JlZW5zaG90LXRoaXJkJywgeyBkZWxheTogMjAwLCBkdXJhdGlvbjogNzAwIH0pO1xuc3IucmV2ZWFsKCcuc3RlcC1zZWN0aW9uX190ZXh0JywgeyBkZWxheTogMjAwIH0pO1xuc3IucmV2ZWFsKCcuc2NyZWVuc2hvdF9fZG90cycsIHsgZGVsYXk6IDIwMCB9KVxuXG4vLyBmb290ZXJcbnNyLnJldmVhbCgnLmZvb3Rlcl9fbG9nbycsIHsgZGVsYXk6IDIwMCwgb3JpZ2luOiAndG9wJywgZGlzdGFuY2U6ICc1MHB4JyB9KTtcbnNyLnJldmVhbCgnLmZvb3Rlcl9fZGVzY3JpcHRpb24nLCB7IGRlbGF5OiAzMDAsIG9yaWdpbjogJ3RvcCcsIGRpc3RhbmNlOiAnNTBweCcgfSk7XG5zci5yZXZlYWwoJy5mb290ZXJfX3RyeS1idXR0b24nLCB7IGRlbGF5OiA0MDAsIG9yaWdpbjogJ3RvcCcsIGRpc3RhbmNlOiAnNTBweCcgfSk7XG5zci5yZXZlYWwoJy5qcy1zb2NpYWwtbmV0d29yazEnLCB7IGRlbGF5OiA1MDAsIGRpc3RhbmNlOiAnNTBweCcgfSk7XG5zci5yZXZlYWwoJy5qcy1zb2NpYWwtbmV0d29yazInLCB7IGRlbGF5OiA2MDAsIGRpc3RhbmNlOiAnNTBweCcgfSk7XG5zci5yZXZlYWwoJy5qcy1zb2NpYWwtbmV0d29yazMnLCB7IGRlbGF5OiA1MDAsIGRpc3RhbmNlOiAnNTBweCcgfSk7XG5zci5yZXZlYWwoJy5qcy1zb2NpYWwtbmV0d29yazQnLCB7IGRlbGF5OiA2MDAsIGRpc3RhbmNlOiAnNTBweCcgfSk7XG5zci5yZXZlYWwoJy5qcy1zb2NpYWwtbmV0d29yazUnLCB7IGRlbGF5OiA3MDAsIGRpc3RhbmNlOiAnNTBweCcgfSk7XG5cbi8vIHNpZW1hXG5jb25zdCBzaWVtYSA9IG5ldyBTaWVtYSh7XG4gICAgc2VsZWN0b3I6ICcuanMtc2xpZGVyJyxcbiAgICBkdXJhdGlvbjogNTAwLFxuICAgIGVhc2luZzogJ2N1YmljLWJlemllcigwLjYsIDAuMiwgMC4xLCAxKScsXG4gICAgcGVyUGFnZTogMSxcbiAgICBzdGFydEluZGV4OiAwLFxuICAgIHRocmVzaG9sZDogMjAsXG4gICAgZHJhZ2dhYmxlOiBmYWxzZSxcbiAgICBsb29wOiBmYWxzZVxufSk7XG5cbmNvbnN0IGRvdHMgPSBbXS5tYXAuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtZG90JyksIG9iaiA9PiBvYmopO1xuY29uc3Qgc2xpZGVzID0gW10ubWFwLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXNsaWRlJyksIG9iaiA9PiBvYmopO1xuXG5jb25zdCBzZXRBY3RpdmUgPSAoY29sbGVjdGlvbiwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBlbGVtZW50ID0gY29sbGVjdGlvbltpbmRleF07XG4gICAgY29uc3QgY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWVcbiAgICBjb2xsZWN0aW9uLm1hcChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSk7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcbn1cblxuc2V0QWN0aXZlKGRvdHMsIDApO1xuc2V0QWN0aXZlKHNsaWRlcywgMCk7XG5cbmRvdHMubWFwKChkb3QsIGkpID0+IHtcbiAgICBkb3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIHNldEFjdGl2ZShkb3RzLCBpKTtcbiAgICAgICAgc2V0QWN0aXZlKHNsaWRlcywgaSk7XG4gICAgICAgIHJldHVybiBzaWVtYS5nb1RvKGkpO1xuICAgIH0pO1xufSkiXX0=
},{"scrollreveal":1,"siema":2}]},{},[3])