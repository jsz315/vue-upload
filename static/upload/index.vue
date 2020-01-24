<template>
    <div class="progress-view">
        <div class="num">{{num}}%</div>
        <div class="color" :style="{width: num + '%'}"></div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            
        };
    },
    props: ["num"],
    mounted() {
        
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
