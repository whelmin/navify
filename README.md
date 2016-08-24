dev-nav 开发导航
===
Developer Navigation

`前端`

---

### 目录结构

```
dev-nav
   ├─ README.md
   ├─ index.html        // 导航主页
   ├─ static            // 页面静态文件夹
   │    └─ css/js/...
   └─ data              // 资源数据文件夹 (json)
        ├─ fe.json      // such as: 前端资源数据 - fe.json
        └─ ...
```

### 当前所包含的方向

|   方向   |  简写   |   对应数据文件  |      网址     |
|:-------:|:------:|:-------------:|:-------------|
|   前端   |  fe    |   fe.json     |  fe.congm.in |

---

## 资源收录

你可以通过下述方式提交满足以下任一条件的资源进行收录

* 对学习和开发有一些帮助的网站资源
* 在Github上有较多的star的开源项目

### New Issues

请依照以下格式提交资源

```
类别:             // 所提交资源的类别
资源名:           // 所提交资源全名
主页地址:         // 所提交资源的主页地址
Github:         // 所提交资源的Github地址
```

## 方向收录

### data.json

关于data数据的json结构分析如下:

```
// data.json
{
  "info": { ... },   // 网站信息(对象)
  "section": [ ... ]   // 资源分类(数组)
}
```
```
// section - 资源分类(数组)
[
  {
    "heading": "类别名(必需)",
    "content": [ ... ]   // 类别内容分组(数组)
  },
  ....
]
```
```
// section[i].content - 类别内容分组(数组)
[
  {
    "title": "分组名(可无)",
    "item": [ ... ]   // 资源列表(数组)
  }
]
```
```
// section[i].content[j].item - 资源列表(数组)
[
  {
    "name": "资源名(必需)",
    "link": {
      "home": "资源主页地址(必需)",
      "github": "资源Github地址(可无)"
    }
  }
]
```

### 联系作者

@ Cong Min - https://congm.in

> 感谢大家对建设`dev-nav`开发导航所做出的贡献。

---

## 关于该项目 (了解更多)

### 所用技术

* html / css / 原生javascript (es5)
* [vue.js](https://github.com/vuejs/vue) / [vue-resource](https://github.com/vuejs/vue-resource)
* [sass](https://github.com/sass/sass) / [compass](https://github.com/Compass/compass)
* [iconfont](http://www.iconfont.cn)

### 搜索高亮

关于搜索高亮功能的原生js实现，可以参见博文: https://i.congm.in/js-find