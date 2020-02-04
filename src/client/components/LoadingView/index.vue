<template>
    <div class="loading-view" v-show="visible">
      <div class="box">
        <div class="progress">{{progress}}%</div>
        <div class="tip">{{tip}}</div>
      </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
          tip: "",
          visible: false
        };
    },
    props: ["progress"],
    components: {
        
    },
    methods: {
      show(tip){
        this.tip = tip;
        this.visible = true;
      },
      hide(){
        this.visible = false;
      }
    },

    async mounted() {
       
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
