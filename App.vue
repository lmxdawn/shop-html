<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show');
            this.userInfo();
        },
		onHide: function() {
			console.log('App Hide')
		},
        methods: {
            userInfo() {
                this.$store.dispatch("getUserInfo")
                    .then(res => {})
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
	}
</script>

<style>
    @import url("style/base.scss");
</style>
