const identity = (v) => v;

/**
 * @param {*} [mapStateToProps]
 * @param {*} [mapDispatchToProps]
 * @returns {function (component: Object): Object}
 */
export const connect = (mapStateToProps, mapDispatchToProps) => (component) => ({
	...component,
	mapDispatchToProps,
	mapStateToProps
});

/**
 * @param {Object} Vue
 * @param {Object} options
 * @param {Object} options.store
 * @param {Function} [options.mapDispatchToPropsFactory]
 * @param {Function} [options.mapStateToPropsFactory]
 */
export default (Vue, {
	store,
	mapDispatchToPropsFactory = identity,
	mapStateToPropsFactory = identity
}) => {
	Vue.mixin({
		beforeCreate() {
			if (this.$options.mapDispatchToProps) {
				const mapDispatchToProps = mapDispatchToPropsFactory(this.$options.mapDispatchToProps);
				this.$actions = mapDispatchToProps(store.dispatch);
			}

			if (this.$options.mapStateToProps) {
				const mapStateToProps = mapStateToPropsFactory(this.$options.mapStateToProps);
				this._initialData = mapStateToProps(store.getState());

				const keys = Object.keys(this._initialData);
				this._disconnectState = store.subscribe(() => {
					const data = this.$data || this._initialData;
					const next = mapStateToProps(store.getState());

					keys.forEach((key) => {
						if (data[key] !== next[key]) {
							data[key] = next[key];
						}
					});
				});
			}
		},
		data() {
			return {
				...this._initialData
			};
		},
		destroyed() {
			if (this._disconnectState) {
				this._disconnectState();
			}
		}
	});
};
