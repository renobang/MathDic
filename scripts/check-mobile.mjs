import assert from 'node:assert/strict';import {readFile,access} from 'node:fs/promises';
const config=JSON.parse(await readFile('capacitor.config.json','utf8'));assert.equal(config.appName,'MathDic');assert(!config.server?.url,'A store build must use bundled content');
const notes=JSON.parse(await readFile('mobile-dist/data/notes.json','utf8'));assert.equal(Object.keys(notes).length,433);
for(const path of ['admin/index.html','admin/admin.js','sw.js'])await assert.rejects(access('mobile-dist/'+path));
for(const path of ['index.html','mobile.js','mobile.css','privacy.html','vendor/katex/katex.min.js'])await access('mobile-dist/'+path);
const source=await readFile('public/app.js','utf8');assert(source.includes("if(!IS_NATIVE&&'serviceWorker'in navigator)"));assert(!source.includes('copy-math'));assert(!source.includes('edit-example'));
const plist=await readFile('ios/App/App/PrivacyInfo.xcprivacy','utf8');assert(plist.includes('CA92.1'));assert((await readFile('ios/App/App.xcodeproj/project.pbxproj','utf8')).includes('PrivacyInfo.xcprivacy in Resources'));
console.log('PASS: bundled 433 examples, no remote URL/admin/PWA worker, native assets, privacy manifest, student-only UI.');
