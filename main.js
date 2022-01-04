import App from './App'
import Vue from 'vue'
Vue.config.productionTip = false;
// 生产环境 去除打印
if (process.env.NODE_ENV == 'production') { //development production
	let consoles = ['log', 'warn', 'info'];
	consoles.forEach(item => console[item] = () => {});
}

App.mpType = 'app'
const app = new Vue({
	...App
})

import LSUtil from '@/common/utils/localStorage.js';
Vue.prototype.$LSUtil = LSUtil;
import DesignUtil from '@/common/utils/design.js';
Vue.use(DesignUtil);
import views from '@/common/utils/views.js';
Vue.use(views);
//page-meta 标签属性
import pageMeta from '@/common/mixin/page-meta.js';
Vue.use(pageMeta);
app.$mount();
