import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'OpenccLint',
  description: '繁简体转换工具',
  themeConfig: {
    logo: '/logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '指南', link: '/guide/intro' },
      { text: '编辑器插件', link: '/extensions/vscode' },
    ],
    sidebar: [
      {
        text: '简介',
        base: '/guide/',
        items: [
          { text: '什么是 OpenccLint', link: '/intro' },
          { text: '快速开始', link: '/quickstart' },
          { text: '配置', link: '/config' },
          { text: 'CLI', link: '/cli' },
          { text: '禁用规则', link: '/ignore' },
          { text: '贡献指南', link: '/contribute' },
        ],
      },
      {
        text: '插件',
        base: '/extensions/',
        items: [
          { text: 'VSCode', link: '/vscode' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hddhyq/opencclint' },
    ],
    footer: {
      message: '',
      copyright: 'Copyright © 2024-present brokenbonesdd',
    },
    search: {
      provider: 'local',
    },
  },
})
