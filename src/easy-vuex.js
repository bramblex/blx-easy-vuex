
import { mapState, mapActions } from 'vuex'

function extend(store, is_root = false) {

    // 递归 extend 每个模块
    const modules = {}
    for (const [name, module] of Object.entries(store.modules || {})) {
        modules[name] = EasyStore.extend(module, false)
    }

    return {
        ...store,

        // 强制全部加上 namespace
        namespace: is_root ? false : true,

        // 添加默认 Mutation
        mutations: {
            EASY_VUEX_MODIFY(state, { name, value }) {
                state[name] = value
            },
            ...store.mutations
        },

        // 添加默认 Action
        actions: {
            easyVuexModify(context, payload) {
                context.commit('EASY_VUEX_MODIFY', payload)
            },
            ...store.actions
        },

        modules
    }
}

function beforeCreate() {

    const easy_vuex = this.$options.easy_vuex

    // 获取配置
    let fields
    if (!easy_vuex) {
        return
    } else if (Array.isArray(easy_vuex)) {
        fields = easy_vuex.map((path) => {
            const name = path.split('/').pop()
            return [name, path]
        })
    } else {
        fields = Object.entries(easy_vuex || {})
    }

    if (!this.$options.computed) this.$options.computed = {}

    // 循环创建双向绑定
    for (const [alias, path] of fields) {
        const _path = path.split('/')
        const name = _path.pop()
        const namespace = _path.join('/') || null

        // 获取 getter 和 setter 函数
        let getter
        if (namespace) {
            getter = mapState(namespace, { '_temp': name })['_temp']
            modify = mapActions(namespace, { '_temp': 'easyVuexModify' })['_temp']
        }

        // 创建 computed
        this.$options.computed[alias] = {
            get: getter,
            set: function (value) { return modify.apply(this, { name, value }) }
        }

    }

}

function install(Vue) { Vue.mixin({ beforeCreate }) }

export default { install, extend }