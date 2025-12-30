import type { DefaultTheme } from 'vitepress'
import TsRouter from "../router/TS"
import ProjectRouter from "../router/project"
import BrowserRouter from "../router/browser"
export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/views/JS/': [
    {
      text: 'JS执行上下文',
      items: [
        { text: '从ECMAScript规范解读this', link: '/views/JS/从ECMAScript规范解读this' },
      ]
    }
  ],
  '/views/TS/': TsRouter,
  '/views/project/': ProjectRouter,
  '/views/browser/':BrowserRouter
}
