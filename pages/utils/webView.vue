<template>
    <view>
        <web-view :webview-styles="webviewStyles" :src="url"></web-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                },
                url: null
            }
        },
        onPullDownRefresh() {

        },
        onLoad(options) {
            if (options.url) {
                this.url = decodeURIComponent(options.url);
            }
        },
    }
</script>

<style>
</style>
