module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'airbnb-base',
        'plugin:vue/essential'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
