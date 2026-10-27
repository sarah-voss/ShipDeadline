import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output=path.join(root,'_site');
const key=process.env.GEOAPIFY_API_KEY?.trim();
if (!key || key==='your_api_key_here') throw new Error('Set GEOAPIFY_API_KEY before building the public site.');
await fs.mkdir(output,{recursive:true});
for (const entry of ['index.html','fiscal-months.html','css','js','assets']) {
 await fs.cp(path.join(root,entry),path.join(output,entry),{recursive:true});
}
await fs.writeFile(path.join(output,'js/services/env.js'),`export const GEOAPIFY_API_KEY = ${JSON.stringify(key)};\n`);
await fs.writeFile(path.join(output,'.nojekyll'),'');
console.log('Static site prepared in _site. Browser API keys are public: restrict the production key in Geoapify.');
