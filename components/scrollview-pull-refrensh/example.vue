<template>
	<scrollview-pull-refrensh ref="scrollviewPullRefrensh" :canStartLodingData="canStartLodingData"
		:queryData="queryData" :loadDataFunc="loadData" @changeData="changeData" @pageData="pageData">
		<template>
			<template v-for="(item,i) in list">
				<view :key="i">
					{{item}}
				</view>
			</template>
		</template>
	</scrollview-pull-refrensh>
</template>

<script>
	import MonitoringDataService from '@/user/common/service/monitoringData.js'
	export default {
		data() {
			return {
				canStartLodingData: false,
				list: [],
				queryData: {
					page: 1,
					size: 10,
					otherProp1: 'otherProp1',
					otherProp2: 'otherProp2',
				}
			}
		},
		onLoad() {
			setTimeout(() => {
				// 被动加载数据
				this.canStartLodingData = true;
			}, 3000);
			// 主动加载数据
			// 下拉刷新
			// this.$refs.scrollviewPullRefrensh.scrollTop();
			// 加载更多
			// this.$refs.scrollviewPullRefrensh.scrollBottom();
		},
		methods: {
			loadData: MonitoringDataService.getMonitorDay.bind(MonitoringDataService),
			//data为最终数据，不需要自己组装，
			//pageData为当前页的数据，可以更改内部数据，不需要组装到data
			//dataSource 为当次请求数据集合。
			changeData(data, pageData, dataSource) {
				this.list = data;
			},
			pageData(data) {
				console.log(`第${data.page}页`)
				console.log(`每页${data.size}条数据`)
			}

		}
	}
</script>

<style>
</style>
