<template>
	<view class="tui-addr-box">
		<form :report-submit="true">
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">收货人</view>
					<input placeholder-class="tui-phcolor" class="tui-input" v-model="item.name" placeholder="请输入收货人姓名" maxlength="15" type="text" />
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">手机号码</view>
					<input placeholder-class="tui-phcolor" class="tui-input" v-model="item.tel" placeholder="请输入收货人手机号码" maxlength="11"
					 type="text" />
				</view>
			</tui-list-cell>
			<tui-list-cell :arrow="true" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title"><text class="tui-title-city-text">所在城市</text></view>
					<input placeholder-class="tui-phcolor" class="tui-input" disabled name="city" placeholder="请选择城市" maxlength="50" type="text" />
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">收货地址</view>
					<input placeholder-class="tui-phcolor" class="tui-input" v-model="item.address" placeholder="请输入详细的收货地址" maxlength="50" type="text" />
				</view>
			</tui-list-cell>

			<!-- 默认地址 -->
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-swipe-cell">
					<view>设为默认地址</view>
					<switch :checked="item.is_default === 1" @change="defaultChange" color="#30CC67" class="tui-switch-small" />
				</view>
			</tui-list-cell>
			<!-- 保存地址 -->
			<view class="tui-addr-save">
				<tui-button type="danger" height="88rpx" @tap="ok">保存收货地址</tui-button>
			</view>
			<view class="tui-del" v-if="item.id">
				<tui-button type="gray" height="88rpx" @tap="del">删除收货地址</tui-button>
			</view>
		</form>
	</view>
</template>

<script>
	import tuiButton from "../../components/extend/button/button"
	import tuiListView from "../../components/list-view/list-view"
	import tuiListCell from "../../components/list-cell/list-cell"
	import { orderAddressRead, orderAddressSave, orderAddressDel } from "../../api/orderAddress"
	export default {
		components: {
			tuiButton,
			tuiListView,
			tuiListCell
		},
		data() {
			return {
				item: {
					id: "",
					name: "",
					tel: "",
					province: "22",
					city: "33",
					area: "44",
					is_default: 0,
					address: "",
				},
				readLoading: false,
				loading: false
			}
		},
		onLoad(options) {
			this.item.id = options.id;
			this.read();
		},
		methods: {
			defaultChange(e) {
				this.item.is_default = e.target.value ? 1 : 0;
			},
			ok() {
				if (this.loading) {
					return false;
				}
				if (!this.item.name) {
					this.$tui.toast("请输入收货人姓名");
					return false;
				}
				if (!this.item.tel) {
					this.$tui.toast("请输入收货人电话");
					return false;
				}
				if (!this.item.province || !this.item.city || !this.item.area) {
					this.$tui.toast("请选择所在城市");
					return false;
				}
				if (!this.item.address) {
					this.$tui.toast("请输入详细地址");
					return false;
				}
				this.loading = true;
				orderAddressSave(this.item)
					.then(res => {
						this.loading = false;
						if (res.code > 0) {
							this.$tui.toast(res.message);
							return false;
						}
						this.$tui.toast("添加成功");
						setTimeout(() => {
							this.$tui.navigateBack(1);
						}, 300)
					})
					.catch(() => {
						this.loading = false;
					})
			},
			del() {
				uni.showModal({
					title: '提示',
					content: '确认删除？',
					success: (res) => {
						if (res.confirm) {
							orderAddressDel(this.item)
								.then(res => {
									if (res.code > 0) {
										this.$tui.toast(res.message);
										return false;
									}
									this.$tui.toast("删除成功");
									setTimeout(() => {
										this.$tui.navigateBack(1);
									}, 300)
								})
						}
					}
				});
			},
			read() {
				if (!this.item.id) {
					return false;
				}
				orderAddressRead({id: this.item.id})
					.then(res => {
						if (res.code > 0) {
							this.$tui.toast(res.message);
							return false;
						}
						this.item = res.data || {};
					})
			}
		}
	}
</script>

<style>
	.tui-addr-box {
		padding: 20rpx 0;
	}

	.tui-line-cell {
		width: 100%;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-title {
		width: 180rpx;
		font-size: 28rpx;
	}

	.tui-title-city-text {
		width: 180rpx;
		height: 40rpx;
		display: block;
		line-height: 46rpx;
	}

	.tui-input {
		width: 500rpx;
	}

	.tui-input-city {
		flex: 1;
		height: 40rpx;
		font-size: 28rpx;
		padding-right: 30rpx;
	}

	.tui-phcolor {
		color: #ccc;
		font-size: 28rpx;
	}
	.tui-cell-title{
		font-size: 28rpx;
	}
	.tui-addr-label {
		margin-left: 70rpx;
	}

	.tui-label-item {
		width: 76rpx;
		height: 40rpx;
		border: 1rpx solid rgb(136, 136, 136);
		border-radius: 6rpx;
		font-size: 26rpx;
		text-align: center;
		line-height: 40rpx;
		margin-right: 20rpx;
		display: inline-block;
		transform: scale(0.9);
	}
	.tui-label-active{
		background: #E41F19;
		border-color:#E41F19;
		color: #fff;
	}
	.tui-swipe-cell {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		padding: 10rpx 24rpx;
		border-radius: 6rpx;
		overflow: hidden;
		font-size: 28rpx;
	}

	.tui-switch-small {
		transform: scale(0.8);
		transform-origin: 100% center;
	}

	/* #ifndef H5 */
	.tui-switch-small .wx-switch-input {
		margin: 0 !important;
	}

	/* #endif */

	/* #ifdef H5 */
	>>>uni-switch .uni-switch-input {
		margin-right: 0 !important;
	}

	/* #endif */

	.tui-addr-save {
		padding: 24rpx;
		margin-top: 100rpx;
	}

	.tui-del {
		padding: 24rpx;
	}
</style>
