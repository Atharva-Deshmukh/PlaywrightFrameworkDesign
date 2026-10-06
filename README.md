# Installation

- yarn create playwright (choose between TypeScript or JavaScript (default is TypeScript))
![screenshot](imagesForReadme/Install-1.png)

To generate tsconfig.json file 
npx tsc --init 

- Command to run in UI mode:
  yarn run playwright test --ui

Tests are picked from this option in config: testDir: './tests'
Spec pattern can be specified by testMatch: '**/*.spec.ts'


