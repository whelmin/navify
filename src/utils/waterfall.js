/* 瀑布流 */
function Waterfall(container, col = 3) {
    if (typeof (container) === 'string') container = document.querySelector(container);
    if (!container) return;

    const style = (el) => window.getComputedStyle(el);
    const margin = (name, el) => parseFloat(style(el)['margin' + name]) || 0;
    const px = (n) => n + 'px';

    const y = (el) => parseFloat(el.style.top);
    const x = (el) => parseFloat(el.style.left);
    const width = (el) => parseFloat(style(el).width);
    const height = (el) => parseFloat(style(el).height);

    const bottom = (el) => (y(el) + height(el) + margin('Bottom', el));
    const right = (el) => (x(el) + width(el) + margin('Right', el));

    const sort = (list) => {
        list.sort((a, b) => (bottom(b) - bottom(a) || x(b) - x(a)));
        return list;
    };

    const boundary = {
        col: col, // 初始列数
        els: [], // 元素列表
        add(el) { // 添加元素
            this.els.push(el);
            sort(this.els);
            this.els = this.els.slice(0, boundary.col);
        },
        min() {
            return this.els[this.els.length - 1];
        },
        max() {
            return this.els[0];
        }
    };

    var els = container.querySelectorAll('.box:not(.hidden)');

    function placeEl(el, top, left) {
        if (!el || !el.style) return;
        el.style.position = 'absolute';
        el.style.top = top;
        el.style.left = left;
        boundary.add(el);
    }
    function placeFirstElement(el) {
        placeEl(el, '0px', px(margin('Left', el)));
    }
    function placeAtTheFirstLine(prev, el) {
        placeEl(el, prev.style.top, px(right(prev) + margin('Left', el)));
    }
    function placeAtTheSmallestColumn(minEl, el) {
        placeEl(el, px(bottom(minEl) + margin('Top', el)), px(x(minEl)));
    }

    function adjustContainer(container, maxEl) {
        if (!container) return;
        container.style.position = 'relative';
        container.style.height = px(bottom(maxEl) + margin('Bottom', maxEl));
    }

    function thereIsSpace(els, i) {
        var bool = right(els[i - 1]) + width(els[i]) <= width(container);
        if (!bool) { boundary.col = i; }
        return bool;
    }

    if (els.length) { placeFirstElement(els[0]); }

    let i;
    for (i = 1; i < els.length && thereIsSpace(els, i); i++) {
        placeAtTheFirstLine(els[i - 1], els[i]);
    }
    for (; i < els.length; i++) {
        placeAtTheSmallestColumn(boundary.min(), els[i]);
    }
    adjustContainer(container, boundary.max());
}

export default Waterfall;
