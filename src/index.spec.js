import { bindActionCreators, createStore } from 'redux';
import { createLocalVue, mount } from '@vue/test-utils';
import { connect } from './index.js';
import { createStructuredSelector } from 'reselect';
import reduxConnectVue from './index.js';

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

	describe('connect', () => {
		it('does not throw an error when "mapDispatchToProps" is null', () => {
			const localVue = createLocalVue();
			localVue.use(reduxConnectVue, { store });

			const state = (state) => ({
				foo: state.foo,
				bar: state.bar
			});

			const Component = connect(state, null)({
				template: '<p>Test Component</p>'
			});

			expect(() => mount(Component, { localVue })).not.toThrow();
		});

		it('does not throw an error when "mapStateToProps" is null', () => {
			const localVue = createLocalVue();
			localVue.use(reduxConnectVue, { store });

			const Component = connect(null, actions)({
				template: '<p>Test Component</p>'
			});

			expect(() => mount(Component, { localVue })).not.toThrow();
		});

		describe('mapStateToProps', () => {
			it('extends components with a "mapStateToProps" method that maps a set of selectors to the instance properties', () => {
				const localVue = createLocalVue();
				localVue.use(reduxConnectVue, { store });

				const state = (state) => ({
					foo: state.foo,
					bar: state.bar
				});

				const Component = connect(state)({
					template: '<p>Test Component</p>'
				});

				const { vm } = mount(Component, { localVue });
				expect(vm.foo).toEqual('foo');
				expect(vm.bar).toEqual('bar');
			});

			it('uses the mapStateToPropsFactory option to map the return of the "mapStateToProps" method', () => {
				const localVue = createLocalVue();
				localVue.use(reduxConnectVue, {
					store,
					mapStateToPropsFactory: createStructuredSelector
				});

				const state = {
					foo: (state) => state.foo,
					bar: (state) => state.bar
				};

				const Component = connect(state)({
					template: '<p>Test Component</p>'
				});

				const { vm } = mount(Component, { localVue });
				expect(vm.foo).toEqual('foo');
				expect(vm.bar).toEqual('bar');
			});

			it('subscribes to the store and updates the properties defined in "mapStateToProps" when the relevant state changes', (done) => {
				const localVue = createLocalVue();
				localVue.use(reduxConnectVue, { store });

				const state = (state) => ({
					foo: state.foo,
					bar: state.bar
				});

				const Component = connect(state)({
					template: '<p>Test Component</p>'
				});

				const { vm } = mount(Component, { localVue });
				expect(vm.foo).toEqual('foo');
				expect(vm.bar).toEqual('bar');

				store.dispatch({ type: 'CHANGE_FOO', payload: 'FOO' });
				localVue.nextTick().then(() => {
					expect(vm.foo).toEqual('FOO');
				}).then(done);
			});

			it('unsubscribes from the store when it is destroyed', () => {
				const disconnectMock = jest.fn();
				jest.spyOn(store, 'subscribe').mockReturnValue(disconnectMock);
				const localVue = createLocalVue();
				localVue.use(reduxConnectVue, { store });

				const state = (state) => ({
					foo: state.foo,
					bar: state.bar
				});

				const Component = connect(state)({
					template: '<p>Test Component</p>'
				});

				mount(Component, { localVue }).destroy();
				expect(disconnectMock).toHaveBeenCalled();
			});
		});

		describe('mapDispatchToProps', () => {
			beforeEach(() => {
				jest.spyOn(store, 'dispatch');
			});

			it('extends components with a "mapDispatchToProps" method that maps a set of actions to the instance $actions property', () => {
				const localVue = createLocalVue();
				localVue.use(reduxConnectVue, { store });

				const Component = connect(undefined, actions)({
					template: '<p>Test Component</p>'
				});

				const { vm } = mount(Component, { localVue });

				vm.$actions.foo();
				expect(store.dispatch).toHaveBeenCalledWith({ type: 'foo' });

				vm.$actions.bar();
				expect(store.dispatch).toHaveBeenCalledWith({ type: 'bar' });
			});

			it('uses the mapDispatchToPropsFactory option to map the return of the "mapDispatchToProps" method', () => {
				const localVue = createLocalVue();
				localVue.use(reduxConnectVue, {
					store,
					mapDispatchToPropsFactory: (actionCreators) => (dispatch) => bindActionCreators(actionCreators, dispatch)
				});

				const boundActions = {
					foo: () => ({ type: 'foo' }),
					bar: () => ({ type: 'bar' })
				};

				const Component = connect(undefined, boundActions)({
					template: '<p>Test Component</p>'
				});

				const { vm } = mount(Component, { localVue });

				vm.$actions.foo();
				expect(store.dispatch).toHaveBeenCalledWith({ type: 'foo' });

				vm.$actions.bar();
				expect(store.dispatch).toHaveBeenCalledWith({ type: 'bar' });
			});

			it('allows actions to be dispatched within beforeCreate', () => {
				const localVue = createLocalVue();
				localVue.use(reduxConnectVue, {
					store,
					mapDispatchToPropsFactory: (actionCreators) => (dispatch) => bindActionCreators(actionCreators, dispatch)
				});

				const state = (state) => ({
					foo: state.foo
				});

				const actions = {
					changeFoo: (payload) => ({ payload, type: 'CHANGE_FOO' })
				};

				const Component = connect(state, actions)({
					beforeCreate() {
						this.$actions.changeFoo('FOO');
					},
					template: '<p>Test Component</p>'
				});

				const { vm } = mount(Component, { localVue });
				expect(vm.foo).toBe('FOO');
			});

			it('does not subscribe to the store', () => {
				jest.spyOn(store, 'subscribe');
				const localVue = createLocalVue();
				localVue.use(reduxConnectVue, { store });

				const Component = connect(undefined, actions)({
					template: '<p>Test Component</p>'
				});

				mount(Component, { localVue });
				expect(store.subscribe).not.toHaveBeenCalled();
			});

			it('does not unsubscribe from the store when it is destroyed', () => {
				const disconnectMock = jest.fn();
				jest.spyOn(store, 'subscribe').mockReturnValue(disconnectMock);
				const localVue = createLocalVue();
				localVue.use(reduxConnectVue, { store });

				const Component = connect(undefined, actions)({
					template: '<p>Test Component</p>'
				});

				mount(Component, { localVue }).destroy();
				expect(disconnectMock).not.toHaveBeenCalled();
			});
		});
	});
});
