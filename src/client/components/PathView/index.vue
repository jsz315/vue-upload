<template>
    <div class="path-view">
        <div class="path">
            <div class="label">上传目录：</div>
            <input class="txt" v-model="path" />
            <div class="jump" @click="showDir">进入</div>
        </div>
        <div class="path">
            <div class="label">路径：</div>
            <div class="links">
                <div class="link" @click="changePath(item.link)" v-for="(item, index) in links" :key="index" :data-link="item.link">{{item.label}}</div>
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
import fileTooler from '@/client/js/fileTooler'

export default {
    data() {
        return {
            path: this.$store.state.path,
            links: []
        };
    },
    components: {
        
    },
    methods: {
        changePath(url){
            this.path = url;
            if(this.path.substr(-1) != "/"){
                this.path = this.path + "/";
            }
            this.$store.commit('changePath', this.path);
            this.showDir();
        },
        showDir(){
            var path = this.$store.state.path;
            this.path = path;
            this.$store.commit('changeFiles', []);
            this.links = pathTooler.getPath(`${path}`);
            axios.get("/dir", {
                params: {path: `${config.HOST}${path}`}
            }).then(res => {
                console.log(res.data);
                var list = res.data;
                list.forEach(item => {
                    console.log(this.addItem(item));
                })
            });
        },
        addItem(obj){
            var item = fileTooler.addItem(obj, this.path);
            this.$store.commit('addFile', item);
        }
    },

    mounted() {
        this.showDir();
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

