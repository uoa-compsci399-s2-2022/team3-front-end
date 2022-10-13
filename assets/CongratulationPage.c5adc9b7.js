import{g as F,aa as T,cc as J,bP as z,o as b,c as C,F as K,x as tt,a as N,bb as w,Q as B,d as et,a1 as nt,X as at,f as rt,e as ot,u as O,b as P,w as it,t as st,cP as ct,_ as lt}from"./index.594ced5a.js";const $=200,ut=800,dt=.1,ft=.3,k=.5,ht=.5,mt=12,gt=800,yt=1600,vt=150,_t=3500,bt=["#FFC700","#FF0000","#2E3191","#41BBC7"];var D={props:{particleCount:{type:Number,default:vt},particleSize:{type:Number,default:mt},duration:{type:Number,default:_t},colors:{type:Array,default:bt},force:{type:Number,default:ht},stageHeight:{type:Number,default:gt},stageWidth:{type:Number,default:yt},shouldDestroyAfterDone:{type:Boolean,default:!0}},setup(t){const s=F(!0),d=(e,n)=>{H(e,{degree:n})},r=T(()=>p(t.particleCount,t.colors));J(()=>{t.particleCount>300&&console.log("[VUE-CONFETTI-EXPLOSION] That's a lot of confetti, you sure about that? A lesser number like 200 will still give off the party vibes while still not bricking the device \u{1F609}")});const i=T(()=>V(t.particleCount,t.duration,t.colors,t.particleSize,t.force,t.stageHeight,t.stageWidth));z(async()=>{await v(t.duration),t.shouldDestroyAfterDone&&(s.value=!1)});const p=(e,n)=>{const a=360/e;return Array.from({length:e},(l,c)=>({color:n[c%n.length],degree:c*a}))},v=e=>new Promise(n=>setTimeout(n,e));function f(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:2;return Math.round((e+Number.EPSILON)*10**n)/10**n}function x(e,n){if(e===n)return!0;if(e==null||n==null||e.length!==n.length)return!1;for(let a=0;a<e.length;a++)if(e[a]!==n[a])return!1;return!0}const _=(e,n,a,l,c)=>(e-n)*(c-l)/(a-n)+l,S=(e,n)=>{const a=e+n;return a>360?a-360:a},A=()=>Math.random()>.5,R=[0,0,1],E=[[1,1,0],[1,0,1],[0,1,1],[1,0,0],[0,1,0],R],L=e=>!x(E[e],R)&&A(),h=e=>typeof e>"u",m=e=>{console.error(e)};function V(e,n,a,l,c,g,y){const u=Number.isSafeInteger;return!h(e)&&u(e)&&e<0?(m("particleCount must be a positive integer"),!1):!h(n)&&u(n)&&n<0?(m("duration must be a positive integer"),!1):!h(a)&&!Array.isArray(a)?(m("colors must be an array of strings"),!1):!h(l)&&u(l)&&l<0?(m("particleSize must be a positive integer"),!1):!h(c)&&u(c)&&(c<0||c>1)?(m("force must be a positive integer and should be within 0 and 1"),!1):!h(g)&&typeof g=="number"&&u(g)&&g<0?(m("floorHeight must be a positive integer"),!1):!h(y)&&typeof y=="number"&&u(y)&&y<0?(m("floorWidth must be a positive integer"),!1):!0}function H(e,n){let{degree:a}=n;const l=_(Math.abs(S(a,90)-180),0,180,-t.stageWidth/2,t.stageWidth/2),c=Math.random()*(ut-$)+$,g=Math.round(Math.random()*(E.length-1)),y=t.duration-Math.round(Math.random()*1e3),u=Math.random()<dt,I=L(g),M=u?f(Math.random()*ft,2):0,U=M*-1,Z=M,q=f(Math.abs(_(Math.abs(S(a,90)-180),0,180,-1,1)),4),W=f(Math.random()*k,4),X=f(Math.random()*t.force*(A()?1:-1),4),Y=k,j=f(Math.max(_(Math.abs(a-180),0,180,t.force,-t.force),0),4),o=(Q,G)=>e==null?void 0:e.style.setProperty(Q,G+"");o("--x-landing-point",`${l}px`),o("--duration-chaos",`${y}ms`),o("--x1",`${M}`),o("--x2",`${U}`),o("--x3",`${Z}`),o("--x4",`${q}`),o("--y1",`${W}`),o("--y2",`${X}`),o("--y3",`${Y}`),o("--y4",`${j}`),o("--width",`${I?t.particleSize:Math.round(Math.random()*4)+t.particleSize/2}px`),o("--height",(I?t.particleSize:Math.round(Math.random()*2)+t.particleSize)+"px"),o("--rotation",`${E[g].join()}`),o("--rotation-duration",`${c}ms`),o("--border-radius",`${I?"50%":"0"}`)}return{isVisible:s,isValid:i,stageHeight:t.stageHeight,particles:r,setItemRef:d}}};function xt(t,s,d,r,i,p){return r.isVisible&&r.isValid?(b(),C("div",{key:0,class:"container",style:w(`--floor-height: ${r.stageHeight}px;`)},[(b(!0),C(K,null,tt(r.particles,v=>{let{color:f,degree:x}=v;return b(),C("div",{key:x,class:"particle",ref:_=>r.setItemRef(_,x)},[N("div",{style:w(`--bgcolor: ${f};`)},null,4)],512)}),128))],4)):B("",!0)}function Ct(t,s){s===void 0&&(s={});var d=s.insertAt;if(!(!t||typeof document>"u")){var r=document.head||document.getElementsByTagName("head")[0],i=document.createElement("style");i.type="text/css",d==="top"&&r.firstChild?r.insertBefore(i,r.firstChild):r.appendChild(i),i.styleSheet?i.styleSheet.cssText=t:i.appendChild(document.createTextNode(t))}}var pt=`
@keyframes y-axis {
to {
    transform: translate3d(0, var(--floor-height), 0);
}
}
@keyframes x-axis {
to {
    transform: translate3d(var(--x-landing-point), 0, 0);
}
}
@keyframes rotation {
to {
    transform: rotate3d(var(--rotation), 360deg);
}
}
.container {
  width: 0;
  height: 0;
  overflow: visible;
  position: relative;
  transform: translate3d(var(--x, 0), var(--y, 0), 0);
  z-index: 1200;
}
.particle {
  animation: x-axis var(--duration-chaos) forwards
    cubic-bezier(var(--x1), var(--x2), var(--x3), var(--x4));
}
.particle div {
  position: absolute;
  top: 0;
  left: 0;
  animation: y-axis var(--duration-chaos) forwards
    cubic-bezier(var(--y1), var(--y2), var(--y3), var(--y4));
  width: var(--width);
  height: var(--height);
}
.particle div:before {
  display: block;
  height: 100%;
  width: 100%;
  content: "";
  background-color: var(--bgcolor);
  animation: rotation var(--rotation-duration) infinite linear;
  border-radius: var(--border-radius);
}
`;Ct(pt);D.render=xt;var Et=(()=>{const t=D;return t.install=s=>{s.component("ConfettiExplosion",t)},t})();const It={class:"cong-page-container"},Mt={class:"icon-center"},Nt={class:"text-center"},St=et({__name:"CongratulationPage",setup(t){const s=nt(),d=at(),r=F(!0);return z(()=>{setTimeout(async()=>{r.value=!1,await d.push({path:s.query.next}),d.go(0)},3e3)}),(i,p)=>{const v=rt;return b(),C("div",It,[N("div",Mt,[r.value?(b(),ot(O(Et),{key:0,stageHeight:1500,duration:5e3})):B("",!0),P(v,null,{default:it(()=>[P(O(ct))]),_:1})]),N("div",Nt,st(i.$route.query.text),1)])}}});const Rt=lt(St,[["__scopeId","data-v-6862ce37"]]);export{Rt as default};
