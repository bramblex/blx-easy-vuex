
const babel = require('rollup-plugin-babel')

export default {
    input: 'src/blx-easy-vuex.js',
    output: {
        file: 'dist/blx-easy-vuex.umd.js',
        name: 'BLXEasyVuex',
        format: 'umd',
        globals: {
            vuex: 'Vuex',
        },
        external: [ 'vuex' ]
    },
    plugins: [
        babel(),
    ]
}