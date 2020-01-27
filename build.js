const _ = require('lodash');

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
          "format": "css/variables",
          "filter": (token) => !["breakpoint"].includes(token.attributes.category)
        }
      ]
    },
    "scss/map": {
      "transforms": [
        "attribute/cti",
        "name/ti/kebab",
      ],
      "buildPath": "build/scss/",
      "files": [
        {
          "destination": "_breakpoints.scss",
          "format": "scss/map-flat",
          "mapName": "breakpoints",
          "filter": (token) => token.attributes.category === 'breakpoint',
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
          "format": "javascript/exports",
          "filter": (token) => token.attributes.category === 'time',
        },
        {
          "destination": "easings.js",
          "format": "javascript/exports",
          "filter": (token) => token.attributes.category === 'easing',
        },
        {
          "destination": "breakpoints.js",
          "format": "javascript/exports",
          "filter": {
            "attributes": {
              "category": "breakpoint"
            }
          }
        }
      ]
    },
  }
};

const StyleDictionary = require('style-dictionary').extend(config);

StyleDictionary.registerTransform({
  name: 'name/ti/kebab',
  type: 'name',
  transformer: (prop, options) => {
    return _.kebabCase([options.prefix].concat(prop.path.slice(1)).join(' '));
  }
});

StyleDictionary.registerFormat({
  name: 'javascript/exports',
  formatter: function(dictionary) {
    return dictionary.allProperties.map(prop => {
      let output = `module.exports.${prop.name} = ${JSON.stringify(prop.value)};`;
      if (prop.comment) {
        output = output.concat(' // ' + prop.comment);
      }
      return output;
    }).join('\n');
  }
});

StyleDictionary.buildAllPlatforms();
