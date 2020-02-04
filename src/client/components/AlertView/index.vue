<template>
    <div class="alert-view" v-show="visible">
      <div class="box">
        <div class="tip">{{tip}}</div>
        <div class="btns">
          <div class="btn" @click='hide(false)'>取消</div>
          <div class="btn" @click='hide(true)'>确定</div>
        </div>
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
    components: {
        
    },
    methods: {
      show(tip){
        this.tip = tip;
        this.visible = true;
      },
      hide(n){
        this.visible = false;
        if(n){
          this.$emit("sure");
        }
      }
    },

    async mounted() {
       
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
