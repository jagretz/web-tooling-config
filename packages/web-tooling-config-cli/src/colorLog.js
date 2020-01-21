/**
 * @module colorLog
 *
 * @description adds some style to your consoles log statements!
 */

const chalk = require("chalk");
const path = require("path");

/**
 * Delegates to the `console.log` after formatting and colorizing the message.
 *
 * @param {func} colorizer - a color method on `chalk`. ie `chalk.red`
 * @returns {Function} that accepts areguments to delegate to {@link console.log}
 */
const log = colorizer => (...rest) =>
    console.log(
        chalk.gray("web-configs |"),
        ...rest
            /**
             * @param {string} message the message to colorize
             * @returns {string} formatted message
             */
            .map(message =>
                typeof message === "string" && path.isAbsolute(message)
                    ? chalk.green(path.basename(message))
                    : colorizer(message)
            )
    );

module.exports = {
    log: log(chalk.white),
    error: log(chalk.red),
    success: log(chalk.green),
    warn: log(chalk.yellow)
};
