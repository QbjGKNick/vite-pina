# pinia 的特点

- pinia 它是用来取代 vuex 的。pinia 非常小巧的 支持 vue2 也支持 vue3 ts 类型支持非常好。我们在使用 pinia 之后就不要再写类型
- pinia 就是默认支持多仓库 vuex 典型的是当仓库 $store.state 会导致所有的状态都放在一个 store 里，模块来区分不同的 store
  - store.state.a 产生了一个 a 模块。树状结构不好维护 store.state.a.b.c.xx
  - 默认不采用命名空间的方式来管理 拍平，每个状态都可以是单独的 store（userStore.xxx productStore.xxx）
  - 用起来也很方便，store 之间也可以相互调用
- pinia vuex 中所有的状态 组件 -》（action -》mutation -》）状态。action 这一层的是为什么？或者说和 mutation 有啥区别

  - 组件 -》action （commit(mutation) -》
    commit(mutation) -》
    commit(mutation) -》
    commit(mutation) -》）=> 》（mutation）状态 action 起到的作用核心就是封装

  - 组件 点击按钮 setTimeout -> commit(mutation) -> 状态

- pinia 所有的更改 都只有 action 了 没有 mutation，只有 action 层，没有 mutation 了

- 扁平化 多个 store，没有 mutation 了，支持 ts，小，支持 devtool
- vue2 辅助函数 mapState mapGetters mapActions 都支持

## 实现的功能

- crateOptionStore(内部会拿到用户的选项将他变成 setup 语法) createSetupStore(用户传递的就是 setup 可以直接使用)
- 修改状态 可以通过 .xxx = 新值 action 来修改
- $patch $reset(只支持 options api) $subscribe(监听状态变化 将状态存到本地中) $action(监听用户调用 action 的插件)
