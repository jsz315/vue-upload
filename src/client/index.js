import Vue from 'vue'
import AppPage from "./page/AppPage/index.vue";
import EditPage from "./page/EditPage/index.vue";
import ClipPage from "./page/ClipPage/index.vue";
import RankPage from "./page/RankPage/index.vue";
import ListPage from "./page/ListPage/index.vue";
import UploadPage from "./page/UploadPage/index.vue";
import MessageView from '@/client/components/MessageView/index.vue';
import './index.less';
import VueRouter from 'vue-router';
Vue.use(VueRouter)

const routes = [
  { path: '/', component: UploadPage },
  { path: '/list', component: ListPage },
  { path: '/edit', component: EditPage },
  { path: '/clip', component: ClipPage },
  { path: '/rank', component: RankPage }
]

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

// import Element from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(Element)
import toastRegistry from '@/client/components/ToastView/index.js'

// 这里也可以直接执行 toastRegistry()
Vue.use(toastRegistry);

import store from './store/index'
// import { Message, Breadcrumb, BreadcrumbItem } from 'element-ui';

// Vue.prototype.$message = Message;

const MessageConstructor = Vue.extend(MessageView);
Vue.prototype.$toast = function(word){
    document.body.appendChild(new MessageConstructor({
        el: document.createElement("div"),
        data: {word}
    }).$el)
}

// Vue.use(Message);
// Vue.use(Breadcrumb);
// Vue.use(BreadcrumbItem);

new Vue({
    el: "#app",
    store,
    router,
    render: h => h(AppPage)
})