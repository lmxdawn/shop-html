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
				<view class="tui-rolling-search tui-skeleton-fillet" @tap="search">
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
				<view class="tui-category-item" v-for="(item,index) in category" :key="index" @tap="categoryClick(item)">
					<image :src="item.pic" class="tui-category-img tui-skeleton-fillet" mode="scaleToFill"></image>
					<view class="tui-category-name tui-skeleton-rect">{{item.title}}</view>
				</view>
			</view>

			<view class="tui-product-box tui-pb-20 tui-bg-white">
				<view class="tui-group-name">
					<text class="tui-skeleton-rect">新品推荐</text>
				</view>
				<view class="tui-new-box">
					<view class="tui-new-item tui-skeleton-fillet" :class="[index!=0 && index!=1 ?'tui-new-mtop':'']" v-for="(item,index) in newProduct"
						  :key="index" @tap="goodDetail(item)">
						<view class="tui-title-box">
							<view class="tui-new-title">{{item.good_name}}</view>
							<view class="tui-new-price">
								<view class="tui-new-present"><text style="letter-spacing: -2px;">￥</text>{{item.shop_price}}</view>
								<view class="tui-new-original">￥{{item.cost_price}}</view>
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
						<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="goodDetail(item)">
							<image :src="item.original_img" class="tui-pro-img" mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{item.good_name}}</view>
								<view>
									<view class="tui-pro-price">
										<text class="tui-sale-price">￥{{item.shop_price}}</text>
										<text class="tui-factory-price">￥{{item.cost_price}}</text>
									</view>
									<view class="tui-pro-pay">已售{{item.sales_sum}}{{item.unit}}</view>
								</view>
							</view>
						</view>
						<!--商品列表-->
					</block>
				</view>
				<view class="tui-product-container">
					<block v-for="(item,index) in productList" :key="index" v-if="(index+1)%2==0">
						<!--商品列表-->
						<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="goodDetail(item)">
							<image :src="item.original_img" class="tui-pro-img" mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{item.good_name}}</view>
								<view>
									<view class="tui-pro-price">
										<text class="tui-sale-price">￥{{item.shop_price}}</text>
										<text class="tui-factory-price">￥{{item.cost_price}}</text>
									</view>
									<view class="tui-pro-pay">已售{{item.sales_sum}}{{item.unit}}</view>
								</view>
							</view>
						</view>
						<!--商品列表-->
					</block>
				</view>
			</view>
		</view>

		<!--加载loadding-->
		<tui-loadmore :visible="loading" :index="3" type="primary"></tui-loadmore>
		<tui-nomore :visible="!isLoadMore" bgcolor="#f7f7f7"></tui-nomore>
		<!--加载loadding-->
	</view>
</template>

<script>
	import tuiIcon from "../../components/icon/icon"
	import tuiLoadmore from "../../components/loadmore/loadmore"
	import tuiNomore from "../../components/nomore/nomore"
	import tuiSkeleton from "../../components/tui-skeleton/tui-skeleton"
	import { otherIndex } from "../../api/other";
	import { goodRecommend } from "../../api/good";
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
				productList: [],
				loading: false,
				isLoadMore: true,
				params: {
					page: 1,
					count: 20
				}
			}
		},
		onLoad() {
			this.init();
		},
		onPullDownRefresh() {
			// 清空之前的
			this.productList = [];
			this.params.page = 1;
			this.isLoadMore = true;
			this.init();
		},
		onReachBottom() {
			this.loadMore();
		},
		methods: {
			init() {
				this.getOtherIndex();
				this.loadMore();
			},
			goodDetail(item) {
				this.$tui.navigateTo("productDetail/productDetail?good_id=" + item.good_id);
			},
			classify: function() {
				this.$tui.switchTab("category/category");
			},
			categoryClick(item) {
				if (item.jump_type === 0) {
					// web
					this.$tui.jumpWebView(item.jump_url);
				} else if (item.jump_type === 3) {
					// uniapp内部链接
					this.$tui.navigateTo(item.jump_url);
				} else if (item.jump_type === 4){
					let str = item.jump_url.split('?')[1];
					let arr = str.split('&');
					for (let valueItem of arr) {
						let valueArr = str.split('=');
						this.$store.dispatch("setAdParams", {key: valueArr[0], value: valueArr[1]});
					}
					// uniapptabBar链接
					this.$tui.switchTab(item.jump_url);
				}
			},
			search: function() {
				this.$tui.navigateTo("search/search");
			},
			getOtherIndex() {
				otherIndex()
					.then(res => {
						this.skeletonShow = false;
						uni.stopPullDownRefresh();
						this.category = res.data.cate_list || [];
						this.banner = res.data.banner_list || [];
						this.newProduct = res.data.good_new_list || [];
					})
			},
			loadMore() {
				if (!this.isLoadMore) {
					return false;
				}
				this.getRecommendGood();
			},
			getRecommendGood() {
				if (this.loading) {
					return false;
				}
				this.loading = true;
				goodRecommend(this.params)
						.then(res => {
							this.loading = false;
							this.params.page++;
							const list = res.data || [];
							for (let item of list) {
								this.productList.push(item);
							}
							if (list.length < this.params.count) {
								this.isLoadMore = false;
							}
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
		width: 100%;
		padding-right: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		box-sizing: border-box;
		word-break: break-all;
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
		display: flex;
		flex-wrap: wrap;
	}

	.tui-new-present {
		color: #ff201f;
		font-weight: bold;
		word-break: normal;
	}

	.tui-new-original {
		display: inline-block;
		color: #a0a0a0;
		text-decoration: line-through;
		transform: scale(0.8);
		transform-origin: center center;
	}

	.tui-new-img {
		width: 150rpx;
		height: 150rpx;
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
