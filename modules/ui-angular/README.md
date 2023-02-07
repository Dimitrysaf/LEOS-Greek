# eUI starter app

## Development server

`npm start` to start the angular project with node-express proxy mock server

`npm run start-proxy` to start the angular project with real backend proxy server deployed

`npm run build` to build, lint and test your project for DEV

`npm run build-prod` to build, lint and test your project for PROD

`npm run build-prod-skip-test` to build and lint your project for PROD - Unit test skipped - to be used on Bamboo plans

`npm run build-prod-stats` to build, lint and test your project for PROD - with stats.json file generated for webpack-bundle-analyzer input

`npm run lint` to check all files for style and linting errors (replace `lint` with `eslint`, `stylelint` or `prettier` for individual tools)

`npm run lint:fix` to fix fixable errors (replace `lint` with `eslint`, `stylelint` or `prettier` for individual tools)

- check package.json for more info on executable scripts provided

## Linting

This project uses tools for source code linting and formatting.

`eslint`: Static analysis and enforcement of **non-stylistic** rules in **scripts**.

- applies to: `*.{ts,html}`
- configuration file: `src/.eslintrc.js`
- lint command: `npm run eslint`
- fix command: `npm run eslint:fix`

`stylelint`: Static analysis and enforcement of **non-stylistic** rules in **stylesheets**.

- applies to: `*.{css,scss}`
- configuration file: `.stylelintrc.js`
- lint command: `npm run stylelint`
- fix command: `npm run stylelint:fix`

`prettier`: Static analysis and enforcement of **stylistic** rules in **all files**.

- applies to: `*.{js,ts,css,scss,html,json,md}`
- configuration file: `.prettierrc.js`
- lint command: `npm run prettier`
- fix command: `npm run prettier:fix`

### `lint-staged`

This project uses [`lint-staged`](https://github.com/okonet/lint-staged) to lint git-staged files only.
It can be run manually with `yarn lint-staged` (or `npx lint-staged`) and its configuration resides in `package.json`.

### Pre-commit hook

This project uses `husky` to lint and try fixing errors before committing to `git`.

- It is automatically set up after running `yarn install` (or `npm install`) - see `scripts.prepare` in `package.json`.
- The actual script for the hook is `.husky/pre-commit`.
- `husky` expects both `package.json` and `.git` to exist in the same parent directory. Since this is not the case, we must account for it in the `prepare` and `pre-commit` scripts mentioned above. For more details see https://scottsauber.com/2021/06/01/using-husky-git-hooks-and-lint-staged-with-nested-folders/.

### Jetbrains IDE Setup

#### ESLint

Open the plugin's settings at _Language & Frameworks > Code Quality Tools > ESLint_ and set

- _Automatic ESLint configuration_: selected
- _Run for files_: `{**/*,*}.{ts,html}`
- _Run eslint --fix on save_: checked

#### Stylelint

Open the plugin's settings at _Language & Frameworks > Style Sheets > Stylelint_ and set

- _Enable_: checked
- _Stylelint package_: `<path_to_project>/modules/ui-angular/node_modules/stylelint`
- _Configuration file_: -empty- (Auto-detect)
- _Run for files_: `{**/*,*}.{css,scss}`

#### Prettier

1. Install the `prettier` plugin
2. Open the plugin's settings at _Language & Frameworks > Javascript > Prettier_, and set

- _Prettier package_: `<path_to_project>/modules/ui-angular/node_modules/prettier`
- _Run for files_: `{**/*,*}.{js,ts,json,css,scss,html,md}`
- _On "Reformat Code" action_: checked
- _On save_: checked

### VSCode Setup

#### Combined

1. Install extensions.
2. Edit VSCode settings at `.vscode/settings.json` and set

```
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "eslint.workingDirectories": ["modules/ui-angular"],
  "stylelint.snippet": ["css", "less", "postcss", "scss"],
  "stylelint.validate": ["css", "less", "postcss", "scss"]
}
```

#### ESLint

1. Install the `dbaeumer.vscode-eslint` extension.
2. Edit VSCode settings (preferably the workspace at `.vscode/settings.json`) and set

```
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
  },
  "eslint.workingDirectories": ["modules/ui-angular"],
```

#### Stylelint

1. Install the `stylelint.vscode-stylelint` extension.
2. Edit VSCode settings (preferably the workspace at `.vscode/settings.json`) and set

```
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true,
  },
  "stylelint.validate": ["css", "less", "postcss", "scss"],
```

#### Prettier

1. Install the `esbenp.prettier-vscode` extension.
2. Edit VSCode settings (preferably the workspace at `.vscode/settings.json`) and set

```
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
```

## Building With Maven

This project is built with Maven.
The `pom.xml` file is located in the root directory of the module.

```shell
mvn clean package [-Dinstance=os] [-Denv=local] [-DskipTests=true]
```

To create a jar file, run `mvn clean package` in the root directory of the
module. The jar will be created in the `target` directory.

Customize the build with these maven properties:
- `skipTests` - skip unit tests and linting (default: `false`)
- `instance` - specify the LEOS instance to build for (default: `os`)
  - available in the code as `appConfig.global.leos.instance` and
    `process.env.NG_APP_LEOS_INSTANCE`
- `env` - specify the LEOS environment to build for (default: `local`)
  - available in the code as `appConfig.global.leos.env` and
    `process.env.NG_APP_LEOS_ENV`

_See [ngx-env](https://github.com/chihab/ngx-env) for more details about `NG_APP_` environment usage._


## Further help

- https://eui.ecdevops.eu

- register on [MS Teams](https://teams.microsoft.com/l/team/19%3a2f5bb6b7d1e24c4aabaa62229d3e1955%40thread.tacv2/conversations?groupId=fb6def72-c57b-4e8f-a82e-49be65d6e1f5&tenantId=b24c8b06-522c-46fe-9080-70926f8dddb1) with your EC mail account, for extra-muros please send a mail to DIGIT-EUI-SUPPORT@ec.europa.eu

- For bugs / request new features : Drop us an email at : DIGIT-EUI-SUPPORT@ec.europa.eu
