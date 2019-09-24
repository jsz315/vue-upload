import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    isEdit: false,
    isUpload: true,
    files: [],
    path: "/",
    token: "",
    copyDir: "",
    copyFiles: []
}

const mutations = {
    changeIsEdit(state, isEdit) {
        state.isEdit = isEdit;
    },

    changeIsUpload(state, isUpload) {
        state.isUpload = isUpload;
    },

    changeFiles(state, files) {
        state.files = files;
    },

    addFile(state, file){
        state.files.push(file);
    },

    changePath(state, path){
        state.path = path;
    },

    changeToken(state, token){
        state.token = token;
    },

    changeFileSelect(state, selected){
        state.files.forEach(item => {
            item.selected = selected;
        })
    },

    changeCopyFiles(state, copyFiles, copyDir){
        state.copyDir = copyDir;
        state.copyFiles = copyFiles;
    }
}

export default new Vuex.Store({
    state,
    mutations
})