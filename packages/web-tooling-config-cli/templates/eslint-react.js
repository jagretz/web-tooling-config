module.exports = {
    extends: [
        "@dominos-pulse/eslint-config-base",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended"
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    },
    settings: {
        react: {
            version: "detect"
        }
    },
    rules: {
        "react/jsx-filename-extension": ["error", { extensions: [".js"] }]
    }
};
