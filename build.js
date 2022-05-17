const _ = require("lodash");

const config = {
  source: ["tokens/**/*.json"],
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: "build/scss/",
      files: [
        {
          destination: "_variables.scss",
          format: "scss/variables",
        },
        {
          destination: "_custom-properties.scss",
          format: "css/variables",
          filter: (token) =>
            !["breakpoint"].includes(token.attributes.category),
        },
      ],
    },
    "scss/map": {
      transforms: [
        "attribute/cti",
        "name/ti/kebab",
        "time/seconds",
        "size/rem",
      ],
      buildPath: "build/scss/",
      files: [
        {
          destination: "_breakpoints.scss",
          format: "scss/map-flat",
          mapName: "breakpoints",
          filter: (token) => token.attributes.category === "breakpoint",
        },
        {
          destination: "_colors.scss",
          format: "scss/map-flat",
          mapName: "colors",
          filter: (token) =>
            token.attributes.category === "color" &&
            token.attributes.type !== "off-brand",
        },
        {
          destination: "_off-brand-colors.scss",
          format: "scss/map-flat",
          mapName: "off-brand-colors",
          filter: (token) =>
            token.attributes.category === "color" &&
            token.attributes.type === "off-brand",
        },
        {
          destination: "_durations.scss",
          format: "scss/map-flat",
          mapName: "durations",
          filter: (token) => token.attributes.category === "time",
        },
        {
          destination: "_easings.scss",
          format: "scss/map-flat",
          mapName: "easings",
          filter: (token) => token.attributes.category === "easing",
        },
        {
          destination: "_spacings.scss",
          format: "scss/spacings",
          mapName: "spacings",
          filter: (token) => token.attributes.type === "space",
        },
      ],
    },
    js: {
      transforms: ["attribute/cti", "name/ti/camel"],
      buildPath: "build/js/",
      files: [
        {
          destination: "colors.js",
          format: "javascript/exports",
          filter: (token) => token.attributes.category === "color",
        },
        {
          destination: "durations.js",
          format: "javascript/exports",
          filter: (token) => token.attributes.category === "time",
        },
        {
          destination: "easings.js",
          format: "javascript/exports",
          filter: (token) => token.attributes.category === "easing",
        },
        {
          destination: "breakpoints.js",
          format: "javascript/exports",
          filter: (token) => token.attributes.category === "breakpoint",
        },
      ],
    },
    sketch: {
      transforms: ["attribute/cti", "name/start-case", "color/sketch"],
      buildPath: "build/sketch/",
      files: [
        {
          destination: "tokens.sketchpalette",
          format: "sketch/palette/v2",
          filter: (token) => token.attributes.category === "color",
        },
      ],
    },
  },
};

const StyleDictionary = require("style-dictionary").extend(config);

StyleDictionary.registerTransform({
  name: "name/ti/kebab",
  type: "name",
  transformer: (token, options) => {
    return _.kebabCase([options.prefix].concat(token.path.slice(1)).join(" "));
  },
});

StyleDictionary.registerTransform({
  name: "name/start-case",
  type: "name",
  transformer: (token, options) => {
    return _.startCase(token.name.replace("-", " "));
  },
});

StyleDictionary.registerFormat({
  name: "javascript/exports",
  formatter: function (dictionary) {
    return dictionary.allTokens
      .map((token) => {
        let output = `module.exports.${token.name} = ${JSON.stringify(
          token.value
        )};`;
        if (token.comment) {
          output = output.concat(" // " + token.comment);
        }
        return output;
      })
      .join("\n");
  },
});

StyleDictionary.registerFormat({
  name: "scss/spacings",
  formatter: function (dictionary) {
    let tokens = dictionary.allTokens
      .map((token, index) => {
        const value = token.value === "0rem" ? "0" : token.value;
        return `  ${index}: ${value}`;
      })
      .join(",\n");

    return `$spacings: (\n${tokens}\n);\n`;
  },
});

StyleDictionary.buildAllPlatforms();
