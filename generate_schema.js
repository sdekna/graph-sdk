#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper function to read JSON file
const readJSONFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Failed to read or parse JSON file at ${filePath}:`, error);
    process.exit(1);
  }
};

// Check if a file path was provided
if (process.argv.length < 3) {
  console.error('Usage: npx mylibrary <path_to_json_file>');
  process.exit(1); // Exit the script if no file path is provided
}

// Get the JSON file path from the command-line arguments
const jsonFilePath = path.resolve(process.argv[2]);

// Read and parse the JSON file
const jsonData = readJSONFile(jsonFilePath);

// Destructure necessary data from the parsed JSON
const { endpoint, headers, types, esm } = jsonData;

// Read the version of @gqlts/cli from the library's package.json
const packageJSON = readJSONFile(path.resolve(__dirname, 'package.json'));
const gqltsCliVersion = packageJSON.devDependencies['@gqlts/cli'];

// Detect the package manager by checking the existence of lock files
let packageManager = 'npm';
if (fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'))) {
  packageManager = 'yarn';
} else if (fs.existsSync(path.resolve(process.cwd(), 'pnpm-lock.yaml'))) {
  packageManager = 'pnpm';
} else if (fs.existsSync(path.resolve(process.cwd(), 'bun.lockb'))) {
  packageManager = 'bun';
}

// Check if @gqlts/cli is installed
let gqltsCliInstalled = false;
try {
  require.resolve('@gqlts/cli');
  gqltsCliInstalled = true;
} catch (error) {
  console.log('@gqlts/cli is not installed. Installing...');
}

// Install @gqlts/cli if it's not installed
if (!gqltsCliInstalled) {
  const installCommand = {
    npm: `npm install --save-dev @gqlts/cli@${gqltsCliVersion}`,
    yarn: `yarn add --dev @gqlts/cli@${gqltsCliVersion}`,
    pnpm: `pnpm add --save-dev @gqlts/cli@${gqltsCliVersion}`,
    bun: `bun add --dev @gqlts/cli@${gqltsCliVersion}`
  }[packageManager];

  try {
    console.log(`Running "${installCommand}" using ${packageManager}`);
    execSync(installCommand, { stdio: 'inherit' });
    console.log('@gqlts/cli installed successfully.');
  } catch (error) {
    console.error(`Failed to install @gqlts/cli using ${packageManager}:`, error);
    process.exit(1);
  }
}

const output_path = path.resolve(__dirname, './src/generated');

// Execute the constructed command
try {
  const typegenCommand = `./node_modules/.bin/gqlts -S ${types.map(type => `${type.uuid}:string`).join(' ')} ${esm ? '--esm' : ''} --endpoint ${endpoint} --output ${output_path} -H ${headers}`;

  execSync(typegenCommand, { stdio: 'inherit' });

  console.log('Type generation completed successfully.');
} catch (error) {
  console.error('An error occurred during type generation:', error);
}
