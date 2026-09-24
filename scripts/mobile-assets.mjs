import sharp from 'sharp';import {readFile,writeFile} from 'node:fs/promises';
const source=(await readFile('public/icon.svg','utf8')).replace('rx="112"','rx="0"');
await sharp(Buffer.from(source)).resize(1024,1024).flatten({background:'#173c35'}).png().toFile('ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png');
for(const [density,size] of Object.entries({mdpi:48,hdpi:72,xhdpi:96,xxhdpi:144,xxxhdpi:192}))for(const name of ['ic_launcher','ic_launcher_round'])await sharp(Buffer.from(source)).resize(size,size).png().toFile(`android/app/src/main/res/mipmap-${density}/${name}.png`);
const foreground=source.replace('<rect width="512" height="512" rx="0" fill="#173c35"/>','').replace('<path ','<g transform="translate(85 85) scale(.67)"><path ').replace('</svg>','</g></svg>');
for(const [density,size] of Object.entries({mdpi:108,hdpi:162,xhdpi:216,xxhdpi:324,xxxhdpi:432}))await sharp(Buffer.from(foreground)).resize(size,size).png().toFile(`android/app/src/main/res/mipmap-${density}/ic_launcher_foreground.png`);
const splash=await sharp({create:{width:2732,height:2732,channels:3,background:'#173c35'}}).composite([{input:await sharp(Buffer.from(source)).resize(440,440).png().toBuffer(),gravity:'center'}]).png().toBuffer();
for(const name of ['splash-2732x2732.png','splash-2732x2732-1.png','splash-2732x2732-2.png'])await writeFile('ios/App/App/Assets.xcassets/Splash.imageset/'+name,splash);
const {readdir}=await import('node:fs/promises');for(const dir of await readdir('android/app/src/main/res')){if(!dir.startsWith('drawable'))continue;const file='android/app/src/main/res/'+dir+'/splash.png';try{const {width,height}=await sharp(file).metadata();await sharp(splash).resize(width,height,{fit:'cover'}).png().toBuffer().then(data=>writeFile(file,data))}catch{}}
