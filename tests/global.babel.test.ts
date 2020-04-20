import { create } from 'babel-test';
 
const { test } = create({
    plugins: [require.resolve('../src/global.babel')],
});
 
test('add import', async ({ transform }): Promise<any> => {
    const { code } = await transform(
        `import { e } from './a.js';
a;
window.a;
a();
a.b;
a.b();
f.b;
a.b.c;
a.b.c.d;
var c = {};
c.b;
{
    d = 1;
}
[].forEach((i) => {
    console.log(c.b);
    console.log(c);
    console.log(g);
    console.log(i);
});`, { filename: 'foo.js' });
   
    expect(code).toBe(
        `import { e } from './a.js';
window["a"];
window.a;
window["a"]();
window["a"].b;
window["a"].b();
window["f"].b;
window["a"].b.c;
window["a"].b.c.d;
var c = {};
c.b;
{
  window["d"] = 1;
}
[].forEach(i => {
  window["console"].log(c.b);
  window["console"].log(c);
  window["console"].log(window["g"]);
  window["console"].log(i);
});`
    );
});

