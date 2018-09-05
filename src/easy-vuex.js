
import { mapState, mapMutations } from 'vuex'

function extend(store) {

    // 递归 extend 每个模块
    const modules = {}
    for (const [name, module] of Object.entries(store.modules || {})) {
        modules[name] = extend(module, false)
    }

    return {
        ...store,

        // 强制全部加上 namespace
        namespaced: true,

        // 添加默认 Mutation
        mutations: {
            EASY_VUEX_MODIFY(state, { name, value }) {
                state[name] = value
            },
            ...store.mutations
        },

        modules
    }
}

function beforeCreate() {

    const easyMapState = this.$options.easyMapState

    // 获取配置
    let fields
    if (!easyMapState) {
        return
    } else if (Array.isArray(easyMapState)) {
        fields = easyMapState.map((path) => {
            const name = path.split('/').pop()
            return [name, path]
        })
    } else {
        fields = Object.entries(easyMapState || {})
    }

    if (!this.$options.computed) this.$options.computed = {}

    // 循环创建双向绑定
    for (const [alias, path] of fields) {
        const _path = path.split('/')
        const name = _path.pop()
        const namespace = _path.join('/') || null

        // 获取 getter 和 setter 函数
        const getter = namespace
            ? mapState(namespace, { '_temp': name })['_temp']
            : mapState({ '_temp': name })['_temp']

        const modify = namespace
            ? mapMutations(namespace, { '_temp': 'EASY_VUEX_MODIFY' })['_temp']
            : mapMutations({ '_temp': 'EASY_VUEX_MODIFY' })['_temp']

        // 创建 computed
        this.$options.computed[alias] = {
            get: getter,
            set: function (value) { return modify.apply(this, [{ name, value }]) }
        }

    }

}

function install(Vue) { Vue.mixin({ beforeCreate }) }

export default { install, extend }