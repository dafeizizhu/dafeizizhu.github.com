(function (global) {
  var getCurrentScript = function (base) {
    console.log('getCurrentScript', base)
    var stack
    try {
      a.b.c()
    } catch (e) {
      stack = e.stack
      if (!stack && global.opera) {
        // TODO
      }
    }
    if (stack) {
      stack = stack.split(/[@ ]/g).pop()
      stack = stack[0] == '(' ? stack.slice(1, -1) : stack.replace(/\s/, '')
      var src = stack.replace(/(:\d+)?:\d+$/i, '')
      console.log('src', src)
      return src
    }
    var nodes = (base ? document : document.head).getElementsByTagName('script')
    for (var i = nodes.length, node; node = nodes[--i]; ) {
      if ((base || node.className == moduleClass) && node.readyState == 'interactive') {
        console.log('src', node.src)
        return node.className = node.src
      }
    }
  }
  var modules = {}
  var loadings = []
  var factorys = []
  var basepath = getCurrentScript()
  var loadJSCSS = function (url, parent, ret, shim) {
    console.log('loadJSCSS', url, parent, ret, shim)
    if (/^(\w+)(\d)?:.*/.test(url)) {
      ret = url
    } else {
      parent = parent.substr(0, parent.lastIndexOf('/'))
      var tmp = url.charAt(0)
      if (tmp != '.' && tmp != '/') {
        ret = basepath + url
      } else if (url.slice(0, 2) == './') {
        ret = parent + url.slice(1)
      } else if (url.slice(0, 2) == '..') {
        var arr = parent.replace(/\/$/, '').split('/')
        tmp = url.replace(/\.\.\//g, function () {
          arr.pop()
          return ''
        })
        ret = arr.join('/') + '/' + tmp
      } else if (tmp == '/') {
        ret = parent + url
      } else {
        throw new Error('not match any rules!')
      }
    }
    var src = ret.replace(/[?#].*/, ''), ext
    if (/\.(js)$/.test(src)) {
      ext = RegExp.$1
    }
    if (!ext) {
      src += '.js'
      ext = 'js'
    }
    if (ext == 'js') {
      if (!modules[src]) {
        modules[src] = {
          id: src,
          parent: parent,
          exports: {}
        }
        loadJS(src)
      }
      return src
    }
  }
  var loadJS = function (url, callback) {
    console.log('loadJS', url)
    var node = document.createElement('script')
    node.className = moduleClass
    var W3C = typeof W3C == 'undefined' ? undefined : W3C
    node[W3C ? 'onload' : 'onreadystatechange'] = function () {
      if (W3C || /loaded|complete/i.test(node.readystate)) {
        var factory = factorys.pop()
        factory && factory.delay(node.src)
        if (callback) {
          callback()
        }
        if (checkFail(node, false, !W3C)) {
          // TODO
        }
      }
    }
    node.onerror = function () {
      checkFail(node, true)
    }
    node.src = url
    document.head.insertBefore(node, document.head.firstChild)
  }
  var checkFail = function (node, onError, fuckIE) {
    console.log('checkFail', node, onError, fuckIE)
    var id = node.src
    node.onload = node.onreadystatechange = node.onerror = null
    if (onError || (fuckIE && !modules[id].state)) {
      setTimeout(function () {
        document.head.removeChild(node)
      })
    } else {
      return true
    }
  }
  var moduleClass = 'moduleClass_' + new Date().valueOf()
  var fireFactory = function (id, deps, factory) {
    console.log('fireFactory', id, deps)
    for (var i = 0, array = [], d; d = deps[i++]; ) {
      array.push(modules[d].exports)
    }
    var module = Object(modules[id]),
        ret = factory.apply(global, array)
    module.state = 2
    if (ret != void 0) {
      modules[id].exports = ret
    }
    return ret
  }
  var checkDeps = function () {
    console.log('checkDeps', loadings)
    loop: for (var i = loadings.length, id; id = loadings[--i]; ) {
      var obj = modules[id], deps = obj.deps
      for (var key in deps) {
        if (deps.hasOwnProperty(key) && modules[key].state != 2) {
          continue loop
        }
      }
      if (obj.state != 2) {
        loadings.splice(i, 1)
        fireFactory(obj.id, obj.args, obj.factory)
        checkDeps()
      }
    }
  }
  var checkCycle = function (deps, nick) {
    console.log('checkCycle', deps, nick)
    for (var id in deps) {
      if (deps[id] == 'finished' && modules[id].state != 2 && (id == nick || checkCycle(modules[id].deps, nick))) {
        return true
      }
    }
  }

  global.require = function (list, factory, parent) {
    var deps = {},  // 检查它的依赖是否都完成加载
        args = [],  // 保存依赖模块的返回值
        dn = 0,     // 需要安装的模块数
        cn = 0,     // 已安装的模块数
        id = parent || 'callback' + setTimeout('1'),
        parent = parent || basepath // basepath为加载器的路径

    String(list).replace(/[^, ]+/g, function (el) {
      var url = loadJSCSS(el, parent)
      if (url) {
        dn++
        if (modules[url] && modules[url].state == 2) {
          cn++
        }
        if (!deps[url]) {
          args.push(url)
          deps[url] = 'finished'
        }
      }
    })

    modules[id] = {
      id: id,
      factory: factory,
      deps: deps,
      args: args,
      state: 1
    }
    if (dn == cn) {
      fireFactory(id, args, factory)
    } else {
      loadings.unshift(id)
    }
    checkDeps()
  }
  
  global.define = function (id, deps, factory) {
    var args = Array.prototype.slice.call(arguments)
    if (typeof id == 'string') {
      var _id = args.shift()
    }
    if (typeof args[0] == 'boolean') {
      if (args[0]) return
      args.shift()
    }
    if (typeof args[0] == 'function') {
      args.unshift([])
    }
    id = modules[id] && modules[id].state >= 1 ? _id : getCurrentScript()
    factory = args[1]
    factory.id = _id
    factory.delay = function (id) {
      args.push(id)
      var isCycle = true
      try {
        isCycle = checkCycle(modules[id].deps, id)
      } catch (e) {
      }
      if (isCycle) {
        console.log('id[' + id + '] has cycle deps')
      }
      delete factory.delay
      global.require.apply(null, args)
    }
    if (id) {
      factory.delay(id, args)
    } else {
      factorys.push(factory)
    }
  }
})(this)
