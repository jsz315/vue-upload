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
import config from '@/client/js/config'
import typeTooler from '@/client/js/typeTooler'

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
            var fileType = typeTooler.checkType(url);
            if(fileType == config.FILE_TYPE.IMAGE){
                return config.HOST + url;
            }
            else if(fileType == config.FILE_TYPE.MODEL){
                return config.LINK.MODEL;
            }
            else if(fileType == config.FILE_TYPE.FOLDER){
                return config.LINK.FOLDER;
            }
            else{
                return config.LINK.UNKNOW;
            }
        }
    },

    mounted() {
        
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
