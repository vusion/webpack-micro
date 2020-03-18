import { create } from 'babel-test';
 
const { test } = create({
    plugins: [require.resolve('../src/babel')],
});
 
test('add import', async ({ transform }): Promise<any> => {
    const { code } = await transform(
        `import {a} from "lodash";
const foo = 42; 
var c=2,d=1;
(() => {var e =2;})()
`, { filename: 'foo.js' });
   
    expect(code).toBe(
        `import { _window as window, _console as console, _setTimeout as setTimeout, _document as document, _setInterval as setInterval } from "vusion-micro-app";
import { a } from "lodash";
const foo = 42;
var c = 2,
    d = 1;

(() => {
  var e = 2;
})();`
    );
});

test('add import with document', async ({ transform }): Promise<any> => {
    const { code } = await transform(
        `import {a} from "lodash";
const foo = 42;
var document = window.document;
var c=2,d=1;
(() => {var e =2;})()
`, { filename: 'foo2.js' });
   
    expect(code).toBe(
        `import { _window as window, _console as console, _setTimeout as setTimeout, _setInterval as setInterval } from "vusion-micro-app";
import { a } from "lodash";
const foo = 42;
var document = window.document;
var c = 2,
    d = 1;

(() => {
  var e = 2;
})();`
    );
});

test('add import with document, console, setTimeout, setInterval, window', async ({ transform }): Promise<any> => {
    const { code } = await transform(
        `import {a} from "lodash";
const foo = 42;
var document = window.document;
var console = window.console;
var setTimeout = window.setTimeout;
var setInterval = window.setInterval;
var window = 2;
var c=2,d=1;
(() => {var e =2;})()
`, { filename: 'foo1.js' });
   
    expect(code).toBe(
        `import { a } from "lodash";
const foo = 42;
var document = window.document;
var console = window.console;
var setTimeout = window.setTimeout;
var setInterval = window.setInterval;
var window = 2;
var c = 2,
    d = 1;

(() => {
  var e = 2;
})();`
    );
});

test('test empty', async ({ transform }): Promise<any> => {
    const { code } = await transform(
        ``, { filename: 'foo1.js' });
   
    expect(code).toBe(
        ``
    );
});
test('test var', async ({ transform }): Promise<any> => {
    const { code } = await transform(
        `var a = 1;`, { filename: 'foo1.js' });
   
    expect(code).toBe(
        `const {
  _window: window,
  _console: console,
  _setTimeout: setTimeout,
  _document: document,
  _setInterval: setInterval
} = require("vusion-micro-app");

var a = 1;`
    );
});

test('test function', async ({ transform }): Promise<any> => {
    const { code } = await transform(
        `function a(){}`, { filename: 'foo1.js' });
   
    expect(code).toBe(
        `const {
  _window: window,
  _console: console,
  _setTimeout: setTimeout,
  _document: document,
  _setInterval: setInterval
} = require("vusion-micro-app");

function a() {}`
    );
});

test('test window.cc', async ({ transform }): Promise<any> => {
    const { code } = await transform(
        `window.cc = 1;`, { filename: 'foo1.js' });
   
    expect(code).toBe(
        `const {
  _window: window,
  _console: console,
  _setTimeout: setTimeout,
  _document: document,
  _setInterval: setInterval
} = require("vusion-micro-app");

window.cc = 1;`
    );
});

test('test commonjs', async ({ transform }): Promise<any> => {
    const { code } = await transform(
        `module.exports = 1;`, { filename: 'foo1.js' });
   
    expect(code).toBe(
        `const {
  _window: window,
  _console: console,
  _setTimeout: setTimeout,
  _document: document,
  _setInterval: setInterval
} = require("vusion-micro-app");

module.exports = 1;`
    );
});