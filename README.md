[![npm version](https://badge.fury.io/js/redux-connect-vue.svg)](https://badge.fury.io/js/redux-connect-vue)
[![Dependency Status](https://david-dm.org/kaidjohnson/redux-connect-vue/dev-status.svg)](https://david-dm.org/kaidjohnson/redux-connect-vue?type=dev)
[![Build Status](https://travis-ci.org/kaidjohnson/redux-connect-vue.svg?branch=master)](https://travis-ci.org/kaidjohnson/redux-connect-vue)
[![Test Coverage](https://api.codeclimate.com/v1/badges/e84db5d5c2cd53e07c3e/test_coverage)](https://codeclimate.com/github/kaidjohnson/redux-connect-vue/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/e84db5d5c2cd53e07c3e/maintainability)](https://codeclimate.com/github/kaidjohnson/redux-connect-vue/maintainability)

# redux-connect-vue

> **Note: redux-connect-vue v2 is compatible with Vue 2.x using the composition API provided from [Vue Function API](https://github.com/vuejs/composition-api)**
> If you are looking for a Vue 2.x compatible version without needing to use the composition API, check out [v1](https://github.com/kaidjohnson/redux-connect-vue/tree/v1.1.0)

A tiny Vue plugin that connects components with Redux.

No HOCs. No complex API. No dependencies. Just use and go!

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

### useState(_mapStateToProps_)

- mapStateToProps: Argument that gets passed to _mapStateToPropsFactory_.
- returns an object to be included in a setup() return

### useActions(_mapDispatchToProps_)

- mapDispatchToProps: Argument that gets passed to _mapDispatchToPropsFactory_.
- returns an object to be included in a setup() return

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
import { createApp } from 'vue';
import ReduxConnectVue from 'redux-connect-vue';
import store from './store.js';

createApp(...).use(ReduxConnectVue, { store });
```

Connect your state and actions to your component:

```
// component.vue

<script>
import { useState } from 'redux-connect-vue';

export default {
  setup() {
    const state = useState((state) => ({
      foo: state.foo
    }));

    const actions = useActions((dispatch) => ({
      doSomething: (payload) => dispatch({ type: 'DO_SOMETHING', paylaod })
    }));

    return {
      ...state,
      ...actions
    };
  },
  template: '<p>Foo: {{ foo }}</p><button @click="doSomething('hello')"></button>'
};
</script>
```

## Example using [bindActionCreators](https://redux.js.org/api/bindactioncreators) as mapDispatchToPropsFactory

```
import { bindActionCreators } from 'redux';
import { createApp } from 'vue';
import ReduxConnectVue from 'redux-connect-vue';
import store from './store.js';

createApp(...).use(ReduxConnectVue, {
  store,
  mapDispatchToPropsFactory: (actionCreators) => (dispatch) => bindActionCreators(actionCreators, dispatch)
});
```

```
// component.vue

<script>
import { useActions, useState } from 'redux-connect-vue';

export default {
  setup() {
    const state = useState((state) => ({
      foo: state.foo
    }));

    const actions = useActions({
      doSomething: (payload) => ({ type: 'DO_SOMETHING', payload })
    });

    return {
      ...state,
      ...actions
    };
  },
  template: '<p>Foo: {{ foo }}</p><button @click="doSomething('hello')"></button>'
};
</script>
```

## Example using createStructuredSelector from [Reselect](https://github.com/reduxjs/reselect) as mapStateToPropsFactory

```
import { bindActionCreators } from 'redux';
import { createApp } from 'vue';
import { createStructuredSelector } from 'reselect';
import ReduxConnectVue from 'redux-connect-vue';
import store from './store.js';

createApp(...).use(ReduxConnectVue, {
  store,
  mapDispatchToPropsFactory: (actionCreators) => (dispatch) => bindActionCreators(actionCreators, dispatch),
  mapStateToPropsFactory: createStructuredSelector
});
```

```
// component.vue

<script>
import { useActions, useState } from 'redux-connect-vue';
import { createSelector } from 'reselect';

export default {
  setup() {
    const state = useState({
      foo: createSelector((state) => state.foo, (foo) => foo.toUpperCase())
    });

    const actions = useActions({
      doSomething: (payload) => ({ type: 'DO_SOMETHING', payload })
    });

    return {
      ...state,
      ...actions
    };
  },
  template: '<p>Foo: {{ foo }}</p><button @click="doSomething('hello')"></button>'
};
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
