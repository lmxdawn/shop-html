<template>
	<view class="container">
		<tui-tips v-if="dataList.length === 0" style="margin-top: 100rpx;" :fixed="false" imgUrl="/static/images/toast/img_nodata.png">购物车空空如也，赶紧去逛逛吧~</tui-tips>
		<view v-else>
			<!-- #ifdef MP || H5-->
			<view class="tui-edit-goods">
				<view>购物车共<text class="tui-goods-num">{{dataList.length}}</text>件商品</view>
				<view>
					<tui-button type="gray" :plain="true" shape="circle" width="160rpx" height="60rpx" :size="24" @click="editGoods">{{isEdit?"完成":"编辑商品"}}</tui-button>
				</view>
			</view>
			<!-- #endif -->
			<checkbox-group>
				<view class="tui-cart-cell  tui-mtop" v-for="(item,index) in dataList" :key="index">
					<view class="tui-goods-item">
						<label class="tui-checkbox" v-if="isEdit" @tap="goodSelect(index, item)">
							<checkbox disabled :checked="item.is_select === 1" color="#fff"></checkbox>
						</label>
						<label class="tui-checkbox" v-else @tap="goodClick(index, item)">
							<checkbox disabled :checked="item.is_check === 1" color="#fff"></checkbox>
						</label>
						<image :src="item.original_img" class="tui-goods-img" />
						<view class="tui-goods-info">
							<view class="tui-goods-title">
								{{item.good_name}}
							</view>
							<view class="tui-goods-model">
								<text class="tui-goods-attr-tag">自营</text>
								<text class="tui-goods-attr-tag" v-if="item.is_hot === 1">热卖</text>
								<text class="tui-goods-attr-tag" v-if="item.is_new === 1">新品</text>
								<text class="tui-goods-attr-tag" v-if="item.is_recommend === 1">推荐</text>
							</view>
							<view class="tui-price-box">
								<view class="tui-goods-price">￥{{item.money}}</view>
								<view class="tui-scale">
									<tui-numberbox :value="item.count" :height="40" :width="74" :min="1" :index="index" @change="changeNum"></tui-numberbox>
								</view>
							</view>
						</view>
					</view>
				</view>
			</checkbox-group>

			<!--猜你喜欢-->
			<tui-divider :size="28" :bold="true" color="#333" width="50%">
				<tui-icon name="like" :size="18" color="#e41f19"></tui-icon>
				<text class="tui-youlike">猜你喜欢</text>
			</tui-divider>
			<view class="tui-product-list">
				<view class="tui-product-container">
					<!--商品列表-->
					<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" v-for="(item,index) in productList" :key="index" v-if="(index+1)%2!==0" @tap="goodDetail(item)">
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
				</view>
				<view class="tui-product-container">
					<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" v-for="(item,index) in productList" :key="index" v-if="(index+1)%2===0" @tap="goodDetail(item)">
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
				</view>
			</view>

			<!--tabbar-->
			<view class="tui-tabbar">
				<view class="tui-checkAll">
					<checkbox-group>
						<label class="tui-checkbox" v-if="isEdit" @click="allSelect">
							<checkbox disabled :checked="selectCount === dataList.length" color="#fff"></checkbox>
							<text class="tui-checkbox-pl">全选</text>
						</label>
						<label class="tui-checkbox" v-else @click="allClick">
							<checkbox disabled :checked="sumCount === dataList.length" color="#fff"></checkbox>
							<text class="tui-checkbox-pl">全选</text>
						</label>
					</checkbox-group>
					<view class="tui-total-price" v-if="!isEdit">合计:<text class="tui-bold">￥{{sumMoney}}</text> </view>
				</view>
				<view>
					<tui-button width="200rpx" height="70rpx" :size="30" type="danger" shape="circle" v-if="!isEdit" @click="btnPay">去结算({{sumCount}})</tui-button>
					<tui-button width="200rpx" height="70rpx" :size="30" type="danger" shape="circle" :plain="true" v-else @tap="deleteGood">删除</tui-button>
				</view>
			</view>
			<!--加载loadding-->
			<tui-loadmore :visible="loading" :index="3" type="red"></tui-loadmore>
			<tui-nomore :visible="!isLoadMore" bgcolor="#fafafa"></tui-nomore>
		</view>

	</view>
</template>

<script>
	import tuiSwipeAction from "../../components/swipe-action/swipe-action"
	import tuiButton from "../../components/extend/button/button"
	import tuiNumberbox from "../../components/numberbox/numberbox"
	import tuiIcon from "../../components/icon/icon"
	import tuiDivider from "../../components/divider/divider"
	import tuiLoadmore from "../../components/loadmore/loadmore"
	import tuiNomore from "../../components/nomore/nomore"
	import tuiTips from "../../components/extend/tips/tips"
	import { goodRecommend } from "../../api/good";
	import { orderCartList, orderCartSave, orderCartDelete, orderCartCheck } from "../../api/orderCart";
	import calculation from "../../common/calculation"
	export default {
		components: {
			tuiSwipeAction,
			tuiButton,
			tuiNumberbox,
			tuiIcon,
			tuiDivider,
			tuiLoadmore,
			tuiNomore,
			tuiTips
		},
		props: {
			isTabBar: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				dataList: [],
				isEdit: false,
				productList: [],
				sumMoney: 0,
				sumCount: 0,
				selectCount: 0,
				loading: false,
				isLoadMore: true,
				params: {
					page: 1,
					count: 20
				}
			}
		},
		methods: {
			init() {
				this.getOrderCartList();
				this.loadMore();
			},
			pullDownRefresh() {
				this.productList = [];
				this.params.page = 1;
				this.isLoadMore = true;
				this.init();
			},
			reachBottom() {
				this.loadMore();
			},
			navigationBarButtonTap() {
				this.isEdit = !this.isEdit;
				let text = this.isEdit ? "完成" : "编辑";
				// #ifdef APP-PLUS
				let webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewButtonStyle(0, {
					text: text
				});
				// #endif
			},
			calculation() {
				let sumMoney = 0;
				let sumCount = 0;
				for (let item of this.dataList) {
					if (item.is_check === 1) {
						let money = calculation.accMul(item.count, item.shop_price);
						sumMoney = calculation.accAdd(sumMoney, money);
						sumCount++;
					}
				}
				this.sumCount = sumCount;
				this.sumMoney = sumMoney;
			},
			allSelect() {
				let dataList= [];
				let is_select = this.selectCount === this.dataList.length ? 0 : 1;
				let selectCount = 0;
				for (let item of this.dataList) {
					item.is_select = is_select;
					dataList.push(item);
					selectCount++;
				}
				this.selectCount = is_select === 1 ? selectCount : 0;
				this.dataList = dataList;
			},
			allClick() {
				let good_ids= [];
				let dataList= [];
				let is_check = this.sumCount === this.dataList.length ? 0 : 1;
				for (let item of this.dataList) {
					good_ids.push(item.good_id);
					item.is_check = is_check;
					dataList.push(item);
				}
				this.dataList = dataList;
				this.calculation();
				this.$tui.showLoading();
				orderCartCheck({ good_ids: good_ids, is_check: 1})
						.then(res => {
							this.$tui.hideLoading();
							if (res.code > 0) {
								this.$tui.toast(res.message);
								return false;
							}
						})
						.catch(() => {
							this.$tui.hideLoading();
						})
			},
			goodSelect(index, item) {
				item.is_select = item.is_select === 1 ? 0 : 1;
				this.dataList.splice(index, 1, item);
				let selectCount = 0;
				for (let item of this.dataList) {
					if (item.is_select === 1) {
						selectCount++;
					}
				}
				this.selectCount = selectCount;
			},
			deleteGood() {
				let good_ids= [];
				let indexs = [];
				let index = 0;
				for (let item of this.dataList) {
					if (item.is_select === 1) {
						good_ids.push(item.good_id);
						indexs.push(index);
					}
					index++;
				}
				if (good_ids.length === 0) {
					this.$tui.toast("请选择要删除的商品");
					return false;
				}
				uni.showModal({
					title: '提示',
					content: '确认删除商品？',
					success: (res) => {
						if (res.confirm) {
							this.$tui.showLoading();
							orderCartDelete({ good_ids: good_ids})
									.then(res => {
										this.$tui.hideLoading();
										if (res.code > 0) {
											this.$tui.toast(res.message);
											return false;
										}
										this.$tui.toast("删除成功");
										for (let item of indexs) {
											this.dataList.splice(item, 1);
										}
										this.calculation();
									})
									.catch(() => {
										this.$tui.hideLoading();
									})
						}
					}
				});
			},
			goodClick(index, item) {
				item.is_check = item.is_check === 1 ? 0 : 1;
				this.dataList.splice(index, 1, item);
				this.calculation();
				this.$tui.showLoading();
				orderCartCheck({ good_ids: [item.good_id], is_check: item.is_check})
					.then(res => {
						this.$tui.hideLoading();
						if (res.code > 0) {
							this.$tui.toast(res.message);
							return false;
						}
					})
					.catch(() => {
						this.$tui.hideLoading();
					})
			},
			changeNum(e) {
				let item = this.dataList[e.index];
				const data = {
					good_id: item.good_id,
					count: e.value
				};
				if (data.count <= 0) {
					uni.showModal({
						title: '提示',
						content: '确认删除商品？',
						success: (res) => {
							if (res.confirm) {
								this.$tui.showLoading();
								orderCartDelete({ good_ids: [item.good_id]})
									.then(res => {
										this.$tui.hideLoading();
										if (res.code > 0) {
											this.$tui.toast(res.message);
											return false;
										}
										this.$tui.toast("删除成功");
										this.dataList.splice(index, 1);
										this.calculation();
									})
									.catch(() => {
										this.$tui.hideLoading();
									})
							}
						}
					});
					return false;
				}
				this.$tui.showLoading();
				orderCartSave(data)
					.then(res => {
						this.$tui.hideLoading();
						if (res.code > 0) {
							this.$tui.toast(res.message);
							return false;
						}
						item.count = e.value;
						item.money = calculation.accMul(item.count, item.shop_price);
						this.dataList.splice(e.index, 1, item);
						this.calculation();
					})
					.catch(() => {
						this.$tui.hideLoading();
					})
			},
			editGoods() {
				// #ifdef H5 || MP
				this.isEdit = !this.isEdit;
				// #endif
			},
			goodDetail(item) {
				this.$tui.navigateTo("productDetail/productDetail?good_id=" + item.good_id);
			},
			btnPay() {
				uni.navigateTo({
					url: '../submitOrder/submitOrder'
				})
			},
			getOrderCartList() {
				orderCartList()
					.then(res => {
						this.dataList = res.data || [];
						this.calculation();
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
				this.$tui.showLoading("加载中", true);
				goodRecommend(this.params)
						.then(res => {
							this.loading = false;
							this.$tui.hideLoading();
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
	.container {
		padding-bottom: 120rpx;
	}

	.tui-mtop {
		margin-top: 24rpx;
	}

	.tui-edit-goods {
		width: 100%;
		border-radius: 12rpx;
		overflow: hidden;
		padding: 24rpx 30rpx 0 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #333;
		font-size: 24rpx;
	}

	.tui-goods-num {
		font-weight: bold;
		color: #e41f19;
	}

	.tui-cart-cell {
		width: 100%;
		border-radius: 12rpx;
		background: #FFFFFF;
		padding: 40rpx 0;
		overflow: hidden;
	}

	.tui-goods-item {
		display: flex;
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.tui-checkbox {
		/* width: 40rpx; */
		padding-right: 30rpx;
		display: flex;
		align-items: center;
	}

	/* #ifdef APP-PLUS || MP */
	.tui-checkbox .wx-checkbox-input {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		margin: 0;
	}

	.tui-checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		background: #F82400;
		width: 40rpx;
		height: 40rpx;
		border: none;
	}

	/* #endif */
	/* #ifdef H5 */
	>>>.tui-checkbox .uni-checkbox-input {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50% !important;
		margin: 0;
	}

	>>>.tui-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		background: #F82400;
		width: 40rpx;
		height: 40rpx;
		border: none;
	}

	/* #endif */
	.tui-goods-img {
		width: 200rpx;
		height: 200rpx !important;
		border-radius: 12rpx;
		flex-shrink: 0;
		display: block;
	}

	.tui-goods-info {
		width: 100%;
		padding-left: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		box-sizing: border-box;
		overflow: hidden;
	}

	.tui-goods-title {
		white-space: normal;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 24rpx;
		color: #333;
	}

	.tui-goods-model {
		max-width: 100%;
		color: #333;
		background: #F5F5F5;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16rpx;
		box-sizing: border-box;
	}

	.tui-model-text {
		max-width: 100%;
		transform: scale(0.9);
		transform-origin: 0 center;
		font-size: 24rpx;
		line-height: 32rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tui-price-box {
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	.tui-goods-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;
	}

	.tui-scale {
		transform: scale(0.8);
		transform-origin: 100% 100%;
	}

	.tui-activity {
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx 20rpx 100rpx;
		box-sizing: border-box;
	}

	.tui-buy {
		display: flex;
		align-items: center
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-sub-info {
		max-width: 532rpx;
		font-size: 24rpx;
		line-height: 24rpx;
		padding: 20rpx 30rpx 10rpx 30rpx;
		box-sizing: border-box;
		color: #333;
		transform: scale(0.8);
		transform-origin: 100% center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-left: auto
	}

	.tui-invalid-text {
		width: 66rpx;
		margin-right: 4rpx;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: rgba(0, 0, 0, .3);
		transform: scale(0.8);
		transform-origin: center center;
		border-radius: 4rpx;
		flex-shrink: 0;
	}

	.tui-invalid-pr {
		padding-right: 0 !important;
	}

	.tui-gray {
		color: #B2B2B2 !important;
	}

	.tui-goods-invalid {
		color: #555;
		font-size: 24rpx;
	}

	.tui-flex-center {
		align-items: center !important;
	}

	.tui-invalid-ptop {
		padding-top: 40rpx;
	}

	.tui-tabbar {
		width: 100%;
		height: 100rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: var(--window-bottom);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		z-index: 900;
	}

	.tui-tabbar::before {
		content: '';
		width: 100%;
		border-top: 1rpx solid #d9d9d9;
		position: absolute;
		top: 0;
		left: 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-checkAll {
		display: flex;
		align-items: center;
	}

	.tui-checkbox-pl {
		padding-left: 12rpx;
	}

	.tui-total-price {
		font-size: 30rpx !important;
	}

	/*猜你喜欢*/
	.tui-youlike {
		padding-left: 12rpx
	}

	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
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

	.tui-goods-attr-tag {
		margin-right: 20rpx;
		font-size: 26rpx;
	}
</style>
