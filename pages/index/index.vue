<template>
	<view class="container">
		<tui-skeleton v-if="skeletonShow" backgroundColor="#fafafa" borderRadius="10rpx"></tui-skeleton>
		<view class="tui-skeleton">
			<!--header-->
			<view class="tui-header">
				<view class="tui-category tui-skeleton-circular" hover-class="opcity" :hover-stay-time="150" @tap="classify">
					<tui-icon name="manage-fill" color="#fff" :size="22"></tui-icon>
					<!--<view class="tui-category-scale">分类</view>-->
				</view>
				<view class="tui-rolling-search tui-skeleton-fillet">
					<!-- #ifdef APP-PLUS || MP -->
					<icon type="search" :size='13' color='#999'></icon>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<view class="tui-search-icon">
						<tui-icon name="search" :size='16' color='#999'></tui-icon>
					</view>
					<!-- #endif -->
					<view class="tui-swiper">搜索商品</view>
				</view>
			</view>
			<!--header-->
			<view class="tui-header-banner">
				<view class="tui-banner-bg">
					<view class="tui-primary-bg tui-route-left"></view>
					<view class="tui-primary-bg tui-route-right"></view>
					<!--banner-->
					<view class="tui-banner-box">
						<swiper :indicator-dots="true" :autoplay="true" :interval="5000" :duration="150" class="tui-banner-swiper tui-skeleton-fillet"
								:circular="true" indicator-color="rgba(255, 255, 255, 0.8)" indicator-active-color="#fff">
							<swiper-item v-for="(item,index) in banner" :key="index" @tap.stop="detail">
								<image v-if="item.ad_id > 0" :src="item.pic" class="tui-slide-image" mode="scaleToFill" />
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>

			<view class="tui-product-category">
				<view class="tui-category-item" v-for="(item,index) in category" :key="index" @tap="more">
					<image :src="item.pic" class="tui-category-img tui-skeleton-fillet" mode="scaleToFill"></image>
					<view class="tui-category-name tui-skeleton-rect">{{item.title}}</view>
				</view>
			</view>

			<view class="tui-product-box tui-pb-20 tui-bg-white">
				<view class="tui-group-name" @tap="more">
					<text class="tui-skeleton-rect">新品推荐</text>
				</view>
				<view class="tui-new-box">
					<view class="tui-new-item tui-skeleton-fillet" :class="[index!=0 && index!=1 ?'tui-new-mtop':'']" v-for="(item,index) in newProduct"
						  :key="index" @tap="detail">
						<view class="tui-title-box">
							<view class="tui-new-title">{{item.good_name}}</view>
							<view class="tui-new-price">
								<text class="tui-new-present">￥{{item.shop_price}}</text>
								<text class="tui-new-original">￥{{item.market_price}}</text>
							</view>
						</view>
						<image :src="item.original_img" class="tui-new-img"></image>
					</view>
				</view>
			</view>
		</view>

		<view class="tui-product-box">
			<view class="tui-group-name">
				<text>精选商品</text>
			</view>
			<view class="tui-product-list">
				<view class="tui-product-container">
					<block v-for="(item,index) in productList" :key="index" v-if="(index+1)%2!=0">
						<!--商品列表-->
						<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="detail">
							<image :src="item.img" class="tui-pro-img" mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{item.name}}</view>
								<view>
									<view class="tui-pro-price">
										<text class="tui-sale-price">￥{{item.sale}}</text>
										<text class="tui-factory-price">￥{{item.factory}}</text>
									</view>
									<view class="tui-pro-pay">{{item.payNum}}人付款</view>
								</view>
							</view>
						</view>
						<!--商品列表-->
					</block>
				</view>
				<view class="tui-product-container">
					<block v-for="(item,index) in productList" :key="index" v-if="(index+1)%2==0">
						<!--商品列表-->
						<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="detail">
							<image :src="item.img" class="tui-pro-img" mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{item.name}}</view>
								<view>
									<view class="tui-pro-price">
										<text class="tui-sale-price">￥{{item.sale}}</text>
										<text class="tui-factory-price">￥{{item.factory}}</text>
									</view>
									<view class="tui-pro-pay">{{item.payNum}}人付款</view>
								</view>
							</view>
						</view>
						<!--商品列表-->
					</block>
				</view>
			</view>
		</view>

		<!--加载loadding-->
		<tui-loadmore :visible="loadding" :index="3" type="primary"></tui-loadmore>
		<tui-nomore :visible="!pullUpOn" bgcolor="#f2f2f2"></tui-nomore>
		<!--加载loadding-->
	</view>
</template>

<script>
	import tuiIcon from "../../components/icon/icon"
	import tuiLoadmore from "../../components/loadmore/loadmore"
	import tuiNomore from "../../components/nomore/nomore"
	import tuiSkeleton from "../../components/tui-skeleton/tui-skeleton"
	import { otherIndex } from "../../api/other";
	export default {
		components: {
			tuiIcon,
			tuiLoadmore,
			tuiNomore,
			tuiSkeleton
		},
		data() {
			return {
				skeletonShow: true,
				banner: [{}],
				category: [{},{},{},{},{},{},{},{},{},{}],
				newProduct: [{},{},{},{}],
				productList: [
					{
						img: "/static/images/product/1.jpg",
						name: "欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜 30ml（欧莱雅彩妆 BB霜 粉BB 遮瑕疵 隔离）",
						sale: 599,
						factory: 899,
						payNum: 2342
					},
					{
						img: "/static/images/product/2.jpg",
						name: "德国DMK进口牛奶  欧德堡（Oldenburger）超高温处理全脂纯牛奶1L*12盒",
						sale: 29,
						factory: 69,
						payNum: 999
					},
					{
						img: "/static/images/product/3.jpg",
						name: "【第2支1元】柔色尽情丝柔口红唇膏女士不易掉色保湿滋润防水 珊瑚红",
						sale: 299,
						factory: 699,
						payNum: 666
					},
					{
						img: "/static/images/product/4.jpg",
						name: "百雀羚套装女补水保湿护肤品",
						sale: 1599,
						factory: 2899,
						payNum: 236
					},
					{
						img: "/static/images/product/5.jpg",
						name: "百草味 肉干肉脯 休闲零食 靖江精制猪肉脯200g/袋",
						sale: 599,
						factory: 899,
						payNum: 2399
					},
					{
						img: "/static/images/product/6.jpg",
						name: "短袖睡衣女夏季薄款休闲家居服短裤套装女可爱韩版清新学生两件套 短袖粉色长颈鹿 M码75-95斤",
						sale: 599,
						factory: 899,
						payNum: 2399
					},
					{
						img: "/static/images/product/1.jpg",
						name: "欧莱雅（LOREAL）奇焕光彩粉嫩透亮修颜霜",
						sale: 599,
						factory: 899,
						payNum: 2342
					},
					{
						img: "/static/images/product/2.jpg",
						name: "德国DMK进口牛奶",
						sale: 29,
						factory: 69,
						payNum: 999
					},
					{
						img: "/static/images/product/3.jpg",
						name: "【第2支1元】柔色尽情丝柔口红唇膏女士不易掉色保湿滋润防水 珊瑚红",
						sale: 299,
						factory: 699,
						payNum: 666
					},
					{
						img: "/static/images/product/4.jpg",
						name: "百雀羚套装女补水保湿护肤品",
						sale: 1599,
						factory: 2899,
						payNum: 236
					}
				],
				loadding: false,
				pullUpOn: true
			}
		},
		onLoad() {
			this.init();
		},
		methods: {
			init() {
				this.getOtherIndex();
			},
			classify: function() {
				uni.navigateTo({
					url: '/pages/cart/cart'
				})

			},
			more: function(e) {
				let key = e.currentTarget.dataset.key || "";
				uni.navigateTo({
					url: '../productList/productList?searchKey=' + key
				})

			},
			search: function() {
				uni.navigateTo({
					url: '../news-search/news-search'
				})
			},
			getOtherIndex() {
				otherIndex().then(res => {
					this.skeletonShow = false;
					this.category = res.data.cate_list || [];
					this.banner = res.data.banner_list || [];
					this.newProduct = res.data.good_recommend_list || [];
				})
			}
		}
	}
</script>

<style>
	page {
		background: #f7f7f7;
	}

	.container {
		color: #333;
	}

	.tui-header {
		width: 100%;
		height: 100rpx;
		padding: 0 30rpx 0 20rpx;
		box-sizing: border-box;
		background: #e41f19;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 10;
	}

	.tui-rolling-search {
		width: 100%;
		height: 60rpx;
		border-radius: 35rpx;
		padding: 0 40rpx 0 30rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		color: #999;
	}

	.tui-category {
		font-size: 24rpx;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin: 0;
		margin-right: 22rpx;
		flex-shrink: 0;
	}

	.tui-category-scale {
		transform: scale(0.7);
		line-height: 24rpx;
	}

	.tui-search-icon {
		height: 60rpx;
		line-height: 60rpx;
	}

	.tui-swiper {
		font-size: 26rpx;
		height: 60rpx;
		line-height: 60rpx;
		flex: 1;
		padding-left: 12rpx;
	}

	.tui-swiper-item {
		display: flex;
		align-items: center;
	}

	.tui-hot-item {
		line-height: 26rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-header-banner {
		padding-top: 100rpx;
		box-sizing: border-box;
		background: #e41f19;
	}

	.tui-hot-search {
		color: #fff;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.tui-hot-tag {
		background: rgba(255, 255, 255, 0.15);
		padding: 10rpx 24rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 24rpx;
		/* margin-left: 20rpx; */
	}

	.tui-banner-bg {
		display: flex;
		height: 180rpx;
		background: #e41f19;
		position: relative;
	}

	.tui-primary-bg {
		width: 50%;
		display: inline-block;
		height: 224rpx;
		border: 1px solid transparent;
		position: relative;
		z-index: 1;
		background: #e41f19;
	}

	.tui-route-left {
		transform: skewY(8deg);
	}

	.tui-route-right {
		transform: skewY(-8deg);
	}

	.tui-banner-box {
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: absolute;
		/* overflow: hidden; */
		z-index: 9;
		bottom: -80rpx;
		left: 0;
	}

	.tui-banner-swiper {
		width: 100%;
		height: 240rpx;
		border-radius: 12rpx;
		overflow: hidden;
		transform: translateY(0);
	}

	.tui-slide-image {
		width: 100%;
		height: 240rpx;
		display: block;
	}

	/* #ifdef APP-PLUS || MP */
	.tui-banner-swiper .wx-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	.tui-banner-swiper .wx-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	.tui-banner-swiper .wx-swiper-dot-active::before {
		background: #fff;
	}

	.tui-banner-swiper .wx-swiper-dot.wx-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	/* #ifdef H5 */
	.tui-banner-swiper .uni-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	.tui-banner-swiper .uni-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	.tui-banner-swiper .uni-swiper-dot-active::before {
		background: #fff;
	}

	.tui-banner-swiper .uni-swiper-dot.uni-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	.tui-product-category {
		background: #fff;
		padding: 80rpx 20rpx 30rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		font-size: 24rpx;
		color: #555;
		margin-bottom: 20rpx;
	}

	.tui-category-item {
		width: 20%;
		height: 118rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		padding-top: 30rpx;
	}

	.tui-category-img {
		height: 80rpx;
		width: 80rpx;
		display: block;
	}

	.tui-category-name {
		min-width: 80rpx;
		min-height: 25rpx;
		line-height: 24rpx;
	}

	.tui-product-box {
		margin-top: 20rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.tui-pb-20 {
		padding-bottom: 20rpx;
	}

	.tui-bg-white {
		background: #fff;
	}

	.tui-group-name {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		padding: 24rpx 0;
	}

	.tui-new-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.tui-new-item {
		width: 49%;
		height: 200rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background: #f5f2f9;
		position: relative;
		border-radius: 12rpx;
	}

	.tui-new-mtop {
		margin-top: 2%;
	}

	.tui-title-box {
		font-size: 24rpx;
	}

	.tui-new-title {
		line-height: 32rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-new-price {
		padding-top: 18rpx;
	}

	.tui-new-present {
		color: #ff201f;
		font-weight: bold;
	}

	.tui-new-original {
		display: inline-block;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
		transform: scale(0.8);
		transform-origin: center center;
	}

	.tui-new-img {
		width: 160rpx;
		height: 160rpx;
		display: block;
		flex-shrink: 0;
	}

	.tui-new-label {
		width: 56rpx;
		height: 56rpx;
		border-top-left-radius: 12rpx;
		position: absolute;
		left: 0;
		top: 0;
	}

	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
		/* padding-top: 20rpx; */
	}

	.tui-product-container {
		flex: 1;
		margin-right: 2%;
	}

	.tui-product-container:last-child {
		margin-right: 0;
	}

	.tui-pro-item {
		width: 100%;
		margin-bottom: 4%;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.tui-pro-img {
		width: 100%;
		display: block;
	}

	.tui-pro-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.tui-pro-tit {
		color: #2e2e2e;
		font-size: 26rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-pro-price {
		padding-top: 18rpx;
	}

	.tui-sale-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;
	}

	.tui-factory-price {
		font-size: 24rpx;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
	}

	.tui-pro-pay {
		padding-top: 10rpx;
		font-size: 24rpx;
		color: #656565;
	}
</style>
