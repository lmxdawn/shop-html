<template>
	<view>
		<cart ref="cart"></cart>
	</view>
</template>

<script>
	import cart from "./cart"
	export default {
		components: {
			cart
		},
		data() {
			return {
			}
		},
		methods: {
		},
		onShow() {
			this.$nextTick(() => {
				this.$refs.cart.init()
			})
		},
		onPullDownRefresh() {
			this.$refs.cart.pullDownRefresh()
		},
		onReachBottom() {
			this.$refs.cart.reachBottom()
		},
		onNavigationBarButtonTap(e) {
			this.$refs.cart.navigationBarButtonTap()
		}
	}
</script>

<style>

</style>
