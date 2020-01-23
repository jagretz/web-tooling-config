module.exports = {
    /*
    Reading comprehension and speed may be enhanced by limiting line length.
    Descriptive variable names provide enhanced understanding but can sometimes
    be long. Setting the printWidth to 100 (20 chars beyond the prettier default of 80 chars)
    helps limit the line length and also gives a tad more space for descriptive variable
    names and documentation.
    */
    printWidth: 100,
    // 4-space tab length has been said to improve readability and
    // limit mistakes when tracking the beginning and end of a code block.
    tabWidth: 4,
    overrides: [
        /*
         A slight variation to retain the prettier default settings for markdown.
         The variation is added since markdown is more typically intended solely
         for the purpose of documentation, and thus reading.
         */
        {
            files: "*.{md,mdx}",
            options: {
                printWidth: 80,
                tabWidth: 2,
                proseWrap: "always"
            }
        }
    ]
};
