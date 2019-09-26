import Vue from 'vue'
import App from "./page/App/index.vue";

// import Element from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(Element)

import store from './store/index'
import { Message, Breadcrumb, BreadcrumbItem } from 'element-ui';

Vue.prototype.$message = Message;
// Vue.use(Message);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);

new Vue({
    el: "#app",
    store,
    render: h => h(App)
})