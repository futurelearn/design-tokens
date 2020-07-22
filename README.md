# What is this?

This repo contains FutureLearn's design tokens, in a format that [Style Dictionary](https://github.com/amzn/style-dictionary) can use to generate files for different platforms / formats (eg. Sass, JavaScript, Sketch, etc). This allows us to have a single source of truth for all platforms.

# Installation

Clone this repo and `yarn install`

# How to use it

The definitions are stored in JSON files in the `properties` folder.

If you've edited any of these, `yarn run build` will update the output in the `build` folder.

Don't edit anything in the `build` folder directly, since the contents will be regenerated whenever `yarn run build` is run.
