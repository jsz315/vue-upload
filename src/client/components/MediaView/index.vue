<template>
  <div class="media-view">
    <div class="file-view" :class="{enter}" ref="box">
        <div class="tip">
          <i class="el-icon-sold-out tip-ico"></i> 拖拽文件上传
        </div>
        <div class="btn" @click="openChoose">选择文件</div>
        <div v-show="false">
          <input @change="chooseFile" class="file" type="file" ref="file" multiple/>
        </div>
        
    </div>
    <img v-if="type==1" class="media" :src="media"/>
    <audio v-if="type==2" class="media" controls :src="media"></audio>
    <video v-if="type==3" class="media" controls :src="media"></video>
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
            enter: false,
            type: 0,
            media: "",
            file: null
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
        openChoose(){
          this.$refs.file.click();
        },
        addFiles(files){
            console.log(files);
            for (let i = 0; i < files.length; i++) {
                
                var file = files[i];
                this.file = file;
                console.log(file);
                if(/(jpg|jpeg|gif|png)$/i.test(file.name)){
                  this.type = 1;
                }
                else if(/(mp3|wma)$/i.test(file.name)){
                  this.type = 2;
                }
                else if(/(mp4)$/i.test(file.name)){
                  this.type = 3;
                }
                this.media = this.getObjectURL(file);
                // var item = fileTooler.addItem(file);
                // this.$store.commit('addFile', item);
                // yunTooler.startUpload(files[i], item, this.$store.state.path);
            }
        },
        getObjectURL(file) {
            var url = null ;
            if (window.createObjectURL!=undefined) { // basic
                url = window.createObjectURL(file) ;
            } else if (window.URL!=undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file) ;
            } else if (window.webkitURL!=undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file) ;
            }
            console.log(url);
            return url ;
        },
        setMedia(type, media){
          this.type = type;
          if(type == 1){
            this.media = "/media/image/" + media;
          }
          else if(type == 2){
            this.media = "/media/audio/" + media;
          }
          else if(type == 3){
            this.media = "/media/video/" + media;
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
