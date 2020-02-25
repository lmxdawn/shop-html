<template>
	<view class="container">
		<view class="tui-searchbox">
			<view class="tui-search-input">
				<!-- #ifdef APP-PLUS || MP -->
				<icon type="search" :size='13' color='#333'></icon>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view><tui-icon name="search" :size='16' color='#333'></tui-icon></view>
				<!-- #endif -->
				<input confirm-type="search" placeholder="请输入商品名称" :focus="true" auto-focus placeholder-class="tui-input-plholder"
				 class="tui-input" v-model.trim="key" @confirm="ok"/>
				<!-- #ifdef APP-PLUS || MP -->
				<icon type="clear" :size='13' color='#bcbcbc' @tap="cleanKey" v-show="key"></icon>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view @tap="cleanKey" v-show="key"><tui-icon name="close-fill" :size='16' color='#bcbcbc'></tui-icon></view>
				<!-- #endif -->
			</view>
			<view class="tui-cancle" @tap="ok">搜索</view>
		</view>

		<view class="tui-box" v-if="historyIsShow">
			<view class="tui-search-history" v-if="history.length>0">
				<view class="tui-history-header">
					<view class="tui-search-title">搜索历史</view>
					<tui-icon name="delete" :size='14' color='#333' @tap="openActionSheet" class="tui-icon-delete"></tui-icon>
				</view>
				<view class="tui-history-content">
					<block v-for="(item,index) in history" :key="index">
						<tui-tag type="gray" shape="circle" @tap="historyClick(item)">{{item}}</tui-tag>
					</block>
				</view>
			</view>
			<tui-actionsheet :show="showActionSheet" :tips="tips" @click="itemClick" @cancel="closeActionSheet"></tui-actionsheet>
		</view>

		<view class="tui-box" v-else>
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
									{{goodItem.cost_price || '0.00'}}
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
				<tui-nomore :visible="!isLoadMore" bgcolor="#fff"></tui-nomore>
			</scroll-view>
		</view>

	</view>

</template>

<script>
	import tuiIcon from "../../components/icon/icon"
	import tuiTag from "../../components/tag/tag"
	import tuiActionsheet from "../../components/actionsheet/actionsheet"
	import tuiLoadmore from "../../components/loadmore/loadmore"
	import tuiNomore from "../../components/nomore/nomore"
	import { goodList } from "../../api/good";
	import { getStorageSync, setStorageSync, removeStorageSync } from "../../utils/storage";
	export default {
		components: {
			tuiIcon,
			tuiTag,
			tuiActionsheet,
			tuiLoadmore,
			tuiNomore,
		},
		data() {
			return {
				historyKey: "search_history_key",
				history: [],
				historyIsShow: true,
				key: "",
				showActionSheet: false,
				tips: "确认清空搜索历史吗？",
				goods: [],
				loading: false,
				isLoadMore: true,
				params: {
					page: 1,
					count: 20,
					key: "",
				}
			}
		},
		onLoad: function(options) {
			const history = getStorageSync(this.historyKey) || [];
			this.history = Array.isArray(history) ? history : [];
		},
		onReachBottom() {
			this.loadMore();
		},
		methods: {
			init() {
				this.goods = [];
				this.params.page = 0;
				this.isLoadMore = true;
				this.loadMore();
			},
			ok() {
				if (this.key.length === 0) {
					return false;
				}
				this.historyIsShow = false;
				let index = 0;
				for (let item of this.history) {
					if (this.key === item) {
						this.history.splice(index, 1);
					}
					index++;
				}
				this.history.unshift(this.key);
				setStorageSync(this.historyKey, this.history);
				this.params.key = this.key;
				this.init();
			},
			historyClick(item) {
				this.key = item;
				this.ok();
			},
			cleanKey() {
				this.key = "";
				this.goods = [];
				this.historyIsShow = true;
			},
			closeActionSheet() {
				this.showActionSheet = false
			},
			openActionSheet() {
				this.showActionSheet = true
			},
			itemClick(e) {
				let index = e.index;
				if (index == 0) {
					this.showActionSheet = false;
					this.history = [];
					setStorageSync(this.historyKey, this.history);
				}
			},
			loadMore() {
				if (!this.isLoadMore) {
					return false;
				}
				this.getGoodList();
			},
			getGoodList() {
				if (this.loading) {
					return false;
				}
				this.loading = true;
				goodList(this.params)
					.then(res => {
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
	page {
		color: #333;
		background: #fff;
	}

	.container {
		padding: 0 30upx 30upx 30upx;
		box-sizing: border-box;
	}

	.tui-searchbox {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		padding: 30upx;
		z-index: 11;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background: #fff;
	}

	.tui-search-input {
		width: 100%;
		height: 66upx;
		border-radius: 35upx;
		padding: 0 30upx;
		box-sizing: border-box;
		background: #f2f2f2;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
	}

	.tui-input {
		flex: 1;
		color: #333;
		padding: 0 16upx;
		font-size: 28upx;
	}

	.tui-input-plholder {
		font-size: 28upx;
		color: #b2b2b2;
	}

	.tui-cancle {
		color: #888;
		font-size: 28upx;
		padding-left: 30upx;
		flex-shrink: 0;
	}

	.tui-history-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30upx 0;
	}

	.tui-icon-delete {
		padding: 10upx;
	}

	.tui-search-title {
		font-size: 28upx;
		font-weight: bold;
	}

	.tui-hot-header {
		padding: 30upx 0;
	}

	.tui-tag-class {
		display: inline-block;
		margin-bottom: 20upx;
		margin-right: 20upx;
		font-size: 26upx !important;
	}

	.tui-box {
		padding-top: 126rpx;
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
		padding: 5rpx 20rpx 40rpx;
		display: flex;
		border-bottom: 1px solid #f6f6f6;
	}
	.tab-list-item-img {
		width: 180rpx;
		height: 180rpx !important;
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
		font-size: 38rpx;
		color: #333;
		font-weight: 600;
	}
	.tab-list-pay {
		max-width: 100%;
		transform: scale(0.9);
		transform-origin: 0 center;
		font-size: 30rpx;
		line-height: 32rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #999999;
		margin-top: 15rpx;
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
		font-size: 30rpx;
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
		font-size: 30rpx;
		font-weight: 600;
	}
	.tab-list-price-int {
		font-size: 40rpx;
	}
	.tab-list-price-decimal {
		font-size: 30rpx;
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
</style>
