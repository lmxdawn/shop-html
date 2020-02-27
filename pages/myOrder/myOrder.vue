<template>
	<view class="container">
		<tui-tabs :tabs="tabs" is-fixed :currentTab="currentTab" selectedColor="#E41F19" sliderBgColor="#E41F19" @change="change"></tui-tabs>

		<view class="tui-order-list">
			<tui-tips v-if="list.length === 0" style="margin-top: 30rpx;" :fixed="false" imgUrl="/static/images/toast/img_noorder_3x.png">暂无订单</tui-tips>
			<view v-else>
				<view class="tui-order-item" v-for="(item, index) in list" :key="item.id" @click="orderDetail(item)">
					<tui-list-cell :hover="false" :lineLeft="false">
						<view class="tui-goods-title">
							<view>订单号：{{item.order_num}}</view>
							<view class="tui-order-status">{{getStatusText(item.status)}}</view>
						</view>
					</tui-list-cell>
					<tui-list-cell padding="0" v-for="goodItem in item.good_list" :key="goodItem.id">
						<view class="tui-goods-item">
							<image :src="goodItem.original_img" class="tui-goods-img"></image>
							<view class="tui-goods-center">
								<view class="tui-goods-name">{{goodItem.good_name}}</view>
								<view class="tui-goods-attr">
									<text class="tui-goods-attr-tag">自营</text>
									<text class="tui-goods-attr-tag" v-if="goodItem.is_hot === 1">热卖</text>
									<text class="tui-goods-attr-tag" v-if="goodItem.is_new === 1">新品</text>
									<text class="tui-goods-attr-tag" v-if="goodItem.is_recommend === 1">推荐</text>
								</view>
							</view>
							<view class="tui-price-right">
								<view>￥{{goodItem.money}}</view>
								<view>x{{goodItem.count}}</view>
							</view>
						</view>
					</tui-list-cell>
					<tui-list-cell :hover="false" :last="true">
						<view class="tui-goods-price">
							<view>共{{item.count}}件商品 合计：</view>
							<view class="tui-size-24">￥</view>
							<view class="tui-price-large">{{item.pay_money}}</view>
						</view>
					</tui-list-cell>
					<view class="tui-order-btn">
						<view class="tui-btn-ml">
							<tui-button type="black" :plain="true" width="148rpx" height="56rpx" :size="26" shape="circle">查看详情</tui-button>
						</view>
						<view class="tui-btn-ml" v-if="item.status === 1 || item.status === 2" @tap.stop="orderOK(index, item)">
							<tui-button type="black" :plain="true" width="148rpx" height="56rpx" :size="26" shape="circle">确认收货</tui-button>
						</view>
						<view class="tui-btn-ml" v-if="item.status === 3" @tap.stop="commentClick(item)">
							<tui-button type="black" :plain="true" width="148rpx" height="56rpx" :size="26" shape="circle">评价晒单</tui-button>
						</view>
						<view class="tui-btn-ml" v-if="item.status !== 0">
							<tui-button type="danger" :plain="true" width="148rpx" height="56rpx" :size="26" shape="circle">再次购买</tui-button>
						</view>
						<view class="tui-btn-ml" v-if="item.status === 0" @tap.stop="orderDetail(item)">
							<tui-button type="danger" :plain="true" width="148rpx" height="56rpx" :size="26" shape="circle">确认支付</tui-button>
						</view>
					</view>
				</view>

				<!--加载loadding-->
				<tui-loadmore :visible="loading" :index="3" type="red"></tui-loadmore>
				<tui-nomore :visible="!isLoadMore" bgcolor="#fafafa"></tui-nomore>
				<!--加载loadding-->
			</view>
		</view>

	</view>
</template>

<script>
	import tuiTabs from "../../components/tui-tabs/tui-tabs"
	import tuiButton from "../../components/extend/button/button"
	import tuiLoadmore from "../../components/loadmore/loadmore"
	import tuiNomore from "../../components/nomore/nomore"
	import tuiListCell from "../../components/list-cell/list-cell"
	import tuiSticky from "../../components/sticky/sticky"
	import tuiTips from "../../components/extend/tips/tips"
	import {orderCancel, orderList, orderOk} from "../../api/order";
	export default {
		components: {
			tuiTabs,
			tuiButton,
			tuiLoadmore,
			tuiNomore,
			tuiListCell,
			tuiSticky,
			tuiTips,
		},
		data() {
			return {
				tabs: [
					{
						status: "",
						name: "全部"
					},
					{
						status: 0,
						name: "待付款"
					},
					{
						status: 1,
						name: "待发货"
					},
					{
						status: 2,
						name: "待收货"
					},
					{
						status: 3,
						name: "待评价"
					},
					{
						status: 4,
						name: "已取消"
					}
				],
				currentTab: 0,
				pageIndex: 1,
				submitLoading: false,
				list: [],
				loading: false,
				isLoadMore: true,
				params: {
					page: 1,
					count: 20,
					status: "",
				}
			}
		},
		onLoad(options) {
			this.params.status = options.status;
			let count = 0;
			for (let item of this.tabs) {
				if (options.status == item.status) {
					this.currentTab = count;
				}
				count++;
			}
			this.init();
		},
		onPullDownRefresh() {
			this.init();
		},
		onReachBottom() {
			this.loadMore();
		},
		methods: {
			getStatusText(status) {
				return ["等待您付款", "付款成功", "待收货", "订单已完成", "交易关闭"][status]
			},
			init() {
				// 清空之前的
				this.params.page = 1;
				this.isLoadMore = true;
				this.loadMore();
			},
			change(e) {
				this.currentTab = e.index;
				this.params.status = this.tabs[this.currentTab].status;
				this.init();
			},
			orderDetail(item) {
				this.$tui.navigateTo("orderDetail/orderDetail?order_num=" + item.order_num);
			},
			commentClick(item) {
				this.$tui.navigateTo("comment/add?order_num=" + item.order_num);
			},
			orderOK(index, item) {
				const data = {
					order_num: item.order_num
				};
				uni.showModal({
					title: '提示',
					content: '确认收货？',
					success: (res) => {
						if (res.confirm) {
							this.submitLoading = true;
							orderOk(data)
									.then(res => {
										this.submitLoading = false;
										if (res.code > 0) {
											this.$tui.toast(res.message);
											return false;
										}
										item.status = 4;
										this.list.splice(index, 1, item);
										this.$tui.toast("确认收货成功");
									})
									.catch(() => {
										this.submitLoading = false;
									})
						}
					}
				});
			},
			loadMore() {
				if (!this.isLoadMore) {
					uni.stopPullDownRefresh();
					return false;
				}
				this.getList();
			},
			getList() {
				if (this.loading) {
					uni.stopPullDownRefresh();
					return false;
				}
				this.loading = true;
				orderList(this.params)
						.then(res => {
							if (this.params.page === 1) {
								this.list = [];
							}
							this.loading = false;
							uni.stopPullDownRefresh();
							this.params.page++;
							const list = res.data || [];
							for (let item of list) {
								this.list.push(item);
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
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-order-list {
		/*#ifdef H5*/
		margin-top: 80rpx;
		/*#endif*/
	}

	.tui-order-item {
		margin-top: 20rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-goods-title {
		width: 100%;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-order-status {
		color: #888;
		font-size: 26rpx;
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
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
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
		font-weight: 500;
	}

	.tui-order-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		background: #fff;
		padding: 10rpx 30rpx 20rpx;
		box-sizing: border-box;
	}

	.tui-btn-ml {
		margin-left: 20rpx;
	}
</style>
