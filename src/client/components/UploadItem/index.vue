<template>
    <div class="upload-item">
        <div class="path">
            <div class="label">上传目录：</div>
            <input class="txt" />
        </div>
        <div class="box" :class="{enter}" ref="box">拖拽文件上传</div>
        <div class="list">
            <div class="item" v-for="(item, index) in files" :key="index">
                <div class="img" :style="{'background-image': 'url(' + item.src + ')'}"></div>
                <div class="name">{{item.name}}</div>
                <progress-view class="loading" :num="item.percentage" v-if="item.loading"></progress-view>
                <div class="btn" @click="preview(item.name)" v-if="item.isModel">预览模型</div>
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
                var item = this.addFile(file);
                this.startUpload(file, item);
                
            }
        },
        addFile(file){
            var item = {
                            name: file.name,
                            percentage: 0,
                            loading: true
                        };
            console.log(file);
            if(file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif"){
                item.src = '/asset/img/pic.png';
                var fr = new FileReader();
                fr.readAsDataURL(file);
                fr.onload = () => {
                    item.src = fr.result;
                };
            }
            else{
                if(file.name.match(/\.fbx$/i)){
                    item.src = '/asset/img/3d.png';
                    item.isModel = true;
                }
                else{
                    item.src = '/asset/img/file.png';
                }
            }
            this.files.push(item);
            return item;
        },
        startUpload(file, item){
            var key = "model/" + file.name;
            qiniuTooler.start(file, item, "model/", this.token);
        },
        preview(name){
            var host = window.CFG.host;
            var url = `${host}?url=http://py325bkfy.bkt.clouddn.com/model/${name}`
            window.open(url);
        }
    },

    mounted() {
        var box = this.$refs.box;
        box.addEventListener("dragenter", this.onDrag, false);
        box.addEventListener("dragover", this.onDrag, false);
        box.addEventListener("dragleave", this.onDragLeave, false);
        box.addEventListener("drop", this.onDrop, false);

        axios.get("/token").then(res => {
            // console.log(res);
            this.token = res.data;

            // var file = new Blob( [ 'jjj' ], { type: 'text/plain' } );
            // file.name = "test.txt";
            // var item = this.addFile(file);
            // this.startUpload(file, item);
        })
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
