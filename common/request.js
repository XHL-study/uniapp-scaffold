import Ajax from '@/common/http.js';

import LS from '@/common/utils/localStorage.js';
//请求 发起前 拦截器

Ajax.config.timeout = 16000; //超时时间
Ajax.interceptors.request = function(config) {
	//地址设置
	config.url = (config.baseUrl || process.env.VUE_APP_BASE_URL) + config.url;
	// config.url = ('http://192.168.1.110:10010/') + config.url;
	if (typeof config.showLoadingError != 'boolean')
		config.showLoadingError = true;
	//默认 请求头设置
	let defHeader = {
		'Content-Type': 'application/json',
		'Authorization': `${LS.getToken()}`
	};
	config.header = Object.assign(defHeader, config.header);

	//是否显示加载提示
	if (config.showLoading) {
		uni.showLoading({
			title: config.loadingText || '加载中',
			icon: config.loadingIcon || 'loading',
			mask: config.loadingMask
		});
	}
	return config;
}

//请求 结果 拦截器
Ajax.interceptors.response = function(data, resolve, reject) {
	console.log(data.config.url, '==>', data);
	uni.hideLoading();
	if (data.statusCode == 200 && data.data.code == 200)
		resolve(data.data);
	// else if (data?.data?.code == 401 && data?.data?.msg?.includes('认证失败')) {
	// 	LS.setToken(null);
	// 	var pages = getCurrentPages();
	// 	var page = pages[pages.length - 1];
	// 	//重新登录
	// 	uni.navigateTo({
	// 		url: `/pages/login/index?redirectPage=${encodeURIComponent(page.__page__.fullPath)}`,
	// 		animationType: 'none'
	// 	})
	// } 
	else if (data.data) {
		if (data.config.showLoadingError)
			uni.showToast({
				title: data.data.msg || data.data.message || data.data.error || `请求失败${data.data.code}`,
				icon: 'none'
			})
		//delete data.config;
		reject(data.data);
	} else {
		reject(data);
	}
}

module.exports = {
	get(data) {
		data.method = 'GET';
		return Ajax.request(data);
	},
	post(data) {
		data.method = 'POST';
		return Ajax.request(data);
	},
	put(data) {
		data.method = 'PUT';
		return Ajax.request(data);
	},
	del(data) {
		data.method = 'DELETE';
		return Ajax.request(data);
	},
	/**
	 *  自定义错误处理函数
	 * @param {String} message : 错误说明
	 * @param {Boolean} showToast : 是否展示错误提示
	 * @param {String} toastIcon : 错误提示icon类型：error,none,success
	 */
	CustomErrorMessage(message = '参数错误', showToast = false, toastIcon = 'error') {
		if (showToast) {
			uni.showToast({
				title: message,
				icon: toastIcon
			})
		}
		return Promise.reject({
			code: 601,
			message,
		});
	}
}
