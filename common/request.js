import Ajax from '@/common/http.js';
import Api from '@/common/api.js';

import LS from '@/common/utils/localStorage.js';

//请求 发起前 拦截器
Ajax.config.timeout = 16000; //超时时间
Ajax.interceptors.request = function(config) {
	//地址设置
	config.url = (config.baseUrl || Api.baseUrl) + config.url;
	if (typeof config.showLoadingError != 'boolean')
		config.showLoadingError = true;
	//默认 请求头设置
	let defHeader = {
		'Content-Type': 'application/json',
		// 'Authorization': `Basic ${LS.getTokenSync()}`
		'Authorization': `${LS.getTokenSync()}`
	};
	if (config.noToken) { //不需要token
		delete defHeader['Authorization'];
	}
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
	uni.hideLoading();
	if (data.statusCode != 200) {
		reject({
			code: data.statusCode,
			msg: "请求失败",
		});
		if (data.config.showLoadingError) {
			uni.showToast({
				title: `请求失败${data.statusCode}`,
				icon: 'none'
			})
		}
	} else if ([1, 200].includes(data.data?.code)) {
		resolve(data.data);
	} else {
		if (data.config.showLoadingError) {
			uni.showToast({
				title: data.data.msg || data.data.message || `请求失败${data.data.code}`,
				icon: 'none'
			})
		}
		//delete data.config;
		reject(data.data);
	}
}

module.exports = Ajax;
