if(!self.define){let e,r={};const i=(i,n)=>(i=new URL(i+".js",n).href,r[i]||new Promise((r=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=r,document.head.appendChild(e)}else e=i,importScripts(i),r()})).then((()=>{let e=r[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,d)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(r[s])return;let c={};const o=e=>i(e,s),f={module:{uri:s},exports:c,require:o};r[s]=Promise.all(n.map((e=>f[e]||o(e)))).then((e=>(d(...e),c)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"css/components.BZ8_yiVw.css",revision:"c7390c7731c12d254a01c4aca98d3bc3"},{url:"cube192.png",revision:"4a1d214b21ba22d3239ded25f1835e49"},{url:"cube512.png",revision:"56f635856619b43486c1d29c0f8217d9"},{url:"favicon.ico",revision:"f0517a3046c197dd76796f347256d667"},{url:"index.html",revision:"0a779f322a84a7b1ed37ea6fd2cc20da"},{url:"jpg/image-error._N07Nh_I.jpg",revision:"b9c1c02f139707913d3919c6020b3c7a"},{url:"js/worker-css.BnENw39C.js",revision:"98ba7620c412c5e2711d5b174913ae94"},{url:"js/worker-javascript.iLd8VyHL.js",revision:"9fbc9475588c88060373bf47fc814e6c"},{url:"js/worker-json.D199L-0v.js",revision:"bfd0c39437d49a63608dc07504e19b94"},{url:"png/404.su7Jd0Q0.png",revision:"36144884aed0e7a6208e98de57252033"},{url:"png/build.Gz79pvde.png",revision:"3644671133625587d95fd8935ae7b841"},{url:"png/busy.BCr5edoB.png",revision:"46dd9954b75f24e924dd41e4188416fe"},{url:"png/loading.8LEMhrDl.png",revision:"ad46cd691d1d92244b47b9db5623ba36"},{url:"png/netcut.C9pYP14a.png",revision:"ea70735a0dbd26c78b768b81dca1b2d5"},{url:"png/nodata.BRc6OqL-.png",revision:"14ef2dd225086873e8556c66a840253a"},{url:"png/pcview.BvGNan3o.png",revision:"7fe6f40e43ab9085ff54b18446f7d2ed"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"cube192.png",revision:"4a1d214b21ba22d3239ded25f1835e49"},{url:"cube512.png",revision:"56f635856619b43486c1d29c0f8217d9"},{url:"manifest.webmanifest",revision:"90fff5ec9105b0339391fe38870740d6"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
