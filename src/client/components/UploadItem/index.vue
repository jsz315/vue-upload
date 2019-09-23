<template>
    <div class="upload-item">
        <div class="path">
            <div class="label">上传目录：</div>
            <input class="txt" v-model="path" />
        </div>
        <div class="box" :class="{enter}" ref="box">拖拽文件上传</div>
        <div class="list">
            <div class="item" v-for="(item, index) in files" :key="index">
                <div class="img" :style="{'background-image': 'url(' + item.src + ')'}" @click="preview(item.name)"></div>
                <div class="name">{{item.name}}</div>
                <div class="fresh" :style="{'background-image': 'url(' + freshImg + ')'}" v-if="item.exist" @click="rewrite(item)"></div>
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
import config from '@/client/js/config'
import typeTooler from '@/client/js/typeTooler'

export default {
    data() {
        return {
            enter: false,
            files: [],
            token: null,
            path: "model/",
            freshImg: config.LINK.FRESH
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
                // var item = this.addFile(file);
                var item = this.addItem(file);
                this.startUpload(item);
                
            }
        },
        addFile(file){
            var item = {
                            name: file.name,
                            percentage: 0,
                            loading: true,
                            exist: false,
                            file: file
                        };
            console.log(file);
            var fileType = typeTooler.checkType(file.name);
            if(fileType == config.FILE_TYPE.IMAGE){
                item.src = config.LINK.IMAGE;
                var fr = new FileReader();
                fr.readAsDataURL(file);
                fr.onload = () => {
                    item.src = fr.result;
                };
            }
            else if(fileType == config.FILE_TYPE.MODEL){
                item.src = config.LINK.MODEL;
                item.isModel = true;
            }
            else{
                item.src = config.LINK.UNKNOW;
            }
            this.files.push(item);
            return item;
        },

        startUpload(item){
            qiniuTooler.start(item.file, item, this.path, this.token);
        },

        async rewrite(item){
            var res = await axios.get("/token", {
                params: {key: this.path + item.name}
            });
            this.token = res.data;

            item.loading = true;
            var suc = await qiniuTooler.start(item.file, item, this.path, this.token);
            if(suc){
                item.exist = false;
            }
        },
        preview(name){
            var fileType = typeTooler.checkType(name);
            var url;
            if(fileType == config.FILE_TYPE.IMAGE){
                url = `${config.HOST}${this.path}${name}`;
                window.open(url);
            }
            else if(fileType == config.FILE_TYPE.MODEL){
                var host = window.CFG.host;
                url = `${host}?url=${config.HOST}${this.path}${name}`;
                window.open(url);
            }
            else if(fileType == config.FILE_TYPE.FOLDER){
                
            }
        },
        showDir(){
            axios.get("/dir", {
                params: {path: `${config.HOST}${this.path}${name}/`}
            }).then(res => {
                console.log(res.data);
                var list = res.data;
                list.forEach(item => {
                    addItem(item);
                })
            });
        },
        addItem(obj){
            var fname;
            var isFile;
            if(typeof(obj) == "string"){
                fname = obj;
                isFile = false;
            }
            else{
                fname = obj.name;
                isFile = true;
            }
            var item = {
                            name: fname,
                            percentage: 0,
                            loading: true,
                            exist: false,
                            file: isFile ? obj : null
                        };
            var fileType = typeTooler.checkType(fname);
            if(fileType == config.FILE_TYPE.IMAGE){
                if(isFile){
                    item.src = config.LINK.IMAGE;
                    var fr = new FileReader();
                    fr.readAsDataURL(obj);
                    fr.onload = () => {
                        item.src = fr.result;
                    };
                }
                else{
                    item.src = `${config.HOST}${this.path}${name}`;
                }
            }
            else if(fileType == config.FILE_TYPE.MODEL){
                item.src = config.LINK.MODEL;
                item.isModel = true;
            }
            else if(fileType == config.FILE_TYPE.FOLDER){
                item.src = config.LINK.FOLDER;
            }
            else{
                item.src = config.LINK.UNKNOW;
            }
            this.files.push(item);
            return item;
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
