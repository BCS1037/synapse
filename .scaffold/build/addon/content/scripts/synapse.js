"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/inherits/inherits_browser.js
  var require_inherits_browser = __commonJS({
    "node_modules/inherits/inherits_browser.js"(exports, module) {
      if (typeof Object.create === "function") {
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }
            });
          }
        };
      } else {
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function() {
            };
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
          }
        };
      }
    }
  });

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      var i;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1) validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer2;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = { foo: function() {
            return 42;
          } };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      Object.defineProperty(Buffer2.prototype, "parent", {
        enumerable: true,
        get: function() {
          if (!Buffer2.isBuffer(this)) return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer2.prototype, "offset", {
        enumerable: true,
        get: function() {
          if (!Buffer2.isBuffer(this)) return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer2.prototype);
        return buf;
      }
      function Buffer2(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      Buffer2.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer2.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b) return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      Buffer2.from = function(value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer2, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer2.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer2.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer2.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string, encoding) | 0;
        let buf = createBuffer(length);
        const actual = buf.write(string, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf[i] = array[i] & 255;
        }
        return buf;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new Uint8Array(array);
        } else if (length === void 0) {
          buf = new Uint8Array(array, byteOffset);
        } else {
          buf = new Uint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer2.prototype);
        return buf;
      }
      function fromObject(obj) {
        if (Buffer2.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf = createBuffer(len);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer2.alloc(+length);
      }
      Buffer2.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer2.prototype;
      };
      Buffer2.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array)) a = Buffer2.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array)) b = Buffer2.from(b, b.offset, b.byteLength);
        if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b) return 0;
        let x = a.length;
        let y = b.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer2.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      Buffer2.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer2.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer = Buffer2.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf = list[i];
          if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
              if (!Buffer2.isBuffer(buf)) buf = Buffer2.from(buf);
              buf.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf,
                pos
              );
            }
          } else if (!Buffer2.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer, pos);
          }
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer2.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0) return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer2.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding) encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer2.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer2.prototype.swap16 = function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };
      Buffer2.prototype.swap32 = function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer2.prototype.swap64 = function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer2.prototype.toString = function toString() {
        const length = this.length;
        if (length === 0) return "";
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
      Buffer2.prototype.equals = function equals(b) {
        if (!Buffer2.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return Buffer2.compare(this, b) === 0;
      };
      Buffer2.prototype.inspect = function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max) str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
      }
      Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer2.from(target, target.offset, target.byteLength);
        }
        if (!Buffer2.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0) return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;
          else return -1;
        }
        if (typeof val === "string") {
          val = Buffer2.from(val, encoding);
        }
        if (Buffer2.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i2) {
          if (indexSize === 1) {
            return buf[i2];
          } else {
            return buf.readUInt16BE(i2 * indexSize);
          }
        }
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer2.prototype.write = function write(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0) encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining) length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding) encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer2.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      function asciiSlice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 127);
        }
        return ret;
      }
      function latin1Slice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }
      function hexSlice(buf, start, end) {
        const len = buf.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf[i]];
        }
        return out;
      }
      function utf16leSlice(buf, start, end) {
        const bytes = buf.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      Buffer2.prototype.slice = function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start) end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer2.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      };
      Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      };
      Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer2.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer2.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let i = byteLength2;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128)) return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer2.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      });
      Buffer2.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + // Overflow
        this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      });
      Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer2.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      };
      Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      Buffer2.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer2.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
        if (value < 0) value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };
      Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0) value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      Buffer2.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer2.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer2.isBuffer(target)) throw new TypeError("argument should be a Buffer");
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      };
      Buffer2.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val) val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      };
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      function checkBounds(buf, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
          boundsError(offset, buf.length - (byteLength2 + 1));
        }
      }
      function checkIntBI(value, min, max, buf, offset, byteLength2) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf, offset, byteLength2);
      }
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      var hexSliceLookupTable = (function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
          }
        }
        return table;
      })();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    }
  });

  // node_modules/safe-buffer/index.js
  var require_safe_buffer = __commonJS({
    "node_modules/safe-buffer/index.js"(exports, module) {
      var buffer = require_buffer();
      var Buffer2 = buffer.Buffer;
      function copyProps(src, dst) {
        for (var key in src) {
          dst[key] = src[key];
        }
      }
      if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
        module.exports = buffer;
      } else {
        copyProps(buffer, exports);
        exports.Buffer = SafeBuffer;
      }
      function SafeBuffer(arg, encodingOrOffset, length) {
        return Buffer2(arg, encodingOrOffset, length);
      }
      SafeBuffer.prototype = Object.create(Buffer2.prototype);
      copyProps(Buffer2, SafeBuffer);
      SafeBuffer.from = function(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          throw new TypeError("Argument must not be a number");
        }
        return Buffer2(arg, encodingOrOffset, length);
      };
      SafeBuffer.alloc = function(size, fill, encoding) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        var buf = Buffer2(size);
        if (fill !== void 0) {
          if (typeof encoding === "string") {
            buf.fill(fill, encoding);
          } else {
            buf.fill(fill);
          }
        } else {
          buf.fill(0);
        }
        return buf;
      };
      SafeBuffer.allocUnsafe = function(size) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        return Buffer2(size);
      };
      SafeBuffer.allocUnsafeSlow = function(size) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        return buffer.SlowBuffer(size);
      };
    }
  });

  // node_modules/to-buffer/node_modules/isarray/index.js
  var require_isarray = __commonJS({
    "node_modules/to-buffer/node_modules/isarray/index.js"(exports, module) {
      var toString = {}.toString;
      module.exports = Array.isArray || function(arr) {
        return toString.call(arr) == "[object Array]";
      };
    }
  });

  // node_modules/es-errors/type.js
  var require_type = __commonJS({
    "node_modules/es-errors/type.js"(exports, module) {
      "use strict";
      module.exports = TypeError;
    }
  });

  // node_modules/es-object-atoms/index.js
  var require_es_object_atoms = __commonJS({
    "node_modules/es-object-atoms/index.js"(exports, module) {
      "use strict";
      module.exports = Object;
    }
  });

  // node_modules/es-errors/index.js
  var require_es_errors = __commonJS({
    "node_modules/es-errors/index.js"(exports, module) {
      "use strict";
      module.exports = Error;
    }
  });

  // node_modules/es-errors/eval.js
  var require_eval = __commonJS({
    "node_modules/es-errors/eval.js"(exports, module) {
      "use strict";
      module.exports = EvalError;
    }
  });

  // node_modules/es-errors/range.js
  var require_range = __commonJS({
    "node_modules/es-errors/range.js"(exports, module) {
      "use strict";
      module.exports = RangeError;
    }
  });

  // node_modules/es-errors/ref.js
  var require_ref = __commonJS({
    "node_modules/es-errors/ref.js"(exports, module) {
      "use strict";
      module.exports = ReferenceError;
    }
  });

  // node_modules/es-errors/syntax.js
  var require_syntax = __commonJS({
    "node_modules/es-errors/syntax.js"(exports, module) {
      "use strict";
      module.exports = SyntaxError;
    }
  });

  // node_modules/es-errors/uri.js
  var require_uri = __commonJS({
    "node_modules/es-errors/uri.js"(exports, module) {
      "use strict";
      module.exports = URIError;
    }
  });

  // node_modules/math-intrinsics/abs.js
  var require_abs = __commonJS({
    "node_modules/math-intrinsics/abs.js"(exports, module) {
      "use strict";
      module.exports = Math.abs;
    }
  });

  // node_modules/math-intrinsics/floor.js
  var require_floor = __commonJS({
    "node_modules/math-intrinsics/floor.js"(exports, module) {
      "use strict";
      module.exports = Math.floor;
    }
  });

  // node_modules/math-intrinsics/max.js
  var require_max = __commonJS({
    "node_modules/math-intrinsics/max.js"(exports, module) {
      "use strict";
      module.exports = Math.max;
    }
  });

  // node_modules/math-intrinsics/min.js
  var require_min = __commonJS({
    "node_modules/math-intrinsics/min.js"(exports, module) {
      "use strict";
      module.exports = Math.min;
    }
  });

  // node_modules/math-intrinsics/pow.js
  var require_pow = __commonJS({
    "node_modules/math-intrinsics/pow.js"(exports, module) {
      "use strict";
      module.exports = Math.pow;
    }
  });

  // node_modules/math-intrinsics/round.js
  var require_round = __commonJS({
    "node_modules/math-intrinsics/round.js"(exports, module) {
      "use strict";
      module.exports = Math.round;
    }
  });

  // node_modules/math-intrinsics/isNaN.js
  var require_isNaN = __commonJS({
    "node_modules/math-intrinsics/isNaN.js"(exports, module) {
      "use strict";
      module.exports = Number.isNaN || function isNaN2(a) {
        return a !== a;
      };
    }
  });

  // node_modules/math-intrinsics/sign.js
  var require_sign = __commonJS({
    "node_modules/math-intrinsics/sign.js"(exports, module) {
      "use strict";
      var $isNaN = require_isNaN();
      module.exports = function sign(number) {
        if ($isNaN(number) || number === 0) {
          return number;
        }
        return number < 0 ? -1 : 1;
      };
    }
  });

  // node_modules/gopd/gOPD.js
  var require_gOPD = __commonJS({
    "node_modules/gopd/gOPD.js"(exports, module) {
      "use strict";
      module.exports = Object.getOwnPropertyDescriptor;
    }
  });

  // node_modules/gopd/index.js
  var require_gopd = __commonJS({
    "node_modules/gopd/index.js"(exports, module) {
      "use strict";
      var $gOPD = require_gOPD();
      if ($gOPD) {
        try {
          $gOPD([], "length");
        } catch (e) {
          $gOPD = null;
        }
      }
      module.exports = $gOPD;
    }
  });

  // node_modules/es-define-property/index.js
  var require_es_define_property = __commonJS({
    "node_modules/es-define-property/index.js"(exports, module) {
      "use strict";
      var $defineProperty = Object.defineProperty || false;
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e) {
          $defineProperty = false;
        }
      }
      module.exports = $defineProperty;
    }
  });

  // node_modules/has-symbols/shams.js
  var require_shams = __commonJS({
    "node_modules/has-symbols/shams.js"(exports, module) {
      "use strict";
      module.exports = function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (var _ in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = (
            
    register(menuPopup, options, insertPosition = "after", anchorElement) {
      let popup;
      if (typeof menuPopup === "string") popup = this.getGlobal("document").querySelector(MenuSelector[menuPopup]);
      else popup = menuPopup;
      if (!popup) return false;
      const doc = popup.ownerDocument;
      const genMenuElement = (menuitemOption) => {
        const elementOption = {
          tag: menuitemOption.tag,
          id: menuitemOption.id,
          namespace: "xul",
          attributes: {
            label: menuitemOption.label || "",
            hidden: Boolean(menuitemOption.hidden),
            disabled: Boolean(menuitemOption.disabled),
            class: menuitemOption.class || "",
            oncommand: menuitemOption.oncommand || ""
          },
          classList: menuitemOption.classList,
          styles: menuitemOption.styles || {},
          listeners: [],
          children: []
        };
        if (menuitemOption.icon) {
          if (!this.getGlobal("Zotero").isMac) if (menuitemOption.tag === "menu") elementOption.attributes.class += " menu-iconic";
          else elementOption.attributes.class += " menuitem-iconic";
          elementOption.styles["list-style-image"] = `url(${menuitemOption.icon})`;
        }
        if (menuitemOption.commandListener) elementOption.listeners?.push({
          type: "command",
          listener: menuitemOption.commandListener
        });
        if (menuitemOption.tag === "menuitem") {
          elementOption.attributes.type = menuitemOption.type || "";
          elementOption.attributes.checked = menuitemOption.checked || false;
        }
        const menuItem = this.ui.createElement(doc, menuitemOption.tag, elementOption);
        if (menuitemOption.isHidden || menuitemOption.getVisibility) popup?.addEventListener("popupshowing", async (ev) => {
          let hidden;
          if (menuitemOption.isHidden) hidden = await menuitemOption.isHidden(menuItem, ev);
          else if (menuitemOption.getVisibility) {
            const visible = await menuitemOption.getVisibility(menuItem, ev);
            hidden = typeof visible === "undefined" ? void 0 : !visible;
          }
          if (typeof hidden === "undefined") return;
          if (hidden) menuItem.setAttribute("hidden", "true");
          else menuItem.removeAttribute("hidden");
        });
        if (menuitemOption.isDisabled) popup?.addEventListener("popupshowing", async (ev) => {
          const disabled = await menuitemOption.isDisabled(menuItem, ev);
          if (typeof disabled === "undefined") return;
          if (disabled) menuItem.setAttribute("disabled", "true");
          else menuItem.removeAttribute("disabled");
        });
        if ((menuitemOption.tag === "menuitem" || menuitemOption.tag === "menuseparator") && menuitemOption.onShowing) popup?.addEventListener("popupshowing", async (ev) => {
          await menuitemOption.onShowing(menuItem, ev);
        });
        if (menuitemOption.tag === "menu") {
          const subPopup = this.ui.createElement(doc, "menupopup", {
            id: menuitemOption.popupId,
            attributes: { onpopupshowing: menuitemOption.onpopupshowing || "" }
          });
          menuitemOption.children?.forEach((childOption) => {
            subPopup.append(genMenuElement(childOption));
          });
          menuItem.append(subPopup);
        }
        return menuItem;
      };
      const topMenuItem = genMenuElement(options);
      if (popup.childElementCount) {
        if (!anchorElement) anchorElement = insertPosition === "after" ? popup.lastElementChild : popup.firstElementChild;
        anchorElement[insertPosition](topMenuItem);
      } else popup.appendChild(topMenuItem);
    }
    unregister(menuId) {
      this.getGlobal("document").querySelector(`#${menuId}`)?.remove();
    }
    unregisterAll() {
      this.ui.unregisterAll();
    }
  };
  var MenuSelector = /* @__PURE__ */ (function(MenuSelector$1) {
    MenuSelector$1["menuFile"] = "#menu_FilePopup";
    MenuSelector$1["menuEdit"] = "#menu_EditPopup";
    MenuSelector$1["menuView"] = "#menu_viewPopup";
    MenuSelector$1["menuGo"] = "#menu_goPopup";
    MenuSelector$1["menuTools"] = "#menu_ToolsPopup";
    MenuSelector$1["menuHelp"] = "#menu_HelpPopup";
    MenuSelector$1["collection"] = "#zotero-collectionmenu";
    MenuSelector$1["item"] = "#zotero-itemmenu";
    return MenuSelector$1;
  })(MenuSelector || {});
  var Prompt = class {
    ui;
    base;
    get document() {
      return this.base.getGlobal("document");
    }
    /**
    * Record the last text entered
    */
    lastInputText = "";
    /**
    * Default text
    */
    defaultText = {
      placeholder: "Select a command...",
      empty: "No commands found."
    };
    /**
    * It controls the max line number of commands displayed in `commandsNode`.
    */
    maxLineNum = 12;
    /**
    * It controls the max number of suggestions.
    */
    maxSuggestionNum = 100;
    /**
    * The top-level HTML div node of `Prompt`
    */
    promptNode;
    /**
    * The HTML input node of `Prompt`.
    */
    inputNode;
    /**
    * Save all commands registered by all addons.
    */
    commands = [];
    /**
    * Initialize `Prompt` but do not create UI.
    */
    constructor() {
      this.base = new BasicTool();
      this.ui = new UITool();
      this.initializeUI();
    }
    /**
    * Initialize `Prompt` UI and then bind events on it.
    */
    initializeUI() {
      this.addStyle();
      this.createHTML();
      this.initInputEvents();
      this.registerShortcut();
    }
    createHTML() {
      this.promptNode = this.ui.createElement(this.document, "div", {
        styles: { display: "none" },
        children: [{
          tag: "div",
          styles: {
            position: "fixed",
            left: "0",
            top: "0",
            backgroundColor: "transparent",
            width: "100%",
            height: "100%"
          },
          listeners: [{
            type: "click",
            listener: () => {
              this.promptNode.style.display = "none";
            }
          }]
        }]
      });
      this.promptNode.appendChild(this.ui.createElement(this.document, "div", {
        id: `zotero-plugin-toolkit-prompt`,
        classList: ["prompt-container"],
        children: [
          {
            tag: "div",
            classList: ["input-container"],
            children: [{
              tag: "input",
              classList: ["prompt-input"],
              attributes: {
                type: "text",
                placeholder: this.defaultText.placeholder
              }
            }, {
              tag: "div",
              classList: ["cta"]
            }]
          },
          {
            tag: "div",
            classList: ["commands-containers"]
          },
          {
            tag: "div",
            classList: ["instructions"],
            children: [
              {
                tag: "div",
                classList: ["instruction"],
                children: [{
                  tag: "span",
                  classList: ["key"],
                  properties: { innerText: "\u2191\u2193" }
                }, {
                  tag: "span",
                  properties: { innerText: "to navigate" }
                }]
              },
              {
                tag: "div",
                classList: ["instruction"],
                children: [{
                  tag: "span",
                  classList: ["key"],
                  properties: { innerText: "enter" }
                }, {
                  tag: "span",
                  properties: { innerText: "to trigger" }
                }]
              },
              {
                tag: "div",
                classList: ["instruction"],
                children: [{
                  tag: "span",
                  classList: ["key"],
                  properties: { innerText: "esc" }
                }, {
                  tag: "span",
                  properties: { innerText: "to exit" }
                }]
              }
            ]
          }
        ]
      }));
      this.inputNode = this.promptNode.querySelector("input");
      this.document.documentElement.appendChild(this.promptNode);
    }
    /**
    * Show commands in a new `commandsContainer`
    * All other `commandsContainer` is hidden
    * @param commands Command[]
    * @param clear remove all `commandsContainer` if true
    */
    showCommands(commands, clear = false) {
      if (clear) this.promptNode.querySelectorAll(".commands-container").forEach((e) => e.remove());
      this.inputNode.placeholder = this.defaultText.placeholder;
      const commandsContainer = this.createCommandsContainer();
      for (const command of commands) {
        try {
          if (!command.name || command.when && !command.when()) continue;
        } catch {
          continue;
        }
        commandsContainer.appendChild(this.createCommandNode(command));
      }
    }
    /**
    * Create a `commandsContainer` div element, append to `commandsContainer` and hide others.
    * @returns commandsNode
    */
    createCommandsContainer() {
      const commandsContainer = this.ui.createElement(this.document, "div", { classList: ["commands-container"] });
      this.promptNode.querySelectorAll(".commands-container").forEach((e) => {
        e.style.display = "none";
      });
      this.promptNode.querySelector(".commands-containers").appendChild(commandsContainer);
      return commandsContainer;
    }
    /**
    * Return current displayed `commandsContainer`
    * @returns
    */
    getCommandsContainer() {
      return [...Array.from(this.promptNode.querySelectorAll(".commands-container"))].find((e) => {
        return e.style.display !== "none";
      });
    }
    /**
    * Create a command item for `Prompt` UI.
    * @param command
    * @returns
    */
    createCommandNode(command) {
      const commandNode = this.ui.createElement(this.document, "div", {
        classList: ["command"],
        children: [{
          tag: "div",
          classList: ["content"],
          children: [{
            tag: "div",
            classList: ["name"],
            children: [{
              tag: "span",
              properties: { innerText: command.name }
            }]
          }, {
            tag: "div",
            classList: ["aux"],
            children: command.label ? [{
              tag: "span",
              classList: ["label"],
              properties: { innerText: command.label }
            }] : []
          }]
        }],
        listeners: [{
          type: "mousemove",
          listener: () => {
            this.selectItem(commandNode);
          }
        }, {
          type: "click",
          listener: async () => {
            await this.execCallback(command.callback);
          }
        }]
      });
      commandNode.command = command;
      return commandNode;
    }
    /**
    * Called when `enter` key is pressed.
    */
    trigger() {
      [...Array.from(this.promptNode.querySelectorAll(".commands-container"))].find((e) => e.style.display !== "none").querySelector(".selected").click();
    }
    /**
    * Called when `escape` key is pressed.
    */
    exit() {
      this.inputNode.placeholder = this.defaultText.placeholder;
      if (this.promptNode.querySelectorAll(".commands-containers .commands-container").length >= 2) {
        this.promptNode.querySelector(".commands-container:last-child").remove();
        const commandsContainer = this.promptNode.querySelector(".commands-container:last-child");
        commandsContainer.style.display = "";
        commandsContainer.querySelectorAll(".commands").forEach((e) => e.style.display = "flex");
        this.inputNode.focus();
      } else this.promptNode.style.display = "none";
    }
    async execCallback(callback) {
      if (Array.isArray(callback)) this.showCommands(callback);
      else await callback(this);
    }
    /**
    * Match suggestions for user's entered text.
    */
    async showSuggestions(inputText) {
      const _w = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]/;
      const jw = /\s/;
      const Ww = /[\u0F00-\u0FFF\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF66-\uFF9F]/;
      function Yw(e$1, t, n, i) {
        if (e$1.length === 0) return 0;
        let r = 0;
        r -= Math.max(0, e$1.length - 1), r -= i / 10;
        const o = e$1[0][0];
        return r -= (e$1[e$1.length - 1][1] - o + 1 - t) / 100, r -= o / 1e3, r -= n / 1e4;
      }
      function $w(e$1, t, n, i) {
        if (e$1.length === 0) return null;
        for (var r = n.toLowerCase(), o = 0, a = 0, s = [], l = 0; l < e$1.length; l++) {
          const c = e$1[l];
          const u = r.indexOf(c, a);
          if (u === -1) return null;
          const h = n.charAt(u);
          if (u > 0 && !_w.test(h) && !Ww.test(h)) {
            const p = n.charAt(u - 1);
            if (h.toLowerCase() !== h && p.toLowerCase() !== p || h.toUpperCase() !== h && !_w.test(p) && !jw.test(p) && !Ww.test(p)) if (i) {
              if (u !== a) {
                a += c.length, l--;
                continue;
              }
            } else o += 1;
          }
          if (s.length === 0) s.push([u, u + c.length]);
          else {
            const d = s[s.length - 1];
            d[1] < u ? s.push([u, u + c.length]) : d[1] = u + c.length;
          }
          a = u + c.length;
        }
        return {
          matches: s,
          score: Yw(s, t.length, r.length, o)
        };
      }
      function Gw(e$1) {
        for (var t = e$1.toLowerCase(), n = [], i = 0, r = 0; r < t.length; r++) {
          const o = t.charAt(r);
          jw.test(o) ? (i !== r && n.push(t.substring(i, r)), i = r + 1) : (_w.test(o) || Ww.test(o)) && (i !== r && n.push(t.substring(i, r)), n.push(o), i = r + 1);
        }
        return i !== t.length && n.push(t.substring(i, t.length)), {
          query: e$1,
          tokens: n,
          fuzzy: t.split("")
        };
      }
      function Xw(e$1, t) {
        if (e$1.query === "") return {
          score: 0,
          matches: []
        };
        const n = $w(e$1.tokens, e$1.query, t, false);
        return n || $w(e$1.fuzzy, e$1.query, t, true);
      }
      const e = Gw(inputText);
      let container = this.getCommandsContainer();
      if (container.classList.contains("suggestions")) this.exit();
      if (inputText.trim() == "") return true;
      const suggestions = [];
      this.getCommandsContainer().querySelectorAll(".command").forEach((commandNode) => {
        const spanNode = commandNode.querySelector(".name span");
        const spanText = spanNode.innerText;
        const res = Xw(e, spanText);
        if (res) {
          commandNode = this.createCommandNode(commandNode.command);
          let spanHTML = "";
          let i = 0;
          for (let j = 0; j < res.matches.length; j++) {
            const [start, end] = res.matches[j];
            if (start > i) spanHTML += spanText.slice(i, start);
            spanHTML += `<span class="highlight">${spanText.slice(start, end)}</span>`;
            i = end;
          }
          if (i < spanText.length) spanHTML += spanText.slice(i, spanText.length);
          commandNode.querySelector(".name span").innerHTML = spanHTML;
          suggestions.push({
            score: res.score,
            commandNode
          });
        }
      });
      if (suggestions.length > 0) {
        suggestions.sort((a, b) => b.score - a.score).slice(this.maxSuggestionNum);
        container = this.createCommandsContainer();
        container.classList.add("suggestions");
        suggestions.forEach((suggestion) => {
          container.appendChild(suggestion.commandNode);
        });
        return true;
      } else {
        const anonymousCommand = this.commands.find((c) => !c.name && (!c.when || c.when()));
        if (anonymousCommand) await this.execCallback(anonymousCommand.callback);
        else this.showTip(this.defaultText.empty);
        return false;
      }
    }
    /**
    * Bind events of pressing `keydown` and `keyup` key.
    */
    initInputEvents() {
      this.promptNode.addEventListener("keydown", (event) => {
        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
          event.preventDefault();
          let selectedIndex;
          const allItems = [...Array.from(this.getCommandsContainer().querySelectorAll(".command"))].filter((e) => e.style.display != "none");
          selectedIndex = allItems.findIndex((e) => e.classList.contains("selected"));
          if (selectedIndex != -1) {
            allItems[selectedIndex].classList.remove("selected");
            selectedIndex += event.key == "ArrowUp" ? -1 : 1;
          } else if (event.key == "ArrowUp") selectedIndex = allItems.length - 1;
          else selectedIndex = 0;
          if (selectedIndex == -1) selectedIndex = allItems.length - 1;
          else if (selectedIndex == allItems.length) selectedIndex = 0;
          allItems[selectedIndex].classList.add("selected");
          const commandsContainer = this.getCommandsContainer();
          commandsContainer.scrollTo(0, commandsContainer.querySelector(".selected").offsetTop - commandsContainer.offsetHeight + 7.5);
          allItems[selectedIndex].classList.add("selected");
        }
      });
      this.promptNode.addEventListener("keyup", async (event) => {
        if (event.key == "Enter") this.trigger();
        else if (event.key == "Escape") if (this.inputNode.value.length > 0) this.inputNode.value = "";
        else this.exit();
        else if (["ArrowUp", "ArrowDown"].includes(event.key)) return;
        const currentInputText = this.inputNode.value;
        if (currentInputText == this.lastInputText) return;
        this.lastInputText = currentInputText;
        window.setTimeout(async () => {
          await this.showSuggestions(currentInputText);
        });
      });
    }
    /**
    * Create a commandsContainer and display a text
    */
    showTip(text) {
      const tipNode = this.ui.createElement(this.document, "div", {
        classList: ["tip"],
        properties: { innerText: text }
      });
      const container = this.createCommandsContainer();
      container.classList.add("suggestions");
      container.appendChild(tipNode);
      return tipNode;
    }
    /**
    * Mark the selected item with class `selected`.
    * @param item HTMLDivElement
    */
    selectItem(item) {
      this.getCommandsContainer().querySelectorAll(".command").forEach((e) => e.classList.remove("selected"));
      item.classList.add("selected");
    }
    addStyle() {
      const style$1 = this.ui.createElement(this.document, "style", {
        namespace: "html",
        id: "prompt-style"
      });
      style$1.innerText = `
      .prompt-container * {
        box-sizing: border-box;
      }
      .prompt-container {
        ---radius---: 10px;
        position: fixed;
        left: 25%;
        top: 10%;
        width: 50%;
        border-radius: var(---radius---);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        box-shadow: 0px 1.8px 7.3px rgba(0, 0, 0, 0.071),
                    0px 6.3px 24.7px rgba(0, 0, 0, 0.112),
                    0px 30px 90px rgba(0, 0, 0, 0.2);
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Microsoft YaHei Light", sans-serif;
        background-color: var(--material-background) !important;
        border: var(--material-border-quarternary) !important;
      }
      
      /* input */
      .prompt-container .input-container  {
        width: 100%;
      }

      .input-container input {
        width: -moz-available;
        height: 40px;
        padding: 24px;
        border: none;
        outline: none;
        font-size: 18px;
        margin: 0 !important;
        border-radius: var(---radius---);
        background-color: var(--material-background);
      }
      
      .input-container .cta {
        border-bottom: var(--material-border-quarternary);
        margin: 5px auto;
      }
      
      /* results */
      .commands-containers {
        width: 100%;
        height: 100%;
      }
      .commands-container {
        max-height: calc(${this.maxLineNum} * 35.5px);
        width: calc(100% - 12px);
        margin-left: 12px;
        margin-right: 0%;
        overflow-y: auto;
        overflow-x: hidden;
      }
      
      .commands-container .command {
        display: flex;
        align-content: baseline;
        justify-content: space-between;
        border-radius: 5px;
        padding: 6px 12px;
        margin-right: 12px;
        margin-top: 2px;
        margin-bottom: 2px;
      }
      .commands-container .command .content {
        display: flex;
        width: 100%;
        justify-content: space-between;
        flex-direction: row;
        overflow: hidden;
      }
      .commands-container .command .content .name {
        white-space: nowrap; 
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .commands-container .command .content .aux {
        display: flex;
        align-items: center;
        align-self: center;
        flex-shrink: 0;
      }
      
      .commands-container .command .content .aux .label {
        font-size: 15px;
        color: var(--fill-primary);
        padding: 2px 6px;
        background-color: var(--color-background);
        border-radius: 5px;
      }
      
      .commands-container .selected {
          background-color: var(--material-mix-quinary);
      }

      .commands-container .highlight {
        font-weight: bold;
      }

      .tip {
        color: var(--fill-primary);
        text-align: center;
        padding: 12px 12px;
        font-size: 18px;
      }

      /* instructions */
      .instructions {
        display: flex;
        align-content: center;
        justify-content: center;
        font-size: 15px;
        height: 2.5em;
        width: 100%;
        border-top: var(--material-border-quarternary);
        color: var(--fill-secondary);
        margin-top: 5px;
      }
      
      .instructions .instruction {
        margin: auto .5em;  
      }
      
      .instructions .key {
        margin-right: .2em;
        font-weight: 600;
      }
    `;
      this.document.documentElement.appendChild(style$1);
    }
    registerShortcut() {
      this.document.addEventListener("keydown", (event) => {
        if (event.shiftKey && event.key.toLowerCase() == "p") {
          if (event.originalTarget.isContentEditable || "value" in event.originalTarget || this.commands.length == 0) return;
          event.preventDefault();
          event.stopPropagation();
          if (this.promptNode.style.display == "none") {
            this.promptNode.style.display = "flex";
            if (this.promptNode.querySelectorAll(".commands-container").length == 1) this.showCommands(this.commands, true);
            this.promptNode.focus();
            this.inputNode.focus();
          } else this.promptNode.style.display = "none";
        }
      }, true);
    }
  };
  var PromptManager = class extends ManagerTool {
    prompt;
    /**
    * Save the commands registered from this manager
    */
    commands = [];
    constructor(base) {
      super(base);
      const globalCache = toolkitGlobal_default.getInstance()?.prompt;
      if (!globalCache) throw new Error("Prompt is not initialized.");
      if (!globalCache._ready) {
        globalCache._ready = true;
        globalCache.instance = new Prompt();
      }
      this.prompt = globalCache.instance;
    }
    /**
    * Register commands. Don't forget to call `unregister` on plugin exit.
    * @param commands Command[]
    * @example
    * ```ts
    * let getReader = () => {
    *   return BasicTool.getZotero().Reader.getByTabID(
    *     (Zotero.getMainWindow().Zotero_Tabs).selectedID
    *   )
    * }
    *
    * register([
    *   {
    *     name: "Split Horizontally",
    *     label: "Zotero",
    *     when: () => getReader() as boolean,
    *     callback: (prompt: Prompt) => getReader().menuCmd("splitHorizontally")
    *   },
    *   {
    *     name: "Split Vertically",
    *     label: "Zotero",
    *     when: () => getReader() as boolean,
    *     callback: (prompt: Prompt) => getReader().menuCmd("splitVertically")
    *   }
    * ])
    * ```
    */
    register(commands) {
      commands.forEach((c) => c.id ??= c.name);
      this.prompt.commands = [...this.prompt.commands, ...commands];
      this.commands = [...this.commands, ...commands];
      this.prompt.showCommands(this.commands, true);
    }
    /**
    * You can delete a command registed before by its name.
    * @remarks
    * There is a premise here that the names of all commands registered by a single plugin are not duplicated.
    * @param id Command.name
    */
    unregister(id) {
      this.prompt.commands = this.prompt.commands.filter((c) => c.id != id);
      this.commands = this.commands.filter((c) => c.id != id);
    }
    /**
    * Call `unregisterAll` on plugin exit.
    */
    unregisterAll() {
      this.prompt.commands = this.prompt.commands.filter((c) => {
        return this.commands.every((_c) => _c.id != c.id);
      });
      this.commands = [];
    }
  };
  var ExtraFieldTool = class extends BasicTool {
    /**
    * Get all extra fields
    * @param item
    */
    getExtraFields(item, backend = "custom") {
      const extraFiledRaw = item.getField("extra");
      if (backend === "default") return this.getGlobal("Zotero").Utilities.Internal.extractExtraFields(extraFiledRaw).fields;
      else {
        const map = /* @__PURE__ */ new Map();
        const nonStandardFields = [];
        extraFiledRaw.split("\n").forEach((line) => {
          const split = line.split(": ");
          if (split.length >= 2 && split[0]) map.set(split[0], split.slice(1).join(": "));
          else nonStandardFields.push(line);
        });
        map.set("__nonStandard__", nonStandardFields.join("\n"));
        return map;
      }
    }
    /**
    * Get extra field value by key. If it does not exists, return undefined.
    * @param item
    * @param key
    */
    getExtraField(item, key) {
      const fields = this.getExtraFields(item);
      return fields.get(key);
    }
    /**
    * Replace extra field of an item.
    * @param item
    * @param fields
    */
    async replaceExtraFields(item, fields) {
      const kvs = [];
      if (fields.has("__nonStandard__")) {
        kvs.push(fields.get("__nonStandard__"));
        fields.delete("__nonStandard__");
      }
      fields.forEach((v, k) => {
        kvs.push(`${k}: ${v}`);
      });
      item.setField("extra", kvs.join("\n"));
      await item.saveTx();
    }
    /**
    * Set an key-value pair to the item's extra field
    * @param item
    * @param key
    * @param value
    */
    async setExtraField(item, key, value) {
      const fields = this.getExtraFields(item);
      if (value === "" || typeof value === "undefined") fields.delete(key);
      else fields.set(key, value);
      await this.replaceExtraFields(item, fields);
    }
  };
  var ReaderTool = class extends BasicTool {
    /**
    * Get the selected tab reader.
    * @param waitTime Wait for n MS until the reader is ready
    */
    async getReader(waitTime = 5e3) {
      const Zotero_Tabs = this.getGlobal("Zotero_Tabs");
      if (Zotero_Tabs.selectedType !== "reader") return void 0;
      let reader = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID);
      let delayCount = 0;
      const checkPeriod = 50;
      while (!reader && delayCount * checkPeriod < waitTime) {
        await new Promise((resolve) => setTimeout(resolve, checkPeriod));
        reader = Zotero.Reader.getByTabID(Zotero_Tabs.selectedID);
        delayCount++;
      }
      await reader?._initPromise;
      return reader;
    }
    /**
    * Get all window readers.
    */
    getWindowReader() {
      const Zotero_Tabs = this.getGlobal("Zotero_Tabs");
      const windowReaders = [];
      const tabs = Zotero_Tabs._tabs.map((e) => e.id);
      for (let i = 0; i < Zotero.Reader._readers.length; i++) {
        let flag = false;
        for (let j = 0; j < tabs.length; j++) if (Zotero.Reader._readers[i].tabID === tabs[j]) {
          flag = true;
          break;
        }
        if (!flag) windowReaders.push(Zotero.Reader._readers[i]);
      }
      return windowReaders;
    }
    /**
    * Get Reader tabpanel deck element.
    * @deprecated - use item pane api
    * @alpha
    */
    getReaderTabPanelDeck() {
      const deck = this.getGlobal("window").document.querySelector(".notes-pane-deck")?.previousElementSibling;
      return deck;
    }
    /**
    * Add a reader tabpanel deck selection change observer.
    * @deprecated - use item pane api
    * @alpha
    * @param callback
    */
    async addReaderTabPanelDeckObserver(callback) {
      await waitUtilAsync(() => !!this.getReaderTabPanelDeck());
      const deck = this.getReaderTabPanelDeck();
      const observer = new (this.getGlobal("MutationObserver"))(async (mutations) => {
        mutations.forEach(async (mutation) => {
          const target = mutation.target;
          if (target.classList.contains("zotero-view-tabbox") || target.tagName === "deck") callback();
        });
      });
      observer.observe(deck, {
        attributes: true,
        attributeFilter: ["selectedIndex"],
        subtree: true
      });
      return observer;
    }
    /**
    * Get the selected annotation data.
    * @param reader Target reader
    * @returns The selected annotation data.
    */
    getSelectedAnnotationData(reader) {
      const annotation = reader?._internalReader._lastView._selectionPopup?.annotation;
      return annotation;
    }
    /**
    * Get the text selection of reader.
    * @param reader Target reader
    * @returns The text selection of reader.
    */
    getSelectedText(reader) {
      return this.getSelectedAnnotationData(reader)?.text ?? "";
    }
  };
  var ZoteroToolkit = class extends BasicTool {
    static _version = BasicTool._version;
    UI = new UITool(this);
    Reader = new ReaderTool(this);
    ExtraField = new ExtraFieldTool(this);
    FieldHooks = new FieldHookManager(this);
    Keyboard = new KeyboardManager(this);
    Prompt = new PromptManager(this);
    Menu = new MenuManager(this);
    Clipboard = makeHelperTool(ClipboardHelper, this);
    FilePicker = makeHelperTool(FilePickerHelper, this);
    Patch = makeHelperTool(PatchHelper, this);
    ProgressWindow = makeHelperTool(ProgressWindowHelper, this);
    VirtualizedTable = makeHelperTool(VirtualizedTableHelper, this);
    Dialog = makeHelperTool(DialogHelper, this);
    LargePrefObject = makeHelperTool(LargePrefHelper, this);
    Guide = makeHelperTool(GuideHelper, this);
    constructor() {
      super();
    }
    /**
    * Unregister everything created by managers.
    */
    unregisterAll() {
      unregister(this);
    }
  };

  // package.json
  var package_default = {
    name: "Synapse",
    type: "module",
    version: "1.0.5",
    description: "Synapse for Zotero 8: Create mdnotes file, templates, and Obsidian integration",
    config: {
      addonName: "Synapse",
      addonID: "synapse@bcs1037.github.io",
      addonRef: "synapse",
      addonInstance: "Synapse",
      prefsPrefix: "extensions.synapse"
    },
    repository: {
      type: "git",
      url: "git+https://github.com/BCS1037/synapse.git"
    },
    author: "BCS1037",
    bugs: {
      url: "https://github.com/BCS1037/synapse/issues"
    },
    homepage: "https://github.com/BCS1037/synapse",
    license: "AGPL-3.0-or-later",
    scripts: {
      start: "NO_UPDATE_NOTIFIER=1 zotero-start",
      build: `node -e "try{require('fs').rmSync('gen/version.json')}catch(e){}" && NO_UPDATE_NOTIFIER=1 zotero-plugin build && NO_UPDATE_NOTIFIER=1 zp-zipup .scaffold/build Synapse && node scripts/postbuild-clean.js && tsc --noEmit`,
      "lint:check": "prettier --check . && eslint .",
      "lint:fix": "prettier --write . && eslint . --fix",
      release: "NO_UPDATE_NOTIFIER=1 zp-release",
      test: "NO_UPDATE_NOTIFIER=1 zotero-plugin test",
      "update-deps": "npm update --save"
    },
    dependencies: {
      "sha.js": "^2.4.11",
      turndown: "^7.1.2",
      "zotero-plugin-toolkit": "^5.1.0-beta.4"
    },
    devDependencies: {
      "@types/chai": "^5.2.2",
      "@types/mocha": "^10.0.10",
      "@types/node": "^24.2.0",
      "@zotero-plugin/eslint-config": "^0.6.7",
      chai: "^5.2.1",
      eslint: "^9.32.0",
      mocha: "^11.7.1",
      prettier: "^3.6.2",
      typescript: "^5.9.2",
      "zotero-plugin": "^6.4.0",
      "zotero-plugin-scaffold": "^0.8.0",
      "zotero-types": "^4.1.0-beta.1"
    },
    prettier: {
      printWidth: 80,
      tabWidth: 2,
      endOfLine: "lf",
      overrides: [
        {
          files: [
            "*.xhtml"
          ],
          options: {
            htmlWhitespaceSensitivity: "css"
          }
        }
      ]
    },
    zotero: {
      updateJSON: "",
      engines: {
        zotero: ">=7.0.0"
      }
    }
  };

  // src/utils/locale.ts
  var config = package_default.config;
  function initLocale() {
    const l10n = new (typeof Localization === "undefined" ? ztoolkit.getGlobal("Localization") : Localization)([`${config.addonRef}-addon.ftl`], true);
    addon.data.locale = {
      current: l10n
    };
  }
  function getString(...inputs) {
    if (inputs.length === 1) {
      return _getString(inputs[0]);
    } else if (inputs.length === 2) {
      if (typeof inputs[1] === "string") {
        return _getString(inputs[0], { branch: inputs[1] });
      } else {
        return _getString(inputs[0], inputs[1]);
      }
    } else {
      throw new Error("Invalid arguments");
    }
  }
  function _getString(localeString, options = {}) {
    const localStringWithPrefix = localeString.startsWith(
      `${config.addonRef}-`
    ) ? localeString : `${config.addonRef}-${localeString}`;
    const { branch, args } = options;
    const pattern = addon.data.locale?.current.formatMessagesSync([
      { id: localStringWithPrefix, args }
    ])[0];
    if (!pattern) {
      return localStringWithPrefix;
    }
    if (branch && pattern.attributes) {
      for (const attr of pattern.attributes) {
        if (attr.name === branch) {
          return attr.value;
        }
      }
      return pattern.attributes?.[branch] || localStringWithPrefix;
    } else {
      return pattern.value || localStringWithPrefix;
    }
  }

  // src/utils/prefs.ts
  var config2 = package_default.config;
  var PREFS_PREFIX = config2.prefsPrefix;
  function getPref(key) {
    return Zotero.Prefs.get(`${PREFS_PREFIX}.${key}`, true);
  }
  function getPrefRaw(key) {
    return Zotero.Prefs.get(`${PREFS_PREFIX}.${key}`, true);
  }
  function setPrefRaw(key, value) {
    return Zotero.Prefs.set(`${PREFS_PREFIX}.${key}`, value, true);
  }
  function setPref(key, value) {
    return Zotero.Prefs.set(`${PREFS_PREFIX}.${key}`, value, true);
  }
  function getBoolPref(key, def = false) {
    const v = Zotero.Prefs.get(`${PREFS_PREFIX}.${key}`, true);
    return typeof v === "boolean" ? v : !!def;
  }
  async function migratePrefsPrefix(oldPrefix, newPrefix, keys) {
    try {
      for (const key of keys) {
        const oldVal = Zotero.Prefs.get(`${oldPrefix}.${key}`, true);
        if (typeof oldVal === "undefined" || oldVal === null) continue;
        Zotero.Prefs.set(`${newPrefix}.${key}`, oldVal, true);
      }
    } catch {
    }
  }
  async function migrateMdnotesToSynapse() {
    const keys = [
      // directories & templates
      "directory",
      "templates.directory",
      "template.default",
      "templates.include_empty_placeholders",
      // file naming
      "filename.template",
      "attach_to_zotero",
      "create_notes_file",
      // file organization
      "file_conf",
      "files.zotero.metadata.prefix",
      "files.zotero.metadata.suffix",
      "files.zotero.note.prefix",
      "files.zotero.note.suffix",
      "files.mdnotes.hub.prefix",
      "files.mdnotes.hub.suffix",
      // frontmatter
      "frontmatter.fields",
      "frontmatter.enabled",
      "frontmatter.format",
      // placeholders
      "placeholder.title",
      "placeholder.abstractNote",
      "placeholder.author",
      "placeholder.collections",
      "placeholder.related",
      "placeholder.notes",
      "placeholder.tags",
      "placeholder.url",
      "placeholder.DOI",
      "placeholder.cloudLibrary",
      "placeholder.localLibrary",
      "placeholder.noteContent",
      // HTML → Markdown rules
      "html.strong",
      "html.em",
      "html.strikethrough",
      "html.underline",
      "html.bullet",
      // Obsidian integration
      "obsidian.attach_obsidian_uri",
      "obsidian.block_ids",
      "obsidian.vault",
      "obsidian.dir"
    ];
    await migratePrefsPrefix("extensions.mdnotes", "extensions.synapse", keys);
  }

  // src/modules/preferenceScript.ts
  var config3 = package_default.config;
  function registerPrefsScripts(win) {
    if (!addon.data.prefs) {
      addon.data.prefs = { window: win };
    } else {
      addon.data.prefs.window = win;
    }
    initPrefsUI();
    bindPrefEvents();
  }
  function initPrefsUI() {
    const win = addon.data.prefs?.window;
    if (!win) return;
    const dirInput = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-directory`
    );
    if (dirInput) {
      dirInput.value = getPref("directory") || "";
    }
    const tplDirInput = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-templates-dir`
    );
    if (tplDirInput) {
      tplDirInput.value = getPref("templates.directory") || "";
    }
    const htmlStrong = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-html-strong`
    );
    if (htmlStrong) {
      htmlStrong.checked = !!getPrefRaw("html.strong");
    }
    const htmlEm = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-html-em`
    );
    if (htmlEm) {
      htmlEm.checked = !!getPrefRaw("html.em");
    }
    const htmlStrike = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-html-strikethrough`
    );
    if (htmlStrike) {
      htmlStrike.checked = !!getPrefRaw("html.strikethrough");
    }
    const htmlUnderline = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-html-underline`
    );
    if (htmlUnderline) {
      htmlUnderline.checked = !!getPrefRaw("html.underline");
    }
    const htmlBullet = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-html-bullet`
    );
    if (htmlBullet) {
      htmlBullet.checked = !!getPrefRaw("html.bullet");
    }
    const obsidianAttachUri = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-obsidian-attach-uri`
    );
    if (obsidianAttachUri) {
      obsidianAttachUri.checked = !!getPrefRaw("obsidian.attach_obsidian_uri");
    }
    const obsidianBlockIds = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-obsidian-block-ids`
    );
    if (obsidianBlockIds) {
      obsidianBlockIds.checked = !!getPrefRaw("obsidian.block_ids");
    }
    const obsidianVault = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-obsidian-vault`
    );
    if (obsidianVault) {
      obsidianVault.value = getPrefRaw("obsidian.vault") || "";
    }
    const obsidianDir = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-obsidian-dir`
    );
    if (obsidianDir) {
      obsidianDir.value = getPrefRaw("obsidian.dir") || "";
    }
    const tplNameInput = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-template-default`
    );
    if (tplNameInput) {
      tplNameInput.value = getPref("template.default") || "";
    }
    tplNameInput?.addEventListener("input", (ev) => {
      const el = ev.currentTarget;
      setPref("template.default", el.value || "default.md");
    });
    const fileNameTplInput = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-filename-template`
    );
    if (fileNameTplInput) {
      fileNameTplInput.value = getPrefRaw("filename.template") || "";
    }
    fileNameTplInput?.addEventListener("input", (ev) => {
      const el = ev.currentTarget;
      setPrefRaw("filename.template", el.value || "");
    });
  }
  function bindPrefEvents() {
    const win = addon.data.prefs?.window;
    if (!win) return;
    const chooseBtn = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-choose-dir`
    );
    const dirInput = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-directory`
    );
    chooseBtn?.addEventListener("command", async () => {
      try {
        const picker = new ztoolkit.FilePicker("Select Directory", "folder");
        const path = await picker.open();
        if (path) {
          await setPref("directory", path);
          if (dirInput) dirInput.value = path;
        }
      } catch (e) {
        ztoolkit.getGlobal("alert")(
          `${getString("startup-finish")}
Pick directory failed: ${e.message}`
        );
      }
    });
    dirInput?.addEventListener("input", (ev) => {
      const el = ev.currentTarget;
      setPref("directory", el.value || "");
    });
    const chooseTplBtn = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-choose-templates-dir`
    );
    const tplDirInput = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-templates-dir`
    );
    chooseTplBtn?.addEventListener("command", async () => {
      try {
        const picker = new ztoolkit.FilePicker(
          "Select Templates Directory",
          "folder"
        );
        const path = await picker.open();
        if (path) {
          await setPref("templates.directory", path);
          if (tplDirInput) tplDirInput.value = path;
        }
      } catch (e) {
        ztoolkit.getGlobal("alert")(
          `Pick templates directory failed: ${e.message}`
        );
      }
    });
    tplDirInput?.addEventListener("input", (ev) => {
      const el = ev.currentTarget;
      setPref("templates.directory", el.value || "");
    });
    const htmlStrong = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-html-strong`
    );
    htmlStrong?.addEventListener("command", (ev) => {
      const el = ev.currentTarget;
      setPrefRaw("html.strong", !!el.checked);
    });
    const htmlEm = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-html-em`
    );
    htmlEm?.addEventListener("command", (ev) => {
      const el = ev.currentTarget;
      setPrefRaw("html.em", !!el.checked);
    });
    const htmlStrike = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-html-strikethrough`
    );
    htmlStrike?.addEventListener("command", (ev) => {
      const el = ev.currentTarget;
      setPrefRaw("html.strikethrough", !!el.checked);
    });
    const htmlUnderline = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-html-underline`
    );
    htmlUnderline?.addEventListener("command", (ev) => {
      const el = ev.currentTarget;
      setPrefRaw("html.underline", !!el.checked);
    });
    const htmlBullet = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-html-bullet`
    );
    htmlBullet?.addEventListener("command", (ev) => {
      const el = ev.currentTarget;
      setPrefRaw("html.bullet", !!el.checked);
    });
    const obsidianAttachUri = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-obsidian-attach-uri`
    );
    obsidianAttachUri?.addEventListener("command", (ev) => {
      const el = ev.currentTarget;
      setPrefRaw("obsidian.attach_obsidian_uri", !!el.checked);
    });
    const obsidianBlockIds = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-obsidian-block-ids`
    );
    obsidianBlockIds?.addEventListener("command", (ev) => {
      const el = ev.currentTarget;
      setPrefRaw("obsidian.block_ids", !!el.checked);
    });
    const obsidianVault = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-obsidian-vault`
    );
    obsidianVault?.addEventListener("input", (ev) => {
      const el = ev.currentTarget;
      setPrefRaw("obsidian.vault", el.value || "");
    });
    const obsidianDir = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-obsidian-dir`
    );
    obsidianDir?.addEventListener("input", (ev) => {
      const el = ev.currentTarget;
      setPrefRaw("obsidian.dir", el.value || "");
    });
    const tplNameInput = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-template-default`
    );
    tplNameInput?.addEventListener("input", (ev) => {
      const el = ev.currentTarget;
      setPref("template.default", el.value || "default.md");
    });
    const fileNameTplInput = win.document.querySelector(
      `#zotero-prefpane-${config3.addonRef}-filename-template`
    );
    if (fileNameTplInput) {
      fileNameTplInput.value = getPrefRaw("filename.template") || "";
    }
    fileNameTplInput?.addEventListener("input", (ev) => {
      const el = ev.currentTarget;
      setPrefRaw("filename.template", el.value || "");
    });
  }
  (function ensureYamlOnly() {
    try {
      const mainWin = Zotero?.getMainWindow?.();
      const prefsWin = addon?.data?.prefs?.window;
      const doc = mainWin?.document || prefsWin?.document || (typeof window !== "undefined" ? window.document : void 0);
      if (!doc) return;
      const list = doc.getElementById(
        "zotero-prefpane-__addonRef__-frontmatter-format"
      );
      if (list && list.menupopup) {
        const items = Array.from(list.menupopup.children || []);
        items.forEach((el) => {
          const val = el?.getAttribute?.("value");
          if (val && val.toLowerCase() !== "yaml") {
            el.remove?.();
          }
        });
        const pref = Zotero?.Prefs?.get?.(
          "extensions.__addonRef__.frontmatter.format"
        );
        if (pref && pref !== "yaml") {
          Zotero?.Prefs?.set?.(
            "extensions.__addonRef__.frontmatter.format",
            "yaml"
          );
        }
        if (list.value !== "yaml") list.value = "yaml";
      }
    } catch (e) {
    }
  })();

  // src/utils/ztoolkit.ts
  var config4 = package_default.config;
  function createZToolkit() {
    const _ztoolkit = new ZoteroToolkit();
    initZToolkit(_ztoolkit);
    return _ztoolkit;
  }
  function initZToolkit(_ztoolkit) {
    const env = "production";
    _ztoolkit.basicOptions.log.prefix = `[${config4.addonName}]`;
    _ztoolkit.basicOptions.log.disableConsole = env === "production";
    _ztoolkit.UI.basicOptions.ui.enableElementJSONLog = false;
    _ztoolkit.UI.basicOptions.ui.enableElementDOMLog = false;
    _ztoolkit.basicOptions.api.pluginID = config4.addonID;
    _ztoolkit.ProgressWindow.setIconURI(
      "default",
      `chrome://${config4.addonRef}/content/icons/synapse-logo.a.svg`
    );
  }

  // src/modules/mdnotes.ts
  var MdnotesUIFactory = class {
    static registerMenus(win) {
      ztoolkit.Menu.register("item", {
        tag: "menuitem",
        label: getString("mdnotes-menu-create-file"),
        commandListener: () => addon.hooks.onMdnotesCommand("create-file")
      });
      ztoolkit.Menu.register("menuFile", {
        tag: "menuitem",
        label: getString("mdnotes-menu-create-file"),
        commandListener: () => addon.hooks.onMdnotesCommand("create-file")
      });
    }
  };

  // src/utils/object.ts
  function getByPath(obj, path) {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }

  // src/modules/placeholder.ts
  var PlaceholderResolver = class _PlaceholderResolver {
    /**
     * 从条目解析模板上下文对象
     * Resolve context object from Zotero item
     */
    static async resolve(item) {
      if (!item || !item.isRegularItem?.()) return {};
      const title = item.getField?.("title", false, true) || `item-${item.id}`;
      const creators = await item.getCreators?.() || item.getCreators?.() || [];
      let creatorsFiltered = Array.isArray(creators) ? creators : [];
      const authorsOnly = creatorsFiltered.filter(
        (c) => String(c?.creatorType || "").toLowerCase() === "author"
      );
      if (authorsOnly.length > 0) creatorsFiltered = authorsOnly;
      const authorsArr = creatorsFiltered.map((c) => {
        const nameRaw = typeof c?.name === "string" && c.name.trim() ? c.name.trim() : [c?.firstName, c?.lastName].map((s) => typeof s === "string" ? s.trim() : "").filter(Boolean).join(" ");
        return nameRaw;
      }).filter((s) => typeof s === "string" && s.trim());
      const authorSingle = authorsArr.length > 0 ? authorsArr[0] : "";
      const url = item.getField?.("url", false, true) || "";
      const year = _PlaceholderResolver._extractYear(item);
      const citekey = _PlaceholderResolver._getCitekey(item);
      const collections = await _PlaceholderResolver._getCollectionNames(item);
      const collection = collections.length > 0 ? collections[0] : "";
      const tags = _PlaceholderResolver._getTags(item);
      const attachments = await _PlaceholderResolver._getAttachments(item);
      let doi = "";
      try {
        let doiRaw = item.getField?.("DOI", false, true) || item.getField?.("doi", false, true) || "";
        if (typeof doiRaw !== "string") doiRaw = "";
        doiRaw = doiRaw.trim();
        if (doiRaw) {
          const stripped = doiRaw.replace(/^doi:\s*/i, "");
          if (/^https?:\/\//i.test(stripped)) {
            doi = stripped;
          } else if (/^10\.\S+/i.test(stripped)) {
            doi = `https://doi.org/${stripped}`;
          } else {
            doi = stripped;
          }
        }
      } catch {
        doi = "";
      }
      const dateRaw = item.getField?.("date", false, true) || "";
      const publicationTitle = item.getField?.("publicationTitle", false, true) || "";
      const abstractNote = item.getField?.("abstractNote", false, true) || "";
      let localLibrary = "";
      let cloudLibrary = "";
      try {
        const key = item.key;
        const libID = item.libraryID;
        let isGroup = false;
        try {
          const userLibID = Zotero.Libraries?.userLibraryID;
          if (typeof userLibID === "number") {
            isGroup = libID !== userLibID;
          } else {
            isGroup = typeof libID === "number" && libID > 1;
          }
        } catch {
          isGroup = typeof libID === "number" && libID > 1;
        }
        localLibrary = isGroup ? `zotero://select/groups/${libID}/items/${key}` : `zotero://select/library/items/${key}`;
        if (isGroup) {
          cloudLibrary = `https://www.zotero.org/groups/${libID}/items/${key}`;
        } else {
          const userID = Zotero.Users?.getCurrentUserID?.();
          if (typeof userID === "number") {
            cloudLibrary = `https://www.zotero.org/users/${userID}/items/${key}`;
          }
        }
      } catch {
      }
      if (!localLibrary)
        localLibrary = String(getPrefRaw("placeholder.localLibrary") || "");
      if (!cloudLibrary)
        cloudLibrary = String(getPrefRaw("placeholder.cloudLibrary") || "");
      const created = item.dateAdded ? new Date(item.dateAdded).toISOString().split("T")[0] : "";
      const updated = item.dateModified ? new Date(item.dateModified).toISOString().split("T")[0] : "";
      const pdfAttachments = await _PlaceholderResolver._getPdfLinks(item);
      return {
        key: item.key,
        libraryID: item.libraryID,
        itemType: item.itemType,
        title,
        url,
        year,
        authors: authorsArr,
        author: authorSingle,
        // 单作者（第一作者）；Single author (first author)
        citekey,
        // 引文键 / citation key
        collections,
        collection,
        // 单一集合名；Singular form for convenience in frontmatter
        tags,
        attachments,
        doi,
        // 规范化后的 DOI 链接 / normalized DOI link
        DOI: doi,
        // 兼容模板中使用大写 {{DOI}} 的占位符
        date: dateRaw,
        // 原始日期字符串 / raw date string
        publicationTitle,
        // 期刊或出版物标题 / journal or publication title
        publication: publicationTitle,
        // 别名：publication / alias for convenience
        abstractNote,
        // 摘要内容 / abstract content
        localLibrary,
        // 本地库占位符内容 / local library placeholder content
        cloudLibrary,
        // 云库占位符内容 / cloud library placeholder content
        created,
        // 创建日期 YYYY-MM-DD / creation date YYYY-MM-DD
        updated,
        // 更新日期 YYYY-MM-DD / modification date YYYY-MM-DD
        pdfAttachments
        // PDF 链接数组 / array of zotero://open-pdf links
      };
    }
    static _extractYear(item) {
      const date = item.getField?.("date", false, true) || "";
      const match = /\b(\d{4})\b/.exec(date);
      return match ? match[1] : "";
    }
    /**
     * 尝试获取引文键：
     * 1) 直接读取 citationKey 字段（若 Better BibTeX 或其他插件提供）
     * 2) 从 extra 字段解析 "Citation Key:"、"citation key:"、"citekey:" 等格式
     * Try to get citation key from explicit field or the Extra field.
     */
    static _getCitekey(item) {
      try {
        const direct = item.getField?.(
          "citationKey",
          false,
          true
        );
        if (direct && typeof direct === "string" && direct.trim()) {
          return direct.trim();
        }
      } catch {
      }
      try {
        const extra = item.getField?.("extra", false, true) || "";
        if (extra) {
          const m = /(?:^|\n)\s*(?:Citation Key|citation key|citekey)\s*:\s*(\S+)/.exec(
            extra
          );
          if (m && m[1]) return m[1].trim();
        }
      } catch {
      }
      return "";
    }
    static async _getCollectionNames(item) {
      try {
        const api = Zotero.Collections;
        if (!api) return [];
        const result = await api.getCollectionsContainingItems?.([item.id]);
        let parentIds = [];
        if (Array.isArray(result)) {
          parentIds = result;
        } else if (result && typeof result === "object") {
          const ids = result[item.id] ?? result[String(item.id)];
          if (Array.isArray(ids)) parentIds = ids;
        }
        if (!Array.isArray(parentIds) || parentIds.length === 0) {
          const fallback = await api.getCollectionsContainingItem?.(
            item.id
          );
          if (Array.isArray(fallback)) parentIds = fallback;
        }
        if (!Array.isArray(parentIds) || parentIds.length === 0) return [];
        const names = [];
        for (const cid of parentIds) {
          try {
            const c = await Zotero.Collections.getAsync(cid);
            if (c?.name) names.push(c.name);
          } catch {
          }
        }
        return names;
      } catch {
        return [];
      }
    }
    static _getTags(item) {
      try {
        const tags = item.getTags?.() || [];
        return Array.isArray(tags) ? tags.map((t) => t.tag).filter((s) => typeof s === "string" && s.trim()) : [];
      } catch {
        return [];
      }
    }
    static async _getAttachments(item) {
      const results = [];
      try {
        const ids = await item.getAttachments?.();
        if (!Array.isArray(ids)) return results;
        for (const id of ids) {
          const att = await Zotero.Items.getAsync(id);
          if (!att) continue;
          const title = att.getField?.("title", false, true) || "";
          let path;
          try {
            path = att.getFilePath?.();
          } catch (e) {
            void e;
          }
          results.push({ id, title, path });
        }
        return results;
      } catch {
        return results;
      }
    }
    // 生成 PDF 打开链接（zotero://open-pdf/...）
    static async _getPdfLinks(item) {
      const links = [];
      try {
        const ids = await item.getAttachments?.();
        if (!Array.isArray(ids)) return links;
        for (const id of ids) {
          const att = await Zotero.Items.getAsync(id);
          if (!att) continue;
          let isPDF = false;
          try {
            const mime = att.attachmentMIMEType || att.getField?.("mimeType", false, true) || "";
            if (typeof mime === "string" && /pdf/i.test(mime)) isPDF = true;
          } catch {
          }
          if (!isPDF) {
            try {
              const fp = att.getFilePath?.();
              if (typeof fp === "string" && /\.pdf$/i.test(fp)) isPDF = true;
            } catch {
            }
          }
          if (!isPDF) continue;
          const libID = att.libraryID ?? item.libraryID;
          const key = att.key;
          if (!key) continue;
          let isGroup = false;
          try {
            const userLibID = Zotero.Libraries?.userLibraryID;
            if (typeof userLibID === "number") {
              isGroup = libID !== userLibID;
            } else {
              isGroup = typeof libID === "number" && libID > 1;
            }
          } catch {
            isGroup = typeof libID === "number" && libID > 1;
          }
          const link = isGroup ? `zotero://open-pdf/groups/${libID}/items/${key}` : `zotero://open-pdf/library/items/${key}`;
          links.push(link);
        }
      } catch {
      }
      return links;
    }
  };

  // node_modules/turndown/lib/turndown.browser.es.js
  function extend(destination) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (source.hasOwnProperty(key)) destination[key] = source[key];
      }
    }
    return destination;
  }
  function repeat(character, count) {
    return Array(count + 1).join(character);
  }
  function trimLeadingNewlines(string) {
    return string.replace(/^\n*/, "");
  }
  function trimTrailingNewlines(string) {
    var indexEnd = string.length;
    while (indexEnd > 0 && string[indexEnd - 1] === "\n") indexEnd--;
    return string.substring(0, indexEnd);
  }
  var blockElements = [
    "ADDRESS",
    "ARTICLE",
    "ASIDE",
    "AUDIO",
    "BLOCKQUOTE",
    "BODY",
    "CANVAS",
    "CENTER",
    "DD",
    "DIR",
    "DIV",
    "DL",
    "DT",
    "FIELDSET",
    "FIGCAPTION",
    "FIGURE",
    "FOOTER",
    "FORM",
    "FRAMESET",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "HEADER",
    "HGROUP",
    "HR",
    "HTML",
    "ISINDEX",
    "LI",
    "MAIN",
    "MENU",
    "NAV",
    "NOFRAMES",
    "NOSCRIPT",
    "OL",
    "OUTPUT",
    "P",
    "PRE",
    "SECTION",
    "TABLE",
    "TBODY",
    "TD",
    "TFOOT",
    "TH",
    "THEAD",
    "TR",
    "UL"
  ];
  function isBlock(node) {
    return is(node, blockElements);
  }
  var voidElements = [
    "AREA",
    "BASE",
    "BR",
    "COL",
    "COMMAND",
    "EMBED",
    "HR",
    "IMG",
    "INPUT",
    "KEYGEN",
    "LINK",
    "META",
    "PARAM",
    "SOURCE",
    "TRACK",
    "WBR"
  ];
  function isVoid(node) {
    return is(node, voidElements);
  }
  function hasVoid(node) {
    return has(node, voidElements);
  }
  var meaningfulWhenBlankElements = [
    "A",
    "TABLE",
    "THEAD",
    "TBODY",
    "TFOOT",
    "TH",
    "TD",
    "IFRAME",
    "SCRIPT",
    "AUDIO",
    "VIDEO"
  ];
  function isMeaningfulWhenBlank(node) {
    return is(node, meaningfulWhenBlankElements);
  }
  function hasMeaningfulWhenBlank(node) {
    return has(node, meaningfulWhenBlankElements);
  }
  function is(node, tagNames) {
    return tagNames.indexOf(node.nodeName) >= 0;
  }
  function has(node, tagNames) {
    return node.getElementsByTagName && tagNames.some(function(tagName) {
      return node.getElementsByTagName(tagName).length;
    });
  }
  var rules = {};
  rules.paragraph = {
    filter: "p",
    replacement: function(content) {
      return "\n\n" + content + "\n\n";
    }
  };
  rules.lineBreak = {
    filter: "br",
    replacement: function(content, node, options) {
      return options.br + "\n";
    }
  };
  rules.heading = {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    replacement: function(content, node, options) {
      var hLevel = Number(node.nodeName.charAt(1));
      if (options.headingStyle === "setext" && hLevel < 3) {
        var underline = repeat(hLevel === 1 ? "=" : "-", content.length);
        return "\n\n" + content + "\n" + underline + "\n\n";
      } else {
        return "\n\n" + repeat("#", hLevel) + " " + content + "\n\n";
      }
    }
  };
  rules.blockquote = {
    filter: "blockquote",
    replacement: function(content) {
      content = content.replace(/^\n+|\n+$/g, "");
      content = content.replace(/^/gm, "> ");
      return "\n\n" + content + "\n\n";
    }
  };
  rules.list = {
    filter: ["ul", "ol"],
    replacement: function(content, node) {
      var parent = node.parentNode;
      if (parent.nodeName === "LI" && parent.lastElementChild === node) {
        return "\n" + content;
      } else {
        return "\n\n" + content + "\n\n";
      }
    }
  };
  rules.listItem = {
    filter: "li",
    replacement: function(content, node, options) {
      var prefix = options.bulletListMarker + "   ";
      var parent = node.parentNode;
      if (parent.nodeName === "OL") {
        var start = parent.getAttribute("start");
        var index = Array.prototype.indexOf.call(parent.children, node);
        prefix = (start ? Number(start) + index : index + 1) + ".  ";
      }
      content = content.replace(/^\n+/, "").replace(/\n+$/, "\n").replace(/\n/gm, "\n" + " ".repeat(prefix.length));
      return prefix + content + (node.nextSibling && !/\n$/.test(content) ? "\n" : "");
    }
  };
  rules.indentedCodeBlock = {
    filter: function(node, options) {
      return options.codeBlockStyle === "indented" && node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE";
    },
    replacement: function(content, node, options) {
      return "\n\n    " + node.firstChild.textContent.replace(/\n/g, "\n    ") + "\n\n";
    }
  };
  rules.fencedCodeBlock = {
    filter: function(node, options) {
      return options.codeBlockStyle === "fenced" && node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE";
    },
    replacement: function(content, node, options) {
      var className = node.firstChild.getAttribute("class") || "";
      var language = (className.match(/language-(\S+)/) || [null, ""])[1];
      var code = node.firstChild.textContent;
      var fenceChar = options.fence.charAt(0);
      var fenceSize = 3;
      var fenceInCodeRegex = new RegExp("^" + fenceChar + "{3,}", "gm");
      var match;
      while (match = fenceInCodeRegex.exec(code)) {
        if (match[0].length >= fenceSize) {
          fenceSize = match[0].length + 1;
        }
      }
      var fence = repeat(fenceChar, fenceSize);
      return "\n\n" + fence + language + "\n" + code.replace(/\n$/, "") + "\n" + fence + "\n\n";
    }
  };
  rules.horizontalRule = {
    filter: "hr",
    replacement: function(content, node, options) {
      return "\n\n" + options.hr + "\n\n";
    }
  };
  rules.inlineLink = {
    filter: function(node, options) {
      return options.linkStyle === "inlined" && node.nodeName === "A" && node.getAttribute("href");
    },
    replacement: function(content, node) {
      var href = node.getAttribute("href");
      if (href) href = href.replace(/([()])/g, "\\$1");
      var title = cleanAttribute(node.getAttribute("title"));
      if (title) title = ' "' + title.replace(/"/g, '\\"') + '"';
      return "[" + content + "](" + href + title + ")";
    }
  };
  rules.referenceLink = {
    filter: function(node, options) {
      return options.linkStyle === "referenced" && node.nodeName === "A" && node.getAttribute("href");
    },
    replacement: function(content, node, options) {
      var href = node.getAttribute("href");
      var title = cleanAttribute(node.getAttribute("title"));
      if (title) title = ' "' + title + '"';
      var replacement;
      var reference;
      switch (options.linkReferenceStyle) {
        case "collapsed":
          replacement = "[" + content + "][]";
          reference = "[" + content + "]: " + href + title;
          break;
        case "shortcut":
          replacement = "[" + content + "]";
          reference = "[" + content + "]: " + href + title;
          break;
        default:
          var id = this.references.length + 1;
          replacement = "[" + content + "][" + id + "]";
          reference = "[" + id + "]: " + href + title;
      }
      this.references.push(reference);
      return replacement;
    },
    references: [],
    append: function(options) {
      var references = "";
      if (this.references.length) {
        references = "\n\n" + this.references.join("\n") + "\n\n";
        this.references = [];
      }
      return references;
    }
  };
  rules.emphasis = {
    filter: ["em", "i"],
    replacement: function(content, node, options) {
      if (!content.trim()) return "";
      return options.emDelimiter + content + options.emDelimiter;
    }
  };
  rules.strong = {
    filter: ["strong", "b"],
    replacement: function(content, node, options) {
      if (!content.trim()) return "";
      return options.strongDelimiter + content + options.strongDelimiter;
    }
  };
  rules.code = {
    filter: function(node) {
      var hasSiblings = node.previousSibling || node.nextSibling;
      var isCodeBlock = node.parentNode.nodeName === "PRE" && !hasSiblings;
      return node.nodeName === "CODE" && !isCodeBlock;
    },
    replacement: function(content) {
      if (!content) return "";
      content = content.replace(/\r?\n|\r/g, " ");
      var extraSpace = /^`|^ .*?[^ ].* $|`$/.test(content) ? " " : "";
      var delimiter = "`";
      var matches = content.match(/`+/gm) || [];
      while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + "`";
      return delimiter + extraSpace + content + extraSpace + delimiter;
    }
  };
  rules.image = {
    filter: "img",
    replacement: function(content, node) {
      var alt = cleanAttribute(node.getAttribute("alt"));
      var src = node.getAttribute("src") || "";
      var title = cleanAttribute(node.getAttribute("title"));
      var titlePart = title ? ' "' + title + '"' : "";
      return src ? "![" + alt + "](" + src + titlePart + ")" : "";
    }
  };
  function cleanAttribute(attribute) {
    return attribute ? attribute.replace(/(\n+\s*)+/g, "\n") : "";
  }
  function Rules(options) {
    this.options = options;
    this._keep = [];
    this._remove = [];
    this.blankRule = {
      replacement: options.blankReplacement
    };
    this.keepReplacement = options.keepReplacement;
    this.defaultRule = {
      replacement: options.defaultReplacement
    };
    this.array = [];
    for (var key in options.rules) this.array.push(options.rules[key]);
  }
  Rules.prototype = {
    add: function(key, rule) {
      this.array.unshift(rule);
    },
    keep: function(filter) {
      this._keep.unshift({
        filter,
        replacement: this.keepReplacement
      });
    },
    remove: function(filter) {
      this._remove.unshift({
        filter,
        replacement: function() {
          return "";
        }
      });
    },
    forNode: function(node) {
      if (node.isBlank) return this.blankRule;
      var rule;
      if (rule = findRule(this.array, node, this.options)) return rule;
      if (rule = findRule(this._keep, node, this.options)) return rule;
      if (rule = findRule(this._remove, node, this.options)) return rule;
      return this.defaultRule;
    },
    forEach: function(fn) {
      for (var i = 0; i < this.array.length; i++) fn(this.array[i], i);
    }
  };
  function findRule(rules2, node, options) {
    for (var i = 0; i < rules2.length; i++) {
      var rule = rules2[i];
      if (filterValue(rule, node, options)) return rule;
    }
    return void 0;
  }
  function filterValue(rule, node, options) {
    var filter = rule.filter;
    if (typeof filter === "string") {
      if (filter === node.nodeName.toLowerCase()) return true;
    } else if (Array.isArray(filter)) {
      if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true;
    } else if (typeof filter === "function") {
      if (filter.call(rule, node, options)) return true;
    } else {
      throw new TypeError("`filter` needs to be a string, array, or function");
    }
  }
  function collapseWhitespace(options) {
    var element = options.element;
    var isBlock2 = options.isBlock;
    var isVoid2 = options.isVoid;
    var isPre = options.isPre || function(node2) {
      return node2.nodeName === "PRE";
    };
    if (!element.firstChild || isPre(element)) return;
    var prevText = null;
    var keepLeadingWs = false;
    var prev = null;
    var node = next(prev, element, isPre);
    while (node !== element) {
      if (node.nodeType === 3 || node.nodeType === 4) {
        var text = node.data.replace(/[ \r\n\t]+/g, " ");
        if ((!prevText || / $/.test(prevText.data)) && !keepLeadingWs && text[0] === " ") {
          text = text.substr(1);
        }
        if (!text) {
          node = remove(node);
          continue;
        }
        node.data = text;
        prevText = node;
      } else if (node.nodeType === 1) {
        if (isBlock2(node) || node.nodeName === "BR") {
          if (prevText) {
            prevText.data = prevText.data.replace(/ $/, "");
          }
          prevText = null;
          keepLeadingWs = false;
        } else if (isVoid2(node) || isPre(node)) {
          prevText = null;
          keepLeadingWs = true;
        } else if (prevText) {
          keepLeadingWs = false;
        }
      } else {
        node = remove(node);
        continue;
      }
      var nextNode = next(prev, node, isPre);
      prev = node;
      node = nextNode;
    }
    if (prevText) {
      prevText.data = prevText.data.replace(/ $/, "");
      if (!prevText.data) {
        remove(prevText);
      }
    }
  }
  function remove(node) {
    var next2 = node.nextSibling || node.parentNode;
    node.parentNode.removeChild(node);
    return next2;
  }
  function next(prev, current, isPre) {
    if (prev && prev.parentNode === current || isPre(current)) {
      return current.nextSibling || current.parentNode;
    }
    return current.firstChild || current.nextSibling || current.parentNode;
  }
  var root = typeof window !== "undefined" ? window : {};
  function canParseHTMLNatively() {
    var Parser = root.DOMParser;
    var canParse = false;
    try {
      if (new Parser().parseFromString("", "text/html")) {
        canParse = true;
      }
    } catch (e) {
    }
    return canParse;
  }
  function createHTMLParser() {
    var Parser = function() {
    };
    {
      if (shouldUseActiveX()) {
        Parser.prototype.parseFromString = function(string) {
          var doc = new window.ActiveXObject("htmlfile");
          doc.designMode = "on";
          doc.open();
          doc.write(string);
          doc.close();
          return doc;
        };
      } else {
        Parser.prototype.parseFromString = function(string) {
          var doc = document.implementation.createHTMLDocument("");
          doc.open();
          doc.write(string);
          doc.close();
          return doc;
        };
      }
    }
    return Parser;
  }
  function shouldUseActiveX() {
    var useActiveX = false;
    try {
      document.implementation.createHTMLDocument("").open();
    } catch (e) {
      if (root.ActiveXObject) useActiveX = true;
    }
    return useActiveX;
  }
  var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();
  function RootNode(input, options) {
    var root2;
    if (typeof input === "string") {
      var doc = htmlParser().parseFromString(
        // DOM parsers arrange elements in the <head> and <body>.
        // Wrapping in a custom element ensures elements are reliably arranged in
        // a single element.
        '<x-turndown id="turndown-root">' + input + "</x-turndown>",
        "text/html"
      );
      root2 = doc.getElementById("turndown-root");
    } else {
      root2 = input.cloneNode(true);
    }
    collapseWhitespace({
      element: root2,
      isBlock,
      isVoid,
      isPre: options.preformattedCode ? isPreOrCode : null
    });
    return root2;
  }
  var _htmlParser;
  function htmlParser() {
    _htmlParser = _htmlParser || new HTMLParser();
    return _htmlParser;
  }
  function isPreOrCode(node) {
    return node.nodeName === "PRE" || node.nodeName === "CODE";
  }
  function Node(node, options) {
    node.isBlock = isBlock(node);
    node.isCode = node.nodeName === "CODE" || node.parentNode.isCode;
    node.isBlank = isBlank(node);
    node.flankingWhitespace = flankingWhitespace(node, options);
    return node;
  }
  function isBlank(node) {
    return !isVoid(node) && !isMeaningfulWhenBlank(node) && /^\s*$/i.test(node.textContent) && !hasVoid(node) && !hasMeaningfulWhenBlank(node);
  }
  function flankingWhitespace(node, options) {
    if (node.isBlock || options.preformattedCode && node.isCode) {
      return { leading: "", trailing: "" };
    }
    var edges = edgeWhitespace(node.textContent);
    if (edges.leadingAscii && isFlankedByWhitespace("left", node, options)) {
      edges.leading = edges.leadingNonAscii;
    }
    if (edges.trailingAscii && isFlankedByWhitespace("right", node, options)) {
      edges.trailing = edges.trailingNonAscii;
    }
    return { leading: edges.leading, trailing: edges.trailing };
  }
  function edgeWhitespace(string) {
    var m = string.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
    return {
      leading: m[1],
      // whole string for whitespace-only strings
      leadingAscii: m[2],
      leadingNonAscii: m[3],
      trailing: m[4],
      // empty for whitespace-only strings
      trailingNonAscii: m[5],
      trailingAscii: m[6]
    };
  }
  function isFlankedByWhitespace(side, node, options) {
    var sibling;
    var regExp;
    var isFlanked;
    if (side === "left") {
      sibling = node.previousSibling;
      regExp = / $/;
    } else {
      sibling = node.nextSibling;
      regExp = /^ /;
    }
    if (sibling) {
      if (sibling.nodeType === 3) {
        isFlanked = regExp.test(sibling.nodeValue);
      } else if (options.preformattedCode && sibling.nodeName === "CODE") {
        isFlanked = false;
      } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
        isFlanked = regExp.test(sibling.textContent);
      }
    }
    return isFlanked;
  }
  var reduce = Array.prototype.reduce;
  var escapes = [
    [/\\/g, "\\\\"],
    [/\*/g, "\\*"],
    [/^-/g, "\\-"],
    [/^\+ /g, "\\+ "],
    [/^(=+)/g, "\\$1"],
    [/^(#{1,6}) /g, "\\$1 "],
    [/`/g, "\\`"],
    [/^~~~/g, "\\~~~"],
    [/\[/g, "\\["],
    [/\]/g, "\\]"],
    [/^>/g, "\\>"],
    [/_/g, "\\_"],
    [/^(\d+)\. /g, "$1\\. "]
  ];
  function TurndownService(options) {
    if (!(this instanceof TurndownService)) return new TurndownService(options);
    var defaults = {
      rules,
      headingStyle: "setext",
      hr: "* * *",
      bulletListMarker: "*",
      codeBlockStyle: "indented",
      fence: "```",
      emDelimiter: "_",
      strongDelimiter: "**",
      linkStyle: "inlined",
      linkReferenceStyle: "full",
      br: "  ",
      preformattedCode: false,
      blankReplacement: function(content, node) {
        return node.isBlock ? "\n\n" : "";
      },
      keepReplacement: function(content, node) {
        return node.isBlock ? "\n\n" + node.outerHTML + "\n\n" : node.outerHTML;
      },
      defaultReplacement: function(content, node) {
        return node.isBlock ? "\n\n" + content + "\n\n" : content;
      }
    };
    this.options = extend({}, defaults, options);
    this.rules = new Rules(this.options);
  }
  TurndownService.prototype = {
    /**
     * The entry point for converting a string or DOM node to Markdown
     * @public
     * @param {String|HTMLElement} input The string or DOM node to convert
     * @returns A Markdown representation of the input
     * @type String
     */
    turndown: function(input) {
      if (!canConvert(input)) {
        throw new TypeError(
          input + " is not a string, or an element/document/fragment node."
        );
      }
      if (input === "") return "";
      var output = process.call(this, new RootNode(input, this.options));
      return postProcess.call(this, output);
    },
    /**
     * Add one or more plugins
     * @public
     * @param {Function|Array} plugin The plugin or array of plugins to add
     * @returns The Turndown instance for chaining
     * @type Object
     */
    use: function(plugin) {
      if (Array.isArray(plugin)) {
        for (var i = 0; i < plugin.length; i++) this.use(plugin[i]);
      } else if (typeof plugin === "function") {
        plugin(this);
      } else {
        throw new TypeError("plugin must be a Function or an Array of Functions");
      }
      return this;
    },
    /**
     * Adds a rule
     * @public
     * @param {String} key The unique key of the rule
     * @param {Object} rule The rule
     * @returns The Turndown instance for chaining
     * @type Object
     */
    addRule: function(key, rule) {
      this.rules.add(key, rule);
      return this;
    },
    /**
     * Keep a node (as HTML) that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The Turndown instance for chaining
     * @type Object
     */
    keep: function(filter) {
      this.rules.keep(filter);
      return this;
    },
    /**
     * Remove a node that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The Turndown instance for chaining
     * @type Object
     */
    remove: function(filter) {
      this.rules.remove(filter);
      return this;
    },
    /**
     * Escapes Markdown syntax
     * @public
     * @param {String} string The string to escape
     * @returns A string with Markdown syntax escaped
     * @type String
     */
    escape: function(string) {
      return escapes.reduce(function(accumulator, escape) {
        return accumulator.replace(escape[0], escape[1]);
      }, string);
    }
  };
  function process(parentNode) {
    var self2 = this;
    return reduce.call(parentNode.childNodes, function(output, node) {
      node = new Node(node, self2.options);
      var replacement = "";
      if (node.nodeType === 3) {
        replacement = node.isCode ? node.nodeValue : self2.escape(node.nodeValue);
      } else if (node.nodeType === 1) {
        replacement = replacementForNode.call(self2, node);
      }
      return join(output, replacement);
    }, "");
  }
  function postProcess(output) {
    var self2 = this;
    this.rules.forEach(function(rule) {
      if (typeof rule.append === "function") {
        output = join(output, rule.append(self2.options));
      }
    });
    return output.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "");
  }
  function replacementForNode(node) {
    var rule = this.rules.forNode(node);
    var content = process.call(this, node);
    var whitespace = node.flankingWhitespace;
    if (whitespace.leading || whitespace.trailing) content = content.trim();
    return whitespace.leading + rule.replacement(content, node, this.options) + whitespace.trailing;
  }
  function join(output, replacement) {
    var s1 = trimTrailingNewlines(output);
    var s2 = trimLeadingNewlines(replacement);
    var nls = Math.max(output.length - s1.length, replacement.length - s2.length);
    var separator = "\n\n".substring(0, nls);
    return s1 + separator + s2;
  }
  function canConvert(input) {
    return input != null && (typeof input === "string" || input.nodeType && (input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11));
  }
  var turndown_browser_es_default = TurndownService;

  // src/utils/htmlToMarkdown.ts
  function buildTurndown() {
    const bulletEnabled = getBoolPref("html.bullet", true);
    const service = new turndown_browser_es_default({
      headingStyle: "atx",
      // # H1 style
      hr: "---",
      bulletListMarker: bulletEnabled ? "-" : "*",
      codeBlockStyle: "fenced",
      emDelimiter: "*",
      strongDelimiter: "**"
    });
    const strongEnabled = getBoolPref("html.strong", false);
    const emEnabled = getBoolPref("html.em", false);
    const strikeEnabled = getBoolPref("html.strikethrough", false);
    const underlineEnabled = getBoolPref("html.underline", false);
    service.addRule("mdnotes-strong", {
      filter: ["strong", "b"],
      replacement: (content) => strongEnabled ? `**${content}**` : content
    });
    service.addRule("mdnotes-em", {
      filter: ["em", "i"],
      replacement: (content) => emEnabled ? `*${content}*` : content
    });
    service.addRule("mdnotes-strike", {
      filter: ["s", "del", "strike"],
      replacement: (content) => strikeEnabled ? `~~${content}~~` : content
    });
    service.addRule("mdnotes-underline", {
      filter: ["u"],
      replacement: (content) => underlineEnabled ? `<u>${content}</u>` : content
    });
    return service;
  }
  function htmlToMarkdown(html) {
    const text = String(html ?? "");
    if (!text.trim()) return "";
    try {
      const td = buildTurndown();
      return td.turndown(text);
    } catch (e) {
      try {
        return text.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
      } catch {
        return text;
      }
    }
  }

  // src/modules/template.ts
  var import_sha = __toESM(require_sha2(), 1);
  var TemplateEngine = class _TemplateEngine {
    static instance;
    templateCache;
    constructor() {
      this.templateCache = /* @__PURE__ */ new Map();
    }
    static getInstance() {
      if (!_TemplateEngine.instance) {
        _TemplateEngine.instance = new _TemplateEngine();
      }
      return _TemplateEngine.instance;
    }
    /**
     * Render an inline template string against a Zotero item.
     * 渲染内联模板字符串（非文件）。
     */
    static async renderStringForItem(template, item) {
      const engine = _TemplateEngine.getInstance();
      const context = await engine.buildItemContext(item);
      const flatContext = {
        ...context,
        ...context.item ?? {}
      };
      return engine.interpolate(template, flatContext);
    }
    /**
     * Render an item to Markdown by loading a template file and adding YAML frontmatter (if enabled).
     * 通过加载模板文件渲染为 Markdown，并在启用时添加 YAML frontmatter。
     */
    static async renderItemToMarkdown(item, options = {}) {
      const engine = _TemplateEngine.getInstance();
      const context = await engine.buildItemContext(item);
      const template = await engine.loadTemplate(options.templateName);
      const flatContext = {
        ...context,
        ...context.item ?? {}
      };
      let content = engine.interpolate(template, flatContext);
      content = engine.addFrontmatter(content, flatContext);
      content = engine.addObsidianBlockIDsIfEnabled(content);
      return content;
    }
    /** 判断是否为绝对路径（跨平台 Windows/macOS/Linux） */
    isAbsolutePath(p) {
      return /^(?:[a-zA-Z]:[\\/]|\/.+)/.test(p);
    }
    /** 简单拼接目录与文件名（使用 POSIX 风格，避免依赖外部 API） */
    joinPath(dir, file) {
      const d = (dir || "").replace(/[\\/]+$/, "");
      const f = (file || "").replace(/^[\\/]+/, "");
      return `${d}/${f}`;
    }
    /**
     * Load template content by name.
     * 支持：
     * 1) 在“默认模板文件名/独立模板文件名”中直接填写绝对路径
     * 2) 否则从“模板目录 + 文件名”组合计算
     * 若均不可用，则回退到内置的极简模板
     */
    async loadTemplate(templateName) {
      const name = templateName || "default";
      if (this.templateCache.has(name)) {
        return this.templateCache.get(name);
      }
      const configuredName = String(getPrefRaw("template.default") || "default.md");
      const configuredDir = String(getPrefRaw("templates.directory") || "");
      let path = configuredName;
      if (!this.isAbsolutePath(configuredName) && configuredDir) {
        path = this.joinPath(configuredDir, configuredName);
      }
      try {
        const content = await this.readFileUTF8(path);
        if (typeof content === "string" && content.trim().length > 0) {
          this.templateCache.set(name, content);
          return content;
        }
      } catch (e) {
        try {
          ztoolkit.log(`Failed to read template file: ${path}`, e);
        } catch {
        }
      }
      const fallback = this.getFallbackTemplate();
      this.templateCache.set(name, fallback);
      return fallback;
    }
    /** 读取 UTF-8 文本文件（优先 IOUtils，回退 OS.File） */
    async readFileUTF8(path) {
      if (!path) throw new Error("Empty template path");
      try {
        const IOUtils = ztoolkit.getGlobal?.("IOUtils") || ztoolkit.getGlobal?.("IOUtils");
        if (IOUtils?.readUTF8) {
          return await IOUtils.readUTF8(path);
        }
        if (IOUtils?.read) {
          const decoder = new TextDecoder();
          const bytes = await IOUtils.read(path);
          return decoder.decode(bytes);
        }
      } catch (_) {
      }
      try {
        const OS = ztoolkit.getGlobal?.("OS");
        if (OS?.File?.read) {
          const bytes = await OS.File.read(path);
          if (typeof bytes === "string") return bytes;
          const decoder = new TextDecoder();
          return decoder.decode(bytes);
        }
      } catch (_) {
      }
      throw new Error("No API to read file (IOUtils/OS.File) or read failed");
    }
    getFallbackTemplate() {
      return [
        "---",
        "title: {{ item.title }}",
        "year: {{ item.year }}",
        "collections: {{ item.collections|list }}",
        "tags: {{ item.tags|list }}",
        "doi: {{ item.DOI }}",
        "---",
        "",
        "# {{ item.title }}",
        "",
        "> {{ item.abstractNote|md }}",
        "",
        "## Notes",
        "",
        "{{ item.notes|md }}"
      ].join("\n");
    }
    async buildItemContext(item) {
      const base = await PlaceholderResolver.resolve(item);
      let notesMD = "";
      try {
        const notes = item?.getNotes?.() || [];
        const htmls = [];
        for (const noteID of notes) {
          const note = await Zotero.Items.getAsync(noteID);
          const html = await note?.getNote?.();
          if (typeof html === "string" && html.trim()) htmls.push(html);
        }
        notesMD = htmlToMarkdown(htmls.join("\n\n"));
      } catch {
        notesMD = "";
      }
      const ctx = {};
      ctx.item = { ...base, notes: notesMD };
      return ctx;
    }
    interpolate(template, context) {
      return template.replace(
        /{{\s*([^}|\s]+(?:\.[^}|\s]+)*)(\|[^}\s]+)?\s*}}/g,
        (_m, path, filter) => {
          const raw = getByPath(context, String(path).trim());
          let out = "";
          if (filter && String(filter).includes("md")) {
            out = htmlToMarkdown(raw == null ? "" : String(raw));
          } else if (filter && String(filter).includes("list")) {
            if (Array.isArray(raw)) {
              out = raw.map((v) => v == null ? "" : String(v)).filter((s) => s.length > 0).join(", ");
            } else if (raw != null) {
              out = String(raw);
            } else {
              out = "";
            }
          } else {
            out = raw == null ? "" : String(raw);
          }
          return out;
        }
      );
    }
    hasYamlFrontmatter(content) {
      const lines = content.split(/\r?\n/);
      if (lines.length >= 3 && lines[0].trim() === "---") {
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === "---") return true;
          if (lines[i].startsWith("#")) break;
        }
      }
      return false;
    }
    readField(context, field) {
      return getByPath(context, field);
    }
    addFrontmatter(content, context) {
      const enabled = getBoolPref("frontmatter.enabled", true);
      if (!enabled || this.hasYamlFrontmatter(content)) return content;
      const front = {};
      const fields = String(getPrefRaw("frontmatter.fields") || "").split(
        /\s*,\s*/
      );
      for (const f of fields) {
        if (!f) continue;
        const value = this.readField(context, f);
        if (Array.isArray(value)) {
          front[f.split(".").pop() || f] = value;
        } else if (value != null) {
          front[f.split(".").pop() || f] = String(value);
        }
      }
      if (Object.keys(front).length === 0) {
        front.title = context.item?.title || "";
        front.year = context.item?.year || "";
        front.collections = context.item?.collections || [];
        front.tags = context.item?.tags || [];
        front.doi = context.item?.DOI || "";
      }
      const yaml = this.yamlStringify(front);
      return `---
${yaml}
---

${content}`;
    }
    addObsidianBlockIDsIfEnabled(content) {
      return content;
    }
    computeBlockIdForLine(line) {
      const s = this.normalizeLineForHash(line);
      if (!s) return null;
      const hash = (0, import_sha.default)("sha1").update(s).digest("hex");
      return hash.slice(0, 8);
    }
    normalizeLineForHash(s) {
      let t = s || "";
      t = t.replace(/`[^`]*`/g, "");
      t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
      t = t.replace(/\[[^\]]*\]\([^)]*\)/g, "");
      t = t.replace(/[*_~]/g, "");
      t = t.replace(/\s+/g, " ").toLowerCase().trim();
      return t;
    }
    /** 简单 YAML 序列化（仅键值与列表） */
    yamlStringify(obj) {
      const lines = [];
      for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === void 0) {
          lines.push(`${key}: ""`);
          continue;
        }
        if (Array.isArray(value)) {
          if (value.length > 0) {
            lines.push(`${key}:`);
            for (const v of value) {
              lines.push(`  - ${this._yamlEscape(String(v))}`);
            }
          } else {
            lines.push(`${key}: []`);
          }
        } else if (typeof value === "object") {
          lines.push(`${key}: ${this._yamlEscape(JSON.stringify(value))}`);
        } else {
          lines.push(`${key}: ${this._yamlEscape(String(value))}`);
        }
      }
      return lines.join("\n");
    }
    _yamlEscape(str) {
      const s = String(str ?? "");
      if (s === "" || /[:\-?{}[\],&*#%!@`]|^\s|\s$|\n/.test(s)) {
        return '"' + s.replace(/"/g, '\\"') + '"';
      }
      return s;
    }
  };

  // src/modules/mdnotesService.ts
  var MdnotesService = class _MdnotesService {
    // 防重入标记：避免并发执行导致的卡顿/死锁
    // Reentrancy guard to avoid overlapping executions
    static busy = false;
    /**
     * 非阻塞通知（Toast）：使用 ztoolkit.ProgressWindow
     * Non-blocking toast notification using ProgressWindow
     */
    static toast(text, opts = {}) {
      try {
        const type = opts.type ?? "default";
        const ms = typeof opts.ms === "number" ? opts.ms : 2600;
        const title = addon?.data?.config?.addonName || "Mdnotes";
        const win = new ztoolkit.ProgressWindow(title, {
          closeOnClick: true,
          closeTime: -1
        }).createLine({ text, type, progress: 100 }).show();
        win.startCloseTimer(ms);
      } catch (e) {
        try {
          ztoolkit.log(text);
        } catch {
        }
      }
    }
    /**
     * Create or update the mdnotes file attached/related to the given item.
     * 为单个条目创建或更新 mdnotes 文件。
     */
    static async createMdnotesFile(item) {
      if (_MdnotesService.busy) {
        _MdnotesService.toast(
          "Another export is in progress. \u8BF7\u7A0D\u5019\uFF0C\u6B63\u5728\u5904\u7406\u4E0A\u4E00\u4E2A\u5BFC\u51FA\u4EFB\u52A1\u2026",
          { type: "warning" }
        );
        return;
      }
      if (!item || !item.isRegularItem?.()) {
        _MdnotesService.toast(
          "Please select a regular item.\n\u8BF7\u9009\u62E9\u4E00\u4E2A\u5E38\u89C4\u6761\u76EE\u3002",
          { type: "warning" }
        );
        return;
      }
      _MdnotesService.busy = true;
      try {
        const exportDirPref = String(getPrefRaw("directory") || "");
        const exportDir = await this.ensureExportDir(exportDirPref);
        if (!exportDir) return;
        const fileName = await this.computeFileName(item);
        const { content } = await this.generateMarkdownForItem(item);
        const filePath = await this.safeJoinPath(exportDir, fileName);
        const finalContent = content;
        await this.writeFile(filePath, finalContent);
        try {
          await Zotero.Promise.delay(0);
        } catch {
        }
        const createNotes = getBoolPref("create_notes_file", false);
        const attach = getBoolPref("attach_to_zotero", false) && !createNotes;
        if (attach) {
          await this.attachLinkedFile(item, filePath);
        }
        try {
          await Zotero.Promise.delay(0);
        } catch {
        }
        if (createNotes) {
          await this.createChildNoteForExport(item, filePath, fileName);
        }
        _MdnotesService.toast(
          `Mdnotes file created/updated:
${filePath}
Mdnotes \u6587\u4EF6\u5DF2\u521B\u5EFA/\u66F4\u65B0`,
          { type: "success" }
        );
      } catch (e) {
        ztoolkit.log("createMdnotesFile failed", e);
        _MdnotesService.toast("Failed to create mdnotes file. \u521B\u5EFA\u6587\u4EF6\u5931\u8D25\u3002", {
          type: "error"
        });
        throw e;
      } finally {
        _MdnotesService.busy = false;
      }
    }
    // ===================== Helpers | 工具函数 =====================
    /**
     * 统一的文件名计算逻辑：优先使用用户定义的模板渲染，失败或为空时回退旧逻辑。
     * Unified filename computation: prefer user-defined template; fallback to legacy behavior.
     */
    static async computeFileName(item) {
      const template = String(getPrefRaw("filename.template") || "");
      if (template) {
        try {
          const raw = await TemplateEngine.renderStringForItem(template, item);
          const normalized = this.normalizeFileName(raw || "");
          const ensured = this.ensureMdExtension(normalized);
          if (ensured) return ensured;
        } catch (e) {
          ztoolkit.log("Filename template rendering failed", e);
        }
      }
      const title = item?.getField?.("title", false, true) || (item ? `item-${item.id}` : "Untitled");
      const suffix = String(getPrefRaw("files.mdnotes.hub.suffix") || "");
      const prefix = String(getPrefRaw("files.mdnotes.hub.prefix") || "");
      return this.ensureMdExtension(
        this.normalizeFileName(`${prefix}${title}${suffix}`)
      );
    }
    /**
     * Generate simple Markdown content for an item. Will be replaced by template engine.
     * 为条目生成简要 Markdown 内容。后续由模板引擎替换。
     */
    static async generateMarkdownForItem(item, templateName) {
      const fileName = await this.computeFileName(item);
      const title = item.getField("title", false, true) || `item-${item.id}`;
      const creators = await item.getCreators?.() || item.getCreators?.() || [];
      const authors = Array.isArray(creators) ? creators.map((c) => [c.firstName, c.lastName].filter(Boolean).join(" ")).filter(Boolean).join(", ") : "";
      const url = item.getField("url", false, true) || "";
      let content = "";
      try {
        content = await TemplateEngine.renderItemToMarkdown(
          item,
          templateName ? { templateName } : {}
        );
      } catch (e) {
        ztoolkit.log(
          "TemplateEngine rendering failed, fallback to basic content",
          e
        );
        const lines = [];
        lines.push(`# ${title}`);
        content = lines.join("\n");
      }
      return { fileName, content };
    }
    /**
     * Normalize file name to be cross-platform safe.
     * 归一化文件名，跨平台安全。
     */
    static normalizeFileName(name) {
      return (name || "").replace(/[\\/:*?"<>|]/g, "_").trim();
    }
    /** 确保 .md 扩展名 / Ensure .md extension */
    static ensureMdExtension(name) {
      if (!name) return "";
      const lower = name.toLowerCase();
      return lower.endsWith(".md") ? name : `${name}.md`;
    }
    /** 去掉扩展名，常用于生成标题 / Strip extension for display */
    static stripExtension(name) {
      if (!name) return name;
      return name.replace(/\.[^.]+$/, "");
    }
    /**
     * Ensure export directory is available: return pref if set; otherwise prompt user to select one and save preference.
     * 确保导出目录可用：若已设置则直接返回；否则提示用户选择并写回偏好。
     */
    static async ensureExportDir(prefDir) {
      const dir = (prefDir || "").trim();
      if (!dir) {
        _MdnotesService.toast(
          "Please set the export directory first: Preferences \u2192 Mdnotes \u2192 Export Directory.\n\u8BF7\u5148\u5728\u201C\u504F\u597D\u8BBE\u7F6E\u2192Mdnotes\u2192\u5BFC\u51FA\u76EE\u5F55\u201D\u4E2D\u8BBE\u7F6E\u5BFC\u51FA\u6587\u4EF6\u5939\u3002",
          { type: "warning" }
        );
        return null;
      }
      try {
        await this.ensureDirRecursive(dir);
        try {
          const IOUtils = ztoolkit.getGlobal("IOUtils");
          if (IOUtils?.stat) {
            const stats = await IOUtils.stat(dir);
            const isDir = stats && (stats.isDir === true || stats.type === "directory");
            if (!isDir) {
              throw new Error(
                `Export path exists but is not a directory: ${dir}`
              );
            }
          }
        } catch (_) {
        }
        return dir;
      } catch (e) {
        ztoolkit.log(
          `ensureExportDir: Failed to create or access directory ${dir}`,
          e
        );
        const msg = e?.message || "Unknown error";
        _MdnotesService.toast(
          `Failed to create or access export directory:
${dir}
${msg}
\u5EFA\u8BAE\uFF1A\u8BF7\u786E\u8BA4\u4E0A\u7EA7\u76EE\u5F55\u5B58\u5728\u4E14\u5F53\u524D\u7528\u6237\u5BF9\u8BE5\u8DEF\u5F84\u6709\u5199\u6743\u9650\u3002`,
          { type: "error" }
        );
        return null;
      }
    }
    /**
     * Ensure directory exists, creating ancestors as needed using best-available API.
     * 递归保证目录存在：优先使用 IOUtils.makeDirectory(createAncestors)，否则（仅当可用时）逐级创建。
     */
    static async ensureDirRecursive(dir) {
      const d = (dir || "").trim();
      if (!d) throw new Error("Empty directory path");
      try {
        const IOUtils = ztoolkit.getGlobal("IOUtils");
        if (IOUtils?.makeDirectory) {
          await IOUtils.makeDirectory(d, { createAncestors: true, mode: 493 });
          return;
        }
      } catch (_) {
      }
      try {
        const OS = ztoolkit.getGlobal("OS");
        if (OS?.File?.makeDir && OS?.File?.stat) {
          const PathUtils = ztoolkit.getGlobal("PathUtils") || ztoolkit.getGlobal("PathUtils");
          const exists = async (p) => {
            try {
              await OS.File.stat(p);
              return true;
            } catch {
              return false;
            }
          };
          const parentOf = (p) => {
            try {
              if (PathUtils?.parent) return PathUtils.parent(p);
            } catch (_) {
            }
            const norm = String(p).replace(/[\\/]+$/, "");
            const idx = Math.max(norm.lastIndexOf("/"), norm.lastIndexOf("\\"));
            return idx > 0 ? norm.slice(0, idx) : norm;
          };
          const stack = [];
          let cur = d;
          while (true) {
            if (await exists(cur)) break;
            stack.push(cur);
            const parent = parentOf(cur);
            if (!parent || parent === cur) break;
            cur = parent;
          }
          for (let i = stack.length - 1; i >= 0; i--) {
            const p = stack[i];
            try {
              await OS.File.makeDir(p, { ignoreExisting: true });
            } catch (e) {
              try {
                const st = await OS.File.stat(p);
                if (!st.isDir) throw e;
              } catch (_) {
                throw e;
              }
            }
          }
          return;
        }
      } catch (_) {
      }
      throw new Error(
        "Failed to ensure directory: no supported I/O API available (IOUtils/OS.File)"
      );
    }
    /**
     * Join directory and file name in a cross-platform way.
     * 跨平台拼接目录与文件名。
     */
    static async safeJoinPath(dir, fileName) {
      try {
        const PathUtils = ztoolkit.getGlobal("PathUtils") || ztoolkit.getGlobal("PathUtils");
        if (PathUtils?.join) return PathUtils.join(dir, fileName);
      } catch (e) {
      }
      const sep = "/";
      return `${dir.replace(/[\\/]+$/, "")}${sep}${fileName.replace(/^[/\\]+/, "")}`;
    }
    /**
     * Write text content to file path.
     * 写入文本内容到文件。
     */
    static async writeFile(path, content) {
      try {
        const IOUtils = ztoolkit.getGlobal("IOUtils");
        if (IOUtils?.writeUTF8) {
          await IOUtils.writeUTF8(path, content, { tmpPath: path + ".tmp" });
          return;
        }
        if (IOUtils?.write) {
          const encoder = new TextEncoder();
          await IOUtils.write(path, encoder.encode(content), {
            tmpPath: path + ".tmp"
          });
          return;
        }
      } catch (e) {
        ztoolkit.log(`writeFile via IOUtils failed for ${path}`, e);
      }
      try {
        const OS = ztoolkit.getGlobal("OS");
        if (OS?.File?.writeAtomic) {
          await OS.File.writeAtomic(path, content, {
            encoding: "utf-8",
            tmpPath: path + ".tmp"
          });
          return;
        }
      } catch (e) {
        ztoolkit.log(`writeFile via OS.File failed for ${path}`, e);
      }
      const err = new Error(
        "writeFile: No supported I/O API available (IOUtils/OS.File)"
      );
      ztoolkit.log(String(err));
      _MdnotesService.toast(`Failed to write file:
${path}`, { type: "error" });
      throw err;
    }
    /**
     * Attach a linked file to Zotero item.
     * 将生成的文件以链接附件的形式附加到 Zotero 条目。
     */
    static async attachLinkedFile(item, filePath) {
      try {
        const title = this.stripExtension(filePath.split(/[\\/]/).pop() || "") || "Mdnotes";
        if (Zotero.Attachments?.linkFromFile) {
          await Zotero.Attachments.linkFromFile({
            file: filePath,
            parentItemID: item.id,
            title
          });
          return;
        }
        if (Zotero.Items?.addLinkedFileFromPath) {
          await Zotero.Items.addLinkedFileFromPath(item, filePath);
          return;
        }
        throw new Error("No API to attach linked file found");
      } catch (e) {
        ztoolkit.log("attachLinkedFile failed", e);
      }
    }
    /**
     * Create a child linked-URL attachment that points to the exported Markdown file or Obsidian URI.
     * 在条目下创建一个“链接到 URL”的子附件，指向导出的 Markdown 文件或 Obsidian URI（受偏好控制）。
     *
     * 说明：Zotero 7/8 推荐使用 Zotero.Attachments.linkFromURL 创建“链接到 URI”的附件；
     * 若运行环境不支持，则回退为创建子笔记，内容中包含可点击的链接。
     */
    static async createChildNoteForExport(item, filePath, fileName) {
      try {
        const useObsidian = false;
        let fileURL = "";
        try {
          if (Zotero.File?.pathToFileURI) {
            fileURL = Zotero.File.pathToFileURI(filePath);
          } else {
            const p = String(filePath || "");
            fileURL = p.startsWith("/") ? `file://${p}` : `file:///${p}`;
          }
        } catch (e) {
          const p = String(filePath || "");
          fileURL = p.startsWith("/") ? `file://${p}` : `file:///${p}`;
        }
        const obsidianHref = "";
        const display = this.stripExtension(fileName) || fileName;
        if (Zotero.Attachments?.linkFromURL) {
          await Zotero.Attachments.linkFromURL({
            url: fileURL,
            parentItemID: item.id,
            title: `${display}`
          });
          return;
        }
        const linkParts = [
          `<a href="${fileURL}">${display}</a>`
        ];
        const noteHtml = `<!-- mdnotes:link --><p><strong>Mdnotes</strong>: ${linkParts.join(
          ""
        )}</p>`;
        const note = new Zotero.Item("note");
        note.parentID = item.id;
        note.setNote(noteHtml);
        if (typeof note.saveTx === "function") {
          await note.saveTx();
        } else if (typeof note.save === "function") {
          await note.save();
        }
      } catch (e) {
        ztoolkit.log("createChildNoteForExport failed", e);
      }
    }
    /**
     * Optionally append Obsidian URI depending on prefs
     * 根据偏好可选附加 Obsidian URI
     */
  };

  // src/hooks.ts
  async function onStartup() {
    await Promise.all([
      Zotero.initializationPromise,
      Zotero.unlockPromise,
      Zotero.uiReadyPromise
    ]);
    await migrateMdnotesToSynapse();
    initLocale();
    Zotero.PreferencePanes.register({
      pluginID: addon.data.config.addonID,
      src: rootURI + "content/preferences.xhtml",
      label: getString("mdnotes-menu-label"),
      image: `chrome://${addon.data.config.addonRef}/content/icons/synapse-logo.a.svg`
    });
    await Promise.all(
      Zotero.getMainWindows().map((win) => onMainWindowLoad(win))
    );
    addon.data.initialized = true;
  }
  async function onMainWindowLoad(win) {
    addon.data.ztoolkit = createZToolkit();
    win.MozXULElement.insertFTLIfNeeded(
      `${addon.data.config.addonRef}-mainWindow.ftl`
    );
    const popupWin = new ztoolkit.ProgressWindow(addon.data.config.addonName, {
      closeOnClick: true,
      closeTime: -1
    }).createLine({
      text: getString("startup-begin"),
      type: "default",
      progress: 0
    }).show();
    await Zotero.Promise.delay(500);
    popupWin.changeLine({
      progress: 60,
      text: `[60%] ${getString("startup-begin")}`
    });
    MdnotesUIFactory.registerMenus(win);
    await Zotero.Promise.delay(300);
    popupWin.changeLine({
      progress: 100,
      text: `[100%] ${getString("startup-finish")}`
    });
    popupWin.startCloseTimer(3e3);
  }
  async function onMainWindowUnload(win) {
    ztoolkit.unregisterAll();
    addon.data.dialog?.window?.close();
  }
  function onShutdown() {
    ztoolkit.unregisterAll();
    addon.data.dialog?.window?.close();
    addon.data.alive = false;
    delete Zotero[addon.data.config.addonInstance];
  }
  async function onNotify(event, type, ids, extraData) {
    ztoolkit.log("notify", event, type, ids, extraData);
  }
  async function onPrefsEvent(type, data) {
    switch (type) {
      case "load":
        registerPrefsScripts(data.window);
        break;
      default:
        return;
    }
  }
  async function onMdnotesCommand(type) {
    const pane = Zotero.getActiveZoteroPane();
    const items = pane?.getSelectedItems() || [];
    if (items.length === 0) return;
    switch (type) {
      case "create-file": {
        for (const item of items) {
          try {
            if (item?.isRegularItem?.()) {
              await MdnotesService.createMdnotesFile(item);
            }
          } catch (e) {
            ztoolkit.log("create-file failed for item", item?.id, e);
          }
        }
        break;
      }
    }
  }
  var hooks_default = {
    onStartup,
    onShutdown,
    onMainWindowLoad,
    onMainWindowUnload,
    onNotify,
    onPrefsEvent,
    onMdnotesCommand
  };

  // src/addon.ts
  var config5 = package_default.config;
  var Addon = class {
    data;
    // Lifecycle hooks
    hooks;
    // APIs
    api;
    constructor() {
      this.data = {
        alive: true,
        config: config5,
        env: "production",
        initialized: false,
        ztoolkit: createZToolkit()
      };
      this.hooks = hooks_default;
      this.api = {};
    }
  };
  var addon_default = Addon;

  // src/index.ts
  var config6 = package_default.config;
  var basicTool2 = new BasicTool();
  if (!basicTool2.getGlobal("Zotero")[config6.addonInstance]) {
    _globalThis.addon = new addon_default();
    defineGlobal("ztoolkit", () => {
      return _globalThis.addon.data.ztoolkit;
    });
    Zotero[config6.addonInstance] = addon;
  }
  function defineGlobal(name, getter) {
    Object.defineProperty(_globalThis, name, {
      get() {
        return getter ? getter() : basicTool2.getGlobal(name);
      }
    });
  }
})();
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
*/
