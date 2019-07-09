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
        "class-methods-use-this": [
            "error",
            {
                /* Adds exceptions for react life-cycle hooks */
                exceptMethods: [
                    "render",
                    "componentDidMount",
                    "componentWillUnmount",
                    "shouldComponentUpdate",
                    "componentDidUpdate"
                    /* react deprecated methods -- They are mentioned here for documenting legacy-support */
                    // "getInitialState",
                    // "getDefaultProps",
                    // "componentWillMount",
                    // "componentWillReceiveProps",
                    // "componentWillUpdate"
                ]
            }
        ],
        "react/jsx-filename-extension": ["error", { extensions: [".js"] }],
        "react-hooks/rules-of-hooks": "error"
    }
};
