import { bindActionCreators, createStore } from 'redux';
import { createLocalVue, mount } from '@vue/test-utils';
import reduxConnectVue, { useActions, useState } from './index.js';
import { createStructuredSelector } from 'reselect';
import VueFunctionApi from 'vue-function-api';

describe('reduxConnectVue', () => {
	let actions;
	let store;

	beforeEach(() => {
		const defaultState = { foo: 'foo', bar: 'bar' };
		store = createStore((state = defaultState, action) => {
			switch (action.type) {
				case 'CHANGE_FOO':
					return Object.assign({}, state, { foo: action.payload });

				default:
					return state;
			}
		});

		actions = (dispatch) => ({
			foo: () => dispatch({ type: 'foo' }),
			bar: () => dispatch({ type: 'bar' })
		});
	});

	it('creates a Vue mixin', () => {
		const localVue = createLocalVue();
		jest.spyOn(localVue, 'mixin');

		localVue.use(reduxConnectVue, { store });
		expect(localVue.mixin).toHaveBeenCalled();
	});

	describe('useState', () => {
		it('extends components with state', () => {
			const localVue = createLocalVue();
			localVue.use(VueFunctionApi);
			localVue.use(reduxConnectVue, { store });

			const Component = {
				setup() {
					return useState((state) => ({
						foo: state.foo,
						bar: state.bar
					}));
				},
				template: '<p>Test Component</p>'
			};

			const { vm } = mount(Component, { localVue });
			expect(vm.foo).toBe('foo');
			expect(vm.bar).toBe('bar');
		});

		it('uses the mapStateToPropsFactory option to map the useState callback', () => {
			const localVue = createLocalVue();
			localVue.use(VueFunctionApi);
			localVue.use(reduxConnectVue, {
				mapStateToPropsFactory: createStructuredSelector,
				store
			});

			const Component = {
				setup() {
					return useState({
						foo: (state) => state.foo,
						bar: (state) => state.bar
					});
				},
				template: '<p>Test Component</p>'
			};

			const { vm } = mount(Component, { localVue });
			expect(vm.foo).toBe('foo');
			expect(vm.bar).toBe('bar');
		});

		it('subscribes to the store and updates the properties defined in "mapStateToProps" when the relevant state changes', async () => {
			const localVue = createLocalVue();
			localVue.use(VueFunctionApi);
			localVue.use(reduxConnectVue, { store });

			const Component = {
				setup() {
					return useState((state) => ({
						foo: state.foo,
						bar: state.bar
					}));
				},
				template: '<p>Test Component</p>'
			};

			const { vm } = mount(Component, { localVue });
			expect(vm.foo).toBe('foo');
			expect(vm.bar).toBe('bar');

			store.dispatch({ type: 'CHANGE_FOO', payload: 'FOO' });
			expect(vm.foo).toBe('FOO');
		});

		it('unsubscribes from the store when it is destroyed', () => {
			const disconnectMock = jest.fn();
			jest.spyOn(store, 'subscribe').mockReturnValue(disconnectMock);
			const localVue = createLocalVue();
			localVue.use(VueFunctionApi);
			localVue.use(reduxConnectVue, { store });

			const Component = {
				setup() {
					return useState((state) => ({
						foo: state.foo,
						bar: state.bar
					}));
				},
				template: '<p>Test Component</p>'
			};

			mount(Component, { localVue }).destroy();
			expect(disconnectMock).toHaveBeenCalled();
		});
	});

	describe('useActions', () => {
		beforeEach(() => {
			jest.spyOn(store, 'dispatch');
		});

		it('extends components with actions', () => {
			const localVue = createLocalVue();
			localVue.use(VueFunctionApi);
			localVue.use(reduxConnectVue, { store });

			const Component = {
				setup() {
					return useActions(actions);
				},
				template: '<p>Test Component</p>'
			};

			const { vm } = mount(Component, { localVue });

			vm.foo();
			expect(store.dispatch).toHaveBeenCalledWith({ type: 'foo' });

			vm.bar();
			expect(store.dispatch).toHaveBeenCalledWith({ type: 'bar' });
		});

		it('uses the mapDispatchToPropsFactory option to map the useActions callback', () => {
			const localVue = createLocalVue();
			localVue.use(VueFunctionApi);
			localVue.use(reduxConnectVue, {
				store,
				mapDispatchToPropsFactory: (actionCreators) => (dispatch) => bindActionCreators(actionCreators, dispatch)
			});

			const Component = {
				setup() {
					return useActions({
						foo: () => ({ type: 'foo' }),
						bar: () => ({ type: 'bar' })
					});
				},
				template: '<p>Test Component</p>'
			};

			const { vm } = mount(Component, { localVue });

			vm.foo();
			expect(store.dispatch).toHaveBeenCalledWith({ type: 'foo' });

			vm.bar();
			expect(store.dispatch).toHaveBeenCalledWith({ type: 'bar' });
		});

		it('does not subscribe to the store', () => {
			jest.spyOn(store, 'subscribe');
			const localVue = createLocalVue();
			localVue.use(VueFunctionApi);
			localVue.use(reduxConnectVue, { store });

			const Component = {
				setup() {
					return useActions(actions);
				},
				template: '<p>Test Component</p>'
			};

			mount(Component, { localVue });
			expect(store.subscribe).not.toHaveBeenCalled();
		});

		it('does not unsubscribe from the store when it is destroyed', () => {
			const disconnectMock = jest.fn();
			jest.spyOn(store, 'subscribe').mockReturnValue(disconnectMock);
			const localVue = createLocalVue();
			localVue.use(VueFunctionApi);
			localVue.use(reduxConnectVue, { store });

			const Component = {
				setup() {
					return useActions(actions);
				},
				template: '<p>Test Component</p>'
			};

			mount(Component, { localVue }).destroy();
			expect(disconnectMock).not.toHaveBeenCalled();
		});
	});

	describe('useState and useActions together', () => {
		it('extends components with both state and actions', () => {
			const localVue = createLocalVue();
			localVue.use(VueFunctionApi);
			localVue.use(reduxConnectVue, { store });

			const Component = {
				setup() {
					const state = useState((state) => ({
						foo: state.foo,
						bar: state.bar
					}));

					const actions = useActions((dispatch) => ({
						setFoo: (payload) => dispatch({ type: 'CHANGE_FOO', payload })
					}));

					return {
						...state,
						...actions
					};
				},
				template: '<p>Test Component</p>'
			};

			const { vm } = mount(Component, { localVue });
			expect(vm.foo).toBe('foo');
			expect(vm.bar).toBe('bar');

			vm.setFoo('FOO');
			expect(vm.foo).toBe('FOO');
		});

		it('uses the mapDispatchToPropsFactory and mapStateToPropsFactory options to map the useActions and useState callbacks', () => {
			const localVue = createLocalVue();
			localVue.use(VueFunctionApi);
			localVue.use(reduxConnectVue, {
				mapDispatchToPropsFactory: (actionCreators) => (dispatch) => bindActionCreators(actionCreators, dispatch),
				mapStateToPropsFactory: createStructuredSelector,
				store
			});

			const Component = {
				setup() {
					const state = useState({
						foo: (state) => state.foo,
						bar: (state) => state.bar
					});

					const actions = useActions({
						setFoo: (payload) => ({ type: 'CHANGE_FOO', payload })
					});

					return {
						...state,
						...actions
					};
				},
				template: '<p>Test Component</p>'
			};

			const { vm } = mount(Component, { localVue });
			expect(vm.foo).toBe('foo');
			expect(vm.bar).toBe('bar');

			vm.setFoo('FOO');
			expect(vm.foo).toBe('FOO');
		});
	});
});
