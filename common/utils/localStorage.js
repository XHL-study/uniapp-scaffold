/**
 * 缓存工具类
 */
export default {
	/**
	 * 缓存 登录的token
	 * @param {String} data
	 */
	setToken(data) {
		setStorageSync('token', data);
	},
	getToken() {
		return getStorageSync('token');
	},
	removeToken() {
		removeStorageSync('token');
	},
	/**
	 * 缓存 登录的userid
	 * @param {String} data
	 */
	setUserId(data) {
		setStorageSync('user-id', data);
	},
	getUserId() {
		return getStorageSync('user-id');
	},
	removeUserId() {
		removeStorageSync('user-id');
	},

	/**
	 * 清空所有缓存
	 */
	clearAllStorage() {
		clearStorageSync();
	},
	setStorageSync,
	getStorageSync
}

/**
 * 同步 设置缓存内容
 * @param {String} key 键
 * @param {Any} val 值
 */
function
setStorageSync(key, val) {
	try {
		uni.setStorageSync(key, val);
	} catch (e) {
		console.error(`set storage sync error from key=${key} ,${e}`);
	}
}

/**
 * 同步 取出缓存内容
 * @param {String} key 键
 */
function getStorageSync(key) {
	try {
		return uni.getStorageSync(key);
	} catch (e) {
		console.error(`get storage sync error from key=${key} ,${e}`);
		return null;
	}
}

/**同步，删除某个缓存
 * @param {String} key
 */
function removeStorageSync(key) {
	try {
		uni.removeStorageSync(key);
	} catch (e) {
		console.error(`remove storage sync error from key=${key} ,${e}`);
	}
}

/**
 * 	同步清理本地所有的数据缓存
 */
function clearStorageSync() {
	try {
		uni.clearStorageSync();
	} catch (e) {
		// error
		console.error('clear all storage sync error', e);
	}
}
