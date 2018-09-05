
const babel = require('rollup-plugin-babel')

export default {
    input: 'src/easy-vuex.js',
    output: {
        file: 'dist/easy-vuex.umd.js',
        name: 'EasyVuex',
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