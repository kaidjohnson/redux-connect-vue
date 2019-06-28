[![npm version](https://badge.fury.io/js/redux-connect-vue.svg)](https://badge.fury.io/js/redux-connect-vue)
[![Dependency Status](https://david-dm.org/kaidjohnson/redux-connect-vue/dev-status.svg)](https://david-dm.org/kaidjohnson/redux-connect-vue?type=dev)
[![Build Status](https://travis-ci.org/kaidjohnson/redux-connect-vue.svg?branch=master)](https://travis-ci.org/kaidjohnson/redux-connect-vue)
[![Test Coverage](https://api.codeclimate.com/v1/badges/e84db5d5c2cd53e07c3e/test_coverage)](https://codeclimate.com/github/kaidjohnson/redux-connect-vue/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/e84db5d5c2cd53e07c3e/maintainability)](https://codeclimate.com/github/kaidjohnson/redux-connect-vue/maintainability)

# redux-connect-vue

A tiny Vue plugin that connects components with Redux.

No HOCs. No complex API. No dependencies. Just connect and go!

- Simple: < 60 lines code.
- Tiny: < 0.3 KB gzipped.
- Flexible: Configurable api via Vue plugin options.

New to Redux? [Start Here](https://redux.js.org/introduction/getting-started)

## Installation

`npm install redux-connect-vue`

## API

### Vue Plugin Options

- store (required): Redux store (or any other store object that has getState, dispatch, and subscribe methods)
- mapDispatchToStateFactory (optional): Factory function that receives the supplied _mapStateToProps_ and returns a function that receives _state_ and returns an _{Object}_ of props. Defaults to an identity function.
- mapDispatchToPropsFactory (optional): Factory function that receives the supplied _mapDispatchToProps_ and returns a function that receives _dispatch_ and returns an _{Object}_ of actions. Defaults to an identity function.

### connect(_mapStateToProps_, _mapDispatchToProps_)

- mapStateToProps: Argument that gets passed to _mapStateToPropsFactory_. Binds to component _$data_ (available on the vm directly).
- mapDispatchToProps: Argument that gets passed to _mapDispatchToPropsFactory_. Binds to component _$actions_ (available at _vm.$actions_).
- returns a function that receives the Vue component configuration.

## Standard Example

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

## Example using [bindActionCreators](https://redux.js.org/api/bindactioncreators) as mapDispatchToPropsFactory

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

## Example using createStructuredSelector from [Reselect](https://github.com/reduxjs/reselect) as mapStateToPropsFactory

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
