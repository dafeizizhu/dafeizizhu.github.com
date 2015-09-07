var Class = function () {}

Class.extend = function (prop) {
  var _super = this.prototype
  var prototype = new this()
  
  for (var name in prop) {
    prototype[name] = name == 'ctor' && typeof prop[name] == 'function' && typeof _super[name] == 'function' ?
      (function (name, fn) {
        return function () {
          var tmp = this._super
          this._super = _super[name]
          var ret = fn.apply(this, arguments)
          this._super = tmp
          return ret
        }
      })(name, prop[name]) :
      prop[name]
  }

  function Class() {
    this.ctor.apply(this, arguments)
  }

  for (var key in this) {
    if (this.hasOwnProperty(key) && key != 'extend') {
      Class[key] = this[key]
    }
  }

  Class.prototype = prototype

  Class.prototype._super = new this()

  if (prop.statics) {
    for (var name in prop.statics) {
      if (prop.statics.hasOwnProperty(name)) {
        Class[name] = prop.statics[name]
        if (name == 'ctor') {
          Class[name]()
        }
      }
    }
  }

  Class.prototype.constructor = Class

  Class.extendPrototype = function (prop) {
    for (var name in prop) {
      prototype[name] = prop[name]
    }
  }

  Class.extend = arguments.callee

  return Class
}
