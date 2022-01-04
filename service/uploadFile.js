import request from '@/common/request.js';
// import md5 from 'md5';
import LS from '@/common/utils/localStorage.js';
export default {
	uploadSignature(file) {
		/**
		 * 上传签名图片
		 */
		return upload({
			filePath: file,
			fileName: 'files',
			url: '/oss/uploadByFile',
			showLoading: true
		});
		// return Promise.reject({
		// 	msg: '当前客户端未实现',
		// 	code: 500
		// })
	},
	/**
	 * @param {Number} maxCount 图片最大张数
	 */
	async uploadImgs(maxCount = 1) {
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				count: maxCount,
				success(res) {
					const files = res.tempFilePaths?.map((v, i) => {
						return {
							name: 'files',
							file: res.tempFiles[i],
							uri: v
						}
					});
					upload({
						files: files,
						url: '/oss/uploadByFile',
						showLoading: true
					}).then(res => {
						resolve(res);
					}).catch(res => {
						reject(res);
					})
				},
				fail(res) {
					//message = '', showToast = false, toastIcon = 'error'
					reject(request.CustomErrorMessage(res.errMsg, true, 'none'));
				}
			})
		});
	}
}



/**
 * @param {Object} data
 * 	data = {
	 showLoading:Boolean 是否显示 loading,默认显示
	 baseUrl:String 服务器baseurl
	 url:String 文件上传地址
	 filePath：String 要上传的图片路径
	 fileName：String 要上传的图片名字
	 files:Array<String> 要上传的图片路径集合
 }
 */
function upload(data) {
	if (data.showLoading) {
		uni.showLoading({
			title: data.loadingTitle || '上传中，请稍后',
		})
	}
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: (data.baseUrl || process.env.VUE_APP_BASE_URL) + data.url, //仅为示例，非真实的接口地址
			filePath: data.filePath,
			files: data.files,
			header: {
				'Authorization': `${LS.getToken()}`
			},
			name: data.fileName || 'file',
			success: (res) => {
				uni.hideLoading();
				if (typeof res.data == 'string')
					res.data = JSON.parse(res.data);
				resolve(res.data || {})
			},
			fail: (res) => {
				uni.hideLoading();
				if (typeof res.data == 'string')
					res.data = JSON.parse(res.data);
				reject(res.data || {});
			}
		});
	})
}
