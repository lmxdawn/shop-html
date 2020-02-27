<template>
	<view>
		<!--header-->
		<view class="tui-header-box" :style="{height:height+'px',background:'rgba(255,255,255,'+opcity+')'}">
			<view class="tui-header" :style="{paddingTop:top+'px', opacity:opcity}">
				我的
			</view>
		</view>
		<view class="tui-mybg-box">
			<image :src="$tui.staticUrl() + '/static/images/my/my_header_bg_3x.png'" class="tui-my-bg" mode="widthFix"></image>
			<view class="tui-header-center" @tap="avatarClick">
				<image v-if="memberInfo.member_id > 0" :src="memberInfo.avatar" class="tui-avatar"></image>
				<image v-else src="/static/images/my/mine_def_touxiang_3x.png" class="tui-avatar"></image>
				<view class="tui-info">
					<view class="tui-nickname">{{memberInfo.name || "请登录"}}</view>
					<view class="tui-explain">开启美好的一天</view>
				</view>
				<view class="tui-set-box">
					<view class="tui-icon-box tui-icon-setup" @tap.stop="clickSet">
						<tui-icon name="setup" color="#fff" :size="26"></tui-icon>
					</view>
				</view>
			</view>
		</view>

		<view class="tui-content-box">
			<view class="tui-box tui-order-box">
				<tui-list-cell :arrow="true" padding="0" :lineLeft="false" @click="orderClick('')">
					<view class="tui-cell-header">
						<view class="tui-cell-title">我的订单</view>
						<view class="tui-cell-sub">查看全部订单</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-list">
					<view class="tui-order-item" @tap="orderClick(0)">
						<view class="tui-icon-box">
							<image src="/static/images/my/icon_daifukuan_3x.png" class="tui-order-icon"></image>
						</view>
						<view class="tui-order-text">待付款</view>
					</view>
					<view class="tui-order-item" @tap="orderClick(1)">
						<view class="tui-icon-box">
							<image src="/static/images/my/icon_daifahuo_3x.png" class="tui-order-icon"></image>
						</view>
						<view class="tui-order-text">待发货</view>
					</view>
					<view class="tui-order-item" @tap="orderClick(2)">
						<view class="tui-icon-box">
							<image src="/static/images/my/icon_daishouhuo_3x.png" class="tui-order-icon"></image>
						</view>
						<view class="tui-order-text">待收货</view>
					</view>
					<view class="tui-order-item" @tap="orderClick(3)">
						<view class="tui-icon-box">
							<image src="/static/images/my/icon_pingjia_3x.png" class="tui-order-icon"></image>
						</view>
						<view class="tui-order-text">评价</view>
					</view>
					<view class="tui-order-item" @tap="tuikuanClick">
						<view class="tui-icon-box">
							<image src="/static/images/my/icon_tuikuan_3x.png" class="tui-order-icon"></image>
						</view>
						<view class="tui-order-text">退款/售后</view>
					</view>
				</view>
			</view>

			<view class="tui-box tui-assets-box" >
				<tui-list-cell :arrow="true" class="tui-list" @tap="couponClick">
					<tui-icon name="redpacket" :size="24" color="#ff7900"></tui-icon>
					<text class="tui-list-cell-name">优惠券</text>
					<view class="tui-right">暂无可用</view>
				</tui-list-cell>
				<tui-list-cell :arrow="true" class="tui-list" @tap="addressClick">
					<tui-icon name="gps" :size="23" color="#5677fc"></tui-icon>
					<view class="tui-list-cell-name">地址管理</view>
				</tui-list-cell>
				<tui-list-cell :arrow="true" class="tui-list" @tap="problemClick">
					<tui-icon name="explain-fill" :size="24" color="#19be6b"></tui-icon>
					<view class="tui-list-cell-name">常见问题</view>
				</tui-list-cell>
				<tui-list-cell :arrow="true" class="tui-list" @tap="helpClick">
					<tui-icon name="kefu" :size="23" color="#ee659f"></tui-icon>
					<view class="tui-list-cell-name">客服与帮助</view>
				</tui-list-cell>
			</view>
		</view>
	</view>
</template>

<script>
	import tuiIcon from "../../components/icon/icon"
	import tuiButton from "../../components/extend/button/button"
	import tuiListCell from "../../components/list-cell/list-cell"
	import tuiDivider from "../../components/divider/divider"
	import { mapGetters } from "vuex";
	export default {
		components: {
			tuiIcon,
			tuiButton,
			tuiListCell,
			tuiDivider
		},
		computed: {
			...mapGetters({
				memberInfo: "memberInfo",
			})
		},
		data() {
			return {
				height: 64, //header高度
				top: 0, //标题图标距离顶部距离
				scrollH: 0, //滚动总高度
				opcity: 0,
				pullUpOn: true
			}
		},
		onLoad() {
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif

			uni.getSystemInfo({
				success: (res) => {
					this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
					this.top = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
					this.scrollH = res.windowWidth * 0.6
				}
			})
		},
		onPageScroll(e) {
			let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
			let opcity = scroll / this.scrollH;
			if (this.opcity >= 1 && opcity >= 1) {
				return;
			}
			this.opcity = opcity;
		},
		methods: {
			avatarClick() {
				this.$tui.loginNavigateTo("userInfo/userInfo");
			},
			clickSet() {
				this.$tui.loginNavigateTo("set/set");
			},
			tuikuanClick() {
				this.$tui.toast("功能开发中...");
			},
			orderClick(status) {
				// this.$tui.loginNavigateTo("myOrder/myOrder?type=" + type);
				this.$tui.navigateTo("myOrder/myOrder?status=" + status);
			},
			couponClick() {
				this.$tui.toast("功能开发中...");
			},
			addressClick() {
				this.$tui.loginNavigateTo("address/address");
			},
			problemClick() {
				this.$tui.toast("功能开发中...");
			},
			helpClick() {
				this.$tui.toast("功能开发中...");
			},
		}
	}
</script>

<style>
	.logo {
		height: 40rpx;
		width: 40rpx;
	}
	.tui-header-box {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9998;
	}

	.tui-header {
		width: 100%;
		font-size: 18px;
		line-height: 18px;
		font-weight: 500;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-set-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-icon-box {
		position: relative;
	}

	.tui-icon-setup {
		margin-left: 8rpx;
	}

	.tui-badge {
		position: absolute;
		font-size: 24rpx;
		height: 32rpx;
		min-width: 20rpx;
		padding: 0 6rpx;
		border-radius: 40rpx;
		right: 10rpx;
		top: -5rpx;
		transform: scale(0.8) translateX(60%);
		transform-origin: center center;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.tui-badge-red {
		background: #F74D54;
		color: #fff;
	}

	.tui-mybg-box {
		width: 100%;
		height: 420rpx;
		position: relative;
	}

	.tui-my-bg {
		width: 100%;
		height: 464rpx;
		display: block;
	}

	.tui-header-center {
		position: absolute;
		width: 100%;
		height: 128rpx;
		left: 0;
		top: 160rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-avatar {
		flex-shrink: 0;
		width: 128rpx;
		height: 128rpx;
		display: block;
		border-radius: 50%;
	}

	.tui-info {
		width: 60%;
		padding-left: 30rpx;

	}

	.tui-nickname {
		font-size: 30rpx;
		font-weight: 500;
		color: #fff;
		display: flex;
		align-items: center;
	}

	.tui-img-vip {
		width: 56rpx;
		height: 24rpx;
		margin-left: 18rpx;
	}

	.tui-explain {
		width: 80%;
		font-size: 24rpx;
		font-weight: 400;
		color: #fff;
		opacity: 0.75;
		padding-top: 8rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-content-box {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: relative;
		top: -72rpx;
		z-index: 10;
	}

	.tui-box {
		width: 100%;
		background: #fff;
		box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.1);
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-order-box {
		height: 260rpx;
	}

	.tui-cell-header {
		width: 100%;
		height: 100rpx;
		padding: 0 26rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-cell-title {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: 600;
		color: #333;
	}

	.tui-cell-sub {
		font-size: 26rpx;
		font-weight: 400;
		color: #999;
		padding-right: 28rpx;
	}

	.tui-order-list {
		width: 100%;
		height: 134rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;

	}

	.tui-order-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tui-order-text {
		font-size: 26rpx;
		font-weight: 400;
		color: #666;
		padding-top: 4rpx;
	}


	.tui-order-icon {
		width: 56rpx;
		height: 56rpx;
		display: block;
	}

	.tui-assets-box {
		margin-top: 20rpx;
	}

	.tui-list {
		height: 120rpx;
		border-bottom: 1px solid #fbfbfb;
	}
	.tui-list-cell-name {
		padding-left: 20rpx;
		vertical-align: middle;
		line-height: 30rpx;
	}
	.tui-list::after {
		left: 94upx !important
	}

	.tui-right {
		margin-left: auto;
		margin-right: 34upx;
		font-size: 26upx;
		line-height: 1;
		color: #999;
	}
</style>
