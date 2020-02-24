<template>
	<view class="container">
		<view class="tui-searchbox">
			<view class="tui-search-input" @tap="search">
				<!-- #ifdef APP-PLUS || MP -->
				<icon type="search" size='13' color='#999'></icon>
				<!-- #endif -->
				<text class="tui-search-text">搜索商品</text>
			</view>
		</view>

		<view :style="{height:height+'px',marginTop:top+'px'}" class="tab-main">
			<tui-skeleton v-if="skeletonShow" backgroundColor="#fafafa" borderRadius="10rpx"></tui-skeleton>
			<tui-skeleton selector="tui-skeleton-good" v-if="goodSkeletonShow" backgroundColor="#fafafa" borderRadius="10rpx" style="z-index: 890;" :isLoading="false"></tui-skeleton>
			<view class="tui-skeleton tui-skeleton-good" style="height: 100%;">
				<scroll-view scroll-y scroll-with-animation class="tab-view" :scroll-top="scrollTop" :style="{height:height+'px'}">
					<view v-for="(item,index) in tabBar" :key="index" class="tab-bar-item tui-skeleton-rect" :class="[currentTab===index ? 'active' : '']" @tap.stop="swichNav(index)">
						<text>{{item.name}}</text>
					</view>
				</scroll-view>
				<scroll-view scroll-x scroll-with-animation class="tab-top-view" :scroll-left="scrollLeft">
					<view v-for="(itemTop,indexTop) in topTabBar" :key="indexTop" class="tab-top-bar-item tui-skeleton-fillet" :class="[currentTopTab===indexTop ? 'active' : '']" @tap.stop="swichTopNav(indexTop, itemTop)">
						<text class="tab-bar-title">{{itemTop.name}}</text>
					</view>
				</scroll-view>
				<view class="tab-list">
					<scroll-view scroll-y scroll-with-animation class="tab-list-scroll">
						<view class="tab-list-item" v-for="(goodItem, goodIndex) in goods" :key="goodIndex">
							<image :src="goodItem.original_img" class="tab-list-item-img tui-skeleton-fillet tui-skeleton-good-fillet" mode="widthFix" />
							<view class="tab-list-info">
								<view class="tab-list-title tui-skeleton-rect tui-skeleton-good-rect">{{goodItem.good_name || "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}}</view>
								<view class="tab-list-pay tui-skeleton-rect tui-skeleton-good-rect">已售{{goodItem.sales_sum}}{{goodItem.unit}}</view>
								<view class="tab-list-price-box">
									<view class="tab-list-prices tui-skeleton-rect tui-skeleton-good-rect">
										<view class="tab-list-price-shop">
											<text class="tab-list-price-symbol">￥</text>
											<block v-if="goodItem.shop_price_list && goodItem.shop_price_list.length > 0">
												<text class="tab-list-price-int">{{goodItem.shop_price_list[0]}}</text>
												<text class="tab-list-price-decimal">.{{goodItem.shop_price_list[1]}}</text>
											</block>
											<block v-else>
												<text class="tab-list-price-int">0</text>
												<text class="tab-list-price-decimal">.00</text>
											</block>
										</view>
										<view class="tab-list-price-market">
											<text class="tab-list-price-symbol">￥</text>
											{{goodItem.market_price || '0.00'}}
										</view>
									</view>
									<view class="tab-list-scale tui-skeleton-circular tui-skeleton-good-circular" @tap.stop="cartAdd(goodIndex, goodItem)">
										<tui-icon name="cart" :size="20" color="#fff"></tui-icon>
										<tui-tag class="tab-list-scale-tag" shape="circle" type="red" size="mini" v-if="goodItem.cart_num > 0" :class="{w10: goodItem.cart_num >= 10 && goodItem.cart_num < 100, w100: goodItem.cart_num >= 100}">{{goodItem.cart_num}}</tui-tag>
									</view>
								</view>
							</view>
						</view>
						<!--加载loadding-->
						<tui-loadmore :visible="loading" :index="3" type="red"></tui-loadmore>
						<tui-nomore :visible="!isLoadMore" bgcolor="#fafafa"></tui-nomore>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tuiIcon from "../../components/icon/icon"
	import tuiTag from '../../components/tag/tag'
	import tuiLoadmore from "../../components/loadmore/loadmore"
	import tuiNomore from "../../components/nomore/nomore"
	import tuiSkeleton from "../../components/tui-skeleton/tui-skeleton"
	import { goodCategoryList } from "../../api/goodCategory";
	import { goodList } from "../../api/good";
	import { mapGetters } from "vuex";
	export default {
		components: {
			tuiIcon,
			tuiTag,
			tuiLoadmore,
			tuiNomore,
			tuiSkeleton
		},
		computed: {
			...mapGetters({
				adParams: "adParams",
			})
		},
		data() {
			return {
				tabBar: [{},{},{},{},{},{},{},{},{},{},{}],
				tabBarMap: {},
				topTabBar: [{},{},{},{},{}],
				height: 0, //scroll-view高度
				top: 0,
				currentTab: 0, //预设当前项的值
				scrollTop: 0, //tab标题的滚动条位置,
				scrollLeft: 0,
				currentTopTab: 0,
				cartNum: 0,
				skeletonShow: false,
				goodSkeletonShow: false,
				goods: [{},{},{},{},{},{},{},{}],
				loading: false,
				isLoadMore: true,
				params: {
					page: 1,
					count: 20,
					category_id: "",
				},
				category_id: ""
			}
		},
		onLoad: function(options) {
			setTimeout(() => {
				uni.getSystemInfo({
					success: (res) => {
						let header = 92;
						let top = 0;
						this.height = res.windowHeight - uni.upx2px(header);
						this.top = top + uni.upx2px(header);
						this.init();
					}
				});
			}, 50);
		},
		onShow() {
			this.init();
		},
		onPullDownRefresh() {
			// 清空之前的
			this.currentTab = 0;
			this.currentTopTab = 0;
			this.goodSkeletonShow = true;
			this.init();
		},
		onReachBottom() {
			this.loadMore();
		},
		methods: {
			init() {
				this.skeletonShow = true;
				this.goodSkeletonShow = true;
				if (this.adParams.category_id) {
					this.category_id = this.adParams.category_id;
					this.$store.dispatch("setAdParams", {key: "category_id", value: ""});
				}
				this.getGoodCategoryList();
			},
			// 点击标题切换当前页时改变样式
			swichNav(index) {
				if (this.currentTab === index) {
					return false;
				}
				this.currentTab = index;
				this.currentTopTab = 0;
				this.checkCor();
				const topTabBar = this.tabBarMap[index] || [];
				if (topTabBar.length === 0) {
					this.params.category_id = 0;
				}
				let count = 0;
				for (let item of topTabBar) {
					if (count === this.currentTopTab) {
						this.params.category_id = item.id;
					}
					count++;
				}
				this.topTabBar = topTabBar;
				this.getSelectGoodList();
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor() {
				let that = this;
				//这里计算按照实际情况进行修改，动态数据要进行动态分析
				//思路：窗体高度/单个分类高度 200rpx 转px计算 =>得到一屏幕所显示的个数，结合后台传回分类总数进行计算
				//数据很多可以多次if判断然后进行滚动距离计算即可
				if (that.currentTab > 7) {
					that.scrollTop = 500
				} else {
					that.scrollTop = 0
				}
			},
			// 点击标题切换当前页时改变样式
			swichTopNav(index, item) {
				if (this.currentTopTab === index) {
					return false;
				}
				this.currentTopTab = index;
				this.checkTopCor();
				this.params.category_id = item.id;
				this.getSelectGoodList();
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkTopCor() {
				if (this.currentTopTab > 2) {
					//这里距离按实际计算
					this.scrollLeft = 300
				} else {
					this.scrollLeft = 0
				}
			},
			cartAdd(index, item) {
				this.goods[index].cart_num++;
			},
			detail(e) {
				uni.navigateTo({
					url: '../extend-view/productDetail/productDetail'
				})
			},
			productList(e) {
				let key = e.currentTarget.dataset.key;
				uni.navigateTo({
					url: '../extend-view/productList/productList?searchKey=' + key
				})
			},
			search() {
				this.$tui.navigateTo("search/search");
			},
			getGoodCategoryList() {
				goodCategoryList()
					.then(res => {
						this.skeletonShow = false;
						uni.stopPullDownRefresh();
						const list = res.data || [];
						let index = 0;
						for (let item of list) {
							if (this.category_id == item.id) {
								this.currentTab = index;
							}
							index++;
						}
						let category_id = "";
						let count = 0;
						for (let item of list) {
							this.tabBarMap[count] = [];
							let cCount = 0;
							if (item.children) {
								for (let cItem of item.children) {
									let cCCount = 0;
									if (cItem.children) {
										for (let cCItem of cItem.children) {
											if (count === this.currentTab && cCount === 0 && cCCount === this.currentTopTab) {
												category_id = cCItem.id;
											}
											this.tabBarMap[count].push(cCItem);
											cCCount++;
										}
									}
									cCount++;
								}
							}
							if (count === this.currentTab) {
								this.topTabBar = this.tabBarMap[count];
							}
							count++;
						}
						this.params.category_id = category_id;
						this.tabBar = list;
						this.getSelectGoodList();
					})
			},
			loadMore() {
				if (!this.isLoadMore) {
					return false;
				}
				this.getGoodList();
			},
			getSelectGoodList() {
				this.goods = [{},{},{},{},{},{},{},{}];
				this.params.page = 1;
				this.isLoadMore = true;
				this.goodSkeletonShow = true;
				this.getGoodList();
			},
			getGoodList() {
				if (this.loading) {
					return false;
				}
				this.loading = true;
				goodList(this.params)
					.then(res => {
						this.goodSkeletonShow = false;
						if (this.params.page === 1) {
							this.goods = [];
						}
						this.loading = false;
						this.params.page++;
						const list = res.data || [];
						for (let item of list) {
							item.shop_price_list = item.shop_price.split(".");
							this.goods.push(item);
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
	::-webkit-scrollbar {
		display: none;
	}

	page {
		background: #fcfcfc;
	}

	/* 左侧导航布局 start*/

	/* 隐藏scroll-view滚动条*/

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.tui-searchbox {
		width: 100%;
		height: 92upx;
		padding: 0 30upx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 901;
	}

	.tui-searchbox::after {
		content: '';
		position: absolute;
		border-bottom: 1upx solid #d2d2d2;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.tui-search-input {
		width: 100%;
		height: 60upx;
		background: #f1f1f1;
		border-radius: 30upx;
		font-size: 26upx;
		color: #999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-search-text {
		padding-left: 16upx;
	}

	.tab-main {
		box-sizing: border-box;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tab-view {
		float: left;
	 	height: 100%;
		width: 200upx;
		background: #f6f6f6;
		z-index: 899;
		position: absolute;
		box-sizing: border-box;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tab-bar-item {
		width: 200upx;
		height: 100upx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26upx;
		font-weight: 400;
		color: #444;
		margin-bottom: 10rpx;
	}

	.tab-view .active {
		position: relative;
		color: #fa436a;
		font-size: 30upx;
		font-weight: 600;
	}

	tab-view .active::before {
		content: "";
		position: absolute;
		border-left: 8upx solid #E41F19;
		height: 30upx;
		left: 0;
	}

	.tab-top-view {
		width: 100%;
		white-space: nowrap;
		z-index: 898;
		position: absolute;
		box-sizing: border-box;
		padding-left: 200rpx;
		padding-top: 20upx;
		padding-right: 20upx;
	}

	.tab-top-bar-item {
		box-sizing: border-box;
		height: 60rpx;
		min-width: 90rpx;
		line-height: 60rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		border-radius: 10rpx;
		display: inline-block;
		text-align: center;
		font-size: 26upx;
		font-weight: 400;
		color: #444;
		border: 1px solid #f6f6f6;
		margin-left: 20rpx;
	}

	.tab-top-view .active {
		color: #fa436a;
		font-weight: 600;
		border: 1px solid #fa436a;
	}

	.tab-list {
		height: 100%;
		box-sizing: border-box;
		padding-top: 80rpx;
		padding-left: 220rpx;
		padding-right: 20upx;
	}

	.tab-list-scroll {
		height: 100%;
		width: 100%;
	}

	.tab-list-item {
		padding: 40rpx 20rpx;
		display: flex;
		border-bottom: 1px solid #f6f6f6;
	}
	.tab-list-item-img {
		width: 140rpx;
		height: 140rpx !important;
		border-radius: 12rpx;
		flex-shrink: 0;
		display: block;
	}
	.tab-list-info {
		width: 100%;
		padding-left: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		box-sizing: border-box;
	}
	.tab-list-title {
		white-space: normal;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 28rpx;
		color: #333;
	}
	.tab-list-pay {
		max-width: 100%;
		transform: scale(0.9);
		transform-origin: 0 center;
		font-size: 26rpx;
		line-height: 32rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #999999;
		margin-top: 10rpx;
	}
	.tab-list-price-box {
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-top: 10rpx;
	}
	.tab-list-prices {
		color: red;
	}
	.tab-list-price-symbol{
		font-size: 25rpx;
		letter-spacing: -2px;
		font-weight: 600;
	}
	.tab-list-price-shop {
		display: inline-block;
		margin-right: 5px;
		font-weight: 600;
	}
	.tab-list-price-market {
		display: inline-block;
		color: #999999;
		text-decoration: line-through;
		font-size: 25rpx;
		font-weight: 600;
	}
	.tab-list-price-int {
		font-size: 34rpx;
	}
	.tab-list-price-decimal {
		font-size: 25rpx;
	}
	.tab-list-scale {
		width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 50%;
		text-align: center;
		background-image: linear-gradient(#fd5609, #fc8b3f);
		position: relative;
		flex-shrink: 0;
	}
	.tab-list-scale-tag {
		position: absolute;
		top: -12rpx;
		right: -12rpx;
		border: 1px solid #F0F0F0;
	}
	.tab-list-scale-tag.w10 {
		right: -20rpx;
	}
	.tab-list-scale-tag.w100 {
		right: -24rpx;
	}

	/* 左侧导航布局 end*/

	.right-box {
		width: 100%;
		position: fixed;
		padding-left: 200upx;
		box-sizing: border-box;
		left: 0;
	}

	.page-view {
		width: 100%;
		overflow: hidden;
		padding-top: 20upx;
		padding-right: 20upx;
		box-sizing: border-box;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.swiper {
		width: 100%;
		height: 220upx;
		border-radius: 12upx;
		overflow: hidden;
		transform: translateZ(0);
	}

	/* #ifdef APP-PLUS || MP */
	.swiper .wx-swiper-dot {
		width: 8upx;
		height: 8upx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	.swiper .wx-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 16upx;
		overflow: hidden;
	}

	.swiper .wx-swiper-dot-active::before {
		background: #fff;
	}

	.swiper .wx-swiper-dot.wx-swiper-dot-active {
		width: 16upx;
	}

	/* #endif */

	/* #ifdef H5 */
	>>>.swiper .uni-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	>>>.swiper .uni-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	>>>.swiper .uni-swiper-dot-active::before {
		background: #fff;
	}

	>>>.swiper .uni-swiper-dot.uni-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	.slide-image {
		width: 100%;
		height: 220upx;
	}

	.class-box {
		padding-top: 30upx;
	}

	.class-item {
		background: #fff;
		width: 100%;
		box-sizing: border-box;
		padding: 20upx;
		margin-bottom: 20upx;
		border-radius: 12upx;
	}

	.class-name {
		font-size: 22upx;
	}

	.g-container {
		/* padding-top: 20upx; */
		display: flex;
		display: -webkit-flex;
		justify-content: flex-start;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.g-box {
		width: 33.3333%;
		text-align: center;
		padding-top: 40upx;
	}

	.g-image {
		width: 120upx;
		height: 120upx;
	}

	.g-title {
		font-size: 22upx;
	}
</style>
