module.exports = {
    extends: ["stylelint-scss", "stylelint-config-recommended-scss"],
    rules: {
        indentation: 4,
        "string-quotes": "double",
        "at-rule-no-unknown": null,
        "comment-empty-line-before": null,
        "comment-whitespace-inside": null,
        "no-missing-end-of-source-newline": null,
        "no-eol-whitespace": [
            true,
            {
                ignore: ["empty-lines"]
            }
        ],
        "rule-empty-line-before": [
            "always",
            {
                except: ["first-nested"],
                ignore: ["after-comment"]
            }
        ],
        /* declaration */
        "declaration-no-important": true,
        "declaration-empty-line-before": "never",
        "declaration-block-no-duplicate-properties": [
            true,
            {
                ignore: ["consecutive-duplicates-with-different-values"]
            }
        ],
        "declaration-block-no-redundant-longhand-properties": [
            true,
            {
                ignoreShorthands: ["grid", "/template/"]
            }
        ],
        /* selectors */
        "selector-list-comma-newline-after": "always",
        "selector-max-id": 1,
        "selector-no-qualifying-type": [
            true,
            {
                ignore: ["attribute"]
            }
        ],
        "selector-pseudo-element-colon-notation": "double",
        /* miscellaneous */
        "font-family-name-quotes": "always-where-recommended",
        "function-url-quotes": "always",
        "shorthand-property-no-redundant-values": true,
        /*
        Begin scss-specific configuration settings
        */
        "scss/at-rule-no-unknown": true
    }
};
