<template>
	<view class="tui-cmt-add-box" v-if="isInit">
		<view class="tui-cmt-add-list-box">
			<view class="tui-cmt-add-list-item" v-for="(item, index) in goodList">
				<view class="tui-cmt-add-list-item-rate-box">
					<image class="tui-cmt-add-list-item-pic" :src="item.original_img"></image>
					<view class="tui-cmt-add-list-item-content">
						<view class="tui-cmt-add-list-item-title">商品评价</view>
						<view class="tui-cmt-add-list-item-rate">
							<tui-rate @change="change" :index="index" :hollow="true" :size="25" :current="item.rate" :quantity="maxRate" normal="#ccc" active="#ff7900"></tui-rate>
							<view class="tui-cmt-add-list-item-rate-text">{{getRateText(item.rate)}}</view>
						</view>
					</view>
				</view>
				<view class="tui-cmt-add-list-item-textare-box">
					<textarea class="tui-cmt-add-list-item-textare" v-model="item.content" auto-height placeholder="宝贝满足你的期待吗？说说它的优点和美中不足的地方吧" maxlength="255" placeholder-style="color: #999;" />
				</view>
			</view>
		</view>
		<!-- #ifdef MP || H5-->
		<view class="tui-cmt-add">
			<tui-button type="danger" shape="circle" height="88rpx" @tap="add">发布</tui-button>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import tuiRate from "../../components/rate/rate"
	import tuiButton from "../../components/extend/button/button"
	import { orderRead, orderComment } from "../../api/order";
	export default {
		components: {
			tuiRate,
			tuiButton,
		},
		data() {
			return {
				maxRate: 5,
				isInit: false,
				order: {},
				goodList: [],
				loading: false,
				params: {
					order_num: "",
				}
			}
		},
		onLoad(options) {
			this.params.order_num = options.order_num;
			this.init();
		},
		onNavigationBarButtonTap(e) {
			this.add();
		},
		methods: {
			getRateText(rate) {
				return ["非常差", "差", "一般", "好", "非常好"][rate - 1]
			},
			init() {
				this.getOrderRead();
			},
			change(e) {
				console.log(e);
				let value = e.value;
				let index = e.index;
				let item = this.goodList[index];
				item.rate = value;
				this.goodList.splice(index, 1, item);
			},
			add() {
				uni.showModal({
					title: '提示',
					content: '评价后不能修改，确认评价？',
					success: (res) => {
						if (res.confirm) {
							const date = {
								order_num: this.params.order_num,
								good_list: this.goodList
							};
							orderComment(date)
								.then(res => {
									if (res.code > 0) {
										this.$tui.toast(res.message);
										return false;
									}
									this.$tui.toast("评价成功");
									setTimeout(() => {
										this.$tui.switchTab("my/my");
									}, 300)
								})
						}
					}
				});
			},
			getOrderRead() {
				if (this.loading) {
					return false;
				}
				this.loading = true;
				orderRead(this.params)
					.then(res => {
						this.loading = false;
						this.order = res.data .order|| {};
						let goodList = res.data.good_list || [];
						for (let index in goodList) {
							goodList[index].rate = this.maxRate;
							goodList[index].content = "";
						}
						this.goodList = goodList;
						this.isInit = true;
					})
			}
		}
	}
</script>

<style>
page {
	background-color: #f8f8f8;
}

.tui-cmt-add {
	padding: 20rpx 20rpx;
	box-sizing: border-box;
}
.tui-cmt-add-box {
}
.tui-cmt-add-list-box {
	box-sizing: border-box;
}

.tui-cmt-add-list-item {
	box-sizing: border-box;
	margin-bottom: 20rpx;
}
.tui-cmt-add-list-item-rate-box {
	display: flex;
	background-color: #ffffff;
	padding: 20rpx 20rpx;
	box-sizing: border-box;
}
.tui-cmt-add-list-item-pic {
	width: 120rpx;
	height: 120rpx;
	flex-shrink: 0;
}
.tui-cmt-add-list-item-content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	font-size: 26rpx;
	margin-left: 20rpx;
}
.tui-cmt-add-list-item-title {
	color: #5d5d5d;
	font-size: 28rpx;
}
.tui-cmt-add-list-item-rate {
	display: flex;
	align-items: center;
}
.tui-cmt-add-list-item-rate-text {
	margin-left: 10rpx;
	font-size: 24rpx;
	color: #999999;
}
.tui-cmt-add-list-item-textare-box {
	background-color: #ffffff;
	padding: 20rpx 20rpx;
	min-height: 50px;
}
.tui-cmt-add-list-item-textare {
	width: 100%;
	color: #666;
	font-size: 14px;
}

</style>
