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
        "time/seconds",
        "size/rem",
      ],
      "buildPath": "build/scss/",
      "files": [
        {
          "destination": "_breakpoints.scss",
          "format": "scss/map-flat",
          "mapName": "breakpoints",
          "filter": (token) => token.attributes.category === 'breakpoint',
        },
        {
          "destination": "_colors.scss",
          "format": "scss/map-flat",
          "mapName": "colors",
          "filter": (token) => token.attributes.category === 'color',
        },
        {
          "destination": "_durations.scss",
          "format": "scss/map-flat",
          "mapName": "durations",
          "filter": (token) => token.attributes.category === 'time',
        },
        {
          "destination": "_easings.scss",
          "format": "scss/map-flat",
          "mapName": "easings",
          "filter": (token) => token.attributes.category === 'easing',
        },
        {
          "destination": "_spacings.scss",
          "format": "scss/spacings",
          "mapName": "spacings",
          "filter": (token) => token.attributes.type === 'space',
        },
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
          "destination": "colors.js",
          "format": "javascript/exports",
          "filter": (token) => token.attributes.category === 'color',
        },
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
          "filter": (token) => token.attributes.category === 'breakpoint',
        }
      ]
    },
    "ts": {
      "transforms": [
        "attribute/cti",
        "name/ti/camel"
      ],
      "buildPath": "build/ts/",
      "files": [
        {
          "destination": "colors.ts",
          "format": "ts/enums",
          "filter": (token) => token.attributes.category === 'color',
        },
        {
          "destination": "durations.ts",
          "format": "ts/enums",
          "filter": (token) => token.attributes.category === 'time',
        },
        {
          "destination": "easings.ts",
          "format": "ts/enums",
          "filter": (token) => token.attributes.category === 'easing',
        },
        {
          "destination": "breakpoints.ts",
          "format": "ts/enums",
          "filter": (token) => token.attributes.category === 'breakpoint',
        }
      ]
    },
    "sketch": {
      "transforms": [
        "attribute/cti",
        "name/start-case",
        "color/sketch"
      ],
      "buildPath": "build/sketch/",
      "files": [
        {
          "destination": "tokens.sketchpalette",
          "format": "sketch/palette/v2",
          "filter": (token) => token.attributes.category === 'color',
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

StyleDictionary.registerTransform({
  name: 'name/start-case',
  type: 'name',
  transformer: (prop, options) => {
    return _.startCase(prop.name.replace('-', ' '));
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

StyleDictionary.registerFormat({
  name: 'scss/spacings',
  formatter: function(dictionary) {
    let props = dictionary.allProperties.map((prop, index) => {
      const value = prop.value === '0rem' ? '0' : prop.value;
      return `  ${index}: ${value}`;
    }).join(",\n");

    return `$spacings: (\n${props}\n);\n`;
  }
});

StyleDictionary.registerFormat({
  name: 'ts/enums',
  formatter: function(dictionary) {
    let props = dictionary.allProperties.map((prop) => {
      const value = typeof prop.value === 'string' ? `'${prop.value}'` : prop.value;
      return `  ${_.upperFirst(prop.name)} = ${value},`;
    }).join("\n");

    const category = dictionary.allProperties[0].attributes.category;

    return `export enum ${_.upperFirst(category)} {\n${props}\n};\n`;
  }
})

StyleDictionary.buildAllPlatforms();
