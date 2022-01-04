const path = require('path')

function resolve(dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	chainWebpack: config => {
		config
			.plugin('define')
			.tap(args => {
				let apis;
				if (process.env.NODE_ENV == 'production') {
					apis = require(resolve('/common/api.build.js'));
				} else if (process.env.NODE_ENV == 'development') {
					apis = require(resolve('/common/api.dev.js'));
				}
				registerProcessENVKV(args, apis);
				return args
			})
	},

}


/**
 * 注册 环境变量
 * @param {Object} args
 * @param {Object} apis
 */
function registerProcessENVKV(args, apis) {
	const apiKeys = Object.keys(apis);
	apiKeys.forEach(item => {
		args[0]['process.env'][item] = JSON.stringify(apis[item]);
	})
}
