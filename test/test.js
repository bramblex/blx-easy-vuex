
const BLXEasyVuex = require('../dist/blx-easy-vuex.umd')

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

const new_store_config = BLXEasyVuex.extend(store_config)

console.log(new_store_config)
