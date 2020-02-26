<template>
	<view class="tui-login-box">
		<view class="tui-login-logo-box">
			<image class="tui-login-logo" src="/static/images/logo.png"></image>
		</view>
		<view class="tui-login-title">
			万千好物
		</view>
		<view class="tui-login-btn">
			<tui-button type="green" shape="circle">微信登录</tui-button>
		</view>
		<view class="tui-login-footer">
			<view class="tui-login-footer-title">
				若您的微信未注册，将为您直接注册，注册即视为同意 <text>《用户协议》</text>
			</view>
		</view>
	</view>
</template>

<script>
	import tuiListCell from "../../components/list-cell/list-cell"
	import tuiButton from "../../components/extend/button/button"
	import { mapGetters } from "vuex";
	export default {
		components: {
			tuiListCell,
			tuiButton
		},
		computed: {
			...mapGetters({
				memberInfo: "memberInfo",
			})
		},
		data() {
			return {

			}
		},
		methods: {
			avatarClick() {
				this.$tui.loginNavigateTo("userInfo/userInfo");
			},
			addressClick() {
				this.$tui.loginNavigateTo("address/address");
			},
		}
	}
</script>

<style scoped>
.tui-login-box {
	padding: 0 30rpx;
	box-sizing: border-box;
	overflow: hidden;
}
.tui-login-logo-box {
	margin-top: 340rpx;
	width: 100%;
	text-align: center;
}
.tui-login-logo {
	width: 200rpx;
	height: 200rpx;
}
.tui-login-title {
	margin-top: 10rpx;
	font-size: 26px;
	width: 100%;
	text-align: center;
}
.tui-login-btn {
	margin-top: 200rpx;
}
.tui-login-footer {
	width: 100%;
	position: fixed;
	left: 0;
	bottom: 12rpx;
	padding-left: 30rpx;
	padding-right: 30rpx;
	box-sizing: border-box;
	padding-bottom: env(safe-area-inset-bottom);
	text-align: center;
	color: #999999;
	font-size: 28rpx;
}
.tui-login-footer text {
	margin-left: 5rpx;
	color: #1890ff;
}
</style>
