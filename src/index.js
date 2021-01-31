import { inject, onBeforeDestroy, reactive, toRefs } from 'vue-function-api';

const OptionsSymbol = Symbol();

/**
 * @param {*} v
 * @returns {*}
 */
const identity = (v) => v;

/**
 * @param {Object} Vue
 * @param {Object} options
 * @param {Object} options.store
 * @param {Function} [options.mapDispatchToPropsFactory]
 * @param {Function} [options.mapStateToPropsFactory]
 */
export default (Vue, {
	mapDispatchToPropsFactory = identity,
	mapStateToPropsFactory = identity,
	store
}) => {
	Vue.mixin({
		provide: {
			[OptionsSymbol]: {
				mapDispatchToPropsFactory,
				mapStateToPropsFactory,
				store
			}
		}
	});
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
	const state = reactive(mapStateToPropsFinal(store.getState()));

	onBeforeDestroy(store.subscribe(() => {
		const next = mapStateToPropsFinal(store.getState());

		Object.keys(next).forEach((key) => {
			state[key] = next[key];
		});
	}));

	return toRefs(state);
};
