<template>
	<uni-popup ref="popup" :mask-click="maskClick" @touchmove.prevent.stop="">
		<view
			class="m-signature"
			:style="{
				height: pHeight + 'px',
				width: pWidth + 'px'
			}"
		>
			<view @click="cancel()" class="iconfont icon-remove close"></view>
			<canvas
				:style="{
					height: cHeight + 'px',
					width: cWidth + 'px'
				}"
				class="handWriting"
				:disable-scroll="true"
				@touchstart="uploadScaleStart"
				@touchmove="uploadScaleMove"
				canvas-id="handWriting"
			></canvas>

			<view class="handBtn">
				<button size="mini" @click="retDraw" class="delBtn">重写</button>
				<!-- <button size="mini" @click="triggerFullScreen" class="saveBtn">全屏</button> -->
				<!-- <button size="mini" @click="previewCanvasImg" class="previewBtn">预览</button> -->

				<button type="primary" size="mini" @click="subCanvas" class="subBtn">确定</button>
			</view>
		</view>
	</uni-popup>
</template>

<script>
import DesignUtil from '@/common/utils/design.js';
import UploadFileService from '@/service/uploadFile.js';

let landscapeOb;
export default {
	//签名组件
	name: 'm-signature',
	props: {
		maskClick: {
			//点击蒙层是否关闭
			type: Boolean,
			default: false
		},
		canvasBGColor: {
			//画布背景色，不设置导出图片为透明的
			type: String,
			default: '#EEEEEE'
		},
		lineSize: {
			//画笔粗细
			type: Number,
			default: 2
		},
		lineColor: {
			//画笔粗细
			type: String,
			default: '#1A1A1A'
		}
	},
	data() {
		return {
			loading: false,
			isShow: false,
			isSignature: false,
			ctx: '',
			startX: null,
			startY: null,
			canvasHeight: DesignUtil.transformDesignWidth(320),
			canvasWidth: DesignUtil.transformDesignWidth(640),
			signatureUrl: '', //签名地址：上传后的地址、本地临时地址
			isFullScreen: false,
			pWidth: DesignUtil.transformDesignWidth(677),
			pHeight: DesignUtil.transformDesignWidth(432),
			cWidth: DesignUtil.transformDesignWidth(640),
			cHeight: DesignUtil.transformDesignWidth(320)
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.landscapeObserver();
		});
	},
	methods: {
		triggerFullScreen() {
			if (this.isFullScreen) {
				this.$nextTick(function() {
					const { screenWidth, screenHeight } = uni.getSystemInfoSync();
					this.pWidth = screenWidth - 50;
					this.pHeight = screenHeight - 50;
					this.cWidth = this.pWidth - DesignUtil.transformDesignWidth(37);
					this.cHeight = this.pHeight - DesignUtil.transformDesignWidth(132);
					this.canvasHeight = this.cHeight;
					this.canvasWidth = this.cWidth;
					this.setCanvasBg();
					uni.hideTabBar({
						animation: true
					});
				});
			} else {
				this.canvasHeight = DesignUtil.transformDesignWidth(320);
				this.canvasWidth = DesignUtil.transformDesignWidth(640);

				this.pWidth = DesignUtil.transformDesignWidth(677);
				this.pHeight = DesignUtil.transformDesignWidth(432);
				this.cWidth = this.canvasWidth;
				this.cHeight = this.canvasHeight;
				this.setCanvasBg();
				uni.showTabBar({
					animation: true
				});
			}
		},
		openPopup(type = 'center') {
			this.isShow = true;
			this.$refs.popup.open(type);
			this.ctx = uni.createCanvasContext('handWriting');
			this.$nextTick(function() {
				//设置canvas背景
				this.setCanvasBg();
			});
			this.$nextTick(() => {
				this.triggerFullScreen();
			});
		},
		closePopup() {
			this.isShow = false;
			this.$refs.popup.close();
			this.setCanvasBg();
			uni.showTabBar({
				animation: true
			});
		},
		cancel() {
			this.$emit('cancel');
			//取消
			this.closePopup();
		},
		// 笔迹开始
		uploadScaleStart(e) {
			this.startX = e.changedTouches[0].x;
			this.startY = e.changedTouches[0].y;
			//设置画笔参数
			//画笔颜色
			this.ctx.setStrokeStyle(this.lineColor);
			//设置线条粗细
			this.ctx.setLineWidth(this.lineSize);
			//设置线条的结束端点样式
			this.ctx.setLineCap('round'); //'butt'、'round'、'square'
			//开始画笔
			this.ctx.beginPath();
			this.isSignature = true;
		},
		// 笔迹移动
		uploadScaleMove(e) {
			//取点
			let temX = e.changedTouches[0].x;
			let temY = e.changedTouches[0].y;
			//画线条
			this.ctx.moveTo(this.startX, this.startY);
			this.ctx.lineTo(temX, temY);
			this.ctx.stroke();
			this.startX = temX;
			this.startY = temY;
			this.ctx.draw(true);
		},
		/**
		 * 重写
		 */
		retDraw() {
			this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
			this.ctx.draw();
			//设置canvas背景
			this.setCanvasBg();
		},
		//完成
		subCanvas() {
			if (!this.isSignature)
				return uni.showToast({
					title: '请签名',
					icon: 'none'
				});
			if (this.loading) return;
			uni.canvasToTempFilePath({
				canvasId: 'handWriting',
				fileType: 'png',
				quality: 1, //图片质量
				success: res => {
					this.signatureUrl = res.tempFilePath;

					//上传签名文件到服务器
					this.loading = true;
					UploadFileService.uploadSignature(this.signatureUrl)
						.then(res => {
							this.loading = false;
							if (res?.code == 200) {
								//确认
								this.$emit('confirm', res.data[0]?.url);
								this.closePopup();
								return;
							}
							return Promise.reject({
								code: 500
							});
						})
						.catch(res => {
							this.loading = false;
							uni.showToast({
								title: `上传失败${res?.data?.code || ''}`,
								icon: 'error'
							});
						});
				}
			});
		},
		//保存到相册
		// saveCanvasAsImg() {
		// 	uni.canvasToTempFilePath({
		// 		canvasId: 'handWriting',
		// 		fileType: 'png',
		// 		quality: 1, //图片质量
		// 		success(res) {
		// 			console.log(res.tempFilePath, 'canvas生成图片地址');
		// 			uni.saveImageToPhotosAlbum({
		// 				filePath: res.tempFilePath,
		// 				success(res) {
		// 					uni.showToast({
		// 						title: '已保存到相册',
		// 						duration: 2000
		// 					});
		// 				}
		// 			});
		// 		}
		// 	});
		// },
		//预览
		// previewCanvasImg() {
		// 	uni.canvasToTempFilePath({
		// 		canvasId: 'handWriting',
		// 		fileType: 'jpg',
		// 		quality: 1, //图片质量
		// 		success(res) {
		// 			uni.previewImage({
		// 				urls: [res.tempFilePath] //预览图片 数组
		// 			});
		// 		}
		// 	});
		// },
		//设置canvas背景色  不设置  导出的canvas的背景为透明
		setCanvasBg(bg) {
			this.isSignature = false;
			this.ctx.rect(0, 0, this.canvasWidth, this.canvasHeight);
			this.ctx.setFillStyle(bg || this.canvasBGColor);
			this.ctx.fill(); //设置填充
			this.ctx.draw(); //开画
		},
		landscapeObserver() {
			landscapeOb = uni.createMediaQueryObserver(this);
			landscapeOb.observe(
				{
					orientation: 'landscape' //屏幕方向为纵向
				},
				matches => {
					this.isFullScreen = matches;
					if (!this.ctx || !this.isShow) return;
					this.triggerFullScreen();
				}
			);
		}
	},
	destroyed() {
		landscapeOb.disconnect();
	}
};
</script>

<style lang="scss" scoped>
view.uni-popup {
	z-index: 99 !important;
}

.m-signature {
	position: relative;
	width: 677rpx;
	height: 432rpx;
	background: #ffffff;
	border-radius: 10rpx;
	padding: 17rpx;
	margin: auto;

	.close {
		position: absolute;
		right: -24rpx;
		top: -24rpx;
		width: 48rpx;
		height: 48rpx;
		opacity: 0.5;
		font-size: 48rpx;
		color: #747474;
	}

	.handWriting {
		width: 640rpx;
		height: 320rpx;
		background: #eeeeee;
	}

	.handBtn button {
		font-size: 28rpx;
		border: none;
		color: #0061f3;
		background: none;

		&::after {
			border: none;
		}
	}

	.handBtn {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 95rpx;
	}

	.delBtn {
		color: #666;
	}

	.subBtn {
		color: #fff;
	}

	/*Peach - 新增 - 保存*/

	.saveBtn {
		color: #666;
	}

	.previewBtn {
		color: #666;
	}
}
</style>
