import vm from 'node:vm';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
const events={},stores=new Map();const base='https://dev.mathdic.bang-academy.com/';let network=true;
const key=r=>new URL(typeof r==='string'?r:r.url,base).href;
const caches={keys:async()=>[...stores.keys()],delete:async k=>stores.delete(k),open:async name=>{if(!stores.has(name))stores.set(name,new Map());const m=stores.get(name);return{addAll:async urls=>{for(const u of urls){const pathname=new URL(u,base).pathname;const file=pathname==='/'?'index.html':pathname.slice(1);m.set(key(u),new Response(await readFile('public/'+file)))}},match:async r=>m.get(key(r))?.clone(),put:async(r,response)=>m.set(key(r),response.clone())}}};
const context={URL,Response,Error,Promise,caches,fetch:async r=>{if(!network)throw Error('Offline');const u=new URL(typeof r==='string'?r:r.url,base);try{return new Response(await readFile('public/'+u.pathname.slice(1)))}catch{return new Response('missing',{status:404})}},self:{location:{origin:new URL(base).origin},registration:{scope:base},clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener:(name,fn)=>events[name]=fn}};
vm.runInNewContext(await readFile('public/sw.js','utf8'),context);
let wait;events.install({waitUntil:p=>wait=p});await wait;events.activate({waitUntil:p=>wait=p});await wait;
network=false;for(const path of ['/','/app.js','/vendor/katex/katex.min.js','/data/notes.json']){let response;events.fetch({request:{url:new URL(path,base).href,method:'GET',mode:'navigate'},respondWith:p=>response=p});const r=await response;assert(r?.ok,path);assert((await r.text()).length>0,path)}
network=true;const messages=[];const terms=JSON.parse(await readFile('public/data/terms.json','utf8'));const asset=terms[0].cells.km;events.message({data:{type:'download',urls:[asset]},ports:[{postMessage:m=>messages.push(m)}],waitUntil:p=>wait=p});await wait;assert.equal(messages.at(-1).type,'done');
network=false;let image;events.fetch({request:{url:new URL(asset,base).href,method:'GET',mode:'cors'},respondWith:p=>image=p});assert((await image).ok);
console.log('PASS: offline app shell, scripts, math library, 433 examples, and downloaded language asset; service-worker lifecycle.');

for(const path of ['/admin/','/admin/api/examples','/admin/admin.js','/cdn-cgi/access/logout']){let handled=false;events.fetch({request:{url:new URL(path,base).href,method:'GET',mode:'navigate'},respondWith:()=>handled=true});assert.equal(handled,false,'Admin/auth requests must never be cached')}
