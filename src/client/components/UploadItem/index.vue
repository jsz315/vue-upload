<template>
    <div class="upload-item">
        <div class="box" :class="{enter}" ref="box">拖拽文件上传</div>
        <div class="list">
            <div class="item" v-for="(item, index) in files" :key="index">
                <div class="img" :style="{'background-image': 'url(' + item.src + ')'}"></div>
                <div class="name">{{item.name}}</div>
                <progress-view :num="item.percentage" v-if="item.loading"></progress-view>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
import ProgressView from '@/client/components/ProgressView/index.vue'

export default {
    data() {
        return {
            enter: false,
            files: []
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
            var url = "/upload";
            var dt = e.dataTransfer;
            for (var i = 0; i < dt.files.length; i++) {
                this.uploadFile(dt.files[i], url);
            }
        },
        uploadFile(file, url) {
            var item = {
                            name: file.name,
                            percentage: 0,
                            loading: true
                        };
            if(file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif"){
                var fr = new FileReader();
                fr.readAsDataURL(file);
                fr.onload = () => {
                    item.src = fr.result;
                    this.files.push(item);
                };
            }
            else{
                item.src = '/asset/img/file.png';
                this.files.push(item);
            }

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
        }
    },

    mounted() {
        var box = this.$refs.box;
        box.addEventListener("dragenter", this.onDrag, false);
        box.addEventListener("dragover", this.onDrag, false);
        box.addEventListener("dragleave", this.onDragLeave, false);
        box.addEventListener("drop", this.onDrop, false);

        axios.get("/abc").then(res=>{
            console.log(res);
        })
    }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
