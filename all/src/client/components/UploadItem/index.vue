<template>
    <div class="upload-item">
        <div class="info">3D模型转换工具<i @click="showHelp" class="el-icon-question help-btn">帮助</i></div>
        <path-view ref="pathView" />
        <file-view v-if="$store.state.isUpload"/>
        <edit-view ref="editView" v-show="$store.state.isEdit"/>
        <div class="list">
            <div class="item" :class="{'selected':item.selected}" v-for="(item, index) in files" :key="index">
                <div class="img-box" @click="toggleSelect(item)" @dblclick="preview(item)">
                    <img class="img" :src="item.src"/>
                </div>
                <div class="name">{{item.name}}</div>
                <div class="fresh" :style="{'background-image': 'url(' + freshImg + ')'}" v-if="item.exist" @click="rewrite(item)"></div>
                <progress-view class="loading" :num="item.percentage" v-if="item.loading"></progress-view>
                <div class="btn" v-if="item.isModel">预览模型</div>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
import * as qiniu from 'qiniu-js';
import ProgressView from '@/client/components/ProgressView/index.vue'
import PathView from '@/client/components/PathView/index.vue'
import FileView from '@/client/components/FileView/index.vue'
import EditView from '@/client/components/EditView/index.vue'
import qiniuTooler from '@/client/js/qiniuTooler'
import config from '@/client/js/config'
import typeTooler from '@/client/js/typeTooler'
import pathTooler from '@/client/js/pathTooler'

import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'

export default {
    data() {
        return {
            freshImg: config.LINK.FRESH,
        };
    },
    components: {
        ProgressView, PathView, FileView, EditView
    },
    computed: {
        files(){
            return this.$store.state.files;
        },
        path(){
            return this.$store.state.path;
        },
        token(){
            return this.$store.state.token;
        }
    },
    methods: {
        async rewrite(item){
            var res = await axios.get("/token", {
                params: {key: this.path + item.name}
            });
            this.$store.commit('changeToken', res.data);

            item.loading = true;
            var suc = await qiniuTooler.start(item.file, item, this.path, this.token);
            if(suc){
                item.exist = false;
            }
        },
        toggleSelect(item){
            item.selected = !item.selected;
        },
        preview(item){
            var name = item.name;
            var fileType = typeTooler.checkType(name);
            var url;
            if(fileType == config.FILE_TYPE.IMAGE){
                url = `${config.HOST}${this.path}${name}`;
                window.open(url);
            }
            else if(fileType == config.FILE_TYPE.MODEL){
                url = `${config.STAGE}?url=${config.HOST}${this.path}${name}`;
                window.open(url);
            }
            else if(fileType == config.FILE_TYPE.FOLDER){
                this.$store.commit('changePath', `${this.path}${name}/`);
                this.$refs.pathView.showDir();
            }
        },
        initEvent(){
            document.addEventListener("keydown", (event)=>{
                console.log(event.keyCode);
                if(event.ctrlKey && event.keyCode == 67){ 
                    console.log('你按下了CTRL+C');
                    this.$refs.editView.copyItem(false);
                }
                else if(event.ctrlKey && event.keyCode == 86){ 
                    console.log('你按下了CTRL+V');
                    this.$refs.editView.pasteItem();
                }
                else if(event.ctrlKey && event.keyCode == 88){ 
                    console.log('你按下了CTRL+X');
                    this.$refs.editView.copyItem(true);
                }
                else if(event.ctrlKey && event.keyCode == 65){ 
                    console.log('你按下了CTRL+A');
                    event.preventDefault();
                    this.$refs.editView.toggleSelect();
                }
                else if(event.keyCode == 46){ 
                    console.log('你按下了Del');
                    this.$refs.editView.deleteItem();
                }
            })
        },
        showHelp(){
            alert("开发中");
        }
    },

    mounted() {
        axios.get("/token").then(res => {
            this.$store.commit('changeToken', res.data);
        })

        // var file = new Blob( [ 'jjj' ], { type: 'text/plain' } );
        // file.name = "test.txt";
        // var item = this.addFile(file);
        // this.startUpload(file, item);

        this.initEvent();
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
