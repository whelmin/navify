# Navify

[![npm version](https://img.shields.io/npm/v/navify.svg?style=flat-square)](https://www.npmjs.com/package/navify)
[![npm total downloads](https://img.shields.io/npm/dt/navify.svg?style=flat-square)](https://www.npmjs.com/package/navify)
[![License](https://img.shields.io/github/license/whelmin/navify.svg?style=flat-square)](https://github.com/whelmin/navify/blob/master/LICENSE)

🌏 An elegant website navigation page generator. Let us call it `Navify` .

[README中文版](./README-zh.md)

## How to use navify

### 1. **Global install navify with npm**

```bash
$ npm install -g navify
```

### 2. **Usage**

**2.1 Create and initialize a navify project**

```bash
$ navify create <dir>
```
Enter the above command, will automatic generated these files, `index.html` and `nav.json` in your `<dir>` directory.

**2.2 Development**

```bash
$ cd <dir>
$ navify serve
```

Browser will open automatically `http://localhost:8520`

**2.3 `index.html` Configuration**

```html
<script>
  window.Navify = {
    el: '#app',
    json: './nav.json',
    title: {
      alias: 'FE',
      full: 'Web FE checklist',
      en: 'FE',
    },
    author: {
      name: 'Cong Min',
      link: 'https://congm.in',
    },
    github: 'https://github.com/whelmin/navify',
    // Customized icon
    // key is the icon, value is the icon url
    icon: {
      'share': 'https://.../share.png',
    },
    favicon: 'https://www.google.cn/s2/favicons?domain=',
    // favicon: 'https://api.byi.pw/favicon/?url='
  };
</script>
```

| name | type | description | default |
|:----:|:----------:|:---------|:----|
| **el** | `String` | **the mounted element** | `'#app'` |
| **json** | `String` | **json source** local relative path or network link | `'./nav.json'` |
| **title** | `String/Object` | **site info** |
| **author** | `String/Object` | **author info** | `null` |
| **github** | `String` | **Github link** After setting, the Github logo will appear in the upper right corner of the page. | `null` |
| **icon** | `Object` | **customized icon** | `{}` |
| **favicon** | `String` | **favicon** `'https://api.byi.pw/favicon/?url='` or `'https://www.google.cn/s2/favicons?domain='` |

**2.4 `nav.json`**

You should follow the below rules and formats to add, delete, and modify the json source.

```js
// nav.json
// List - category
[
  {
    "heading": "category title",
    "info": "category info",
    "content": [
      ...
    ]
  },
  {
    ...
  }
]
```

```js
// List[n].content
// Group - group
[
  {
    "title": "group title",
    "info": "group info",
    "item": [
      ...
    ]
  }
]
```

```js
// Group[m].item
// Item - item
[
  {
    "name": "item title",
    "info": "item info",
    "link": {
      "home": "item website links",
      "github": "item github links"
    }
  }
]
```

the complete example:

```json
[
  {
    "heading": "category 1",
    "content": [
      {
        "item": [
          {
            "name": "item name 2",
            "info": "item info 2",
            "link": {
              "home": "item website links 2",
              "github": "item github links 2",
            }
          }
        ]
      }
    ]
  },
  {
    "title": "group 1",
    "item": [
      {
        "name": "item name 1",
        "link": {
          "home": "item website links 1"
        }
      }
    ]
  }
]
```

### 3. **Deployment**

**3.1 Web server**

set `<dir>` folder in Web server or use `Github Pages` to deploy.

**3.2 Github Pages**

There're three places to deploy navify website for your Github repository:

* `docs/` folder

* `master` branch

* `gh-pages` branch

in your Github repository' `settings page`, choose the `master branch` and save, and you can bind a custom domain name with `CNAME` .

![GitHub Pages Screenshot](https://user-images.githubusercontent.com/13345272/46583007-727aa680-ca82-11e8-8548-ec6defbfb04b.png)
---

## About

### Contributors

[@ whelmin](https://whelm.in) & [@ Cong Min](https://congm.in)

### License

[MIT License](https://github.com/whelmin/navify/blob/master/LICENSE)
