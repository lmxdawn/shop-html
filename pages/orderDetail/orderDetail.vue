<template>
	<view class="container">
		<view class="tui-order-header">
			<image :src="$tui.staticUrl() + '/static/images/order/img_detail_bg.png'" mode="widthFix" class="tui-img-bg"></image>
			<view class="tui-header-content">
				<view>
					<view class="tui-status-text">{{getStatusText(order.status)}}</view>
					<view class="tui-reason"><text class="tui-reason-text">{{getReason(order.status)}}</text>
						<tui-countdown :time="order.expire_second" color="rgba(254,254,254,0.75)" colonColor="rgba(254,254,254,0.75)" bcolor="transparent"
						 bgcolor="transparent" v-if="order.status===0"></tui-countdown>
					</view>
				</view>
				<image v-if="order.id" :src="getImg(order.status)" class="tui-status-img" mode="widthFix"></image>
			</view>
		</view>
		<tui-list-cell :last="true" :hover="false">
			<view class="tui-flex-box">
				<image :src="$tui.staticUrl() + '/static/images/order/img_order_address3x.png'" class="tui-icon-img"></image>
				<view class="tui-addr">
					<view class="tui-addr-userinfo">{{order.name}}<text class="tui-addr-tel">{{order.tel | formatTel}}</text></view>
					<view class="tui-addr-text">{{order.address}}</view>
				</view>
			</view>
		</tui-list-cell>

		<view class="tui-order-item">
			<tui-list-cell :hover="false" :lineLeft="false">
				<view class="tui-goods-title">
					商品信息
				</view>
			</tui-list-cell>
			<tui-list-cell padding="0" v-for="(item,index) in goodList" :key="index">
				<view class="tui-goods-item" @click="goodDetail(item)">
					<image :src="item.original_img" class="tui-goods-img"></image>
					<view class="tui-goods-center">
						<view class="tui-goods-name">{{item.good_name}}</view>
						<view class="tui-goods-attr">
							<text class="tui-goods-attr-tag">自营</text>
							<text class="tui-goods-attr-tag" v-if="item.is_hot === 1" size="small" :plain="true" type="red" shape="circle">热卖</text>
							<text class="tui-goods-attr-tag" v-if="item.is_new === 1" size="small" :plain="true" type="high-green" shape="circle">新品</text>
							<text class="tui-goods-attr-tag" v-if="item.is_recommend === 1" size="small" :plain="true" type="warning" shape="circle">推荐</text>
						</view>
					</view>
					<view class="tui-price-right">
						<view>￥{{item.money}}</view>
						<view>x{{item.count}}</view>
					</view>
				</view>
			</tui-list-cell>
			<view class="tui-goods-info">
				<view class="tui-price-flex tui-size24">
					<view>商品总额</view>
					<view>￥{{order.pay_money}}</view>
				</view>
				<view class="tui-price-flex tui-size32">
					<view class="tui-flex-shrink">实付款</view>
					<view class="tui-goods-price tui-primary-color">
						<view class="tui-size-24">￥</view>
						<view class="tui-price-large">{{order.pay_money}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="tui-order-info">
			<tui-list-cell :hover="false">
				<view class="tui-order-title">
					订单信息
				</view>
			</tui-list-cell>
			<view class="tui-order-content">
				<view class="tui-order-flex">
					<view class="tui-item-title">订单号:</view>
					<view class="tui-item-content">{{order.order_num}}</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">创建时间:</view>
					<view class="tui-item-content">{{order.create_time}}</view>
				</view>
				<view class="tui-order-flex" v-if="order.pay_time">
					<view class="tui-item-title">付款时间:</view>
					<view class="tui-item-content">{{order.pay_time}}</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">订单备注:</view>
					<view class="tui-item-content">{{order.remark || "无"}}</view>
				</view>
			</view>
		</view>
		<view class="tui-safe-area"></view>
		<view class="tui-tabbar tui-order-btn" v-if="order.status === 0">
			<view class="tui-btn-mr" @tap="postOrderCancel">
				<tui-button type="black" :plain="true" width="148rpx" height="56rpx" :size="26" shape="circle">取消订单</tui-button>
			</view>
			<view class="tui-btn-mr" @tap="payOrder">
				<tui-button type="danger" :plain="true" width="148rpx" height="56rpx" :size="26" shape="circle">立即支付</tui-button>
			</view>
		</view>
	</view>
</template>

<script>
	import tuiIcon from '../../components/icon/icon'
	import tuiButton from "../../components/extend/button/button"
	import tuiCountdown from "../../components/countdown/countdown"
	import tuiListCell from "../../components/list-cell/list-cell"
	import { orderRead, orderCancel } from "../../api/order"
	import { orderPayWeChatMiniApp } from "../../api/orderPay"
	export default {
		components: {
			tuiIcon,
			tuiButton,
			tuiCountdown,
			tuiListCell
		},
		data() {
			return {
				order: {},
				goodList: [],
				loading: false,
				submitLoading: false,
				params: {
					order_num: ""
				}
			}
		},
		onLoad(options) {
			this.params.order_num = options.order_num;
			this.getOrderRead();
		},
		methods: {
			// 0-待付款 1-付款成功 2-待收货 3-订单已完成 4-交易关闭
			getImg(status) {
				return this.$tui.staticUrl() + "/static/images/order/" +
						["img_order_payment3x.png",
							"img_order_send3x.png", "img_order_received3x.png",
							"img_order_signed3x.png", "img_order_closed3x.png",
							"img_order_signed3x.png"
						][status]
			},
			getStatusText(status) {
				return ["等待您付款", "付款成功", "待收货", "订单已完成", "交易关闭", "交易成功"][status]
			},
			getReason(status) {
				return ["剩余时间", "等待卖家发货", "等待用户收货", "", "超时未付款，订单自动取消"][status]
			},
			goodDetail(item) {
				this.$tui.navigateTo("productDetail/productDetail?good_id=" + item.good_id);
			},
			getOrderRead() {
				if (this.loading) {
					return false;
				}
				this.loading = true;
				orderRead(this.params)
					.then(res => {
						this.loading = false;
						if (res.code > 0) {
							this.$tui.toast(res.message);
							return false;
						}
						this.order = res.data .order|| {};
						this.goodList = res.data.good_list || [];
					})
					.catch(() => {
						this.loading = false;
					})
			},
			payOrder() {
				uni.getProvider({
					service: 'payment',
					success: (res) => {
						if (~res.provider.indexOf('wxpay')) {
							orderPayWeChatMiniApp(this.params)
								.then(res => {
									this.submitLoading = false;
									if (res.code > 0) {
										this.$tui.toast(res.message);
										return false;
									}
									let data = res.data || {};
									uni.requestPayment({
										provider: 'wxpay',
										appId: data.appId,
										timeStamp: data.timeStamp,
										nonceStr: data.nonceStr,
										package: data.package,
										signType: data.signType,
										paySign: data.paySign,
										success: (res) => {
											this.order.status = 1;
										},
										fail: (err) => {
											console.log('fail:' + JSON.stringify(err));
											this.$tui.toast(JSON.stringify(err));
										}
									});
								})
						} else {
							this.$tui.toast("未支持的平台");
						}
					}
				});
			},
			postOrderCancel() {
				if (this.submitLoading) {
					return false;
				}
				uni.showModal({
					title: '提示',
					content: '确认取消？',
					success: (res) => {
						if (res.confirm) {
							this.submitLoading = true;
							orderCancel(this.params)
									.then(res => {
										this.submitLoading = false;
										if (res.code > 0) {
											this.$tui.toast(res.message);
											return false;
										}
										this.order.status = 4;
										this.$tui.toast("取消成功");
									})
									.catch(() => {
										this.submitLoading = false;
									})
						}
					}
				});
			}
		}
	}
</script>

<style>
	.container {
		padding-bottom: 118rpx;
	}

	.tui-order-header {
		width: 100%;
		height: 160rpx;
		position: relative;
	}

	.tui-img-bg {
		width: 100%;
		height: 160rpx;
	}

	.tui-header-content {
		width: 100%;
		height: 160rpx;
		position: absolute;
		z-index: 10;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 70rpx;
		box-sizing: border-box;
	}

	.tui-status-text {
		font-size: 36rpx;
		line-height: 36rpx;
		color: #FEFEFE;
	}

	.tui-reason {
		font-size: 24rpx;
		line-height: 24rpx;
		color: rgba(254, 254, 254, 0.75);
		padding-top: 15rpx;
		display: flex;
		align-items: center;
	}

	.tui-reason-text {
		padding-right: 12rpx;
	}

	.tui-status-img {
		width: 80rpx;
		height: 80rpx;
		display: block;
	}

	.tui-flex-box {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.tui-icon-img {
		width: 44rpx;
		height: 44rpx;
		flex-shrink: 0;
	}

	.tui-logistics {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 24rpx 0 20rpx;
		box-sizing: border-box;
	}

	.tui-logistics-text {
		font-size: 28rpx;
		line-height: 32rpx;
	}

	.tui-logistics-time {
		font-size: 24rpx;
		line-height: 24rpx;
		padding-top: 16rpx;
		color: #666;
	}

	.tui-addr {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.tui-addr-userinfo {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: bold;
	}

	.tui-addr-text {
		font-size: 24rpx;
		line-height: 30rpx;
		padding-top: 16rpx;
	}

	.tui-addr-tel {
		padding-left: 40rpx;
	}

	.tui-order-item {
		margin-top: 20rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-goods-title {
		width: 100%;
		font-size: 28rpx;
		line-height: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-goods-item {
		width: 100%;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.tui-goods-img {
		width: 160rpx;
		height: 160rpx;
		display: block;
		flex-shrink: 0;
	}

	.tui-goods-center {
		flex: 1;
		padding: 20rpx 20rpx;
		box-sizing: border-box;
	}

	.tui-goods-name {
		max-width: 310rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 30rpx;
		line-height: 32rpx;
	}

	.tui-goods-attr {
		font-size: 22rpx;
		color: #888888;
		line-height: 32rpx;
		padding-top: 20rpx;
		display: flex;
	}

	.tui-goods-attr-tag {
		margin-right: 20rpx;
	}

	.tui-price-right {
		text-align: right;
		font-size: 24rpx;
		color: #888888;
		line-height: 30rpx;
		padding-top: 20rpx;
	}

	.tui-color-red {
		color: #E41F19;
		padding-right: 30rpx;
	}

	.tui-goods-price {
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		font-size: 24rpx;
	}

	.tui-size-24 {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-price-large {
		font-size: 32rpx;
		line-height: 30rpx;
	}

	.tui-goods-info {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		background: #fff;
	}

	.tui-price-flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-size24 {
		padding-bottom: 20rpx;
		font-size: 24rpx;
		line-height: 24rpx;
		color: #888;
	}

	.tui-size32 {
		font-size: 32rpx;
		line-height: 32rpx;
		font-weight: 500;
	}

	.tui-pbtm20 {
		padding-bottom: 20rpx;
	}

	.tui-flex-shrink {
		flex-shrink: 0;
	}

	.tui-primary-color {
		color: #EB0909;
	}

	.tui-order-info {
		margin-top: 20rpx;
	}

	.tui-order-title {
		position: relative;
		font-size: 28rpx;
		line-height: 28rpx;
		padding-left: 12rpx;
		box-sizing: border-box;
	}

	.tui-order-title::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		border-left: 4rpx solid #EB0909;
		height: 100%;
	}

	.tui-order-content {
		width: 100%;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		background: #fff;
		font-size: 24rpx;
		line-height: 30rpx;
	}

	.tui-order-flex {
		display: flex;
		padding-top: 18rpx;
	}

	.tui-order-flex:first-child {
		padding-top: 0
	}

	.tui-item-title {
		width: 132rpx;
		flex-shrink: 0;
	}

	.tui-item-content {
		color: #666;
	}

	.tui-safe-area {
		height: 1rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-tabbar {
		width: 100%;
		height: 98rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-size: 26rpx;
		box-shadow: 0 0 1px rgba(0, 0, 0, .3);
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 999;
	}

	.tui-btn-mr {
		margin-right: 30rpx;
	}
</style>
