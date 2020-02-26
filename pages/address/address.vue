<template>
	<view class="tui-safe-area">
		<view class="tui-address">
			<tui-list-cell padding="0" v-for="(item,index) in addressList" :key="index"  @tap="selectAddr(item)">
				<view class="tui-address-flex">
					<view class="tui-address-left">
						<view class="tui-address-main">
							<view class="tui-address-name tui-ellipsis">{{item.name}}</view>
							<view class="tui-address-tel">{{item.tel | formatTel}}</view>
						</view>
						<view class="tui-address-detail">
							<view class="tui-address-label" v-if="item.is_default===1">默认</view>
							<text>{{item.address}}</text>
						</view>
					</view>
					<view class="tui-address-imgbox" @tap="editAddr(item)">
						<image class="tui-address-img" src="/static/images/icon_addr_edit.png" />
					</view>
				</view>
			</tui-list-cell>
		</view>
		<!-- 新增地址 -->
		<view class="tui-address-new">
			<tui-button type="danger" height="88rpx" @click="editAddr">+ 新增收货地址</tui-button>
		</view>
	</view>
</template>

<script>
	import tuiButton from "../../components/extend/button/button"
	import tuiListCell from "../../components/list-cell/list-cell"
	import { orderAddressList } from "../../api/orderAddress"
	export default {
		components: {
			tuiButton,
			tuiListCell
		},
		data() {
			return {
				addressList: [],
				loading: false,
				isLoadMore: true,
				params: {
					page: 1,
					count: 20
				},
				isBlock: false
			}
		},
		onLoad(options) {
			this.getOrderAddressList();
			this.isBlock = options.isBlock || false;
		},
		onPullDownRefresh() {
			// 清空之前的
			this.init();
		},
		onReachBottom() {
			this.loadMore();
		},
		onShow() {
			this.init();
		},
		methods: {
			selectAddr(item) {
				if (!this.isBlock) {
					return false;
				}
				this.$store.dispatch("setSubmitOrderAddress", item);
				this.$tui.navigateBack(1);
			},
			editAddr(item) {
				let url = "addressEdit/addressEdit";
				if (item && item.id) {
					url += "?id=" + item.id;
				}
				this.$tui.navigateTo(url);
			},
			init() {
				this.params.page = 1;
				this.isLoadMore = true;
				console.log(11);
				this.loadMore();
			},
			loadMore() {
				if (!this.isLoadMore) {
					uni.stopPullDownRefresh();
					return false;
				}
				this.getOrderAddressList();
			},
			getOrderAddressList() {
				if (this.loading) {
					uni.stopPullDownRefresh();
					return false;
				}
				this.loading = true;
				orderAddressList(this.params)
					.then(res => {
						this.loading = false;
						uni.stopPullDownRefresh();
						if (this.params.page === 1) {
							this.addressList = [];
						}
						this.params.page++;
						const list = res.data || [];
						for (let item of list) {
							this.addressList.push(item);
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
	.tui-address {
		width: 100%;
		padding-top: 20rpx;
		padding-bottom: 160rpx;
	}
	.tui-address-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tui-address-main {
		width: 600rpx;
		height: 70rpx;
		display: flex;
		font-size: 30rpx;
		line-height: 86rpx;
		padding-left: 30rpx;
	}

	.tui-address-name {
		width: 120rpx;
		height: 60rpx;
	}

	.tui-address-tel {
		margin-left: 10rpx;
	}

	.tui-address-detail {
		font-size: 24rpx;
		word-break: break-all;
		padding-bottom: 25rpx;
		padding-left: 25rpx;
		padding-right: 120rpx;
	}

	.tui-address-label {
		padding: 5rpx 8rpx;
		flex-shrink: 0;
		background: #e41f19;
		border-radius: 6rpx;
		color: #fff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 25rpx;
		line-height: 25rpx;
		transform: scale(0.8);
		transform-origin: center center;
		margin-right: 6rpx;
	}

	.tui-address-imgbox {
		width: 80rpx;
		height: 100rpx;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		right: 10rpx;
	}

	.tui-address-img {
		width: 36rpx;
		height: 36rpx;
	}

	.tui-address-new {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 999;
		padding: 20rpx 25rpx 30rpx;
		box-sizing: border-box;
		background: #fafafa;
	}

	.tui-safe-area {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
