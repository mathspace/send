(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.send = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  // Unique ID creation requires a high quality random # generator.  In the
  // browser this is a little complicated due to unknown quality of Math.random()
  // and inconsistent support for the `crypto` API.  We do the best we can via
  // feature-detection
  var rng;
  var crypto = typeof commonjsGlobal !== 'undefined' && (commonjsGlobal.crypto || commonjsGlobal.msCrypto); // for IE 11

  if (crypto && crypto.getRandomValues) {
    // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
    var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

    rng = function whatwgRNG() {
      crypto.getRandomValues(rnds8);
      return rnds8;
    };
  }

  if (!rng) {
    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    var rnds = new Array(16);

    rng = function () {
      for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return rnds;
    };
  }

  var rngBrowser = rng;

  /**
   * Convert array of 16 byte values to UUID string format of the form:
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   */
  var byteToHex = [];

  for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
  }

  function bytesToUuid(buf, offset) {
    var i = offset || 0;
    var bth = byteToHex;
    return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]];
  }

  var bytesToUuid_1 = bytesToUuid;

  function v4(options, buf, offset) {
    var i = buf && offset || 0;

    if (typeof options == 'string') {
      buf = options == 'binary' ? new Array(16) : null;
      options = null;
    }

    options = options || {};
    var rnds = options.random || (options.rng || rngBrowser)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

    if (buf) {
      for (var ii = 0; ii < 16; ++ii) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || bytesToUuid_1(rnds);
  }

  var v4_1 = v4;

  // numbers and booleans too.

  var sendData = function sendData(url, data) {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, data);
    } else {
      var client = new XMLHttpRequest(); // Third parameter indicates sync xhr… yeah performance!

      client.open('POST', url, false);
      client.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
      client.send(data);
    }
  };

  var Analytics =
  /*#__PURE__*/
  function () {
    function Analytics(endpoint, writeKey) {
      _classCallCheck(this, Analytics);

      this.endpoint = endpoint;
      this.writeKey = writeKey;
      this.userId = v4_1();
    }

    _createClass(Analytics, [{
      key: "identify",
      value: function identify(userId) {
        this.userId = userId;
      }
    }, {
      key: "send",
      value: function send(type, properties) {
        var payload = {
          writeKey: this.writeKey,
          events: [{
            id: v4_1(),
            timestamp: new Date().toISOString(),
            user_id: this.userId,
            type: type,
            properties: properties
          }]
        };
        sendData(this.endpoint, JSON.stringify(payload));
      }
    }]);

    return Analytics;
  }();

  return Analytics;

})));
