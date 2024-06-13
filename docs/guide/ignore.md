# OpenccLint 禁用规则

`OpenccLint` 提供了灵活的注释指令，允许用户在代码中指定忽略特定文本的转换。这些指令可以应用于整个文件、特定行或代码段，从而避免不必要的转换错误或干扰。

## 忽略整行

要忽略整行的转换，可在该行末尾添加 `opencclint-disable-line` 注释：

```js
console.log('测试') // opencclint-disable-line
```

## 忽略代码段

如果希望忽略一个代码段的转换，可以在段的开始添加 `opencclint-disable` 注释，并在结束处添加 `opencclint-enable` 注释：

```js
// opencclint-disable
console.log('测试')
// opencclint-enable
```

## 忽略下一行

要忽略紧接着的下一行代码，可在其前一行添加 `opencclint-disable-next-line` 注释：

```js
// opencclint-disable-next-line
console.log('测试')
```

## 忽略整个文件

若需要忽略整个文件的转换，可在**文件的顶部**添加 opencclint-disable 注释：

```js
// opencclint-disable
```

这些忽略指令提供了对 `OpenccLint` 转换过程的细粒度控制，帮助开发者保持代码的原始意图和功能性。
