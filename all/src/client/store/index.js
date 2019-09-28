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
    copyFiles: [],
    isCut: false
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

    changeCopyFiles(state, copyFiles){
        state.copyFiles = copyFiles;
        state.copyDir = state.path;
    },

    changeIsCut(state, isCut){
        state.isCut = isCut;
    }
}

export default new Vuex.Store({
    state,
    mutations
})