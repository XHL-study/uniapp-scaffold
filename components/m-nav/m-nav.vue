<template>
	<view id="nav" class="m-nav">
		<template v-if="showPlaceholderBox">
			<view class="nav-box" v-if="isFixed"></view>
		</template>
		<view class="nav-box" :class="[position]" :style="[{ background: background }, navStyle]">
			<view class="left" @click="leftClick">
				<template v-if="showBackBtn">
					<view class="iconfont" :class="[leftIcon]" :style="{ color: leftIconColor }"></view>
					<text>{{ leftText }}</text>
				</template>
			</view>
			<view class="title" :style="{ 'text-align': titleAlign, color: titleColor, 'font-size': titleSize }">
				<slot name="title">{{ title }}</slot>
			</view>
			<view class="right"></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'm-nav',
	props: {
		showPlaceholderBox: {
			type: Boolean,
			default: true
		},
		position: {
			// fixed , absolute
			type: String,
			default: 'fixed'
		},
		title: {
			default: ''
		},
		titleColor: {
			default: '#424242'
		},
		titleAlign: {
			// center , left right
			type: String,
			default: 'center'
		},
		titleSize: {
			type: String,
			default: '20px'
		},
		leftIcon: {
			// @/common/css/iconfont/index.css
			type: String,
			default: 'icon-you'
		},
		leftIconColor: {
			// @/common/css/iconfont/index.css
			type: String,
			default: '#424242'
		},
		leftText: {
			type: String,
			default: ''
		},
		background: {
			type: String,
			default: '#fff'
		},
		showBackBtn: {
			type: Boolean,
			default: true
		},
		backClick: {
			type: Function,
			default: function() {
				uni.navigateBack();
			}
		},
		navStyle: {
			type: Object,
			default: () => {
				return {
					// 'box-shadow': '0 .3px .3px gray'
					// 'border-bottom': 'thin solid #D4D4D4'
				};
			}
		}
	},
	computed: {
		isFixed() {
			return this.position == 'fixed';
		}
	},
	methods: {
		leftClick() {
			if (!this.showBackBtn) return;
			if (!this.backClick) {
				uni.navigateBack();
			} else this.backClick.bind(this.$parent)();
		},
		navRect() {
			return this.$views.getRect(this, '#nav');
		}
	}
};
</script>

<style lang="scss">
.m-nav {
	min-height: 50px;
	width: 100%;
	position: relative;

	.nav-box {
		z-index: 9;
		min-height: 50px;
		width: 100%;
		padding-top: var(--status-bar-h);
		box-sizing: content-box;

		top: 0;
		left: 0;

		display: flex;
		flex-direction: row;
		align-items: center;

		.left,
		.right {
			display: flex;
			min-height: 100%;
			min-width: 50px;
			align-items: center;
			justify-content: center;

			&:active {
				transform: scale(1.02);
			}
		}

		.icon-you {
			display: inline-block;
			transform: rotate(-180deg);
			font-size: 24px;
		}

		.title {
			min-height: 100%;
			flex: 1;
		}
	}

	.fixed {
		position: fixed;
	}

	.absolute {
		position: absolute;
	}
}
</style>
