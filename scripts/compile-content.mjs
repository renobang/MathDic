import {readFile,writeFile} from 'node:fs/promises';
const terms=JSON.parse(await readFile('content/source-reference/imported-terms.json','utf8'));
const previous=JSON.parse(await readFile('content/source-reference/early-study-notes.json','utf8'));
const rows=(await readFile('content/original-examples.tsv','utf8')).trim().split('\n').map(line=>line.split('|'));
const notes={};const seen=new Set();
for(const row of rows){if(row.length!==5)throw Error('Malformed content row: '+row[0]);const [term,definition,prompt,latex,explanation]=row;const t=terms.find(t=>t.term===term);if(!t)throw Error('Unknown term: '+term);if(seen.has(t.id))throw Error('Duplicate: '+term);seen.add(t.id);const old=previous[t.id];notes[t.id]={term,definition,prompt,latex,explanation,definitions:old?.definitions||{},related:old?.related||[],aliases:old?.aliases||[],authorship:'MathDic original example',contentVersion:2};}
if(seen.size!==terms.length)throw Error('Missing content');
const specs={
 'absolute-value':{type:'numberline',value:-7,min:-8,max:8},
 'slope':{type:'slope',rise:3,run:8},
 'area':{type:'grid',columns:7,rows:3,unit:'m'},
 'pythagorean-theorem':{type:'triangle',a:9,b:12,c:15},
 'right-triangle':{type:'triangle',a:5,b:12,c:13},
 'coordinates':{type:'point',x:5,y:-2},
 'ordered-pair':{type:'pairs',points:[[2,6],[6,2]]}
};for(const[id,spec]of Object.entries(specs))notes[id].diagramSpec=spec;
const output=terms.map(t=>{const {definition,excerpt,englishPage,...rest}=t;return rest});
await writeFile('public/data/terms.json',JSON.stringify(output,null,2));await writeFile('public/data/notes.json',JSON.stringify(notes,null,2));
console.log(`Compiled ${seen.size} original explanations and editable examples.`);
