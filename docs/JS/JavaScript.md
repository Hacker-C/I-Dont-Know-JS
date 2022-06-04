<!-- ---
sidebar: auto
--- -->

# 🦅 我不知道的 JavaScript
::: tip
有一些还未公布答案，可以自己思考。
:::

## 01. 标签函数与模板字符串

观察下面代码，你觉得会输出什么？

```js
function test(x) {
  console.log(x)
}

test `hello`
```

事实是，这里会打印出一个数组 `['hello']`。没错，**模板字符串还支持在前面添加一个函数标签，这个函数标签就是一个函数的函数名。**

:::tip
MDN: 如果一个模板字符串由表达式开头，则该字符串被称为带标签的模板字符串，该表达式通常是一个函数，它会在模板字符串处理后被调用，在输出最终结果前，你都可以通过该函数来对模板字符串进行操作处理。
:::

### 定义

**标签函数**：模板字符串在 JS 底层中会被一个默认函数处理，也就是把接收的字符串和参数拼接起来。我们可以自定义该函数，**在模板字符串前面添加一个函数标签（函数名），覆盖 JS 默认的函数处理，就能够手动处理模板字符串了**。
```js
tagFunction `string text ${expression} string text`
```

### 参数获取

模板字符串中的字符和插入的 `${}` 中的参数都可以在 `arguments` 中获取或者定义形参获取。

示例1：使用 `arguments` 获取

```js
let user = {
  name: 'Murphy',
  age: 20
}

function greet() {
  console.log(arguments[0])
  // ["I'm ", ". I'm ", " years old."]
  console.log(arguments[1])
  // Murphy
  console.log(arguments[2])
  // 20
}

greet `I'm ${user.name}. I'm ${user.age} years old.`
```

示例2：使用标签函数的形参获取
```js
let user = {
  name: 'Murphy',
  age: 20
}

function greet(strs, name, age) {
  console.log(strs[0] + name + strs[1] + age + strs[[2]])
  // I'm Murphy. I'm 20 years old.
}

greet`I'm ${user.name}. I'm ${user.age} years old.`
```

### 结合柯里化：标签函数返回标签函数

```js
const tagFunc = (...arg1) => (...arg2) => (...arg3) => arg1 + arg2 + arg3

let res = tagFunc `hello` `world` `123`

console.log(res) // helloworld123
```

解释：`tagFunc` 接收一个模板字符串参数，仍然返回一个标签函数，就可以继续接收模板字符串参数，所以可以连续接收三个模板字符串。

### 标签函数的应用场景

问题来了，讲了这么多，标签函数有啥用？

React 的 styled-components 就是利用标签函数给 UI 设置样式的：[styled-components](https://styled-components.com/)
```js
const Button = styled.a`
  ${props => props.primary && css`
    background: white;
    color: black;
  `}
`
```

## 02. 只执行一次的函数

定义一个 `once` 方法，该函数方法只执行一次，具体要求和描述如下：
```js
// 定义一个函数方法，满足下面要求
function f(x) {
  console.log(x)
  return x * 2
}

const fOnce = f.once() // 你要定义的 once 方法
let ans1 = fOnce(3) // 打印 3，返回结果为 6
let ans2 = fOnce(2) // 什么都不打印，返回 6
let ans3 = fOnce(1) // 什么都不打印，返回 6
console.log(ans1, ans2, ans3) // 6 6 6

let ans4 = f(10) // 打印 10，返回 20
console.log(ans4) // 打印 20
```

这个 `once()` 函数方法就是在原函数基础上，创建一个新函数（闭包），这个新函数只会执行一次。而且后续继续执行会返回第一次执行时的结果（需要缓存结果）。而且对原函数不造成影响。

看到 `f.once()`，就知道是要在构造函数对象原型上定义 `once` 方法，也就是标题所述定义一个  `Function.prototype.once()`。

该方法返回一个新的函数 `fOnce`，说明要在方法内部 `return function() {}`，这很难不让我们想到要使用 **闭包**。回忆下红宝书中对于闭包的定义：

::: tip
闭包指的是那些引用了另一个函数作用域中变量的函数，通常是在嵌套函数中实现的。——《JS高程》
:::

执行了一次 `fOnce(3)` 后，对此函数的后续调用都返回的是第一次调用的结果，这说明我们要 **对结果进行缓存**。
```js
fOnce(3) // 6
fOnce(2) // 6
fOnce(1) // 6
```

然后就是传参，内部函数执行需要传参我们可以使用 `fn.apply(null, ...arguments)` 的形式。

有了整体的思路，现在我们来看一下代码：
```js
Function.prototype.once = function () {
  let ans = null // ans缓存结果，同时判断该函数是否执行过
  let that = this // that保存原函数中的this，避免this丢失，this指向原函数
  // 返回一个函数闭包
  return function () {
    // 闭包特性，内部可以访问到外部的ans和that
    if (ans) return ans // 根据ans判断函数是否首次次调用；后续调用，直接返回缓存结果
    let res = that.call(that, ...arguments) // 执行原函数，同时传入参数，缓存返回结果res，以赋值给ans
    ans = res // ans被赋值，于是对于后续调用，函数都会直接 return ans
    return ans // 第一次调用，返回结果
  }
}
```

## 03. == 与 === 问题
### 1. x == 1 && x == 2 && x == 3

如何定义 `x`，使得下列代码的 `Hello World` 成功输出？
```js
if (x == 1 && x == 2 && x == 3) {
  console.log('Hello World')
}
```

这个是经典问题了，这里给出一种方法实例，其他方法的思想都和下面这种方法差不多。这里利用了 `==` 在对象与其他类型比较会触发 **隐式转换** 的原理，重写 `toString` 或者 `valueOf` 方法。

```js
let x = {
  value: 1,
  toString() {
    return this.value++
  }
}
```

::: tip
如果你还不了解 == 的比较原理，请移步 MDN 文档：[MDN ==](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Equality#%E6%8F%8F%E8%BF%B0)
:::

如果你对其他解法感兴趣，请移步我的掘金：[a==1 && a==2 && a==3 的三种解法](https://juejin.cn/post/7087507873189593102)
### 2. x !== x

如何定义 `x`，使得下列代码的 `Hello World` 成功输出？
```js
if (x !== x) {
  console.log('Hello World')
}
```

#### 解法1

相信大家都想出了 `x = NaN` 这个方法，因为 `NaN` 和任何值使用 `===` 比较，返回的都是 `false`，因此 `NaN !=== NaN` 返回 `true`。

#### 解法2

我们知道 `===` 不会触发隐式转换，那么就必须劫持【获取 `x` 的值】这个行为，因为比较的过程中就是 **获取值**，然后进行比较，自然而然就想到了 `getter`。这里的 `x` 是在全局环境下直接获取然后比较的（不是 `obj.x === obj.x` 这种），那我们就能想到劫持全局环境下的属性，全局环境是指：
- 浏览器中：`window`
- 浏览器中：`global 对象`

一切尽在代码之中：
```js
function getGlobal() {
  return this
}

Reflect.defineProperty(getGlobal(), 'x', {
  get() {
    return Math.random() // 每次获取 x 都返回一个随机值
  }
})

if (x !== x) {
  console.log('Hello World')
}
```

### 3. x === x + 1

如何定义 `x`，使得下列代码的 `Hello World` 成功输出？
```js
if (x === x + 1) {
  console.log('Hello World')
}
```

这道题和上一道异曲同工，第二次获取令其减一即可。
```js
function getGlobal() {
  return this
}
let y = 0
Reflect.defineProperty(getGlobal(), 'x', {
  get() {
    return y--
  }
})

if (x === x + 1) {
  console.log('Hello World')
}
```

### 4. x === 1 && x === 2 && x === 3

如何定义 `x`，使得下列代码的 `Hello World` 成功输出？
```js
if (x === 1 && x === 2 && x === 3) {
  console.log('Hello World')
}
```

同样的，劫持全局环境下的 `x`。

```js
function getGlobal() {
  return this
}
let y = 1
Reflect.defineProperty(getGlobal(), 'x', {
  get() {
    return y++
  }
})

if (x === 1 && x === 2 && x === 3) {
  console.log('Hello World')
}
```

## 04. foo[1][2][3]

如何定义 `foo`，使得以下等式成立？
```js
foo[1][2][3] == 6
foo[100][200] == 300
foo[100][200][300] == 600
foo[10][20] == 30
```

这里就要用到 `Proxy`（代理）了，如果你不熟悉代理，请先阅读 MDN 文档之后再来结合代码中的注释阅读代码，代码本身不复杂，关键是一些底层原理。你也可以直接看我的掘金文章：[add(1)(2)(3)你会写了，那么add[1][2][3]呢？](https://juejin.cn/post/7081655211097325599)

```js
// 被代理的目标对象，有一个属性 sum，用来进行累加
const target = { sum: 0 }

// handler 参数，定义一个 get 捕获器
const handler = {
  get(trapTarget, property, receiver) {
    // 原表达式中的 + 操作会触发代理的 toPrimitive 隐式转换 ...(1)
    // 在代理对象中具体以 Symbol.toPrimitive 的形式存在
    if (property === Symbol.toPrimitive) {
      // 最后一次触发的是加法，则返回累加的结果
      // 这里需要暂时储存结果，因为要清空 0，以进行下一次表达式计算 ...(2)
      let temp = trapTarget.sum
      // 清空 sum 属性
      trapTarget.sum = 0
      // Symbol.toPrimitive 是一个对象内部的【函数属性】...(3)
      // 内部需要执行该函数，因此套了一个箭头函数，执行结果是返回累积和
      return () => temp
    }
    // 访问的属性为数字，会被转为字符串，因此要转回数字 ...(4)
    trapTarget.sum += Number(property)
    // 返回代理本身，以进行下一次访问，达到 add[1][2][3] 连续访问的目的
    return receiver
  }
}
const add = new Proxy(target, handler)
```

## 05. “数组” 负数取值

重新改造 `arr`，使得 `arr` 能以负数取值，如下所示

```js
let arr = [0, 1, 2, 3, 4]

// your code

arr[-1] // 4
arr[-2] // 3
arr[-3] // 2
arr[0]  // 0
arr[1]  // 1
```

相信思路大家都是这样：访问负数索引的时候，将其转换为正向应该访问的正索引。  

对于 `arr[x]`
- `x` 为正：正常返回 `arr[x]`
- `x` 为负：返回 `arr[arr.length + x]`

我们不能直接修改数组的 `getter`，也就是说使用 `Object.defineProperty` 无法实现，因为 `getter` 不支持传参（这里访问的数组的索引就是参数）。

**我们知道，数据劫持有两个方法，除了上面这个 `defineProperty`，剩下的就是 Vue3 使用的 `Proxy` 代理。**

代码实现：
```js
let arr = [0, 1, 2, 3, 4]

arr = new Proxy(arr, {
  get(target, property) {
    if (property < 0) {
      // 传入的 property 为数字字符串，需要强转
      return target[target.length + Number(property)]
    }
    return target[property]
  }
})

arr[-1] // 4
arr[-2] // 3
arr[-3] // 2
arr[0]  // 0
arr[1]  // 1
```

## 06. (1).add(2).add(3)

如何使得以下代码成功返回正确结果？
```js
(1).add(2).add(3)     // 6
(10).add(20).sub(30)  // 0
(10).sub(2).sub(3)    // 5
```

观察表达式的形式，支持直接在数字上使用 `add` 方法，所以想到修改数字的原型，也就是在 `Number.prototype` 上添加 `add` 和 `sub` 方法 。

代码实现：
```js
Number.prototype.add = function (x) {
  return this + x
}
Number.prototype.sub = function (x) {
  return this - x
}
```

## 07. 我真不会 parseInt 啊

### 场景1

一个简单的需求，要求对一个浮点数进行取整操作，你可能会立马想到以下代码：
```js
parseInt(x) // x 为浮点数，例如 1.2
```

这个对于大部分情况是没问题的：
```js
parseInt(0.3)       // 0           
parseInt(0.03)      // 0      
parseInt(0.003)     // 0            
parseInt(0.0003)    // 0       
parseInt(0.00003)   // 0      
parseInt(0.000003)  // 0       
```

继续执行 `parseInt(0.0000003)`，这个返回的结果居然是 `3`？

这是因为 `parseInt` 执行的原理：
如果 `parseInt` 接受的第一个参数不是一个字符串，则将其转换为字符串 (使用 ToString 转换)。
需要注意：
- 返回值是从给定的字符串中解析出的一个整数，例如 `'123a'` 返回 `123`。
- 字符串开头的空白符将会被忽略，例如 ` 123` 返回 `123`。

所以 `parseInt(0.0000003)` 的具体转换过程为：
```js
x = 0.0000003
x = 3e-7
x = x.toString() // '3e-7'
x = parseInt('3e-7')
x = 3
```

基于以上分析，MDN 也给出了警告：**因此当对非常大或非常小的数字使用数字时，使用 `parseInt` 截断数字将产生意外结果。`parseInt` 不应替代 `Math.floor()`。**

### 场景2

对数组中所有的浮点数取整，例如 `[1.1, 2.3, 3.5]` 应该返回 `[1, 2, 3]`。

如果你写出了以下代码，运行后，结果是不对的。
```js
let res = [1.1, 2.3, 3.5].map(parseInt)
```
上述代码结果为 `[1, NaN, NaN]`。

`parseInt` 其实接收两个参数，第一个参数为一个待解析的字符串，第二个参数表示该字符串 **基数**。对于 `parseInt(str, radix)`，`str` 是一个基于 `radix` 进制的数字字符串，返回一个该数的十进制形式。例如 `parseInt('111', 2)` 返回 `7`。

分析 `[1.1, 2.3, 3.5].map(parseInt)`，`parseInt` 能够接收两个参数，而 `map` 能够提供两个参数：`map(value, index)`，因此数组中的 `v, k` 就变成参数传递给了 `parseInt`。

`[1.1, 2.3, 3.5].map(parseInt)` 的过程如下所示：
```js
x = [1.1, 2.3, 3.5]
x[0] = parseInt(1.1, 0) // 第二个参数为 0，表示十进制，返回 1
x[1] = parseInt(2.3, 1) // 不存在 1 进制，出错，处理为 NaN
x[2] = parseInt(3.5, 2) // 一个 2 进制的 3，出错，处理为 NaN
x -> [1, NaN, NaN]
```

更多细节，请阅读 MDN 文档：[MDN parseInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)

## 08. name 的长度是多少

在浏览器里面运行下面代码，会打印出多少？

```js
var name = [1, 2, 3]
console.log(name.length)
```

你可以试着复制到控制台执行，可能会超出你的预期，居然打印了 `5` ？！

解析：使用 `var` 在浏览器中定义的 `name` 变量，会和全局 `window` 下的自带属性 `name` 重复定义。也就是说，上面这段代码，尝试把 `[1, 2, 3]` 赋值给 `window.name`，而 `window.name` 只接收字符串类型，所以会调用 `[1, 2, 3].toString()`，返回 `1,2,3`。

具体过程：
```js
name = [1, 2, 3]
name = [1, 2, 3].toString()
name = '1,2,3'
name.length // 5
```

## 09. 快速产生连续字符序列

### 1. 快速产生连续数字序列

现在，有这样一个需求：产生从 `[a, b)` 的逐渐递增的整数序列，例如 `[1, 10)` => `[1, 2, 3, 4, 5, 6, 7, 8, 9]`。

方法1：
```js
const res1 = Array(10).fill('').map((_, i) => i++)
```
方法2：
```js
const res2 = Array.from({length: 10}, (_, i) => i++)
```

:::tip
`Array.from` 接收一个 **类数组或可迭代对象**，然后返回一个新的浅拷贝的数组。

实际上，这个方法可以接收两个参数，第二个参数为一个回调函数 `(v, i) => {}`，用来处理类数组或可迭代对象中的每一个元素后返回该元素。
:::

### 2. 快速产生 26 个字母

```js
const letters = Array.from({length: 26}, (_, i) =>  String.fromCharCode(i + 65))
```

## 10. Node.contains()

### 定义

> MDN link: [MDN Node.contains](https://developer.mozilla.org/en-US/docs/Web/API/Node/contains)

`Node.contains(otherNode)` 返回一个布尔值，判断 `otherNode` 是否为 `Node` 的后代节点。下述三种情况，返回的为 `true`：
- `otherNode` 是 `Node` 本身
- `otherNode` 是 `Node` 的直接子节点
- `otherNode` 是 `Node` 的子节点的所有后续子节点

### 使用场景

1. 知道这个方法起源于一个需求：点击下拉菜单以外的地方，则收起该下拉菜单。需要使用 `Node.contains()` 方法判断是否点击了下拉菜单以外的地方。
2. 双击表格中的单元格，则可以编辑单元格内容，点击外边（类似于 `unblur` 事件）则保存编辑的内容，变为普通表格。也需要这个方法来判断是否点击了该单元格外面。

判断是否点击了某一元素外面，使用 Vue3 + TS 封装的 `useClickOutside.ts` hook 如下：（这里只是一个例子，思想是通用的，参考代码逻辑可以写出其他版本的，例如 React 或者原生 JS。）
```ts
import { ref, onMounted, onUnmounted, Ref } from 'vue'

// 传入一个 Node/HTMLElement 不行，在 setup 中无法监控到，也就失去了响应式。
// 所以传入的参数应该是一个 Ref 的类型
export default function useClickOutside(
  elmentRef: Ref<null | HTMLElement>,
): Ref {
  const isClickOutside = ref(false)
  // 点击回调事件
  const handler = (e: MouseEvent) => {
    /* 核心原理
     * e.target 返回的是当前响应事件的元素
     * 1、dropdown 节点包含 e.target，说明是在下拉菜单里面点的
     * 2、dropdown 节点不含 e.target ，说明在外面点击的，就关闭下拉菜单
     */
    if (elmentRef.value) {
      // 类型不吻合，这里需要 as 断言
      if (!elmentRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = true
      } else {
        isClickOutside.value = false
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  // 最后返回这个 ref<boolean>
  return isClickOutside
}
```

## 11. [...10]

试修改原型，实现以下效果：
```js
console.log( [...10] )
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

本题其实就是要在 `Number` 原型上实现一个扩展运算符，这样就能够实现 `[...num]`，其中 `num` 为整数。

【原理分析】**扩展运算符执行的原理**是：
- 首先看是否有实现可迭代协议规定的方法，也就是 `[Symbol.iterator]` 这个函数（方法）是否存在，若存在，则可以进行扩展；
- 其次，ES2019 对于对象也实现了扩展运算符，但是一般对象并没有可迭代方法，这是ES 规范特殊的扩展运算符的实现。

也就是说，我们要在 `Number` 原型上定义 `[Symbol.iterator]` 可迭代方法。

【代码实现】
```js
Number.prototype[Symbol.iterator] = function () {
  let index = 0
  const arr = Array.from({ length: +this }, (_, i) => i + 1)
  return {
    next: () => {
      if (index < arr.length) {
        return {
          value: arr[index++],
          done: false
        }
      }
      return {
        value: undefined,
        done: true
      }
    }
  }
}
```

:::tip
不熟悉迭代器的朋友可以前往 MDN 学习：[迭代器与生成器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Iterators_and_Generators)
:::

事实上，实现了整数的可迭代性后，整数也具有了可迭代类型的其他特性，比如 `let/const ... of ...`
```js
for (const n of 5) {
  console.log(n)
}
// 打印 1、2、3、4、5
```

一般我们会用生成器和 `yield` 替代迭代器（实际上生成器是一种特殊的迭代器），简化代码。上述例子的另一个方案是：
```js
Number.prototype[Symbol.iterator] = function* () {
  yield* Array.from({ length: +this }, (_, i) => ++i)
}

console.log([...10])
// [1, 2, 3, 4,  5, 6, 7, 8, 9, 10]
```

## 12. 事件总线 EventBus

自定义一个事件总线。

熟悉 vue 的同学一定知道 vue2  使用事件总线来进行非父子关系组件之间的信息共享和传递。所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件，所以组件都可以上下平

实际上，自定义事件总线属于一种 **发布-订阅模式**，其中包括三个角色：
- 发布者（Publisher）：发出事件（Event）
- 订阅者（Subscriber）：订阅事件（Event），并且会进行响应（Handler）
- 事件总线（EventBus）：无论是发布者还是订阅者都是通过事件总线作为中台的

手写一个事件总线，至少实现以下方法：
- 事件的监听方法 `on`
- 事件的发射方法 `emit`
- 事件的取消监听 `off`

**【基本思路】** 订阅者通过 `on` 订阅事件，将相应事件（handler）都添加到事件总线的一个数组中。 发布者通过 `emit` 发射事件，触发事件事件总线中相关的响应事件执行。

**【数据结构】** 不同订阅者的事件不同，监听的每一个事件 `evenName` 都映射了一个事件数组 `handlers`，该数组是多次监听同一个事件的响应事件 `handler` 的集和。

![XU1BfU.png](https://s1.ax1x.com/2022/06/03/XU1BfU.png)


**【代码实现】**
```js
class EventBus {
  constructor() {
    this.eventBus = {}
  }

  // 订阅者订阅事件，将响应事件添加到事件总线中心
  on(eventName, eventCallback, thisArg) {
    const handlers = this.eventBus[eventName]
    if (!handlers) {
      this.eventBus[eventName] = []
    }
    this.eventBus[eventName].push({ eventCallback, thisArg })
  }

  // 发布者发送事件，触发事件中心中的响应事件执行
  emit(eventName, ...payload) {
    const handlers = this.eventBus[eventName]
    if (!handlers) return
    handlers.forEach(handler => {
      handler.eventCallback.apply(handler.thisArg, payload)
    })
  }

  // 取消订阅，取消某一事件的响应事件
  off(eventName, eventCallback) {
    const handlers = this.eventBus[eventName]
    const tempHandlers = [...handlers]
    for (let i = 0; i < tempHandlers.length; i++) {
      if (tempHandlers[i].eventCallback === eventCallback) {
        handlers.splice(i, 1)
        break
      }
    }
  }

  // 清除某一个订阅事件
  clear(eventName) {
    if (!this.eventBus[eventName]) return
    this.eventBus[eventName] = []
  }
}
```

测试：
```js
const eventBus = new EventBus()

// 订阅事件 func
const handler1 = function (x, y) {
  console.log('第 1 次监听到了', this, x, y)
}
eventBus.on('func', handler1, { name: 'murphy' })

// 订阅事件 func
const handler2 = function (x) {
  console.log('第 2 次监听到了', this, x)
}
eventBus.on('func', handler2, { name: 'murphy' })

// 发布事件
eventBus.emit('func', '参数1', '参数2')

// 取消订阅
eventBus.off('func', handler1)
eventBus.emit('func', '参数1', '参数2')

// 清除订阅
eventBus.clear('func')
eventBus.emit('func', '参数1', '参数2')
```

:::tip
- vue2 中实现了事件总线，可以直接使用。
- vue3 为了保持 vue 框架的纯粹性，移除了事件总线，推荐使用 mitt
:::

