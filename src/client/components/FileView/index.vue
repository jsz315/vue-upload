<template>
    <div class="upload-item">
        <div class="list">
            <div class="item" v-for="(item, index) in files" :key="index">
                <div class="img" :style="{'background-image': 'url(' + getImg(item) + ')'}"></div>
                <div class="name">{{item}}</div>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
import * as qiniu from 'qiniu-js';
import ProgressView from '@/client/components/ProgressView/index.vue'
import qiniuTooler from '@/client/js/qiniuTooler'

export default {
    data() {
        return {
            files: []
        };
    },
    components: {
        ProgressView
    },
    methods: {
        getImg(url){
            if(url.match(/\.(jpe?g|png|gif)$/i)){
                return 'http://py325bkfy.bkt.clouddn.com/' + url;
            }
            else if(url.match(/\.(gltf|glb|fbx)$/i)){
                return '/asset/img/3d.png'
            }
            else{
                return '/asset/img/folder.png'
            }
        }
    },

    mounted() {
        axios.get("/dir", {
            params: {path: 'http://py325bkfy.bkt.clouddn.com/'}
        }).then(res => {
            console.log(res.data);
            this.files = res.data;
        });
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
