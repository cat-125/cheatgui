const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');

const INJ_TEMPLATE = '{js};cheatgui.utils.includeCSS(`{css}`)';

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function createDirectory(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function write(filePath, text) {
  fs.writeFileSync(filePath, text);
}

function main() {
  const js = read('cheatgui.js');
  const css = read('cheatgui.css');

  const mjs = UglifyJS.minify(js).code;
  const mcss = new CleanCSS({}).minify(css).styles;

  createDirectory('build');

  write('build/cheatgui.min.js', mjs);
  write('build/cheatgui.min.css', mcss);

  const injContent = INJ_TEMPLATE.replace('{js}', mjs).replace('{css}', mcss);
  write('build/cheatgui.inj.js', injContent);

  write('build/LICENSE', read('LICENSE'));
}

main();