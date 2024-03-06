/*
 * CheatGUI - effortless library for building window-based interfaces.
 * Copyright (C) 2024 Cat-125
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
 */

const fs = require('fs');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');

const INJ_TEMPLATE = '{js};cheatgui.utils.includeCSS(`{css}`);';
const header = `/* CheatGUI | (C) Cat-125 and contributors | https://github.com/Cat-125/CheatGUI/ */\n\n`

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

  write('build/cheatgui.min.js', header + mjs);
  write('build/cheatgui.min.css', header + mcss);

  const injContent = INJ_TEMPLATE.replace('{js}', mjs).replace('{css}', mcss);
  write('build/cheatgui.inj.js', header + injContent);
}

main();