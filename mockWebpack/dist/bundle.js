(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function (require,exports,code) {
                code(require, exports);
            })(absRequire,exports,graph[file].code)
            return exports
        }
        require('./test/src/index.js')
    })({
      "./test/src/index.js": {code: function(require, exports) {
      "use strict";

var _add = _interopRequireDefault(require("./add.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log((0, _add["default"])(1, 2));
    },
    deps: {"./add.js":"./test/src/add.js"},
  },
"./test/src/add.js": {code: function(require, exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _test = _interopRequireDefault(require("./test.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_test["default"]);

var _default = function _default(a, b) {
  return a + b;
};

exports["default"] = _default;
    },
    deps: {"./test.js":"./test/src/test.js"},
  },
"./test/src/test.js": {code: function(require, exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var test = 100;
var _default = test;
exports["default"] = _default;
    },
    deps: {},
  },

    })