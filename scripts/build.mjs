import {rm,cp,readdir,writeFile,readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
const environment=process.argv[2]||'development';if(!['development','production'].includes(environment))throw Error('Unknown build environment');
await writeFile('public/build-info.json',JSON.stringify({app:'MathDic',environment,builtAt:new Date().toISOString()},null,2));
const files=['./','./index.html','./build-info.json','./style.css','./app.js','./data/terms.json','./data/notes.json','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./vendor/katex/katex.min.js','./vendor/katex/katex.min.css',...(await readdir('public/vendor/katex/fonts')).map(f=>'./vendor/katex/fonts/'+f)];
const hash=createHash('sha256');for(const f of files.filter(f=>f!=='./'))hash.update(await readFile('public/'+f.slice(2)));
const sw=(await readFile('scripts/sw-template.js','utf8')).replace('__CORE_ASSETS__',JSON.stringify(files)).replaceAll('mathdic-v2','mathdic-'+hash.digest('hex').slice(0,12));await writeFile('public/sw.js',sw);
await rm('dist',{recursive:true,force:true});await cp('public','dist',{recursive:true});if(environment==='development'){await writeFile('dist/robots.txt','User-agent: *\nDisallow: /\n');const headers=await readFile('dist/_headers','utf8');await writeFile('dist/_headers',headers+'\n/*\n  X-Robots-Tag: noindex, nofollow\n')}
console.log('Built MathDic static site with '+files.length+' offline core assets.');
