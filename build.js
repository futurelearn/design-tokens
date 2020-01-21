const config = {
  "source": ["properties/**/*.json"],
  "platforms": {
    "scss": {
      "transformGroup": "scss",
      "buildPath": "build/scss/",
      "files": [
        {
          "destination": "_variables.scss",
          "format": "scss/variables"
        },
        {
          "destination": "_custom-properties.scss",
          "format": "css/variables"
        }
      ]
    },
    "js": {
      "transforms": [
        "attribute/cti",
        "name/ti/camel"
      ],
      "buildPath": "build/js/",
      "files": [
        {
          "destination": "durations.js",
          "format": "javascript/es6",
          "filter": (token) => token.attributes.category === 'time',
        },
        {
          "destination": "easings.js",
          "format": "javascript/es6",
          "filter": (token) => token.attributes.category === 'easing',
        }
      ]
    },
  }
};

const StyleDictionary = require('style-dictionary').extend(config);
StyleDictionary.buildAllPlatforms();
