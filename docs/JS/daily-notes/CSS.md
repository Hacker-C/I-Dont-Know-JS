# CSS 日常随记

## 1. letter-spacing 与 word-spacing

`letter-spacing` 用于控制字母之间的间距。
```css
/** 值可以为关键字 */
letter-spacing: normal;
/** 值可以为长度值 */
letter-spacing: 0.5em;
```

`word-spacing` 用于控制单词之间的间距。
```css
word-spacing: normal;
word-spacing: 0.5em;
```

## 2. 修改滚动条样式

滚动条的样式可以通过伪元素 `::-webkit-scrollbar` 来修改，将整个滚动条大致分为：
- 轨道（track）
- 滑块（thumb）

```
::-webkit-scrollbar — 整个滚动条.
::-webkit-scrollbar-button — 滚动条上的按钮 (上下箭头).
::-webkit-scrollbar-thumb — 滚动条上的滚动滑块.
::-webkit-scrollbar-track — 滚动条轨道.
::-webkit-scrollbar-track-piece — 滚动条没有滑块的轨道部分.
::-webkit-scrollbar-corner — 当同时有垂直滚动条和水平滚动条时交汇的部分.
```

举例：
```css
/** 使某一区域显现滚动条 */
.scrollbar {
  overflow-x: scroll; /* 横向滚动条 */
  overflow-y: hidden; /* 纵向滚动条 */
}

/** 整个滚动条样式 */
.scrollbar::-webkit-scrollbar {
  width: 6px; /* 纵向滚动条的宽度 */
  height: 6px; /* 横向滚动条的高度 */
}

/** 轨道样式 */
.scrollbar::-webkit-scrollbar-track {
  background: #56585d;
}

/** 滑块样式 */
.scrollbar::-webkit-scrollbar-thumb {
  background: gray;
  border-radius: 7px;
  border: 2px solid #56585d;
}

.scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9f9f9f;
}
```

## 3. aspect-ratio 维持宽高比

`aspect-ratio` 属性用于维持元素的宽高比，其值为 `width/height`，如 `aspect-ratio: 16/9`。
```css
/** 以 16:9 的宽高比显示 */
.aspect-ratio {
  width: 100%;
  aspect-ratio: 16/9;
}
```

在此之前，我们可以通过 `padding-top` 来实现。（Padding-Top Hack）
```css
.container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}
```
