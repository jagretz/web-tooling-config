/**
 * All formatting rRule should be managed by prettier. We turn off multiple eslint rules
 * in order to remove conflicts with prettier rules.
 */
module.exports = {
    extends: ["../eslint-config-base/index.js"],
    rules: {
        // Used in a node app, the console output is intended for the end-user.
        "no-console": 0
    }
};
