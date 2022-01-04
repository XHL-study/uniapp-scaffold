import request from '@/common/request.js';
import LSUtil from '@/common/utils/localStorage.js';
export default {
	getTypesDishes() {
		return request.get({
			url: '/menu/type/applist',
			showLoading: true
		})
	},

}
