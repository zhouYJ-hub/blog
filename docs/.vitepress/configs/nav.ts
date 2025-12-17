import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  {
    text:'首页',link:'/'
  },
  {
    text: '框架',
    items: [
      { text: 'Vue', link: '/views/frame/Vue/index' },
      { text: 'React', link: '/views/frame/React/index' }
    ]
  },
  {
    text: 'JS知识', link: '/views/JS/从ECMAScript规范解读this',
  },
  {
    text: 'TS', link: '/views/TS/介绍.md',
  },
  {
    text: 'HTML', link: '/views/HTML/index'
  },
  {
    text: 'CSS', link: '/views/Css/index'
  },
  {
    text: 'H5', link: '/views/H5/index'
  },
  {
    text: '浏览器', link: '/views/browser/index'
  },
  {
    text: '前端工程化', 
    items: [
      { text: 'git', link: '/views/project/git/index' },
      { text: '工具', link: '/views/project/index' }
    ]
  },
  {
    text: '面试', link: '/views/innerView/index'
  },
  {
    text: '总结', link: '/views/summary/index'
  }
]
