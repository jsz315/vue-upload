<template>
    <div class="message-view" ref="box" v-show="visible">
        <div class="word">{{word}}</div>
    </div>
</template>

<script>



export default {
    data() {
        return {
            word: "",
            visible: false
        };
    },
    components: {
        
    },
    methods: {
        
    },

    mounted() {
        this.visible = true;
        setTimeout(()=>{
            this.visible = false;
        }, 2000)
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
