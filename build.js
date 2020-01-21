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
        }
      ]
    }
  }
};

const StyleDictionary = require('style-dictionary').extend(config);
StyleDictionary.buildAllPlatforms();
