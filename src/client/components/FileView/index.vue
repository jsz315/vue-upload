<template>
    <div class="upload-item">
        <div class="list">
            <div class="item" v-for="(item, index) in files" :key="index">
                <div class="img" :style="{'background-image': 'url(' + item.src + ')'}"></div>
                <div class="name">{{item.name}}</div>
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
            enter: false,
            files: [],
            token: null
        };
    },
    components: {
        ProgressView
    },
    methods: {
        
    },

    mounted() {
        
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
