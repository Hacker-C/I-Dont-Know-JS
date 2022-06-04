const { defaultTheme } = require('@vuepress/theme-default')

module.exports = {
  lang: 'zh-CN',
  title: "I Don't Know JavaScript",
  description: '我不知道的 JS',
  theme: defaultTheme({
    sidebarDepth: 1,
    sidebar: [
      '/JS/JavaScript',
      {
        text: '🦚 CSS',
        link: '/CSS/CSS'
      },
      {
        sidebarDepth: 1,
        text: '🐣 HTML',
        link: '/HTML/HTML'
      }
    ],
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
  })
}
