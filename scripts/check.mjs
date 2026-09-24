import assert from 'node:assert/strict';import {readFile,access,readdir,stat} from 'node:fs/promises';import katex from 'katex';
const terms=JSON.parse(await readFile('public/data/terms.json','utf8'));const notes=JSON.parse(await readFile('public/data/notes.json','utf8'));
assert.equal(new Set(terms.map(t=>t.id)).size,terms.length);assert.equal(terms.length,433);assert.equal(Object.keys(notes).length,433);
for(const t of terms){const n=notes[t.id];for(const k of ['definition','prompt','latex','explanation'])assert(n[k]?.trim(),t.id+' '+k);assert(!t.excerpt&&!t.definition,'No scanned/OCR definitions in published data');katex.renderToString(n.latex,{throwOnError:true,strict:'error',trust:false,maxExpand:200});for(const img of Object.values(t.cells))await access('public/'+img)}
const sw=await readFile('public/sw.js','utf8');assert(!sw.includes('__CORE_ASSETS__'));
const app=await readFile('public/app.js','utf8');assert(!app.includes('t.excerpt'));assert(!app.includes('./handbooks/'));assert(!app.includes('source-preview'));
async function walk(dir){const out=[];for(const f of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+f.name;if(f.isDirectory())out.push(...await walk(p));else out.push(p)}return out}const assets=await walk('public');assert(!assets.some(x=>x.endsWith('.pdf')));for(const f of assets)assert((await stat(f)).size<25*1024*1024,'Cloudflare asset size exceeded');
console.log('PASS: 433 unique terms; 433 authored examples; all LaTeX parses; all referenced images exist; no PDF/scanned examples in release; Cloudflare size limits.');
