<template>
    <div class="upload-item">
        <div class="box" :class="{enter}" ref="box">拖拽文件上传</div>
        <div class="list">
            <div class="item" v-for="(item, index) in files" :key="index">
                <div class="img" :style="{'background-image': 'url(' + item.src + ')'}"></div>
                <div class="name">{{item.name}}</div>
                <progress-view :num="item.percentage" v-if="item.loading"></progress-view>
                <div class="btn" @click="preview" v-if="item.isModel">预览模型</div>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
import * as qiniu from 'qiniu-js';
import ProgressView from '@/client/components/ProgressView/index.vue'

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
        onDrop: async function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log("松手");
            this.enter = false;
            // var url = "/upload";
            // var dt = e.dataTransfer;
            // for (var i = 0; i < dt.files.length; i++) {
            //     this.uploadFile(dt.files[i], url);
            // }

            var res = await axios.get("/token");
            this.token = res.data;
            console.log(this.token);

            var config = {
                useCdnDomain: true,
                region: qiniu.region.z2
            };

            var dt = e.dataTransfer;
            for (var i = 0; i < dt.files.length; i++) {
                var file = dt.files[i];
                var key = file.name;
                
                var putExtra = {
                    fname: file.name,
                    params: {},
                    mimeType: null
                };

                var item = this.addFile(file);

                var observable = qiniu.upload(dt.files[i], key, this.token, putExtra, config);
                var observer = {
                    next(res){
                        var n = Math.floor(res.total.percent);
                        item.percentage = n;
                    },
                    error(err){
                        console.log(err);
                    },
                    complete(res){
                        item.loading = false;
                    }
                }
                var subscription = observable.subscribe(observer);
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
                var fr = new FileReader();
                fr.readAsDataURL(file);
                fr.onload = () => {
                    item.src = fr.result;
                    this.files.push(item);
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
                this.files.push(item);
            }
            return item;
        },
        uploadFile(file, url) {
            var item = this.addFile(file);

            var fd = new FormData();
            fd.append("file", file);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.upload.addEventListener("progress", (e) => {
                item.percentage = Math.round((e.loaded * 100) / e.total);
            }, false);
            xhr.onload = function() {
                item.loading = false;
            };
            xhr.send(fd);
        },
        preview(){

        }
    },

    mounted() {
        var box = this.$refs.box;
        box.addEventListener("dragenter", this.onDrag, false);
        box.addEventListener("dragover", this.onDrag, false);
        box.addEventListener("dragleave", this.onDragLeave, false);
        box.addEventListener("drop", this.onDrop, false);



        axios.get("/token").then(res=>{
            console.log(res);
            this.token = res;
        })
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
