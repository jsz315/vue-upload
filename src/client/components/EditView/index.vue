<template>
    <div class="edit-view">
        <div class="all" @click="toggleSelect"><div class="choose" :class="{selected}"></div>全选</div>
        <div class="btn" @click="copyItem">复制</div>
        <div class="btn">剪切</div>
        <div class="btn" @click="pasteItem">粘贴</div>
        <div class="btn" @click="deleteItem">删除</div>
    </div>
</template>

<script>

import axios from 'axios';
import * as qiniu from 'qiniu-js';
import fileTooler from '@/client/js/fileTooler'
import config from '@/client/js/config'
import typeTooler from '@/client/js/typeTooler'
import qiniuTooler from '@/client/js/qiniuTooler'

export default {
    data() {
        return {
            selected: false
        };
    },
    components: {
        
    },
    methods: {
        toggleSelect(){
            this.selected = !this.selected;
            this.$store.commit('changeFileSelect', this.selected);
        },
        deleteItem(){
            var path = this.$store.state.path
            var list = this.$store.state.files.filter(item => {
                if(item.selected){
                    if(item.isFolder){
                        qiniuTooler.deleteFolder(item, path);
                    }
                    else{
                        qiniuTooler.deleteFile(item, path);
                    }
                }
                return !item.selected;
            })
            this.$store.commit('changeFiles', list);
        },
        copyItem(){
            var list = this.$store.state.files.filter(item => {
                return item.selected;
            })
            this.$store.commit('changeCopyFiles', list, this.$store.state.path);
        },
        pasteItem(){
            var copyDir = this.$store.state.copyDir;
            var copyFiles = this.$store.state.copyFiles;
            var keys = copyFiles.map(item => {
                var key = item.name;
                return key;
            })
            qiniuTooler.copyFile(keys, copyDir, this.$store.state.path);
        }
    },

    mounted() {
        
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
