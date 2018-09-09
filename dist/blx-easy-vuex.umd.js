(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vuex')) :
  typeof define === 'function' && define.amd ? define(['vuex'], factory) :
  (global.BLXEasyVuex = factory(global.Vuex));
}(this, (function (vuex) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function extend(store) {
    // 递归 extend 每个模块
    var modules = {};

    var _arr = Object.entries(store.modules || {});

    for (var _i = 0; _i < _arr.length; _i++) {
      var _arr$_i = _slicedToArray(_arr[_i], 2),
          name = _arr$_i[0],
          module = _arr$_i[1];

      modules[name] = extend(module, false);
    }

    return _objectSpread({}, store, {
      // 强制全部加上 namespace
      namespaced: true,
      // 添加默认 Mutation
      mutations: _objectSpread({
        EASY_VUEX_MODIFY: function EASY_VUEX_MODIFY(state, _ref) {
          var name = _ref.name,
              value = _ref.value;
          state[name] = value;
        }
      }, store.mutations),
      modules: modules
    });
  }

  function beforeCreate() {
    var _this = this;

    var easyMapState = this.$options.easyMapState; // 获取配置

    var fields;

    if (!easyMapState) {
      return;
    } else if (Array.isArray(easyMapState)) {
      fields = easyMapState.map(function (path) {
        var name = path.split('/').pop();
        return [name, path];
      });
    } else {
      fields = Object.entries(easyMapState || {});
    }

    if (!this.$options.computed) this.$options.computed = {}; // 循环创建双向绑定

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var _step$value = _slicedToArray(_step.value, 2),
            alias = _step$value[0],
            path = _step$value[1];

        var _path = path.split('/');

        var name = _path.pop();

        var namespace = _path.join('/') || null; // 获取 getter 和 setter 函数

        var getter = namespace ? vuex.mapState(namespace, {
          '_temp': name
        })['_temp'] : vuex.mapState({
          '_temp': name
        })['_temp'];
        var modify = namespace ? vuex.mapMutations(namespace, {
          '_temp': 'EASY_VUEX_MODIFY'
        })['_temp'] : vuex.mapMutations({
          '_temp': 'EASY_VUEX_MODIFY'
        })['_temp']; // 创建 computed

        _this.$options.computed[alias] = {
          get: getter,
          set: function set(value) {
            return modify.apply(this, [{
              name: name,
              value: value
            }]);
          }
        };
      };

      for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  function install(Vue) {
    Vue.mixin({
      beforeCreate: beforeCreate
    });
  }

  var Store =
  /*#__PURE__*/
  function (_VuexStore) {
    _inherits(Store, _VuexStore);

    function Store(store) {
      _classCallCheck(this, Store);

      return _possibleConstructorReturn(this, _getPrototypeOf(Store).call(this, extend(store)));
    }

    return Store;
  }(vuex.Store); // 遵循 Vue 的标准，如果有 window.Vue 则自动 use


  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) && window.Vue) {
    Vue.use({
      install: install
    });
  }

  var blxEasyVuex = {
    install: install,
    extend: extend,
    Store: Store
  };

  return blxEasyVuex;

})));
