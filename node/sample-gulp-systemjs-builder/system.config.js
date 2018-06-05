// For details of this setup see:
// https://www.npmjs.com/package/plugin-typescript
System.config({
	transpiler: 'ts',
	typescriptOptions: {
		// Set to true to use tsconfig.json
		tsconfig: false
	},
	paths: {
		// paths serve as alias
		'npm:': 'node_modules/',
		'lib:': 'src/lib/',
		'scripts:': 'src/scripts/'
	},
	// map tells the System loader where to look for things
	map: {
		'typescript': 'npm:typescript/lib/typescript.js',
		'ts': 'npm:plugin-typescript/lib/plugin.js',
	},
	// use meta configuration to reference which modules
	// should use the plugin loader
	meta: {
		'typescript': {
			"exports": "ts"
		}
	}
});
