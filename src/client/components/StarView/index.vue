<template>
  <div class="star-view">
    <div class="star" :class="{'level':(i<=level)}" v-for="i in 5" @click="chooseLevel(i)"></div>
  </div>
</template>

<script>

export default {
    data() {
        return {
            type: 0
        };
    },
    props: ["level"],
    components: {
        
    },
    methods: {
      chooseLevel(n){
        this.$emit("change", n);
      }
    },

    async mounted() {
        
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
