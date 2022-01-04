export default {
	name: 'scrollview-pull-refrensh',
	components: {},
	props: {
		dataList: { //数据列表
			type: Array,
			default: () => []
		},
		scrollToTop: { //y轴滚动到指定位置
			type: Number,
			default: 0
		},
		refresherEnabled: { //refresher-enabled	Boolean	false	开启自定义下拉刷新
			type: Boolean,
			default: true,
		},
		scrollY: { //是否允许上下滚动
			type: Boolean,
			default: true,
		},
		loadMoreEnabled: { //refresher-enabled	Boolean	false	开启上拉加载更多
			type: Boolean,
			default: true,
		},
		canStartLodingData: { //是否初始化完成,当为true是，才会开始拉取数据
			type: Boolean,
			default: false,
		},
		height: { // 滚动视图高度
			type: String,
			default: null
		},
		hideEmpty: { // 隐藏空占位视图
			type: Boolean,
			default: false,
		},
		emptyText: { //无数据时展示的
			type: String,
			default: "暂无数据"
		},
		moreConfig: { //uni-load-more 组件配置
			default: () => {
				return {
					contentText: {
						contentdown: ' ',
						contentrefresh: '正在加载...',
						contentnomore: '没有更多数据了'
					},
					//其他配置项 参考 /uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue
				}
			}
		},
		dataKey: { // 数据 key
			type: String,
			default: "data"
		},
		listKey: { // 列表数据 key
			type: String,
			default: "records"
		},
		totalKey: { // 数据总数 key
			type: String,
			default: "total"
		},
		pageIndexKey: { // 页码 key
			type: String,
			default: "page"
		},
		pageSizeKey: { // 每页数量 key
			type: String,
			default: "size"
		},
		queryData: { // 请求参数 
			require: true,
			type: Object,
			default: () => {
				return {
					page: 1,
					size: 10,
				}
			}
		},
		loadDataFunc: { //请求方法，必须是Promise对象
			require: true,
			type: Promise | Object,
			default: Promise.resolve(),
		}
	},
	data() {
		return {
			loadMore: 'more', //more/loading/noMore	
			loading: false,
			refresherTriggered: false,
			loaded: false,
			page: this.queryData[this.pageIndexKey] || 1,
			pageSize: this.queryData[this.pageSizeKey] || 10,
			list: this.dataList || []
		}
	},
	computed: {
		showEmpty() {
			return this.list.length == 0 && this.loaded && !this.hideEmpty;
		},
		scrollviewH() {
			if (this.height)
				return `height:${this.height} !important;`;
			return '';
		}
	},
	watch: {
		canStartLodingData(to) {
			if (to)
				this.getList();
		},
		dataList(to) {
			this.list = to || [];
		}
	},
	methods: {
		/**
		 * 下拉刷新数据
		 * @param {boolean}  triggered 刷新数据时，是否显示下拉刷新标志
		 */
		scrollTop(triggered = true) {
			this.refresherTriggered = !!triggered;
			this.page = 1;
			// this.loaded = false;
			this.loadMore = 'more';
			this.list = [];
			this.getList();
		},
		/**
		 * 拉取更多数据
		 * scrollY=false，可以手动调用此方法
		 */
		scrollBottom() {
			if (this.loadMoreEnabled)
				this.getList();
		},
		getList() {
			if (typeof this.loadDataFunc != 'function') throw new Error("props loadDataFunc is not Promise function");
			if (this.loading || this.loadMore == 'noMore') {
				this.$nextTick(() => {
					this.refresherTriggered = false;
				})
				return;
			};
			const query = {
				...this.queryData,
				[this.pageIndexKey]: this.page,
				[this.pageSizeKey]: this.pageSize,
			}
			this.loading = true;
			this.$emit('isLoading', this.loading);
			this.loaded = false;
			this.loadMore = 'loading';
			// console.log(query, this.loadDataFunc(query));
			//绑定 父组件 this
			//拉取数据
			this.loadDataFunc(query).then(res => {
				let list = res[this.dataKey]; //[this.listKey];
				this.list = this.list.concat(list);

				if (this.list.length >= res[this.totalKey]) {
					this.loadMore = 'noMore'
				} else {
					this.loadMore = 'more';
					this.page++;
				}
				//this.list为最终数据，不需要自己组装，list为当前页的数据，可以更改内部数据，不需要组装到data
				this.$emit('changeData', this.list, list, res);
				//当前页面的页码、每页数量
				this.$emit('pageData', {
					[this.pageIndexKey]: this.page,
					[this.pageSizeKey]: this.pageSize,
				});
				this.loaded = true;
				this.refresherTriggered = this.loading = false;
				this.$emit('isLoading', this.loading);
			}).catch(res => {
				this.loadMore = 'more'
				this.loaded = true;
				this.refresherTriggered = this.loading = false;
				this.$emit('isLoading', this.loading);
				return Promise.reject(res);
			})
		}
	}
}
