module.exports = {
    extends: [
        "@jagretz/eslint-config-base",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended"
    ],
    rules: {
        "react/jsx-filename-extension": ["error", { extensions: [".js"] }]
    }
};
