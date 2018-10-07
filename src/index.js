import Vue from 'vue';
import App from './App.vue';
import merge from 'lodash/merge';

Vue.config.productionTip = false;

// config
const defaultConfig = {
    // `挂载元素` 默认 #app
    el: '#app',
    // `json文件来源` 默认 ./nav.json（与页面同路径的），此外还可配置http链接
    json: './nav.json',
    // `title标题` 如果为对象:可设full/alias/en三属性; 如果为字符串:即默认是title.full
    title: 'Navify',
    // `author作者` 如果为对象:可设name/link两属性; 如果为字符串:即默认是title.name
    author: null,
    icon: {
        'home': require('@/static/home.svg'),
        'github': require('@/static/github.svg'),
        'info': require('@/static/info.svg'),
        'search': require('@/static/search.svg'),
    },
};
window.Navify = merge(defaultConfig, window.Navify);

// vm
const vm = new Vue({
    render: h => h(App),
}).$mount(window.Navify.el);

export default vm;
