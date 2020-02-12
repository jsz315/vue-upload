<template>
  <div class="container">
    rank
  </div>
</template>

<script>
import axios from 'axios';
import yunTooler from '@/client/js/yunTooler'
import StarView from '@/client/components/StarView/index.vue';


export default {
  data() {
        return {
           
        };
  },
  components: {
    
  },
  computed:{
    
  },
  mounted() {
    this.init();
  },
  methods: {
    init(){
      axios.post('/yun/user/ranks', {
          v: Math.random()
      }).then(res => {
          console.log(res.data);
      });
    
      axios.post('/yun/user/myRank', {
          openid: "jgjhkjjlkl"
      }).then(res => {
          console.log(res.data);
          if(res.data[0]){
            console.log('rank = ' + res.data[0].rownumber);
          }
          else{
            console.log('no your rank');
          }
      });
      axios.post('/yun/user/myRank', {
          openid: "jgjhkjjkl"
      }).then(res => {
          console.log(res.data);
          if(res.data[0]){
            console.log('rank = ' + res.data[0].rownumber);
          }
          else{
            console.log('no your rank');
          }
          
      });
    
    },

  },

}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
