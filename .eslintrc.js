module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: ['plugin:@typescript-eslint/recommended'],
	parserOptions:  {
		ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
		sourceType:  'module',  // Allows for the use of imports
	  },
	  rules:  {
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		// e.g. "@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-function-return-type": "on",
		"@typescript-eslint/e": "on"
		//TODO:
	  },
  }
  