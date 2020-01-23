# Development

A development guide intended for contributors and forks of the project.

The project root includes information for
[versioning and publishing](../../DEVELOPMENT.md) features.

- [Development](#development)
  - [Testing](#testing)
  - [Debugging](#debugging)

## Testing

There is no automated test framework in use at the moment. This is a feature we
hope to add in the future. For now manually testing is the best way to verify
the project works as intended.

There are several approaches to test how this package will run against client
projects once released.

**Test Locally**

If you want to test how the CLI will work before publishing, you can run a local
copy of the cli against any client package. For example, given our client
package `test-project` we can point to a local copy of the `web-tooling-config`
cli.

```bash
# navigate to client project: test-project
cd C:/w/git/test-project
# Run the cli as a local node module
node C:/w/git/web-tooling-config/packages/web-tooling-config-cli/cli
```

**Test Remotely**

If you can publish the package to a either a local running instance or a private
registry, you can also publish snapshot versions (not for production use) and
pull from the registry.

_Ensure your `.npmrc` is pointing to the correct registry._

```bash
cd C:/w/git/test-project
# where <version> is the version of the cli we are testing
npx @jagretz/web-tooling-config-cli@<version>
```

## Debugging

If you are familiar with VS Code's integrated
[debugger](https://code.visualstudio.com/docs/editor/debugging), that is a good
place to start. VSCodes `launch.json` API changes often so these settings
_should not_ be relied upon.

```json
// Tested with VS Code v1.34.0.
{
  "type": "node",
  "request": "launch",
  "name": "Launch Program",
  "program": "${workspaceFolder}\\packages\\web-tooling-config-cli\\cli.js",
  "console": "integratedTerminal"
}
```
