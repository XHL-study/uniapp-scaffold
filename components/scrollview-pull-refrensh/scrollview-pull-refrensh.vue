<template>
	<scroll-view class="scrollview-pull-refrensh" :scroll-y="scrollY" :style="scrollviewH"
		:refresher-enabled="refresherEnabled" :scroll-top="scrollToTop" @scroll="$emit('scroll',$event)" :refresher-triggered="refresherTriggered" @refresherrefresh="scrollTop"
		@scrolltolower="scrollBottom">
		<slot name="header"></slot>
		<luanqing-empty v-if="showEmpty" :show="showEmpty" :text="emptyText"></luanqing-empty>
		<template v-else>
			<!-- 内容插槽 -->
			<slot></slot>
			<uni-load-more :status="loadMore" :contentText="moreConfig.contentText"></uni-load-more>
		</template>
	</scroll-view>
</template>

<script src="./index.js"></script>

<style scoped lang="scss" src="./index.scss"></style>
