import {Capacitor} from '@capacitor/core';
import {Preferences} from '@capacitor/preferences';
import {App} from '@capacitor/app';
import {Share} from '@capacitor/share';
import {Haptics,NotificationType} from '@capacitor/haptics';
const native=Capacitor.isNativePlatform();
if(native){
 document.documentElement.classList.add('native-app');
 const keys=['saved','language','recent'];
 for(const key of keys){try{const {value}=await Preferences.get({key:'mathdic:'+key});if(value!==null)localStorage.setItem('mathdic:'+key,value)}catch{console.warn('Device preferences unavailable')}}
 let pending=Promise.resolve();
 window.MathDicNative={
  save(key,value){pending=pending.then(()=>Preferences.set({key:'mathdic:'+key,value:JSON.stringify(value)}));pending=pending.catch(()=>{const el=document.querySelector('#toast');if(el){el.textContent='Could not save to this device. Please try again.';el.classList.add('show')}})},
  share:async(term,definition)=>{await Share.share({title:term+' · MathDic',text:term+'\n'+definition,dialogTitle:'Share this math term'})},
  feedback:correct=>Haptics.notification({type:correct?NotificationType.Success:NotificationType.Warning}).catch(()=>{})
 };
 await App.addListener('backButton',()=>{const dialog=document.querySelector('dialog[open]');if(dialog){dialog.close();return}const glossary=document.querySelector('[data-view="glossary"]');if(location.hash&&location.hash!=='#glossary'){glossary?.click();return}if(Capacitor.getPlatform()==='android')App.minimizeApp()});
}
await import('../public/app.js');
