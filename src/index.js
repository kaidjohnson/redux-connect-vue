import { inject, onBeforeUnmount, shallowReactive, toRefs } from 'vue';

const OptionsSymbol = Symbol();

/**
 * @param {*} v
 * @returns {*}
 */
const identity = (v) => v;

/**
 * @param {Object} app
 * @param {Object} options
 * @param {Object} options.store
 * @param {Function} [options.mapDispatchToPropsFactory]
 * @param {Function} [options.mapStateToPropsFactory]
 */
export default {
	install(app, {
		mapDispatchToPropsFactory = identity,
		mapStateToPropsFactory = identity,
		store
	}) {
		app.provide(OptionsSymbol, {
			mapDispatchToPropsFactory,
			mapStateToPropsFactory,
			store
		});
	}
};

/**
 * @param {*} mapDispatchToProps
 * @returns {Object}
 */
export const useActions = (mapDispatchToProps) => {
	const { mapDispatchToPropsFactory, store } = inject(OptionsSymbol);

	return mapDispatchToPropsFactory(mapDispatchToProps)(store.dispatch);
};

/**
 * @param {*} mapStateToProps
 * @returns {Object}
 */
export const useState = (mapStateToProps) => {
	const { mapStateToPropsFactory, store } = inject(OptionsSymbol);
	const mapStateToPropsFinal = mapStateToPropsFactory(mapStateToProps);
	const state = shallowReactive(mapStateToPropsFinal(store.getState()));

	onBeforeUnmount(store.subscribe(() => {
		const next = mapStateToPropsFinal(store.getState());

		Object.keys(next).forEach((key) => {
			state[key] = next[key];
		});
	}));

	return toRefs(state);
};
