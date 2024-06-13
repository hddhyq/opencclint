---
layout: home

hero:
  name: "OpenccLint"
  text: "繁简体转换工具"
  tagline: 基于 OpenCC 支持编辑器和命令行界面
  image:
    src: /slogan.svg
    alt: OpenccLint
  actions:
    - theme: brand
      text: 什么是 OpenccLint
      link: /guide/intro
    - theme: alt
      text: 快速开始
      link: /guide/quickstart

features:
  - icon: 🖥️
    title: CLI
    details: OpenccLint 提供了 CLI 工具，可以方便地在终端中使用
  - icon: ⚙️
    title: Core
    details: 利用 OpenCC 强大的转换引擎，OpenccLint 提供准确、快速的繁简转换功能，适用于大量文本处理
  - icon: 🧩
    title: Extension
    details: OpenccLint 的 VSCode 插件使得用户可以直接在 VSCode 编辑器中实现繁简文本转换，提升编码效率。
  - icon: 🔗
    title: integration
    details: OpenccLint 提供了多种集成方式，可以方便地在各种项目中使用
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #ed9191 2%, #3a5ccc);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #fff 50%, #ed9191 80%);
  --vp-home-hero-image-filter: blur(44px);
}

html.dark {
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #333 50%, #ed9191 80%);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
