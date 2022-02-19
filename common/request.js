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
	//请求头配置
	config.header = Object.assign({
		'Content-Type': 'application/json',
		'Authorization': `${LS.getTokenSync()}`
	}, config.header);
	//不需要token
	if (config.noToken) { 
		delete config.header['Authorization'];
	}
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
	if (data.statusCode != 200) { //请求失败 http状态码不等于 200 时
		if (data.config.showLoadingError) {
			uni.showToast({
				title: `请求失败${data.statusCode}`,
				icon: 'none'
			})
		}
		reject({
			code: data.statusCode,
			msg: `请求失败`,
		});
	} else if ([1, 200].includes(data.data?.code)) { //请求成功 http状态码等于 200 时，接口状态码字段 等于 200|1 时
		resolve(data.data);
	} else { //请求成功 http状态码等于 200 时，接口状态码字段 不等于 200 时
		if (data.config.showLoadingError) {
			uni.showToast({
				title: data.data.msg || data.data.message || `请求失败${data.data.code}`,
				icon: 'none'
			})
		}
		reject(data.data);
	}
}

module.exports = Ajax;
