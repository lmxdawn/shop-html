<template>
	<view class="tui-cmt-box">
		<view class="tui-cmt-list-box">
			<view class="tui-cmt-list-item">
				<view class="tui-cmt-list-item-content" style="margin-top: 0;">商品评价</view>
			</view>
			<view class="tui-cmt-list-item" v-for="item in list" :key="item.id">
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
		</view>
		<!--加载loadding-->
		<tui-loadmore :visible="loading" :index="3" type="red"></tui-loadmore>
		<tui-nomore :visible="!isLoadMore" bgcolor="#fafafa"></tui-nomore>
	</view>
</template>

<script>
	import tuiLoadmore from "../../components/loadmore/loadmore"
	import tuiNomore from "../../components/nomore/nomore"
	import tuiRate from "../../components/rate/rate"
	import { goodCommentList } from "../../api/goodComment";
	export default {
		components: {
			tuiLoadmore,
			tuiNomore,
			tuiRate,
		},
		data() {
			return {
				list: [],
				loading: false,
				isLoadMore: true,
				params: {
					page: 1,
					count: 20,
					good_id: "",
				}
			}
		},
		onLoad(options) {
			this.params.good_id = options.good_id;
			this.init();
		},
		onPullDownRefresh() {
			this.init();
		},
		onReachBottom() {
			this.loadMore();
		},
		methods: {
			init() {
				// 清空之前的
				this.params.page = 1;
				this.isLoadMore = true;
				this.loadMore();
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
				goodCommentList(this.params)
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
.tui-cmt-list-box {
	width: 100%;
	box-sizing: border-box;
	white-space: nowrap;
}

.tui-cmt-list-item {
	width: 100%;
	border-radius: 15rpx;
	background-color: #fff;
	box-sizing: border-box;
	padding: 40rpx;
	border-bottom: 1px solid #fbfbfb;
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
