<template>
    <div class="upload-item">
        <div class="path">
            <div class="label">上传目录：</div>
            <input class="txt" v-model="path" />
            <div class="jump" @click="showDir">进入</div>
        </div>
        <div class="path">
            <div class="label">路径：</div>
            <div class="links">
                <div class="link" @click="changePath(item.link)" v-for="item in links" :data-link="item.link">{{item.label}}</div>
            </div>
        </div>
        <div class="box" :class="{enter}" ref="box" v-if="canUpload">拖拽文件上传</div>
        <div class="list">
            <div class="item" v-for="(item, index) in files" :key="index">
                <div class="img-box" @click="preview(item.name)">
                    <img class="img" :src="item.src"/>
                </div>
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
import pathTooler from '@/client/js/pathTooler'

export default {
    data() {
        return {
            enter: false,
            files: [],
            token: null,
            path: "/model/",
            freshImg: config.LINK.FRESH,
            canUpload: true,
            links: []
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
                var item = this.addItem(file);
                this.startUpload(item);
                
            }
        },
        
        toggle(){
            this.canUpload = !this.canUpload;
        },

        changePath(url){
            this.path = url;
            this.showDir();
        },

        async startUpload(item){
            var suc = await qiniuTooler.start(item.file, item, this.path, this.token);
            if(suc){
                axios.get("/insert", {
                    params: {url: `${config.HOST}${this.path}${item.name}`}
                }).then(res => {
                    console.log(res.data);
                });
            }
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
                this.path = `${this.path}${name}/`;
                this.showDir();
            }
        },
        showDir(){
            if(this.path.substr(-1) != "/"){
                this.path = this.path + "/";
            }
            this.files = [];
            this.links = pathTooler.getPath(`${this.path}`);

            axios.get("/dir", {
                params: {path: `${config.HOST}${this.path}`}
            }).then(res => {
                console.log(res.data);
                var list = res.data;
                list.forEach(item => {
                    console.log(this.addItem(item));
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
                            loading: isFile,
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
                    item.src = `${config.HOST}${this.path}${fname}`;
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

        this.showDir();
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
