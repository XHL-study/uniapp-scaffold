/**
 * 网络状态
 */
export default function networkStatus() {
	return new Promise((resolve, reject) => {
		uni.getNetworkType({
			success: function(res) {
				// 'unknown'
				if (['none'].includes(res.networkType)) {
					reject(res.networkType)
				} else {
					resolve(res.networkType);
				}
			},
			fail: function() {
				reject('none');
			}
		});
	});
}
