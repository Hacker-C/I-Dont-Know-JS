import sidebar from './sidebar'

export default {
  title: "I Don't Know JS",
  description: 'Just playing around.',
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
      copyright:
        'Copyright &copy; MurphyChen 2022 | <a href="https://beian.miit.gov.cn/" target="_blank" style="color:var(--t-color);">湘ICP备 2022004296号</a>'
    },
    nav: [
      { text: '介绍', link: '/JS/intro' },
      { text: '关于我', link: 'https://mphy.top' },
      { text: 'Github', link: 'https://github.com/Hacker-C/I-Dont-Know-JS' }
    ],
    sidebar
  }
}
