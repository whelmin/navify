/* vuejs */
var dev_nav = new Vue({
    el: '#dev-nav',
    data: {
        main: {
            status: false,
            github: 'https://github.com/mcc108/dev-nav'
        },
        data: {},
        favicon: 'http://api.byi.pw/favicon/?url=',
        baidu: 'https://www.baidu.com/s?wd=',
        google: 'https://www.google.com/#q=',
        search: {
            status: false,
            content: ''
        }
    },
    methods: {
        getData: function(filenameList){
            var self = this;
            /* ajax - json */
            self.$http.get('data/' + filenameList[0] + '.json').then(function(res){
                if(res.ok){
                    self.data = res.json();
                    self.initWaterfall();
                }else{
                    self.main.status = true;
                }
            }, function(){
                if(filenameList.length){
                    filenameList.shift();
                    self.getData(filenameList);
                }else{
                    self.main.status = true;
                }
                console.clear();
            });
        },
        initWaterfall: function(){
            /* 调用瀑布流 */
            this.$nextTick(function(){
                waterfall('.content');
                window.addEventListener('resize', function(){
                    waterfall('.content');
                });
            });
        },
        searchOnFocus: function(){
            this.search.status = true;
        },
        searchOnBlur: function(){
            if(!this.search.content){
                this.search.status = false;
            }
        },
        searching: function(e){
            /* 更多关于搜索高亮功能, 参见我的博文 [ https://i.congm.in/js-find ] */
            function highlight(el, value){
                var childList = el.childNodes,
                    childCount = childList.length;
                if(!childCount || !value.length){
                    return;
                }
                var reg = new RegExp(value, "gi");
                for(var i = 0; i < childCount; i++){
                    var oChild = childList[i];
                    if(oChild.nodeType == 1 && oChild.classList && !oChild.classList.contains('highlight') && !/(script|style|template)/i.test(oChild.tagName)){
                       highlight(oChild, value);
                    }else if(oChild.nodeType == 3){
                        var highlightList = oChild.data.match(reg);
                        if(highlightList){
                            var highlightSplit = oChild.data.split(reg),
                                highlightSplitLen = highlightSplit.length;
                            var highlightHtml = '';
                            for(var j = 0; j < highlightSplitLen; j++){
                                var highlightSpan = (j < highlightSplitLen - 1) ? ('<span class="highlight">' + highlightList[j] + '</span>') : ('<template>' + oChild.data +'</template>');
                                highlightHtml += highlightSplit[j] + highlightSpan;
                            }
                            oChild.parentNode.innerHTML = highlightHtml;
                        }
                    }
                }
            }
            function rmHighlight(el) {
                var highlightSpans = el.querySelectorAll("span.highlight");
                for(var i = 0; i < highlightSpans.length; i++){
                    if(highlightSpans[i].parentNode){
                        highlightSpans[i].parentNode.innerHTML = highlightSpans[i].parentNode.querySelector("template").innerHTML;
                    }
                }
            }
            var target = e.target,
                value = target.value;
            var reg = new RegExp(value, "gi"),
                content = document.querySelector(".content"),
                box = document.querySelectorAll(".box"),
                count = box.length;
            rmHighlight(content);
            for(var i = 0; i < count; i++){
                box[i].classList.remove("hidden");
                if(value.length == 0){
                    continue;
                }
                var range = box[i].querySelectorAll(".section-heading, .list-title, .item-name"),
                    rangeLen = range.length,
                    rangeText = '';
                for(var j = 0; j < rangeLen; j++){
                    if(range[j].innerText.match(reg)){
                        highlight(range[j], value);
                    }
                    rangeText += range[j].innerText + '\n';
                }
                if(!rangeText.match(reg)){
                    box[i].classList.add("hidden");
                }else{
                    box[i].classList.remove("hidden");
                }
            }
            waterfall('.content');
        }
    },
    ready: function(){
        var self = this;
        /* hash path - filename */
        var filenameList = [],  /* [hash, path, host] */
            hashArry = location.hash.split('#'),
            pathArry = location.pathname.split('/'),
            hostArry = location.hostname.split('.'),
            pathArryLength = pathArry.length;
        /* push hash */
        if(hashArry[1]){
            filenameList.push(hashArry[1]);
        }
        /* push path */
        if(pathArry[pathArryLength]){
            filenameList.push(pathArry[pathArryLength]);
        }else{
            if(pathArryLength > 1){
                filenameList.push(pathArry[pathArryLength - 1]);
            }
        }
        /* push host */
        if(hostArry[0]){
            filenameList.push(hostArry[0]);
        }
        self.getData(filenameList);
    }
});

/* 瀑布流 */
function waterfall(container){
    if(typeof(container) === 'string'){
        container = document.querySelector(container);
    }
    function style(el){ return window.getComputedStyle(el); }
    function margin(name, el){ return parseFloat(style(el)['margin' + name]) || 0; }
    function px(n){ return n + 'px'; }
    function y(el){ return parseFloat(el.style.top); }
    function x(el){ return parseFloat(el.style.left); }
    function width(el){ return parseFloat(style(el).width); }
    function height(el){ return parseFloat(style(el).height); }
    function bottom(el){ return y(el) + height(el) + margin('Bottom', el); }
    function right(el){ return x(el) + width(el) + margin('Right', el); }
    function sort(l){
        l = l.sort(function(a, b){
            var bottom_diff = bottom(b) - bottom(a);
            return bottom_diff || x(b) - x(a);
        });
    }
    var boundary = {
        col: 3,
        els: [],
        add: function (el){
            this.els.push(el);
            sort(this.els);
            this.els = this.els.slice(0, boundary.col);
        },
        min: function(){
            return this.els[this.els.length - 1];
        },
        max: function(){
            return this.els[0];
        }
    };
    function placeEl(el, top, left){
        el.style.position = 'absolute';
        el.style.top = top;
        el.style.left = left;
        boundary.add(el);
    }
    function placeFirstElement(el){
        placeEl(el, '0px', px(margin('Left', el)));
    }
    function placeAtTheFirstLine(prev, el){
        placeEl(el, prev.style.top, px(right(prev) + margin('Left', el)));
    }
    function placeAtTheSmallestColumn(minEl, el){
        placeEl(el, px(bottom(minEl) + margin('Top', el)), px(x(minEl)));
    }
    function adjustContainer(container, maxEl){
        container.style.position = 'relative';
        container.style.height = px(bottom(maxEl) + margin('Bottom', maxEl));
    }
    function thereIsSpace(els, i){
        var bool = right(els[i - 1]) + width(els[i]) <= width(container);
        if(!bool){ boundary.col = i; }
        return bool;
    }
    var els = container.querySelectorAll('.box:not(.hidden)');
    if(els.length){
        placeFirstElement(els[0]);
    }
    for(var i = 1; i < els.length && thereIsSpace(els, i); i++){
        placeAtTheFirstLine(els[i - 1], els[i]);
    }
    for(; i < els.length; i++){
        placeAtTheSmallestColumn(boundary.min(), els[i]);
    }
    adjustContainer(container, boundary.max());
}