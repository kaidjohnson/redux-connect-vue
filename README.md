[![Build Status](https://travis-ci.org/kaidjohnson/redux-connect-vue.svg?branch=master)](https://travis-ci.org/kaidjohnson/redux-connect-vue) 
[![Coverage Status](https://coveralls.io/repos/github/kaidjohnson/redux-connect-vue/badge.svg?branch=master)](https://coveralls.io/github/kaidjohnson/redux-connect-vue?branch=master)

# redux-connect-vue

A tiny Vue plugin that connects components with Redux. 

No HOCs. No complex API. No dependencies. Just connect and go!

- Simple: 60 lines code.
- Tiny: < 275b gzipped.
- Flexible: mapStateToProps and mapDispatchToProps are configurable via plugin options.

New to Redux? [Start Here](https://redux.js.org/introduction/getting-started)

## Installation

`npm install redux-connect-vue`

## Standard Usage

Set up a Redux store:

```
// store.js

import { createStore, combineReducers } from 'redux';
import fooReducer from './foo/reducer.js';

export default createStore(combineReducers({
  foo: fooReducer
}));
```

Install the redux-connect-vue plugin:

```
import ReduxConnectVue from 'redux-connect-vue';
import store from './store.js';

Vue.use(ReduxConnectVue, { store });
```

Connect your state and actions to your component:

```
// component.vue

<script>
import { connect } from 'redux-connect-vue';

const state = (state) => ({
  foo: state.foo
});

const actions = (dispatch) => ({
  doSomething: (payload) => dispatch({ type: 'DO_SOMETHING', payload })
});

export default connect(state, actions)({
  template: '<p>Foo: {{ foo }}</p><button @click="$actions.doSomething('hello')"></button>'
});
</script>
```

## With [bindActionCreators](https://redux.js.org/api/bindactioncreators)

```
import { bindActionCreators } from 'redux';
import ReduxConnectVue from 'redux-connect-vue';
import store from './store.js';

Vue.use(ReduxConnectVue, { 
  store,
  mapDispatchToPropsFactory: (actionCreators) => (dispatch) => bindActionCreators(actionCreators, dispatch)
});
```

```
// component.vue

<script>
import { connect } from 'redux-connect-vue';

const state = (state) => ({
  foo: state.foo
});

const actions = {
  doSomething: (payload) => ({ type: 'DO_SOMETHING', payload })
};

export default connect(state, actions)({
  template: '<p>Foo: {{ foo }}</p><button @click="$actions.doSomething('hello')"></button>'
});
</script>
```

## With [Reselect](https://github.com/reduxjs/reselect)

```
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import ReduxConnectVue from 'redux-connect-vue';
import store from './store.js';

Vue.use(ReduxConnectVue, { 
  store,
  mapDispatchToPropsFactory: (actionCreators) => (dispatch) => bindActionCreators(actionCreators, dispatch),
  mapStateToPropsFactory: createStructuredSelector
});
```

```
// component.vue

<script>
import { connect } from 'redux-connect-vue';
import { createSelector } from 'reselect';

const state = {
  foo: createSelector((state) => state.foo, (foo) => foo.toUpperCase())
};

const actions = {
  doSomething: (payload) => ({ type: 'DO_SOMETHING', payload })
};

export default connect(state, actions)({
  template: '<p>Foo: {{ foo }}</p><button @click="$actions.doSomething('hello')"></button>'
});
</script>
```

## Yet another Redux library for Vue. Why!?

The source code for Redux is approachable. A Redux connection library should be just as approachable so you can start building things with minimal overhead.

This library is opinionated, as is each of the other libraries out there. It was built with the following best practices in mind:

- [Container-Component](https://medium.com/@learnreact/container-components-c0e67432e005) pattern

There are a lot of options out there that each do similar things, in case you're looking for something else:

- [vuejs-redux](https://github.com/titouancreach/vuejs-redux) - tiny Provider HOC
- [redux-vue-connect](https://github.com/itsazzad/redux-vue-connect) - HOC connector
- [vue-redux-connect](https://github.com/peerhenry/vue-redux-connect) - A variation on redux-vue-connect
- [revux](https://github.com/edvincandon/revux) - inspired by revue
- [redux-vuex](https://github.com/alexander-heimbuch/redux-vuex) - slightly different approach to bindings
