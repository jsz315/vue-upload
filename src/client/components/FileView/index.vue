<template>
    <div class="file-view" :class="{enter}" ref="box" v-if="$store.state.isUpload">
        <i class="el-icon-sold-out tip-ico"></i> 拖拽文件上传
        <input @change="chooseFile" class="file" type="file" ref="file" multiple/>
    </div>
</template>

<script>

import axios from 'axios';
import * as qiniu from 'qiniu-js';
import ProgressView from '@/client/components/ProgressView/index.vue'
import fileTooler from '@/client/js/fileTooler'
import config from '@/client/js/config'
import typeTooler from '@/client/js/typeTooler'
import qiniuTooler from '@/client/js/qiniuTooler'
import yunTooler from '@/client/js/yunTooler'

let dropFiles = [];

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
            console.log(e);
            this.enter = false;
            dropFiles = [];
            // this.addFiles(e.dataTransfer.files);

            let items = e.dataTransfer.items;
            for(let i = 0; i < items.length; i++){
                let item = items[i].webkitGetAsEntry();
                if(item){
                    this.scanFiles(item);
                }
            }
            // this.addFiles(dropFiles);
        },
        async scanFiles(item){
            console.log("path: " + item.fullPath);
          
            if(item.isDirectory){
                let dirReader = item.createReader();
                dirReader.readEntries((entries)=>{
                    entries.forEach((entry)=>{
                        this.scanFiles(entry);
                    })
                })
            }
            else{
                item.file(file=>{
                    // dropFiles.push(file);
                    file.fullPath = item.fullPath;
                    this.addFiles([file]);
                })
            }
        },
        chooseFile(e){
            var files = e.target.files;
            this.addFiles(files);
        },
        addFiles(files){
            console.log(files);
            for (let i = 0; i < files.length; i++) {
                
                var file = files[i];
                var item = fileTooler.addItem(file);
                this.$store.commit('addFile', item);
                console.log("item");
                console.log(item);
                qiniuTooler.startUpload(item, this.$store.state.path, this.$store.state.token);
                
                // yunTooler.startUpload(files[i]);
            }
        }
    },

    async mounted() {
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
