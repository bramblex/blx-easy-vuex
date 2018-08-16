
const EasyVuex = require('../dist/easy-vuex.umd')

const store_config = {
    state: { count: 0 },

    mutations: {
        ADD(state) {
            state.count += 1
        }
    },

    actions: {
        add(context) {
            context.commit('ADD')
        }
    }
}

const new_store_config = EasyVuex.extend(store_config)

console.log(new_store_config)
