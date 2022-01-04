import qs from 'qs';

function Ajax() {
	/**
	 * 拦截器 对象
	 */
	this.interceptors = {
		request: function(config) { //默认不拦截
			return config
		},
		response: function(data, resolve, reject) { //默认不拦截
			if (data.statusCode == 200)
				resolve(data.data);
			else if (data.data)
				reject(data.data);
			else
				reject(data);
		},
	}

	this.config = {
		timeout: 60000, //超时时长 毫秒
	}
}

/**
 * 请求方法
 * @param {Object} data
 */
Ajax.prototype.request = function(data, abortCall) {
	return new Promise((resolve, reject) => {
		//超时设置
		data.timeout = data.timeout || this.config.timeout;
		//请求前拦截 处理
		data = this.interceptors.request(data);

		http(data, abortCall).then(res => {
			this.interceptors.response({
				...res,
				config: data
			}, resolve, reject);
		}).catch(res => {
			this.interceptors.response({
				...res,
				config: data
			}, resolve, reject);
		});
	});
}
/**
 * 请求对象实例
 */
let ajax = new Ajax();

/**
 * 新实例
 */
ajax.create = function() {
	return new Ajax();
}
module.exports = ajax;
module.exports.default = ajax;


/**
 * 统一 请求封装
 * @param {Object} data
 *  data 参数说明 {
		showLoading:,//是否显示加载toast 默认为 false
		loadingIcon:,//加载提示图标，参考 [https://uniapp.dcloud.io/api/ui/prompt?id=showloading]
		loadingText:,//加载提示文字 默认为 加载中,
		loadingMask:,//是否显示透明蒙层，防止触摸穿透，默认：false
		showLoadingError:,//是否默认显示加载错误信息toast 默认为 true
		
		url:,请求地址
		baseUrl:"",//请求根地址
		method: //请求方式get,post,...
		data: //body参数
		query://链接地址上的参数
		timeout: //超时时间
		dataType://参考uniapp文档 
		header: //请求头
	 }
 */
function http(data, abortCall) {
	//地址栏参数 转换
	let urlDataString = '';
	if (data.query)
		urlDataString = (data.url.indexOf('?') < 0 ? '?' : '&') + qs.stringify(data.query);

	//请求
	return new Promise((resolve, reject) => {
		let rw = uni.request({
			url: data.url + urlDataString,
			method: data.method,
			data: data.data,
			timeout: data.timeout,
			dataType: data.dataType || 'json',
			header: data.header,
			success: async (res) => {
				resolve(res);
			},
			fail(res) {
				reject(res);
			}
		});
		if (typeof abortCall == 'function')
			abortCall(rw);
	});
}
