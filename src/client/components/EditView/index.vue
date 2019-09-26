<template>
    <div class="edit-view">
        <div class="all" @click="toggleSelect"><div class="choose" :class="{selected}"></div>全选(ctrl+a)</div>
        <div class="btn" @click="copyItem(false)">复制(ctrl+c)</div>
        <div class="btn" @click="copyItem(true)">剪切(ctrl+x)</div>
        <div class="btn" @click="pasteItem">粘贴(ctrl+v)</div>
        <div class="btn" @click="deleteItem">删除(del)</div>
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
            list.length && this.$store.commit('changeFiles', list);
        },
        copyItem(isCut){
            var list = this.$store.state.files.filter(item => {
                return item.selected;
            })
            this.$store.commit('changeCopyFiles', list);
            this.$store.commit('changeIsCut', isCut);
            this.$message({
                message: isCut ? '已剪切' : '已复制',
                type: 'success'
            });
        },
        pasteItem(){
            var isCut = this.$store.state.isCut;
            var toDir = this.$store.state.path;
            var copyDir = this.$store.state.copyDir;
            var copyFiles = this.$store.state.copyFiles;
            console.log(copyDir + "==>" + toDir);
            if(copyDir == toDir){
                console.log("相同目录");
                this.$message({
                    message: '与源目录相同',
                    type: 'warning'
                });
                return;
            }
            if(toDir.indexOf(copyDir) == 0){
                console.log("复制到子目录");
                this.$message({
                    message: '不能把文字复制到其子目录',
                    type: 'warning'
                });
                return;
            }
            var files = [];
            var folders = [];
            copyFiles.forEach(item => {
                var obj;
                if(item.isFolder){
                    folders.push(item.name);
                    obj = fileTooler.addItem(item.name, this.path);
                }
                else{
                    files.push(item.name);
                    obj = fileTooler.addItem(item.src, this.path);
                }
                this.$store.commit('addFile', obj);
            })
            files.length && qiniuTooler.copyFile(files, copyDir, toDir, isCut);
            folders.length && qiniuTooler.copyFolder(folders, copyDir, toDir, isCut);
            this.$store.commit('changeCopyFiles', [], toDir);
        }
    },

    mounted() {
        
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
