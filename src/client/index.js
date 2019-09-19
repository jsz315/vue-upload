import Vue from 'vue'
import App from "./page/App/index.vue";
// import Element from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(Element)

new Vue({
    el: "#app",
    render: h => h(App)
})