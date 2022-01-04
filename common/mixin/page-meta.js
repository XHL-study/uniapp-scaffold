import DesignUtil from '@/common/utils/design.js';

module.exports = {
	install(Vue) {
		const sysInfo = uni.getSystemInfoSync();

		// page-meta 标签属性
		let pageMeta = {
			rootFontSize: (32 * DesignUtil.proportion) + 'px', //根据设计稿字体大小变化（750宽度）
			// rootFontSize: 'system', //根据系统字体大小变化
			pageStyle: `--status-bar-h:${sysInfo.statusBarHeight}px;`, //
		};

		//页面注入  $pageMeta data属性
		Vue.prototype.$pageMeta = pageMeta;
		Vue.prototype.$statusBarHeight = sysInfo.statusBarHeight;
		let rFontSize = ''; //
		Vue.mixin({
			data() {
				// 仅在【页面】中 混入
				if (this.mpType == 'page') {
					console.warn('page data Properties $pageMeta are overridden');
					return {
						$pageMeta: pageMeta,
					}
				}
				return {}
			},
			onShow() {
				if (this.mpType == 'page' && rFontSize && this.$pageMeta.rootFontSize != rFontSize) {
					this.$pageMeta.rootFontSize = rFontSize;
				}
			},
			// onLoad() {
			// 	wx.setRootFontSize = this.setRootFontSize;
			// },
			methods: {
				//混入 设置页面rootFontSize方法 rootFontSize = [18px | system]
				setRootFontSize(rootFontSize = pageMeta.rootFontSize) {
					rFontSize = this.$pageMeta.rootFontSize = rootFontSize;
				}
			}
		})
	}
}
