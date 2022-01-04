let proportion = 1;
module.exports = {
	/**
	 * 根据设计稿 转换为实际宽度	 
	 */
	transformDesignWidth(w = 0) {
		return w * this.proportion;
	},
	/** 
	 * 根据设计稿 转换为rem	 
	 */
	transformDesignRem(w = 0, toFixed = 5) {
		return (w / this.rootValue).toFixed(toFixed);
	},
	/**
	 * 刷新缩放比
	 */
	refrenshProportion() {
		proportion = uni.getSystemInfoSync().screenWidth / this.rootValue / 10;
	},
	get rootValue() { //设计稿宽度/10 uniapp 设计稿宽度默认 750px
		return 75;
	},
	get proportion() { //缩放比例
		return proportion;
	},
	install(Vue) {
		this.refrenshProportion();
		//注入app 全局
		Vue.prototype.$design = this;
	},
}
