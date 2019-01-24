const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
// https://nodejs.org/api/child_process.html#child_process_child_process
const { exec, spawn } = require("child_process");

const cwd = process.cwd();

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);
const execCmd = promisify(exec);

// testing async/await with promisify

async function callStat() {
    const stats = await stat('.');
    console.log(`This directory is owned by ${stats.uid}`);
}

callStat()

// todo
/*
- Ensure a clean git directory. This will be used as a "backup".
- read in files from dev dependencies
    - try just reading in a single file for now
    - ignore non-essential deps
- copy files into repository (install dir)

Other
- ensure it runs on windows
- handle errors
- prompt user before install
*/

