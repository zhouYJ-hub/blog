import { defineConfig } from 'vitepress'

import { head, nav, sidebar } from './configs'

export default defineConfig({
  outDir: '../dist',
  base:'/',
  lang: 'zh-CN',
  title: '小周',
  description: '前端知识体系',
  head,

  lastUpdated: true,
  cleanUrls: true,

  /* markdown 配置 */
  markdown: {
    lineNumbers: true
  },

  /* 主题配置 */
  themeConfig: {
    i18nRouting: false,

    logo: '/logo.png',

    nav,
    sidebar,
    /* 右侧大纲配置 */
    outline: {
      level: 'deep',
      label: '本页目录'
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/xxzhub' }],

    darkModeSwitchLabel: '外观',
    returnToTopLabel: '返回顶部',
    lastUpdatedText: '上次更新',

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    footer: {
      message: `<a href='https://beian.miit.gov.cn'>蜀ICP备2023036538号-1</a>`,
      copyright: ''
    }
  }
})
