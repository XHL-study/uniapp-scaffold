module.exports = {
	install(Vue) {
		//注入app 全局
		Vue.prototype.$views = this;
	},
	/**
	 * @param {Object}  vm	vue组件对象
	 * @param {String}  el	节点选择字符串
	 */
	getRect(vm, el = '#xx') {
		return new Promise((resolve, reject) => {
			const nodeRef = uni.createSelectorQuery().in(vm).select(el);
			nodeRef.boundingClientRect(data => {
				resolve(data);
			}).exec();
		})
	}
}
