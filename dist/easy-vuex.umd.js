(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vuex')) :
  typeof define === 'function' && define.amd ? define(['vuex'], factory) :
  (global.EasyVuex = factory(global.Vuex));
}(this, (function (vuex) { 'use strict';

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
    var is_root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    // 递归 extend 每个模块
    var modules = {};

    var _arr = Object.entries(store.modules || {});

    for (var _i = 0; _i < _arr.length; _i++) {
      var _arr$_i = _slicedToArray(_arr[_i], 2),
          name = _arr$_i[0],
          module = _arr$_i[1];

      modules[name] = EasyStore.extend(module, false);
    }

    return _objectSpread({}, store, {
      // 强制全部加上 namespace
      namespace: is_root ? false : true,
      // 添加默认 Mutation
      mutations: _objectSpread({
        EASY_VUEX_MODIFY: function EASY_VUEX_MODIFY(state, _ref) {
          var name = _ref.name,
              value = _ref.value;
          state[name] = value;
        }
      }, store.mutations),
      // 添加默认 Action
      actions: _objectSpread({
        easyVuexModify: function easyVuexModify(context, payload) {
          context.commit('EASY_VUEX_MODIFY', payload);
        }
      }, store.actions),
      modules: modules
    });
  }

  function beforeCreate() {
    var _this = this;

    var easy_vuex = this.$options.easy_vuex; // 获取配置

    var fields;

    if (!easy_vuex) {
      return;
    } else if (Array.isArray(easy_vuex)) {
      fields = easy_vuex.map(function (path) {
        var name = path.split('/').pop();
        return [name, path];
      });
    } else {
      fields = Object.entries(easy_vuex || {});
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

        var getter = void 0;

        if (namespace) {
          getter = vuex.mapState(namespace, {
            '_temp': name
          })['_temp'];
          modify = vuex.mapActions(namespace, {
            '_temp': 'easyVuexModify'
          })['_temp'];
        } // 创建 computed


        _this.$options.computed[alias] = {
          get: getter,
          set: function set(value) {
            return modify.apply(this, {
              name: name,
              value: value
            });
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

  var easyVuex = {
    install: install,
    extend: extend
  };

  return easyVuex;

})));
