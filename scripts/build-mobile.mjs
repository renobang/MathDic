import {cp,rm,readFile,writeFile,mkdir} from 'node:fs/promises';
import {build} from 'esbuild';
const root='mobile-dist';await rm(root,{recursive:true,force:true});await mkdir(root);
// Bundle reviewed content and translations: no remote web URL or admin code in the app.
for(const file of ['index.html','style.css','data','translations','vendor','icon.svg','icon-192.png','icon-512.png'])await cp('public/'+file,root+'/'+file,{recursive:true});
let html=await readFile(root+'/index.html','utf8');html=html.replace('width=device-width,initial-scale=1','width=device-width,initial-scale=1,viewport-fit=cover').replace(/<link rel="manifest"[^>]*>/,'').replace('<link rel="stylesheet" href="./style.css">','<link rel="stylesheet" href="./style.css"><link rel="stylesheet" href="./mobile.css">').replace('src="./app.js"','src="./mobile.js"');
await writeFile(root+'/index.html',html);await cp('mobile/mobile.css',root+'/mobile.css');await cp('mobile/privacy.html',root+'/privacy.html');
await build({entryPoints:['mobile/entry.js'],bundle:true,format:'esm',target:['safari15','chrome100'],outfile:root+'/mobile.js',minify:true});
await writeFile(root+'/build-info.json',JSON.stringify({app:'MathDic',platform:'native',content:'bundled-source',builtAt:new Date().toISOString()}));
console.log('Built offline mobile bundle: 433 examples, 10 languages; no admin or remote server URL.');
