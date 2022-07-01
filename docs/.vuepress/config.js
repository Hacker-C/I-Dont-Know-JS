const { defaultTheme } = require('@vuepress/theme-default')
const { rightAnchorPlugin } = require('vuepress-plugin-right-anchor')
const sidebar = require('./sidebar')
const { registerComponentsPlugin } = require('@vuepress/plugin-register-components')
const { path } = require('@vuepress/utils')

module.exports = {
  lang: 'zh-CN',
  title: "I Don't Know JavaScript",
  description: '我不知道的 JS',
  theme: defaultTheme({
    sidebarDepth: 2,
    sidebar,
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
    }),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components')
    })
  ]
}
