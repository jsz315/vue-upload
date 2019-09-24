<template>
    <div class="upload-item">
        <path-view ref="pathView" />
        <file-view v-if="$store.state.isUpload"/>
        <edit-view v-if="$store.state.isEdit"/>
        <div class="list">
            <div class="item" :class="{'selected':item.selected}" v-for="(item, index) in files" :key="index">
                <div class="img-box" @click="preview(item)">
                    <img class="img" :src="item.src"/>
                </div>
                <div class="name">{{item.name}}</div>
                <div class="fresh" :style="{'background-image': 'url(' + freshImg + ')'}" v-if="item.exist" @click="rewrite(item)"></div>
                <progress-view class="loading" :num="item.percentage" v-if="item.loading"></progress-view>
                <div class="btn" @click="preview(item)" v-if="item.isModel">预览模型</div>
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
        preview(item){
            if(this.$store.state.isEdit){
                item.selected = !item.selected;
                return;
            }
            var name = item.name;
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
                this.$store.commit('changePath', `${this.path}${name}/`);
                this.$refs.pathView.showDir();
            }
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
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
