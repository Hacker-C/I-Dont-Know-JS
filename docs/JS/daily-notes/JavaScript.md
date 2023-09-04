# JS 日常开发记录

## 1. JS 控制滚动条在最底部/最右侧

整个页面滚动条在最底部：
```js
window.scrollTop = document.body.scrollHeight;
// window.scrollTo(0, document.body.scrollHeight);
```

某个元素滚动条到最底部/最右侧：
```js
const el = document.querySelector('#element')

// 对于垂直滚动条
el.scrollTop = div.scrollHeight;
// el.scrollTo(0, div.scrollHeight);

// 对于水平滚动条
el.scrollLeft = el.scrollWidth
// el.scrollTo(el.scrollWidth, 0)
```

JSX 示例：
```jsx
<div
  ref={(el) => {
    if (el) {
      el.scrollLeft = el.scrollWidth
      // el.scrollTo(el.scrollWidth, 0)
    }
  }}
>{input}</div>
```
