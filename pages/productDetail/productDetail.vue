<template>
	<view class="container" :class="{hidden: !detailInfo.good_id}">
		<!--header-->
		<view class="tui-header-box" :style="{height:height+'px',background:'rgba(255,255,255,'+opcity+')'}">
			<view class="tui-header" :style="{paddingTop:top+'px', opacity:opcity}">
				商品详情
			</view>
			<view class="tui-header-icon" :style="{marginTop:top+'px'}">
				<view class="tui-icon tui-icon-arrowleft tui-icon-back" :style="{color:opcity>=1?'#000':'#fff',background:'rgba(0, 0, 0,'+iconOpcity+')'}"
				 @tap="back"></view>
				<view class="tui-icon tui-icon-more-fill  tui-icon-ml" :style="{color:opcity>=1?'#000':'#fff',background:'rgba(0, 0, 0,'+iconOpcity+')',fontSize:'20px'}"
				 @tap.stop="openMenu"></view>
			</view>
		</view>
		<!--header-->
		<view style="position: fixed;height: 100vh;width: 100%;background-color: #fff;z-index: 899;" v-if="!detailInfo.good_id"></view>

		<tui-skeleton v-if="skeletonShow" backgroundColor="#fafafa" borderRadius="10rpx"></tui-skeleton>
		<view class="tui-skeleton">
			<!--banner-->
			<view class="tui-banner-swiper tui-skeleton-rect">
				<swiper :autoplay="true" :interval="5000" :duration="150" :circular="true" :style="{height:scrollH + 'px'}" @change="bannerChange">
					<block v-for="(item,index) in detailInfo.imgs_url" :key="index">
						<swiper-item :data-index="index" @tap.stop="previewImage">
							<image :src="item" class="tui-slide-image" :style="{height:scrollH+'px'}" />
						</swiper-item>
					</block>
				</swiper>
				<tui-tag type="translucent" shape="circleLeft" size="small">{{bannerIndex+1}}/{{detailInfo.imgs_url.length}}</tui-tag>
			</view>
			<!--banner-->

			<view class="tui-pro-detail">
				<view class="tui-product-title tui-border-radius">
					<view class="tui-pro-pricebox tui-padding">
						<view class="tui-pro-price tui-skeleton-rect">
							<view>
								￥
								<block v-if="detailInfo.shop_price_list && detailInfo.shop_price_list.length > 0">
									<text class="tui-price">{{detailInfo.shop_price_list[0]}}</text>.{{detailInfo.shop_price_list[1]}}
								</block>
								<block v-else>
									<text class="tui-price">0</text>.00
								</block>
							</view>
							<view class="good-tag-box">
								<tui-tag v-if="detailInfo.is_hot === 1" size="small" :plain="true" type="red" shape="circle">热卖</tui-tag>
								<tui-tag v-if="detailInfo.is_new === 1" size="small" :plain="true" type="high-green" shape="circle">新品</tui-tag>
								<tui-tag v-if="detailInfo.is_recommend === 1" size="small" :plain="true" type="warning" shape="circle">推荐</tui-tag>
							</view>
						</view>
						<view class="tui-collection tui-size tui-skeleton-circular" @tap="collecting">
							<view class="tui-icon tui-icon-collection" :class="['tui-icon-'+(collected?'like-fill':'like')]" :style="{color:collected?'#ff201f':'#333',fontSize:'20px'}"></view>
						</view>
					</view>
					<view class="tui-original-price tui-gray tui-skeleton-rect">
						价格
						<text class="tui-line-through">￥{{detailInfo.cost_price || "0.00"}}</text>
					</view>
					<view class="tui-pro-titbox">
						<view class="tui-pro-title tui-skeleton-rect">{{detailInfo.good_name || "商品名称"}}</view>
						<button open-type="share" class="tui-share-btn tui-share-position tui-skeleton-rect">
							<tui-tag type="gray" tui-tag-class="tui-tag-share tui-size" shape="circleLeft" size="small">
								<view class="tui-icon tui-icon-partake" style="color:#999;font-size:15px"></view>
								<!-- <tui-icon name="partake" color="#999" size="15"></tui-icon> -->
								<text class="tui-share-text tui-gray">分享</text>
							</tui-tag>
						</button>
					</view>
					<view class="tui-padding">
						<view class="tui-sale-info tui-size tui-gray">
							<view class="tui-sale-info-item tui-skeleton-rect">免运费</view>
							<view class="tui-sale-info-item tui-skeleton-rect">已售{{detailInfo.sales_sum}}{{detailInfo.unit}}</view>
							<view class="tui-sale-info-item tui-skeleton-rect">剩余{{detailInfo.store_count}}{{detailInfo.unit}}</view>
						</view>
					</view>
				</view>

				<view class="tui-basic-info tui-mtop tui-radius-all">
					<view class="tui-list-cell">
						<view class="tui-bold tui-cell-title"><text class="tui-skeleton-rect">送至</text></view>
						<view class="tui-addr-box">
							<view class="tui-addr-item tui-skeleton-rect">{{detailInfo.address.address}}</view>
						</view>
						<view>
							<tui-icon name="more-fill" style="flex-shrink: 0;" :size="20" class="tui-right tui-skeleton-rect" color="#666"></tui-icon>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="tui-cmt-box tui-mtop tui-radius-all">
			<view class="tui-list-cell tui-last tui-between">
				<view class="tui-bold tui-cell-title">评价</view>
				<view @tap="commentClick">
					<text class="tui-cmt-all">查看全部</text>
					<view class="tui-icon tui-icon-more-fill" style="color:#ff201f; font-size: 20px;"></view>
					<!-- <tui-icon name="more-fill" size="20" color="#ff201f"></tui-icon> -->
				</view>
			</view>
		</view>

		<scroll-view v-if="detailInfo.good_comment && detailInfo.good_comment.length > 0" scroll-x scroll-with-animation class="tui-cmt-list-box">
			<view class="tui-cmt-list-item" v-for="item in detailInfo.good_comment" :key="item.id">
				<view class="tui-cmt-list-item-user">
					<view class="tui-cmt-list-item-head">
						<image class="tui-cmt-list-item-avatar" :src="item.member.avatar"></image>
						<view class="tui-cmt-list-item-title">
							<view class="tui-cmt-list-item-name">{{item.member.name | formatName}}</view>
							<view class="tui-cmt-list-item-date">{{item.create_time | formatDate}}</view>
						</view>
					</view>
					<view class="tui-cmt-list-item-rate-box">
						<tui-rate :current="item.rate" :quantity="item.rate" normal="#ccc" active="#ff7900"></tui-rate>
						<view class="tui-cmt-list-item-rate">{{item.rate_name}}</view>
					</view>
				</view>
				<view class="tui-cmt-list-item-content">{{item.content}}</view>
			</view>
		</scroll-view>

		<view class="tui-nomore-box">
			<tui-nomore text="宝贝详情" :visible="true" bgcolor="#f7f7f7"></tui-nomore>
		</view>
		<view class="tui-product-img tui-radius-all">
			<rich-text :nodes="detailInfo.details"></rich-text>
		</view>
		<tui-nomore text="已经到最底了" :visible="true" bgcolor="#f7f7f7"></tui-nomore>
		<view class="tui-safearea-bottom"></view>

		<!--底部操作栏-->
		<view class="tui-operation">
			<view class="tui-operation-left tui-col-5">
				<view class="tui-operation-item" style="padding-left: 18rpx;" hover-class="opcity" :hover-stay-time="150" @tap="homeClick">
					<tui-icon name="home" :size="22" color='#333'></tui-icon>
					<view class="tui-operation-text tui-scale-small">首页</view>
				</view>
				<view class="tui-operation-item" style="padding-right: 18rpx;" hover-class="opcity" :hover-stay-time="150" @tap="cartClick">
					<tui-icon name="cart" :size="22" color='#333'></tui-icon>
					<view class="tui-operation-text tui-scale-small">购物车</view>
					<tui-badge type="danger" size="small">9</tui-badge>
				</view>
			</view>
			<view class="tui-operation-right tui-right-flex tui-col-7">
				<tui-button class="tui-operation-right-btn" type="danger" shape="rightAngle" @click="cartAddClick">加入购物车</tui-button>
				<tui-button class="tui-operation-right-btn" type="warning" shape="rightAngle" @click="submit">立即购买</tui-button>
			</view>
		</view>


		<!--底部操作栏--->

		<!--顶部下拉菜单-->
		<tui-top-dropdown tui-top-dropdown="tui-top-dropdown" bgcolor="rgba(76, 76, 76, 0.95)" :show="menuShow" :height="0"
		 @close="closeMenu">
			<view class="tui-menu-box tui-padding tui-ptop">
				<view class="tui-menu-header" :style="{paddingTop:top+'px'}">
					功能直达
				</view>
				<view class="tui-menu-itembox">
					<view class="tui-menu-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="homeClick">
						<view class="tui-badge-box">
							<tui-icon name="home" color="#fff" :size="23"></tui-icon>
						</view>
						<view class="tui-menu-text">首页</view>
					</view>
					<view class="tui-menu-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="peopleClick">
						<view class="tui-badge-box">
							<tui-icon name="people" color="#fff" :size="26"></tui-icon>
						</view>
						<view class="tui-menu-text">我的</view>
					</view>
					<view class="tui-menu-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="cartClick">
						<view class="tui-badge-box">
							<tui-icon name="cart" color="#fff" :size="23"></tui-icon>
						</view>
						<view class="tui-menu-text">购物车</view>
					</view>
					<view class="tui-menu-item" hover-class="tui-opcity" :hover-stay-time="150" @tap="shareClick">
						<view class="tui-badge-box">
							<tui-icon name="share" color="#fff" :size="26"></tui-icon>
						</view>
						<view class="tui-menu-text">分享</view>
					</view>
				</view>
				<view class="tui-icon tui-icon-up" style="color: #fff; font-size: 26px;" @tap.stop="closeMenu"></view>
				<!-- <tui-icon name="up" color="#fff" size="26" class="tui-icon-up" @tap.stop="closeMenu"></tui-icon> -->
			</view>

		</tui-top-dropdown>
		<!---顶部下拉菜单-->

	</view>
</template>

<script>
	import tuiIcon from "../../components/icon/icon"
	import tuiTag from "../../components/tag/tag"
	import tuiBadge from "../../components/badge/badge"
	import tuiNomore from "../../components/nomore/nomore"
	import tuiButton from "../../components/button/button"
	import tuiTopDropdown from "../../components/top-dropdown/top-dropdown"
	import tuiBottomPopup from "../../components/bottom-popup/bottom-popup"
	import tuiNumberbox from "../../components/numberbox/numberbox"
	import tuiRate from "../../components/rate/rate"
	import tuiSkeleton from "../../components/tui-skeleton/tui-skeleton"
	import { goodDetail } from "../../api/good"
	import { orderSubmitGoodList } from "../../api/order"
	export default {
		components: {
			tuiIcon,
			tuiTag,
			tuiBadge,
			tuiNomore,
			tuiButton,
			tuiTopDropdown,
			tuiBottomPopup,
			tuiNumberbox,
			tuiRate,
			tuiSkeleton
		},
		data() {
			return {
				height: 64, //header高度
				top: 0, //标题图标距离顶部距离
				scrollH: 0, //滚动总高度
				opcity: 0,
				iconOpcity: 0.5,
				bannerIndex: 0,
				menuShow: false,
				value: 1,
				collected: false,
				skeletonShow: false,
				detailInfo: {
					details: "",
					address: {},
					good_comment: [],
					imgs_url: [""],
				},
				params: {
					good_id: ""
				},
			}
		},
		onLoad: function(options) {
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

			setTimeout(() => {
				uni.getSystemInfo({
					success: (res) => {
						this.width = obj.left || res.windowWidth;
						this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
						this.top = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
						this.scrollH = res.windowWidth;
						this.params.good_id = options.good_id;
						this.init();
					}
				})
			}, 50)
		},
		methods: {
			init() {
				this.skeletonShow = true;
				this.getGoodDetail();
			},
			bannerChange: function(e) {
				this.bannerIndex = e.detail.current
			},
			previewImage: function(e) {
				let index = e.currentTarget.dataset.index;
				uni.previewImage({
					current: this.detailInfo.imgs_url[index],
					urls: this.detailInfo.imgs_url
				})
			},
			back: function() {
				uni.navigateBack()
			},
			openMenu: function() {
				this.menuShow = true
			},
			closeMenu: function() {
				this.menuShow = false
			},
			change: function(e) {
				this.value = e.value
			},
			collecting: function() {
				this.collected = !this.collected
			},
			homeClick() {
				this.$tui.switchTab("index/index");
			},
			peopleClick() {
				this.$tui.switchTab("my/my");
			},
			cartClick() {
				this.$tui.switchTab("cart/cart");
			},
			shareClick() {
				this.$tui.toast("分享");
			},
			cartAddClick() {
				let isLogin = this.$tui.navigateToLogin();
				if (!isLogin) {
					return false;
				}
			},
			commentClick() {
				this.$tui.navigateTo("comment/comment?good_id=" + this.params.good_id);
			},
			submit() {
				if (!this.detailInfo.good_id) {
					return false;
				}
				let isLogin = this.$tui.navigateToLogin();
				if (!isLogin) {
					return false;
				}
				const data = {
					good_ids: this.detailInfo.good_id,
					counts: 1
				};
				orderSubmitGoodList(data)
					.then(res => {
						if (res.code > 0) {
							this.$tui.toast(res.message);
							return false;
						}
						this.$tui.navigateTo(`submitOrder/submitOrder?good_ids=${this.detailInfo.good_id}&counts=1`);
					});
			},
			getGoodDetail() {
				goodDetail(this.params)
					.then(res => {
						if (res.code) {
							return false;
						}
						this.skeletonShow = false;
						this.detailInfo = res.data || {};
						let details = this.detailInfo.details;
						this.detailInfo.details = details.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
						this.detailInfo.shop_price_list = this.detailInfo.shop_price.split(".");
					})
			}
		},
		onPageScroll(e) {
			let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
			let opcity = scroll / this.scrollH;
			if (this.opcity >= 1 && opcity >= 1) {
				return;
			}
			this.opcity = opcity;
			this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity)
		}
	}
</script>

<style lang="scss">
	/* icon 也可以使用组件*/
	@import "../../static/style/icon.css";

	page {
		background: #f7f7f7;
	}
	.hidden {
		height: 100vh;
		overflow: hidden;
	}
	.container {
		padding-bottom: 110rpx;
	}

	.tui-header-box {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 880;
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

	.tui-header-icon {
		position: fixed;
		top: 0;
		left: 10px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		height: 32px;
		transform: translateZ(0);
		z-index: 99999;
	}



	.tui-header-icon .tui-badge {
		background: #e41f19 !important;
		position: absolute;
		right: -4px;
	}

	.tui-icon-ml {
		margin-left: 20rpx;
	}

	.tui-icon {
		border-radius: 16px;
	}


	.tui-icon-back {
		height: 32px !important;
		width: 32px !important;
		display: block !important;
	}

	.tui-header-icon .tui-icon-more-fill {
		height: 20px !important;
		width: 20px !important;
		padding: 6px !important;
		display: block !important;
	}

	.tui-banner-swiper {
		position: relative;
		min-height: 750rpx;
	}

	.tui-banner-swiper .tui-tag-class {
		position: absolute;
		color: #fff;
		bottom: 30rpx;
		right: 0;
	}

	.tui-slide-image {
		width: 100%;
		display: block;
	}

	/*顶部菜单*/

	.tui-menu-box {
		box-sizing: border-box;
	}

	.tui-menu-header {
		font-size: 34rpx;
		color: #fff;
		height: 32px;
		display: flex;
		align-items: center;
	}

	.tui-top-dropdown {
		z-index: 9999 !important;
	}

	.tui-menu-itembox {
		color: #fff;
		padding: 40rpx 10rpx 0 10rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		font-size: 26rpx;
	}

	.tui-menu-item {
		width: 22%;
		height: 160rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		background: rgba(0, 0, 0, 0.4);
		margin-right: 4%;
		margin-bottom: 4%;
	}

	.tui-menu-item:nth-of-type(4n) {
		margin-right: 0;
	}

	.tui-badge-box {
		position: relative;
	}

	.tui-badge-box .tui-badge-class {
		position: absolute;
		top: -8px;
		right: -8px;
	}

	.tui-msg-badge {
		top: -10px;
	}

	.tui-icon-up {
		position: relative;
		display: inline-block;
		left: 50%;
		transform: translateX(-50%);
	}

	.tui-menu-text {
		padding-top: 12rpx;
	}

	.tui-opcity .tui-menu-text,
	.tui-opcity .tui-badge-box {
		opacity: 0.5;
		transition: opacity 0.2s ease-in-out;
	}

	/*顶部菜单*/

	/*内容 部分*/
	.good-tag-box {
		padding-left: 5px;
	}
	.good-tag-box .tui-tag-class{
		display: inline-block;
	}

	.tui-padding {
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	/* #ifdef H5 */
	.tui-ptop {
		padding-top: 44px;
	}

	/* #endif */

	.tui-size {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-gray {
		color: #999;
	}

	.tui-icon-red {
		color: #ff201f;
	}

	.tui-border-radius {
		overflow: hidden;
	}

	.tui-radius-all {
		overflow: hidden;
	}

	.tui-mtop {
		margin-top: 26rpx;
	}

	.tui-pro-detail {
		box-sizing: border-box;
		color: #333;
	}

	.tui-product-title {
		background: #fff;
		padding: 30rpx 0;
	}

	.tui-pro-pricebox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #ff201f;
		font-size: 36rpx;
		font-weight: bold;
		line-height: 44rpx;
	}

	.tui-pro-price {
		display: flex;
		align-items: center;
	}

	.tui-pro-price .tui-tag-class {
		transform: scale(0.7);
		transform-origin: center center;
		line-height: 24rpx;
		font-weight: normal;
	}

	.tui-price {
		font-size: 58rpx;
	}

	.tui-original-price {
		font-size: 26rpx;
		line-height: 26rpx;
		margin: 10rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-line-through {
		text-decoration: line-through;
	}

	.tui-collection {
		color: #333;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		height: 44rpx;
	}

	.tui-scale {
		transform: scale(0.7);
		transform-origin: center center;
		line-height: 24rpx;
		font-weight: normal;
	}

	.tui-icon-collection {
		line-height: 20px !important;
		margin-bottom: 0 !important;

	}

	.tui-pro-titbox {
		font-size: 32rpx;
		font-weight: 500;
		position: relative;
		padding: 0 150rpx 0 30rpx;
		box-sizing: border-box;
	}

	.tui-pro-title {
		margin-top: 20rpx;
		font-size: 35rpx;
	}

	.tui-share-btn {
		display: block;
		background: none;
		margin: 0;
		padding: 0;
		border-radius: 0;
	}

	.tui-tag-share {
		display: flex;
		align-items: center;
	}

	.tui-share-position {
		position: absolute;
		right: 0;
		top: 0;
	}

	.tui-share-text {
		padding-left: 8rpx;
	}

	.tui-sub-title {
		padding: 20rpx 0;
	}

	.tui-sale-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 35rpx;
	}

	.tui-sale-info-item {
		min-width: 100rpx;
	}

	.tui-discount-box {
		background: #fff;
	}

	.tui-list-cell {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		height: 100rpx;
		line-height: 100rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.tui-top40 {
		top: 40rpx !important;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-list-cell::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 126rpx;
	}

	.tui-last::after {
		border-bottom: 0 !important;
	}

	.tui-tag-coupon-box {
		display: flex;
		align-items: center;
	}

	.tui-tag-coupon-box .tui-tag-class {
		margin-right: 20rpx;
	}


	.tui-cell-title {
		flex-shrink: 0;
	}

	.tui-selected-box {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-promotion-box {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 10rpx 0;
		width: 74%;
	}

	.tui-promotion-box .tui-tag-class {
		display: inline-block !important;
		transform: scale(0.8);
		transform-origin: 0 center;
	}

	/* .tui-inline-block {
		display: inline-block !important;
		transform: scale(0.8);
		transform-origin: 0 center;
	} */

	.tui-basic-info {
		background: #fff;
	}

	.tui-addr-box {
		width: 76%;
		padding-top: 26rpx;
		padding-bottom: 26rpx;
	}

	.tui-addr-item {
		line-height: 34rpx;
	}

	.tui-guarantee {
		background: #fdfdfd;
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 30rpx 30rpx 30rpx;
		font-size: 24rpx;
	}

	.tui-guarantee-item {
		color: #999;
		padding-right: 30rpx;
		padding-top: 10rpx;
	}

	.tui-pl {
		padding-left: 4rpx;
	}

	.tui-cmt-box {
		background: #fff;
	}

	.tui-between {
		justify-content: space-between !important;
	}

	.tui-cmt-all {
		color: #ff201f;
		padding-right: 8rpx;
	}

	.tui-cmt-content {
		font-size: 26rpx;
	}

	.tui-cmt-user {
		display: flex;
		align-items: center;
	}

	.tui-acatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 30rpx;
		display: block;
		margin-right: 16rpx;
	}

	.tui-cmt {
		padding: 14rpx 0;
	}

	.tui-attr {
		font-size: 24rpx;
		color: #999;
		padding: 6rpx 0;
	}

	.tui-cmt-btn {
		padding: 50rpx 0 30rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-tag-cmt {
		min-width: 130rpx;
		padding: 20rpx 52rpx !important;
		font-size: 26rpx !important;
		display: inline-block;
	}

	.tui-nomore-box {
		padding-top: 10rpx;
	}

	.tui-product-img {
		transform: translateZ(0);
	}

	.tui-product-img image {
		width: 100%;
		display: block;
	}

	/*底部操作栏*/

	.tui-col-7 {
		width: 66.66666667%;
	}

	.tui-col-5 {
		width: 33.33333333%;
	}

	.tui-operation {
		width: 100%;
		height: 100rpx;
		/* box-sizing: border-box; */
		background: rgba(255, 255, 255, 0.98);
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
		bottom: 0;
		left: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.tui-operation::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-operation-left {
		display: flex;
		align-items: center;
		height: 100%;
		box-sizing: border-box;
		padding-top: 5rpx;
	}

	.tui-operation-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
		height: 100%;
	}

	.tui-operation-text {
		font-size: 22rpx;
		color: #333;
	}

	.tui-opacity {
		opacity: 0.5;
	}

	.tui-scale-small {
		transform: scale(0.9);
		transform-origin: center center;
	}

	.tui-operation-right {
		/*height: 100rpx;*/
		/* box-sizing: border-box; */
		padding-top: 0;
		.tui-btn-class {
			font-size: 30rpx !important;
			height: 100rpx;
			line-height: 100rpx;
		}
	}

	.tui-operation-right-btn {
		width: 50%;
		height: 100%;
	}

	.tui-right-flex {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.tui-btnbox-4 .tui-btn-class {
		width: 90% !important;
		display: block !important;
		font-size: 28rpx !important;
	}

	.tui-operation .tui-badge-class {
		position: absolute;
		top: 0;
		/* #ifdef H5 */
		transform: translateX(50%)
			/* #endif  */
	}

	.tui-flex-1 {
		flex: 1;
	}

	/*底部操作栏*/

	/*底部选择弹层*/

	.tui-popup-class {
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-popup-box {
		position: relative;
		padding: 30rpx 0 100rpx 0;
	}

	.tui-popup-btn {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
	}

	.tui-popup-btn .tui-btn-class {
		width: 90% !important;
		display: block !important;
		font-size: 28rpx !important;
	}

	.tui-icon-close {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
	}

	.tui-product-box {
		display: flex;
		align-items: flex-end;
		font-size: 24rpx;
		padding-bottom: 30rpx;
	}

	.tui-popup-img {
		height: 200rpx;
		width: 200rpx;
		border-radius: 24rpx;
		display: block;
	}

	.tui-popup-price {
		padding-left: 20rpx;
		padding-bottom: 8rpx;
	}

	.tui-amount {
		color: #ff201f;
		font-size: 36rpx;
	}

	.tui-number {
		font-size: 24rpx;
		line-height: 24rpx;
		padding-top: 12rpx;
		color: #999;
	}

	.tui-popup-scroll {
		height: 600rpx;
		font-size: 26rpx;
	}

	.tui-scrollview-box {
		padding: 0 30rpx 60rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-attr-title {
		padding: 10rpx 0;
		color: #333;
	}

	.tui-attr-box {
		font-size: 0;
		padding: 20rpx 0;
	}

	.tui-attr-item {
		max-width: 100%;
		min-width: 200rpx;
		height: 64rpx;
		display: -webkit-inline-flex;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: #f7f7f7;
		padding: 0 26rpx;
		box-sizing: border-box;
		border-radius: 32rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		font-size: 26rpx;
	}

	.tui-attr-active {
		background: #fcedea !important;
		color: #e41f19;
		font-weight: bold;
		position: relative;
	}

	.tui-attr-active::after {
		content: "";
		position: absolute;
		border: 1rpx solid #e41f19;
		width: 100%;
		height: 100%;
		border-radius: 40rpx;
		left: 0;
		top: 0;
	}

	.tui-number-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0 30rpx 0;
		box-sizing: border-box;
	}

	/*底部选择弹层*/

	.tui-cmt-list-box {
		background-color: #fff;
		padding: 0 30rpx 50rpx 0;
		width: 100%;
		box-sizing: border-box;
		white-space: nowrap;
	}

	.tui-cmt-list-item {
		display: inline-block;
		border-radius: 15rpx;
		background-color: #fbfbfb;
		box-sizing: border-box;
		padding: 40rpx;
		margin-left: 30rpx;
		width: 600rpx;
	}

	.tui-cmt-list-item-user {
		display: flex;
		justify-content: space-between;
	}

	.tui-cmt-list-item-head {
		display: flex;
	}

	.tui-cmt-list-item-avatar {
		width: 90rpx;
		height: 90rpx;
		flex-shrink: 0;
		border-radius: 50%;
	}

	.tui-cmt-list-item-title {
		margin-left: 20rpx;
		font-size: 40rpx;
	}

	.tui-cmt-list-item-name {
		width: 200rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-cmt-list-item-date {
		color: #999999;
		font-size: 24rpx;
	}

	.tui-cmt-list-item-rate-box {
		text-align: right;
		color: #999999;
	}

	.tui-cmt-list-item-rate {
		font-size: 30rpx;
	}

	.tui-cmt-list-item-content {
		color: #666666;
		margin-top: 40rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

</style>
