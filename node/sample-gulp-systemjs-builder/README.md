# sample-gulp-systemjs-builder 
Example of using SystemJS Builder with Gulp along with *plugin-typescript* to produce a single js file which doesn't require XHR calls to import modules.

## Usage:

1. Observe the the source file, *src/scripts/main.ts*
Notice that it imports plain JavaScript, Node.js and TypeScript code.

2. Install:
npm install

3. Build:
gulp

4. Run via Node.js:
node build/main.js

5. Open build/index.html in a web browser
