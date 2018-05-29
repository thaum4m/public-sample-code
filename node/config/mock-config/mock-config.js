/* Hardcoded tree for (note in cron string replace x with *):
config
├── app.yml
	logging:
	  level: 1
	  splunk:
	    token: "85a7fcd4-4b44-4a3b-8270-e86f5c956346"
	    url: "http://159.65.142.229:8088"
	queue:
	  uri: redis://127.0.0.1:6379
	database:
	  name: "schema-registry" 
	  uri: "http://159.65.142.229:8529"
	schedules:
	- ingestion
	- extraction
	- modeling
	- modeling-update
├── extraction.yml
	queue: 
	  name: extraction
	  processor: "jobs/extraction.js"
	cron: "* x/1 * * *"
	extraction:
	- from: products
	  to: analytics
	  cron: ""
	  fetch_max_records: 100000
	  schemata:
	    "product1":
	      cron: "x/30 * * * *"
	      fetch_max_records: 5000
├── ingestion.yml
	queue: 
	  name: ingestion
	  processor: "jobs/ingestion.js"
	cron: "* x/1 * * *"
	fetch_max_records: 100000
	tables:
	  ABN_CROSS_REFERENCE:
	    columns:
	    - ABN_CROSS_REFERENCE_ID
	    fetch_max_records: 5000
	    some_other_field: some other val
	  ACCEPT_FORMAT_FLEXING:
	    columns:
	    - OE_FORMAT_ID
	    - ACTION_TYPE_CD
	    - OE_FIELD_ID
	    - FLEX_TYPE_FLAG
	    - FLEX_CD
	    fetch_max_records: 5000
	    some_other_field: some other val
	  ALIAS_POOL:
	    columns:
	    - ALIAS_POOL_CD
	    fetch_max_records: 5000
	    some_other_field: some other val
├── modeling.yml
	queue:
	  name: modeling
	  processor: "jobs/modeling.js"
	cron: "* x/1 * * *"
	edges:
	  - from: "fromCollection1"
	    to: "toCollection1"
	    edge: "collectionName1"
	  - from: "fromCollection2"
	    to: "toCollection2"
	    edge: "collectionName2"
├── sbbdev
│   ├── extraction.yml
	queue:
  		name: sbbdev-extraction
│   ├── ingestion.yml
	queue:
		name: sbbdev-ingestion
│   └── modeling.yml
	queue:
		name: sbbdev-modeling	
└── sbbdev2
├── extraction.yml
	queue:
		name: sbbdev2-extraction
├── ingestion.yml
	queue:
		name: sbbdev2-ingestion
└── modeling.yml
	queue:
		name: sbbdev2-modeling	
*/

// Hardcoded for this example
let treeObj;

class Config {
	static addDir(file) {
	}
	static addFile(file) {
	}
	static getItem(contextPath) {
		let arr = contextPath.split('.');
	
		let result = treeObj;
		let tempPath = '';

		for (let i = 0; i < arr.length; i++) {
			let prop = arr[i];
			if (!(result instanceof ConfigResult)) {
				if (result instanceof Array) {
					throw new Error('Handling of Array values not yet implemented');
				} else if (result instanceof Object) {
					if (typeof result[prop] !== 'undefined') {
						result = result[prop];
					} else {
						// Context path doesn't match in tree
						return;
					}
				}
				if (i === arr.length-1) {
					if (!(result instanceof ConfigResult)) {
						return new ConfigObject(contextPath, result);
					}
					return result;
				}
			}
			if (result instanceof ConfigResult) {
				if (tempPath.length > 0) {
					tempPath += '.';
				}
				tempPath += prop;

				if (result.contextPath === tempPath) {
					result = result.value;
				} else {
					// Context path doesn't match in the tree
					return;
				}
			}
		}

		if (!(result instanceof ConfigResult)) {
			if (result instanceof Array) {
				result = new ConfigArray(contextPath, result);
			} else {
				result = new ConfigObject(contextPath, result);
			}
		}
		return result;
	}
	static get(contextPath) {
		return Config.getItem(contextPath);
	}
}
class ConfigResult extends Config {
	constructor(contextPath, value, source = '') {
		super();
		this.contextPath = contextPath;
		this.value = value;
		this.source = source;
	}
	get(contextPath) {
		let isParentContextString = (typeof this.contextPath === 'string' || this.contextPath instanceof String);
		if (isParentContextString && this.contextPath.length > 0) {
			contextPath = this.contextPath + '.' + contextPath;
		}
		return ConfigResult.getItem(contextPath);
	}
	getValue() {
		return this.value;
	}
}

// Class for result types
class ConfigArray extends ConfigResult {
}
class ConfigObject extends ConfigResult {
}
class ConfigString extends ConfigResult {
}
class ConfigNumber extends ConfigResult {
}
class ConfigBoolean extends ConfigResult {
}

// Classes for directories, files and URL's 
class ConfigDir extends ConfigObject {
}
class ConfigFile extends ConfigObject {
}
class ConfigUrl extends ConfigObject {
}

treeObj = new ConfigObject(
	'root', 
	{	
		app: new ConfigFile(
			'root.app', 
			{
				logging: new ConfigObject(
					'root.app.logging',
					{
						level: new ConfigNumber(
							'root.app.logging.level',
							1
						),
						splunk: new ConfigObject(
							'root.app.logging.splunk',
							{
								token: new ConfigString(
									'root.app.logging.splunk.token',
	    								'85a7fcd4-4b44-4a3b-8270-e86f5c956346'
								),
								url: new ConfigString(
									'root.app.logging.splunk.url',
	    								'http://159.65.142.229:8088'
								)
							}
						)
					}
				),
				queue: new ConfigObject(
					'root.app.queue',
					{
						uri: new ConfigString(
							'root.app.queue.uri',
							'redis://127.0.0.1:6379'
						)
					}
				),
				database: new ConfigObject(
					'root.app.database',
					{
						name: new ConfigString(
							'root.app.database.name',
	  						'schema-registry'
						),
						uri: new ConfigString(
							'root.app.database.uri',
	 						'http://159.65.142.229:8529'
						)
					}
				),
				schedules: new ConfigArray(
					'root.app.schedules',
					[
						new ConfigString(
							'root.app.schedules[0]',
							'ingestion'
						),
						new ConfigString(
							'root.app.schedules[1]',
							'extraction'
						),
						new ConfigString(
							'root.app.schedules[2]',
							'modeling'
						),
						new ConfigString(
							'root.app.schedules[3]',
							'modeling-update'
						)
					]
				)
			}
		),
		extraction: new ConfigFile(
			'root.extraction',
			{
				queue: new ConfigObject(
					'root.extraction.queue',
					{
						name: new ConfigString(
							'root.extraction.queue.name',
							'extraction'				
						),
						processor: new ConfigString(
							'root.extraction.queue.processor',
	  						'jobs/extraction.js'
						)
					}
				),
				cron: new ConfigString(
					'root.extraction.cron',
					'* */1 * * *'	
				),
				extraction: new ConfigArray(
					'root.extraction.extraction',
					[
						new ConfigObject(
							'root.extraction.extraction[0]',
							{
								from: new ConfigString(
									'root.extraction.extraction[0].from',
									'products'
								),
								to: new ConfigString(
									'root.extraction.extraction[0].to',
									'analytics'
								),
								cron: new ConfigString(
									'root.extraction.extraction[0].cron',
									''
								),
								fetch_max_records: new ConfigNumber(
									'root.extraction.extraction[0].fetch_max_records',
									100000		
								),
								schemata: new ConfigObject(
									'root.extraction.extraction[0].schemata',
									{
	    									product1: new ConfigObject(
											'root.extraction.extraction[0].schemata.product1',
											{
												cron: new ConfigString(
													'root.extraction.extraction[0].schemata.product1.cron',
													'0/30 * * * *'
												),
												fetch_max_records: new ConfigNumber(
													'root.extraction.extraction[0].schemata.product1.fetch_max_records',
													5000
												)
											}
										)
									}
								)
							}
						)
					]					
				)
			}
		),
		ingestion: new ConfigFile(
			'root.ingestion',
			{
				queue: new ConfigObject(
					'root.ingestion.queue',
					{
						name: new ConfigString(
							'root.ingestion.queue.name',
							'ingestion'				
						),
						processor: new ConfigString(
							'root.ingestion.queue.processor',
	  						'jobs/ingestion.js'
						)
					}
				),
				cron: new ConfigString(
					'root.ingestion.cron',
					'* */1 * * *'	
				),
				fetch_max_records: new ConfigNumber(
					'root.ingestion.fetch_max_records',
					100000
				),
				tables: new ConfigObject(
					'root.ingestion.tables',
					{
						ABN_CROSS_REFERENCE: new ConfigObject(
							'root.ingestion.tables.ABN_CROSS_REFERENCE',
							{
								columns: new ConfigArray(
									'root.ingestion.tables.ABN_CROSS_REFERENCE.columns',
									[
										new ConfigString(
											'root.ingestion.tables.ABN_CROSS_REFERENCE.columns[0]',
				    							'ABN_CROSS_REFERENCE_ID'
										)
									]
								),
								fetch_max_records: new ConfigNumber(
									'root.ingestion.tables.ABN_CROSS_REFERENCE.fetch_max_records',
									5000	
								)
							}
						),
						ACCEPT_FORMAT_FLEXING: new ConfigObject(
							'root.ingestion.tables.ACCEPT_FORMAT_FLEXING',
							{
								columns: new ConfigArray(
									'root.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns',
									[
										new ConfigString(
											'root.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
				    							'OE_FORMAT_ID'
										),
										new ConfigString(
											'root.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
				    							'ACTION_TYPE_CD'
										),
										new ConfigString(
											'root.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
				    							'OE_FIELD_ID'
										),
										new ConfigString(
											'root.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
				    							'FLEX_TYPE_FLAG'
										),
										new ConfigString(
											'root.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
				    							'FLEX_ID'
										)
									]
								),
								fetch_max_records: new ConfigNumber(
									'root.ingestion.tables.ACCEPT_FORMAT_FLEXING.fetch_max_records',
									5000
								)
							}
						),
						ALIAS_POOL: new ConfigObject(
							'root.ingestion.tables.ALIAS_POOL',
							{
								columns: new ConfigArray(
									'root.ingestion.tables.ALIAS_POOL.columns',
									[
										new ConfigString(
											'root.ingestion.tables.ALIAS_POOL.columns[0]',
				    							'ALIAS_POOL_CD'
										)
									]
								),
								fetch_max_records: new ConfigNumber(
									'root.ingestion.tables.ALIAS_POOL.fetch_max_records',
									5000	
								)
							}
						)
					}
				)
			}
		),
		modeling: new ConfigFile ( 
			'root.modeling',
			{
				name: new ConfigString(
					'root.modeling.queue.name',
					'modeling'				
				),
				processor: new ConfigString(
					'root.modeling.processor',
					'jobs/modeling.js'
				),
				cron: new ConfigString(
					'root.modeling.cron',
					'* */1 * * *'
				),
				edges: new ConfigArray(
					'root.modeling.edges',
					[
						new ConfigObject(
							'root.modeling.edges[0]',
							{
								from: "fromCollection1",
								to: "toCollection1",
								edge: "collectionName1"
							}
						),
						new ConfigObject(
							'root.modeling.edges[1]',
							{
								from: "fromCollection2",
								to: "toCollection2",
								edge: "collectionName2"
							}
						)
					]
				)
			}
		),
		sbbdev: new ConfigDir(
			'root.sbbdev',
			{
				extraction: new ConfigFile(
					'root.sbbdev.extraction',
					{
						// Inherited from root.extraction
						queue: new ConfigObject(
							'root.sbbdev.extraction.queue',
							{	
								// Overriden value
								name: new ConfigString(
									'root.sbbdev.extraction.queue.name',
									'extraction'				
								),
								processor: new ConfigString(
									'root.sbbdev.extraction.queue.processor',
									'jobs/extraction.js'
								)
							}
						),
						cron: new ConfigString(
							'root.sbbdev.extraction.cron',
							'* */1 * * *'
						),
						extraction: new ConfigArray(
							'root.sbbdev.extraction.extraction',
							[
								new ConfigObject(
									'root.sbbdev.extraction.extraction[0]',
									{
										from: new ConfigString(
											'root.sbbdev.extraction.extraction[0].from',
											'products'
										),
										to: new ConfigString(
											'root.sbbdev.extraction.extraction[0].to',
											'analytics'
										),
										cron: new ConfigString(
											'root.sbbdev.extraction.extraction[0].cron',
											''
										),
										fetch_max_records: new ConfigNumber(
											'root.sbbdev.extraction.extraction[0].fetch_max_records',
											100000		
										),
										schemata: new ConfigObject(
											'root.sbbdev.extraction.extraction[0].schemata',
											{
												product1: new ConfigObject(
													'root.sbbdev.extraction.extraction[0].schemata.product1',
													{
														cron: new ConfigString(
															'root.sbbdev.extraction.extraction[0].schemata.product1.cron',
															'0/30 * * * *'
														),
														fetch_max_records: new ConfigNumber(
															'root.sbbdev.extraction.extraction[0].schemata.product1.fetch_max_records',
															5000
														)
													}
												)
											}
										)
									}
								)
							]					
						)
					}
				),
				ingestion: new ConfigFile(
					'root.sbbdev.ingestion',
					{
						// Inherit values from root.ingestion
						queue: new ConfigObject(
							'root.sbbdev.ingestion.queue',
							{
								// Overriden value
								name: new ConfigString(
									'root.sbbdev.ingestion.queue.name',
									'sbb-ingestion'
								),
								uri: new ConfigString(
									'root.sbbdev.ingestion.queue.uri',
									'redis://127.0.0.1:6379'
								),
								processor: new ConfigString(
									'root.sbbdev.ingestion.queue.processor',
									'jobs/ingestion.js'
								)
							}
						),
						cron: new ConfigString(
							'root.sbbdev.ingestion.cron',
							'* */1 * * *'	
						),
						fetch_max_records: new ConfigNumber(
							'root.sbbdev.ingestion.fetch_max_records',
							100000
						),
						tables: new ConfigObject(
							'root.sbbdev.ingestion.tables',
							{
								ABN_CROSS_REFERENCE: new ConfigObject(
									'root.sbbdev.ingestion.tables.ABN_CROSS_REFERENCE',
									{
										columns: new ConfigArray(
											'root.sbbdev.ingestion.tables.ABN_CROSS_REFERENCE.columns',
											[
												new ConfigString(
													'root.sbbdev.ingestion.tables.ABN_CROSS_REFERENCE.columns[0]',
													'ABN_CROSS_REFERENCE_ID'
												)
											]
										),
										fetch_max_records: new ConfigNumber(
											'root.sbbdev.ingestion.tables.ABN_CROSS_REFERENCE.fetch_max_records',
											5000	
										)
									}
								),
								ACCEPT_FORMAT_FLEXING: new ConfigObject(
									'root.sbbdev.ingestion.tables.ACCEPT_FORMAT_FLEXING',
									{
										columns: new ConfigArray(
											'root.sbbdev.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns',
											[
												new ConfigString(
													'root.sbbdev.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
													'OE_FORMAT_ID'
												),
												new ConfigString(
													'root.sbbdev.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
													'ACTION_TYPE_CD'
												),
												new ConfigString(
													'root.sbbdev.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
													'OE_FIELD_ID'
												),
												new ConfigString(
													'root.sbbdev.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
													'FLEX_TYPE_FLAG'
												),
												new ConfigString(
													'root.sbbdev.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
													'FLEX_ID'
												)
											]
										),
										fetch_max_records: new ConfigNumber(
											'root.sbbdev.ingestion.tables.ACCEPT_FORMAT_FLEXING.fetch_max_records',
											5000
										)
									}
								),
								ALIAS_POOL: new ConfigObject(
									'root.sbbdev.ingestion.tables.ALIAS_POOL',
									{
										columns: new ConfigArray(
											'root.sbbdev.ingestion.tables.ALIAS_POOL.columns',
											[
												new ConfigString(
													'root.sbbdev.ingestion.tables.ALIAS_POOL.columns[0]',
													'ALIAS_POOL_CD'
												)
											]
										),
										fetch_max_records: new ConfigNumber(
											'root.sbbdev.ingestion.tables.ALIAS_POOL.fetch_max_records',
											5000	
										)
									}
								)
							}
						)
					}
				),	
				modeling: new ConfigFile ( 
					'root.sbbdev.modeling',
					{
						// Overriden value
						name: new ConfigString(
							'root.sbbdev.modeling.queue.name',
							'sbbdev-modeling'
						),
						processor: new ConfigString(
							'root.sbbdev.modeling.processor',
							'jobs/modeling.js'
						),
						cron: new ConfigString(
							'root.sbbdev.modeling.cron',
							'* */1 * * *'
						),
						edges: new ConfigArray(
							'root.sbbdev.modeling.edges',
							[
								new ConfigObject(
									'root.sbbdev.modeling.edges[0]',
									{
										from: "fromCollection1",
										to: "toCollection1",
										edge: "collectionName1"
									}
								),
								new ConfigObject(
									'root.sbbdev.modeling.edges[1]',
									{
										from: "fromCollection2",
										to: "toCollection2",
										edge: "collectionName2"
									}
								)
							]
						)
					}
				)
			}
		),	
		sbbdev2: new ConfigDir(
			'root.sbbdev2',
			{
				extraction: new ConfigFile(
					'root.sbbdev2.extraction',
					{
						// Inherited from root.extraction
						queue: new ConfigObject(
							'root.sbbdev2.extraction.queue',
							{	
								// Overriden value
								name: new ConfigString(
									'root.sbbdev2.extraction.queue.name',
									'extraction'				
								),
								processor: new ConfigString(
									'root.sbbdev2.extraction.queue.processor',
									'jobs/extraction.js'
								)
							}
						),
						cron: new ConfigString(
							'root.sbbdev2.extraction.cron',
							''	
						),
						extraction: new ConfigArray(
							'root.sbbdev2.extraction.extraction',
							[
								new ConfigObject(
									'root.sbbdev2.extraction.extraction[0]',
									{
										from: new ConfigString(
											'root.sbbdev2.extraction.extraction[0].from',
											'products'
										),
										to: new ConfigString(
											'root.sbbdev2.extraction.extraction[0].to',
											'analytics'
										),
										cron: new ConfigString(
											'root.sbbdev2.extraction.extraction[0].cron',
											''
										),
										fetch_max_records: new ConfigNumber(
											'root.sbbdev2.extraction.extraction[0].fetch_max_records',
											100000		
										),
										schemata: new ConfigObject(
											'root.sbbdev2.extraction.extraction[0].schemata',
											{
												product1: new ConfigObject(
													'root.sbbdev2.extraction.extraction[0].schemata.product1',
													{
														cron: new ConfigString(
															'root.sbbdev2.extraction.extraction[0].schemata.product1.cron',
															'0/30 * * * *'
														),
														fetch_max_records: new ConfigNumber(
															'root.sbbdev2.extraction.extraction[0].schemata.product1.fetch_max_records',
															5000
														)
													}
												)
											}
										)
									}
								)
							]					
						)
					}
				),
				ingestion: new ConfigFile(
					'root.sbbdev2.ingestion',
					{
						// Inherit values from root.ingestion
						queue: new ConfigObject(
							'root.sbbdev2.ingestion.queue',
							{
								// Overriden value
								name: new ConfigString(
									'root.sbbdev2.ingestion.queue.name',
									'sbb-ingestion'
								),
								uri: new ConfigString(
									'root.sbbdev2.ingestion.queue.uri',
									'redis://127.0.0.1:6379'
								),
								processor: new ConfigString(
									'root.sbbdev2.ingestion.queue.processor',
									'jobs/ingestion.js'
								)
							}
						),
						cron: new ConfigString(
							'root.sbbdev2.ingestion.cron',
							'* */1 * * *'	
						),
						fetch_max_records: new ConfigNumber(
							'root.sbbdev2.ingestion.fetch_max_records',
							100000
						),
						tables: new ConfigObject(
							'root.sbbdev2.ingestion.tables',
							{
								ABN_CROSS_REFERENCE: new ConfigObject(
									'root.sbbdev2.ingestion.tables.ABN_CROSS_REFERENCE',
									{
										columns: new ConfigArray(
											'root.sbbdev2.ingestion.tables.ABN_CROSS_REFERENCE.columns',
											[
												new ConfigString(
													'root.sbbdev2.ingestion.tables.ABN_CROSS_REFERENCE.columns[0]',
													'ABN_CROSS_REFERENCE_ID'
												)
											]
										),
										fetch_max_records: new ConfigNumber(
											'root.sbbdev2.ingestion.tables.ABN_CROSS_REFERENCE.fetch_max_records',
											5000	
										)
									}
								),
								ACCEPT_FORMAT_FLEXING: new ConfigObject(
									'root.sbbdev2.ingestion.tables.ACCEPT_FORMAT_FLEXING',
									{
										columns: new ConfigArray(
											'root.sbbdev2.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns',
											[
												new ConfigString(
													'root.sbbdev2.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
													'OE_FORMAT_ID'
												),
												new ConfigString(
													'root.sbbdev2.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
													'ACTION_TYPE_CD'
												),
												new ConfigString(
													'root.sbbdev2.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
													'OE_FIELD_ID'
												),
												new ConfigString(
													'root.sbbdev2.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
													'FLEX_TYPE_FLAG'
												),
												new ConfigString(
													'root.sbbdev2.ingestion.tables.ACCEPT_FORMAT_FLEXING.columns[0]',
													'FLEX_ID'
												)
											]
										),
										fetch_max_records: new ConfigNumber(
											'root.sbbdev2.ingestion.tables.ACCEPT_FORMAT_FLEXING.fetch_max_records',
											5000
										)
									}
								),
								ALIAS_POOL: new ConfigObject(
									'root.sbbdev2.ingestion.tables.ALIAS_POOL',
									{
										columns: new ConfigArray(
											'root.sbbdev2.ingestion.tables.ALIAS_POOL.columns',
											[
												new ConfigString(
													'root.sbbdev2.ingestion.tables.ALIAS_POOL.columns[0]',
													'ALIAS_POOL_CD'
												)
											]
										),
										fetch_max_records: new ConfigNumber(
											'root.sbbdev2.ingestion.tables.ALIAS_POOL.fetch_max_records',
											5000	
										)
									}
								)
							}
						)
					}
				),	
				modeling: new ConfigFile ( 
					'root.sbbdev2.modeling',
					{
						// Overriden value
						name: new ConfigString(
							'root.sbbdev2.modeling.queue.name',
							'sbbdev2-modeling'
						),
						processor: new ConfigString(
							'root.sbbdev2.modeling.processor',
							'jobs/modeling.js'
						),
						cron: new ConfigString(
							'root.sbbdev2.modeling.cron',
							'* */1 * * *'
						),
						edges: new ConfigArray(
							'root.sbbdev2.modeling.edges',
							[
								new ConfigObject(
									'root.sbbdev2.modeling.edges[0]',
									{
										from: "fromCollection1",
										to: "toCollection1",
										edge: "collectionName1"
									}
								),
								new ConfigObject(
									'root.sbbdev2.modeling.edges[1]',
									{
										from: "fromCollection2",
										to: "toCollection2",
										edge: "collectionName2"
									}
								)
							]
						)
					}
				)
			}
		)	
	}
);

let res = Config.get('root.app.logging').get('level').getValue();
console.log('result:', res);

/*module.exports = {
	Config: Config,
	types: {
		ConfigArray: ConfigArray,
		ConfigObject: ConfigObject,
		ConfigString: ConfigString,
		ConfigNumber: ConfigNumber,
		ConfigBoolean: ConfigBoolean,
		ConfigDir: ConfigDir,
		ConfigFile: ConfigFile,
		ConfigUrl: ConfigUrl
	}
};*/
