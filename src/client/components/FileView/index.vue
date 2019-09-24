<template>
    <div class="box" :class="{enter}" ref="box" v-if="$store.state.isUpload">拖拽文件上传</div>
</template>

<script>

import axios from 'axios';
import * as qiniu from 'qiniu-js';
import ProgressView from '@/client/components/ProgressView/index.vue'
import fileTooler from '@/client/js/fileTooler'
import config from '@/client/js/config'
import typeTooler from '@/client/js/typeTooler'
import qiniuTooler from '@/client/js/qiniuTooler'

export default {
    data() {
        return {
            enter: false
        };
    },
    components: {
        ProgressView
    },
    methods: {
        onDrag: function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log("进入");
            this.enter = true;
        },
        onDragLeave: function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log("离开");
            this.enter = false;
        },
        onDrop: function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log("松手");
            this.enter = false;
        
            var dt = e.dataTransfer;
            for (let i = 0; i < dt.files.length; i++) {
                var file = dt.files[i];
                var item = fileTooler.addItem(file);
                this.$store.commit('addFile', item);
                qiniuTooler.startUpload(item, this.$store.state.path, this.$store.state.token);
            }
        },
    },

    mounted() {
        var box = this.$refs.box;
        box.addEventListener("dragenter", this.onDrag, false);
        box.addEventListener("dragover", this.onDrag, false);
        box.addEventListener("dragleave", this.onDragLeave, false);
        box.addEventListener("drop", this.onDrop, false);
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
