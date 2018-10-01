<template>
<div class="main">
    <transition name="fade">
        <!-- container -->
        <div class="container">
            <!-- header -->
            <header>
                <h2 class="title-en" v-if="title.en">{{ title.en }}</h2>
                <h1 class="title-alias" v-if="title.alias">{{ title.alias }}</h1>
                <h1 class="title-full" v-else-if="title.full">{{ title.full }}</h1>
                <a v-if="title.full || title.alias" href="javascript:void(0);" class="tag">{{ title.full || title.alias }}</a>
                <label class="search" :class="{'active': search.status}">
                    <i class="icon">
                        <img :src="config.icon['search']"/>
                    </i>
                    <input type="text"
                           placeholder="搜索..."
                           autocomplete="off"
                           @focus="searchOnFocus"
                           @blur="searchOnBlur"
                           @input="searching"
                           v-model="search.content">
                </label>
            </header>
            <!-- content -->
            <div class="content">
                <div class="box"
                     v-for="(section, index) in list"
                     :key="index">
                    <section>
                        <div class="section-heading">{{ section.heading }}</div>
                        <ul class="list"
                            v-for="(group, index) in section.content"
                            :key="index">
                            <li class="list-title" v-if="group.title">{{ group.title }}</li>
                            <li class="list-item"
                                v-for="(item, index) in group.item"
                                :key="index">
                                <a :href="item.link.home" target="_blank">
                                    <div class="item-logo" v-if="item.link">
                                        <img :src="favicon + item.link.home">
                                    </div>
                                    <div class="item-name">
                                        {{ item.name }}
                                    </div>
                                </a>
                                <div class="item-info-link">
                                    <i class="icon" v-if="item.info">
                                        <img :src="config.icon['info']"/>
                                    </i>
                                </div>
                                <ul class="item-link-list">
                                    <li class="item-link"
                                        v-for="(val, key) in item.link" :key="key">
                                        <a :href="val" target="_blank">
                                            <i class="icon" v-if="config.icon[key]">
                                                <img :src="config.icon[key]"/>
                                            </i>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
            <footer>
                <p class="line"></p>
                <p class="author">
                    <a v-if="config.author.name"
                       :href="config.author.link || 'javascript:void(0);'"
                       target="_blank">{{ config.author.name }}</a>
                </p>
                <p v-if="title.full">{{ title.full }}</p>
                <p><a href="https://github.com/mcc108/navify" target="_blank">Powered by Navify</a></p>
            </footer>
        </div>
    </transition>
    <!-- github link -->
    <div class="corner-github" v-if="config.github">
        <a :href="config.github" target="_blank">Github</a>
    </div>
</div>
</template>

<script>
import Ajax from '@/utils/ajax';
import Waterfall from '@/utils/waterfall';

export default {
    name: 'app',
    // components: {},
    // directives: {},
    // filters: {},
    // mixins: [],
    // props: {},
    data() {
        return {
            loading: true, // 加载中
            config: window.Navify, // 全局配置
            list: [], // 列表
            search: { // 搜索
                status: false, // 搜索状态
                content: '', // 搜索内容
            },
            favicon: 'https://api.byi.pw/favicon/?url=',
            baidu: 'https://www.baidu.com/s?wd=',
            google: 'https://www.google.com/#q=',
        };
    },
    computed: {
        // 解析config.title
        title() {
            return typeof this.config.title === 'object' ? this.config.title : {
                full: this.config.title,
                alias: null,
                en: null,
            };
        },
        // 解析config.author
        author() {
            return typeof this.config.author === 'object' ? this.config.author : {
                name: this.config.author,
                link: null,
            };
        }
    },
    watch: {
        // 站点标题
        title: {
            handler(title) {
                const mainTitle = title.full || title.alias;
                document.title = `${mainTitle ? `${mainTitle} - ` : ''}${title.en}`;
            },
            immediate: true,
        },
    },
    // beforeCreate() {},
    created() {
        this.getData(window.Navify.json); // 获取数据
    },
    // beforeMount() {},
    // mounted() {},
    // beforeUpdate() {},
    // updated() {},
    // beforeDestroy() {},
    // destroyed() {},
    methods: {
        // ajax - json
        getData(jsonFile) {
            Ajax.get(jsonFile).then((data) => {
                this.list = data || [];
                this.loading = false;
                this.initWaterfall();
            }).catch(() => {
                this.loading = false;
            });
        },
        // 初始化瀑布流
        initWaterfall() {
            this.$nextTick(function () {
                this.waterfall();
                this.$watch('list', this.waterfall, { deep: true });
                window.addEventListener('resize', this.waterfall);
            });
        },
        // 调用瀑布流
        waterfall() {
            Waterfall('.content', 3);
        },
        // 搜索
        searchOnFocus() {
            this.search.status = true;
        },
        searchOnBlur() {
            if (!this.search.content) {
                this.search.status = false;
            }
        },
        searching() { // 搜索input事件
            const text = String(this.search.content).trim();
            const reg = new RegExp(text, 'ig'); // 匹配全局大小写
            const content = document.querySelector('.content');
            const box = document.querySelectorAll('.box');
            this.rmHighlight(content); // 移除所有之前的高亮内容
            box.forEach((el) => { // 遍历.box
                el.classList.remove('hidden'); // 清除之前无搜索结果时隐藏的.box
                if (!text) return; // 如果搜索的字符串为空，不进行下列操作
                let match = false; // 该box内是否含有匹配内容
                const range = el.querySelectorAll('.section-heading, .list-title, .item-name'); // 可搜索区域
                range.forEach((item) => {
                    if (item.innerText.match(reg)) {
                        this.highlight(item, text); // 目标结点匹配则执行高亮标记函数
                        match = true;
                    }
                });
                if (!match) { // 是否有匹配，从而对.box进行隐藏
                    el.classList.add('hidden');
                } else {
                    el.classList.remove('hidden');
                }
            });
            this.waterfall(); // 重置瀑布流
        },
        /* 关于搜索高亮功能, 可参见博文 [ https://i.congm.in/js-find ] */
        highlight(el, value) { // 高亮
            const childList = el.childNodes;
            if (!childList.length || !value.length) return; // 无子节点或无查询值，则不进行下列操作
            const reg = new RegExp(value, 'ig');
            childList.forEach((el) => { // 遍历其内子节点
                if (el.nodeType === 1 // 如果是元素节点
                    && el.classList && !el.classList.contains('search-highlight') // 而且没有被标记高亮
                    && !/(script|style|template)/i.test(el.tagName)) { // 并且元素标签不是script或style或template等特殊元素
                    this.highlight(el, value); // 那么就继续遍历(递归)该元素节点
                } else if (el.nodeType === 3) { // 如果是文本节点
                    const highlightList = el.data.match(reg); // 得出文本节点匹配到的字符串数组
                    if (!highlightList) return;
                    const splitTextList = el.data.split(reg); // 分割多次匹配
                    // 遍历分割的匹配数组，将匹配出的字符串加上.highlight并依次插入DOM
                    el.parentNode.innerHTML = splitTextList.reduce(
                        (html, splitText, i) =>
                            html + splitText + (
                                (i < splitTextList.length - 1)
                                ? `<span class="search-highlight">${highlightList[i]}</span>`
                                : `<template search-highlight>${el.data}</template>`
                            ), // 同时给为匹配的template用于后续恢复
                        '');
                }
            });
        },
        rmHighlight(el) { // 移除高亮
            const highlightSpans = el.querySelectorAll('span.search-highlight');
            highlightSpans.forEach((el) => { // 找到所有.highlight并遍历
                if (!el.parentNode) return;
                const template = el.parentNode.querySelector('template[search-highlight]');
                if (!template) return;
                // 找到父节点中的template，将自己内容替换为template内容
                el.parentNode.innerHTML = el.parentNode.querySelector('template[search-highlight]').innerHTML;
            });
        }
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '~normalize.css';
/* common */
*,
:after,
:before {
    box-sizing: border-box;
}
html {
    width: 100%;
    height: 100%;
}
body {
    position: relative;
    min-height: 100%;
    overflow-x: hidden;
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: none;
}
a {
    text-decoration: none;
}
ol, ul {
    list-style: none;
    margin: 0;
    padding: 0;
}
.hidden,
[search-highlight] {
    display: none;
}

/* themes */
@import './themes/normal.less';

/* others */
.fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}

::-webkit-scrollbar {
    background-color: #f1f1f1;
    overflow: visible;
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, .2);
    background-clip: padding-box;
    min-height: 15px;
    box-shadow: inset 1px 1px 0 rgba(0, 0, 0, .05), inset 0 -1px 0 rgba(0, 0, 0, .05);
}
::-webkit-scrollbar-thumb:vertical:hover {
    background-color: rgba(0, 0, 0, .3);
}
::-webkit-scrollbar-thumb:vertical:active {
    background-color: rgba(0, 0, 0, .5);
}
::-webkit-scrollbar-button {
    height: 0;
    width: 0;
}
::-webkit-scrollbar-track {
    background-clip: padding-box;
    border: solid transparent;
    border-width: 0 0 0 4px;
}
::-webkit-scrollbar-corner {
    background: transparent;
}

::selection {
    background: #e2e2e2;
}
::-moz-selection {
    background: #e2e2e2;
}
</style>
