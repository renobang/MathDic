import {verifyAdmin} from './auth.js';
import katex from 'katex';
const json=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
async function baseNotes(request,env){const url=new URL('/data/notes.json',request.url);const res=await env.ASSETS.fetch(new Request(url));if(!res.ok)throw Error('Content unavailable');return res.json()}
export function validateExample(body){
 if(!body||!Number.isSafeInteger(body.revision)||body.revision<0)throw Error('Invalid revision');
 const result={};for(const k of ['prompt','latex','explanation']){if(typeof body[k]!=='string'||!body[k].trim()||body[k].length>4000)throw Error('Complete all three fields (maximum 4,000 characters each).');result[k]=body[k].trim()}
 katex.renderToString(result.latex,{throwOnError:true,trust:false,strict:'error',maxExpand:200,maxSize:20});return result;
}
async function boundedJSON(request){
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw Error('Expected JSON');
 const reader=request.body?.getReader();if(!reader)throw Error('Missing body');let size=0;const chunks=[];
 for(;;){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>60000){await reader.cancel();throw Error('Request too large')}chunks.push(value)}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length}return JSON.parse(new TextDecoder().decode(bytes));
}
export async function handleAdmin(request,env,email){
 const url=new URL(request.url);
 if(url.pathname==='/admin/api/examples'){
  if(request.method==='GET'){
   const notes=await baseNotes(request,env);const {results}=await env.CONTENT_DB.prepare('SELECT * FROM examples').all();
   for(const row of results)if(Object.hasOwn(notes,row.id))notes[row.id]={...notes[row.id],...row,diagramSpec:null};
   return json({email,examples:Object.entries(notes).map(([id,n])=>({id,term:n.term,prompt:n.prompt,latex:n.latex,explanation:n.explanation,revision:n.revision||0}))});
  }
  if(request.method!=='PUT')return json({error:'Method not allowed'},405);
  if(request.headers.get('origin')!==url.origin||request.headers.get('x-mathdic-admin')!=='1')return json({error:'Invalid request origin'},403);
  let body,value;try{body=await boundedJSON(request);value=validateExample(body)}catch{return json({error:'Invalid example. Check the text and LaTeX.'},400)}
  const notes=await baseNotes(request,env);if(typeof body.id!=='string'||!Object.hasOwn(notes,body.id))return json({error:'Unknown term'},404);
  const now=new Date().toISOString();let result;
  if(body.revision===0){result=await env.CONTENT_DB.prepare('INSERT INTO examples(id,prompt,latex,explanation,revision,updated_at,updated_by) VALUES(?,?,?,?,1,?,?) ON CONFLICT(id) DO NOTHING').bind(body.id,value.prompt,value.latex,value.explanation,now,email).run()}
  else{result=await env.CONTENT_DB.prepare('UPDATE examples SET prompt=?,latex=?,explanation=?,revision=revision+1,updated_at=?,updated_by=? WHERE id=? AND revision=?').bind(value.prompt,value.latex,value.explanation,now,email,body.id,body.revision).run()}
  const changes=result.meta.changes;
  if(!changes)return json({error:'This example changed in another session. Reload before editing.'},409);
  return json({ok:true,revision:body.revision+1,updatedAt:now});
 }
 if(url.pathname.startsWith('/admin/api/'))return json({error:'Not found'},404);
 if(!['GET','HEAD'].includes(request.method))return json({error:'Method not allowed'},405);
 const response=await env.ASSETS.fetch(request);const secured=new Response(response.body,response);secured.headers.set('Cache-Control','no-store');return secured;
}
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/admin')){
  if(url.hostname!==env.ADMIN_HOST)return json({error:'Use the administrator domain'},403);
  let email;try{email=await verifyAdmin(request,env)}catch{return json({error:'Administrator sign-in required'},403)}
  if(!env.CONTENT_DB)return json({error:'Administrator storage unavailable'},503);
  try{return await handleAdmin(request,env,email)}catch{return json({error:'Unable to complete the request. Please retry.'},503)}
 }
 if(url.pathname==='/data/notes.json'&&['GET','HEAD'].includes(request.method)){
  try{const notes=await baseNotes(request,env);if(env.CONTENT_DB){const {results}=await env.CONTENT_DB.prepare('SELECT id,prompt,latex,explanation FROM examples').all();for(const row of results)if(Object.hasOwn(notes,row.id))notes[row.id]={...notes[row.id],prompt:row.prompt,latex:row.latex,explanation:row.explanation,diagramSpec:null}}
   return new Response(request.method==='HEAD'?null:JSON.stringify(notes),{headers:{'Content-Type':'application/json','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'}});
  }catch{return json({error:'Content temporarily unavailable'},503)}
 }
 return env.ASSETS.fetch(request);
}};
