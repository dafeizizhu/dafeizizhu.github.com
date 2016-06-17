---
layout: post
title: "我的React+Redux实践：技术整合篇"
description: ""
category: 
tags: [JavaScript, React]
---

蹚了近一个月的坑之后，是时候来总结总结如何使用React+Redux来构建前端SPA应用。项目源码：[https://github.com/dafeizizhu/there-is-a-calendar-web](https://github.com/dafeizizhu/there-is-a-calendar-web)

### Redux

Redux最大的特点就是整个应用只有一个状态，就是`store`。Redux基于`reducer`来生成应用的状态，要改变这个状态只能通过分发`action`的方式通知`reducer`来改变`store`：

    import { createStore } from 'redux'

    // reducer
    function counter(state = 0, action) {
      switch(action.type) {
        case 'INCREMENT':
          return state + 1
        default:
          return state
      }
    }

    // store
    const store = createStore(counter)

    // action
    function increment() {
      return {
        type: 'INCREMENT'
      }
    }

    // change the store
    store.dispatch(increment())

默认的`dispatch`是同步的。但是我们的应用经常需要分发异步的`action`，例如发送一个Ajax请求返回数据等等，这需要我们在两个地方做出改动。

第一个就是`createStore`，需要引入`redux-thunk`来实现异步分发`action`的功能：

    import { createStore, applyMiddleware } from 'redux'
    import thunkMiddleware from 'redux-thunk'

    const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)

    // store
    const store = createStoreWithMiddleware(counter)

第二个就是编写异步的`action`：

    // reducer
    function counter(state = 0, action) {
      switch(action.type) {
        case 'RECIEVE_INCREMENT':
          return state + 1
        default:
          return state
      }
    }

    // action
    function requestIncrement() {
      return {
        type: 'REQUEST_INCREMENT'
      }
    }

    function recieveIncrement() {
      return {
        type: 'RECIEVE_INCREMENT'
      }
    }

    function increment() {
      return dispatch => {
        dispatch(requestIncrement())
        setTimeout(() => {
          dispatch(recieveIncrement())
        }, 1000)
      }
    }

    // async action
    function asyncIncrement() {
      return dispatch => dispatch(increment())
    }

使用这种方式编写的`action`，可以在异步请求之前、之后分发`action`，通知外观组件来改变它们的状态。

### React-Redux

在Redux中并没有实现跟React的绑定，我们可以使用React-Redux来帮助我们绑定React跟Redux：

    import { Provider } from 'react-redux'

    render(
      <Provider store={store}>
        <Counter />
      </Provider>, 
      el
    )

使用`Provider`之后，里面的每个组件都可以使用`store`中的方法，如`getState()`和`dispatch(action)`等。

### React-Router

要同时使用React-Router和Redux，最好使用`react-router-redux`库进行整合。这样，路由的状态可以作为其中一个`reducer`加入到应用的状态中：

    // store
    import { combineReducers } from 'redux'
    import { routeReducer } from 'react-router-redux'

    const store = createStoreWithMiddleware(combineReducers({
      counter,
      routing: routerReducer
    })

这样，使用React-Router来路由的同时也会分发对应的`action`来改变`store`的对应状态。在构建Router的时候，需要把`store`作为参数传入`Router`中：

    import { Router, Route, hashHistory } from 'react-router'

    render(
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route path='/' component={require('./app')} />
        </Router>
      </Provider>,
      el
    )

这样，在应用内部使用`history`或者`Link`等进行跳转的时候，都会分发对应的`action`来改变`store`中对应的状态。

### React

最后就是为各个`route`中的`path`编写对应的React组件及其子组件。其中有一个指导思想：`UI = fn(State)`，就是说，UI的状态只会根据其自身的状态来变化，即传入相同的参数，UI的外观就是一致的。这个规则约束了我们编写React组件的时候不能在里面编写如下代码：

    render() {
      return <div>{new Date().toString()}</div>
    }

这样编写组件最大的问题是我们的UI在传入参数一致的前提下，还会因为运行时间的不同而产生不同的外观，导致测试用例难以编写。我们应该这么写：

    // component
    render() {
      return <div>{this.props.time}</div>
    }

    // reducer
    function time(state = new Date().toString(), action) {
      return state
    }

    // store
    const store = createStore(combineReducers({ time }))

    // usage
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    )

遵循这种规则的最大的好处就是我们的UI是可预测的，方便我们后续的测试，也使得这个组件的复用变得更加可靠。

### 个人实践

项目结构：

1. `actions`：存放所有`action`，包括登入、登出、创建用户、选择时间等。
2. `components`：存放所有React组件，遵循上述的方式编写。
3. `modules`：存放React-Router的组件，并负责分发`action`、逻辑跳转等功能。
4. `reducers`：存放Redux的`reducer`。其中包括应用程序内部状态以及每一个“页面”（例如登入、创建用户等）的状态（包括用户输入、API调用状态等）。

这样，一个基于React+Redux的应用结构就搭建起来了。余下还有开发环境、调试、打包、构建生产环境的版本等等，未完待续。
