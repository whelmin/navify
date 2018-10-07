# Navify

[![npm version](https://img.shields.io/npm/v/navify.svg?style=flat-square)](https://www.npmjs.com/package/navify)
[![npm total downloads](https://img.shields.io/npm/dt/navify.svg?style=flat-square)](https://www.npmjs.com/package/navify)
[![License](https://img.shields.io/github/license/mcc108/navify.svg?style=flat-square)](https://github.com/mcc108/navify/blob/master/LICENSE)

🌏 An elegant website navigation page generator - 网址导航页生成器

## 如何使用

### 1. **全局安装**

```bash
$ npm install -g navify
```

### 2. **基础用法**

**2.1、创建项目**

```bash
$ navify create <dir>        // 创建项目名
```

在你的 `<dir>` 目录下，会自动生成可进行配置的 `index.html` 和 `nav.json`

**2.2、实时预览**

```bash
$ cd <dir>                   // 进入项目
$ navify serve               // 实时预览
```

在接下来的修改配置与数据过程中，项目将实时在本地Web端口 `8520` 中呈现。

**2.3、`index.html` 配置项**

```html
<script>
    window.Navify = {
        el: '#app',
        json: './nav.json',
        title: {
            alias: '前端',
            full: 'Web前端导航',
            en: 'Front End',
        },
        author: {
            name: 'Cong Min',
            link: 'https://congm.in',
        },
        github: 'https://github.com/mcc108/navify',
        icon: {
            'share': 'https://.../share.png',
        }
    };
</script>
```

| 名称 | 类型 | 说明 | 默认值 |
|:---:|:----------:|:---------|:----|
| **el** | `String` | **挂载元素** | '#app' |
| **json** | `String` | **json文件来源**。本地相对路径或者网络链接 | './nav.json' |
| **title** | `String/Object` | **站点名称**。若值为对象：可设 **`full`(全称)** / **`alias`(简称)** / **`en`(英文名)** 3个属性；若值为字符串：则解析为站点全称 `title.full` | 'Navify' |
| **author** | `String/Object` | **站点作者信息**。若值为对象：可设 **`name`(名字)** / **`link`(个人主页)** 2个属性；若值为字符串：则解析为作者名字 `author.name` | null |
| **github** | `String` | **Github链接**。设置后页面右上角会出现Github标志 | null |
| **icon** | `Object` | **站点自定义图标**。一个Key-Value键值对象：`key` 是对应的icon名称(即nav.json内item.link的key)，`value` 是icon地址(可填写本地相对路径或者网络链接)，默认 home/github 已经拥有了内置的icon | {} |


**2.4、`nav.json` 数据格式**

关于 `nav.json` 的数据结构，你应该遵守以下规则格式进行网站的增删改操作。

```js
// nav.json
// List - 分类列表
[
  {
    "heading": "类别名(必需)",
    "content": [ ... ]  // 类别列表
  },
  { ... }
]
```

```js
// List[n].content
// Group - 类别分组列表
[
  {
    "title": "分组名(可无)",
    "item": [ ... ]  // 网站列表(数组)
  }
]
```

```js
// Group[m].item
// Item - 网站列表
[
  {
    "name": "网站名(必需)",
    "info": "网站简介(可无)",
    "link": {
      "home": "网站主页地址(必需)",
      "github": "网站Github地址(可无)"
    }
  }
]
```

较完整的例子：

```json
[{
    "heading": "类别名A",
    "content": [{
        "item": [{
            "name": "网站名1",
            "info": "网站名1的简介",
            "link": {
                "home": "网站名1的主页地址",
                "github": "网站名1的Github地址"
            }
        }]
    }, {
        "title": "分组名a",
        "item": [{
            "name": "网站名2",
            "link": {
                "home": "网站名2的主页地址"
            }
        }]
    }]
}]
```

### 3. **部署访问**

**方式一、自行部署**

将你的 `<dir>` 目录部署至自己的Web静态服务器，即可直接访问。

**方式二、Github Page**

GitHub Pages 支持从以下代码源读取html文件

* `docs/` 目录
* `master` 或 `gh-pages` 分支

将代码提交到github，在对应的github仓库 **设置选项** 开启 `GitHub Pages` 功能，选择 `master branch` 选项并保存，即可访问。还可以绑定自定义的域名。

![GitHub Pages 部署截图](https://user-images.githubusercontent.com/13345272/46583007-727aa680-ca82-11e8-8548-ec6defbfb04b.png)
---


## 关于

### 联系作者

[@ Cong Min](https://congm.in) & [@ whelmin](https://whelm.in)
