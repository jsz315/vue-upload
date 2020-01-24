import Vue from 'vue'
import App from "./page/App/index.vue";
import MessageView from '@/client/components/MessageView/index.vue';
import './index.less';

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
    render: h => h(App)
})