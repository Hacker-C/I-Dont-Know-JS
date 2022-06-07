const { defaultTheme } = require('@vuepress/theme-default')
const { rightAnchorPlugin } = require('vuepress-plugin-right-anchor')

module.exports = {
  lang: 'zh-CN',
  title: "I Don't Know JavaScript",
  description: '我不知道的 JS',
  theme: defaultTheme({
    sidebarDepth: 2,
    sidebar: {
      '/JS/': [
        {
          text: '🌈 奇技淫巧',
          collapsible: true,
          children: [
            { text: '01. == 与 === 问题', link: '/JS/uncanny-tricks/ch01' },
            { text: '02. foo[1][2][3]', link: '/JS/uncanny-tricks/ch02' },
            { text: '03. “数组” 负数取值', link: '/JS/uncanny-tricks/ch03' },
            { text: '04. (1).add(2).add(3)', link: '/JS/uncanny-tricks/ch04' },
            { text: '05. 我真不会 parseInt', link: '/JS/uncanny-tricks/ch05' },
            { text: '06. name 的长度是多少', link: '/JS/uncanny-tricks/ch06' },
            { text: '07. 快速产生连续字符序列', link: '/JS/uncanny-tricks/ch07' },
            { text: ' 08. [...10]', link: '/JS/uncanny-tricks/ch08' }
          ]
        },
        {
          text: '🚩 查漏补缺',
          collapsible: true,
          children: [
            { text: '01. 标签函数与模板字符串', link: '/JS/check-for-gaps/ch01' },
            { text: '02. 只执行一次的函数', link: '/JS/check-for-gaps/ch02' },
            { text: '03. Node.contains()', link: '/JS/check-for-gaps/ch03' },
            { text: '04. 事件总线 EventBus', link: '/JS/check-for-gaps/ch04' },
            { text: '05. AOP 在 JS 中的实现', link: '/JS/check-for-gaps/ch05' },
            { text: '06. void 运算符', link: '/JS/check-for-gaps/ch06' }
          ]
        },
        {
          text: '🚚 代码模板',
          collapsible: true,
          children: []
        }
      ]
    },
    navbar: [
      {
        text: '首页',
        link: '/'
      },
      {
        text: '关于我',
        link: 'https://mphy.top/'
      },
      {
        text: 'GitHub',
        link: 'https://github.com/Hacker-C/I-Dont-Know-JS'
      },
      {
        text: '更多',
        children: [
          {
            text: 'My Notes',
            link: 'https://docs.mphy.top/'
          },
          {
            text: 'My Blog',
            link: 'https://blog.mphy.top/'
          }
        ]
      }
    ]
  }),
  plugins: [
    rightAnchorPlugin({
      customClass: 'customClass',
      showDepth: 2,
      ignore: ['/'],
      expand: {
        trigger: 'click',
        clickModeDefaultOpen: true
      }
    })
  ]
}
