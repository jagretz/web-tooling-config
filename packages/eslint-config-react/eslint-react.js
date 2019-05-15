module.exports = {
    extends: ["plugin:react/recommended", "plugin:jsx-a11y/recommended", "prettier/react"],
    plugins: ["react", "jsx-a11y", "react-hooks"],
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
        "react/jsx-filename-extension": ["error", { extensions: [".js"] }],
        "react-hooks/rules-of-hooks": "error"
    }
};
