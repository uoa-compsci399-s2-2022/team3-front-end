import{H as T,d as be,g as d,f as Ue,q as we,I as De,J as Pe,K as Ae,L as Ee,M as $e,N as Ne,O as Ie,P as Re,o as r,c as _,a as i,t as h,Q as p,b as t,w as o,F as Fe,z as Q,A as Le,B as Te,R as xe,u as Z,S as Oe,e as y,T as ee,G as c,U as Se,V as z,W as le,_ as Be}from"./index.594ced5a.js";/* empty css                     *//* empty css                 *//* empty css                   *//* empty css                   *//* empty css                    */function ae(g){T({title:"Warning",message:g,type:"warning"})}function F(g){T({title:"Error",message:g,type:"error",position:"bottom-right"})}function H(g,W){T({title:g,message:W})}function L(g){T({title:"Success",message:g,type:"success"})}const m=g=>(Le("data-v-4d482a6f"),g=g(),Te(),g),qe={class:"profile-container"},ze=m(()=>i("div",{class:"profile-avatar"},[i("img",{src:xe,alt:"avatar"})],-1)),He={class:"profile-info"},We={class:"profile-info-general"},Me={class:"profile-info-details"},je=m(()=>i("h2",null,"Infomation",-1)),Qe={key:0},Ze=m(()=>i("pre",null,"Currently Overseas:  Unknown",-1)),Ge=[Ze],Je={key:1},Ke=m(()=>i("pre",null,"Currently Overseas:  Yes",-1)),Ye=[Ke],Xe={key:2},el=m(()=>i("pre",null,"Currently Overseas:  No",-1)),ll=[el],al={key:3},tl=m(()=>i("pre",null,"Enrol Detail:  Unknown",-1)),ol=[tl],sl={key:4},il={key:5},nl=m(()=>i("pre",null,"Degree:  Unknown",-1)),ul=[nl],dl={key:6},rl={class:"profile-download"},cl=m(()=>i("p",null,"Personal documents",-1)),vl=c(" Upload"),pl=c("Update profile"),_l=c("Upload CV"),fl=c("Upload Academic transcript"),ml={key:0,class:"dialog-upload-ad"},gl=m(()=>i("p",null,"Upload your Academic transcript",-1)),yl=m(()=>i("div",{class:"el-upload__text"},[c(" Drop your Academic transcript here or "),i("em",null,"click to upload")],-1)),kl=m(()=>i("div",{class:"el-upload__tip"}," Require: PDF files with a size less than 2MB ",-1)),hl=c("Test"),Cl=c("Cancel"),Vl={key:0,class:"dialog-upload-cv"},bl=m(()=>i("p",null,"Upload your cv",-1)),Ul=m(()=>i("div",{class:"el-upload__text"},[c(" Drop your CV here or "),i("em",null,"click to upload")],-1)),wl=m(()=>i("div",{class:"el-upload__tip"}," Require: PDF files with a size less than 2MB ",-1)),Dl=c("Test"),Pl=c("Cancel"),Al=c("update name"),El=c("update email"),$l=c("update upi"),Nl=c("update auid"),Il=c("update enrol details "),Rl=c("update student degree"),Fl={key:0,class:"dialog-update-name"},Ll=c("cancel"),Tl={key:1,class:"dialog-update-email"},xl={key:0},Ol=c("Check Email"),Sl=c("Valid the code"),Bl=c("cancel"),ql={key:2,class:"dialog-update-upi"},zl=c("cancel"),Hl={key:3,class:"dialog-update-auid"},Wl=c("cancel"),Ml={key:4,class:"dialog-update-enrolDetails"},jl=c("cancel"),Ql={key:5,class:"dialog-update-studentDegree"},Zl=c("cancel"),Gl=c("Test"),Jl=c("submit"),Kl=be({__name:"Profile",setup(g,{expose:W}){d(),d(),d();const x=d();d();const n=d({});async function G(){let l=await Q("api/currentUserProfile");n.value.id=l.id,n.value.name=l.name,n.value.email=l.email,n.value.upi=l.upi,n.value.auid=l.auid,n.value.currentlyOverseas=l.currentlyOverseas,n.value.willBackToNZ=l.willBackToNZ,n.value.isCitizenOrPR=l.isCitizenOrPR,n.value.haveValidVisa=l.haveValidVisa,n.value.enrolDetails=l.enrolDetails,n.value.studentDegree=l.studentDegree,n.value.haveOtherContracts=l.haveOtherContracts,n.value.otherContracts=l.otherContracts,n.value.maximumWorkingHours=l.maximumWorkingHours}function J(l){l=l.replace(/[\n\r]/g,"");var e=window.atob(l);let a=e.length,u=new Uint8Array(a);for(let f=0;f<a;++f)u[f]=e.charCodeAt(f);return new Blob([u],{type:"application/pdf"})}async function te(){let l=await Q("api/getAcademicTranscript/"+n.value.id);if(console.log(l.cv),l.AcademicTranscript!=null&&l.AcademicTranscript!=null&&l.AcademicTranscript!=""){x.value=l.AcademicTranscript;var e=J(x.value);let a=window.URL.createObjectURL(e);window.open(a)}else ae("Did not detect your academic transcript, please upload your academic transcript")}async function oe(){let l=await Q("api/getCV/"+n.value.id);if(console.log(l.cv),l.cv!=null&&l.cv!=null&&l.cv!=""){x.value=l.cv;var e=J(x.value);let a=window.URL.createObjectURL(e);window.open(a)}else ae("Did not detect your CV, please upload your CV")}G();const O=d(!1),M=d(!1),v=d({}),se=()=>{M.value=!0,K()},ie=()=>{O.value=!0,K()},U=d(!0),w=d(!0),D=d(!0),P=d(!0),A=d(!0),E=d(!0),S=d(!1),j=d(!1),$=d(!0),N=d(!0),ne=()=>{T({title:"Info",message:"This is an info message",type:"info"})},B=d(""),ue=l=>{console.log(l);const e=d(!0);for(let a in l)a==="studentDegree"&&(l[a].toLowerCase()!="undergraduate"&&l[a].toLowerCase()!="postgraduate"?(H("Student Degree form: Not a Valid degree !!!!!","We are only accepting Undergraduate and Postgraduate students. Please check your spelling ."),e.value=!1):v.value.studentDegree=l[a].toLowerCase()),a==="auid"&&(console.log(isNaN(Number(l[a]))),isNaN(Number(l[a]))&&(H("AUID form: Not a Valid AUID !!!!!","Please check your AUID again."),e.value=!1)),a==="email"&&j.value==!1&&(H("Email form: Not a Valid code !!!!!","Please check your validation code from your email again."),e.value=!1);e.value==!1?F("Update Failed"):Se("api/currentUserProfile",{data:v.value}).then(a=>{console.log(a.status),a.status==1?(L("Update Success"),G(),O.value=!1):F("Update Failed")})};async function de(l){H("Sending an email to "+l,"Please wait for a few seconds");const e=await z("api/sendValidationEmail",{email:l});console.log(e),L("Send email to "+l+"successfully. Please type the validation code, validation code will be expired in 5 minutes")}async function re(l,e){const a=await z("/api/validateValidationCode/"+l+"/"+e);console.log(a),console.log(a.status),a.status===1?(L("Validation Code is correct"),j.value=!0):F(e+" Code is incorrect")}const K=()=>{U.value=!0,w.value=!0,D.value=!0,P.value=!0,A.value=!0,E.value=!0,S.value=!1,B.value="",j.value=!1,V.value="",C.value=[]},C=d([]),V=d(""),q=d(),ce=(l,e)=>{if(C.value.length==0){C.value.push(l);const a=new FileReader;a.readAsDataURL(l.raw),a.onload=()=>{const f=a.result;V.value=f.split("data:application/pdf;base64,")[1]}}else{C.value[0]=l;const a=new FileReader;a.readAsDataURL(l.raw),a.onload=()=>{const f=a.result;V.value=f.split("data:application/pdf;base64,")[1]}}},ve=(l,e)=>{q.value.clearFiles();const a=l[0];a.uid=le(),q.value.handleStart(a)},pe=(l,e)=>{V.value=""};async function _e(){V.value==""?F("Please upload your CV"):(await z("/api/getCV/"+n.value.id,{cv:V.value}),L("uploading your CV successfully"),$.value=!1)}const I=d([]),R=d(""),Y=d(),fe=(l,e)=>{if(I.value.length==0){I.value.push(l);const a=new FileReader;a.readAsDataURL(l.raw),a.onload=()=>{const f=a.result;R.value=f.split("data:application/pdf;base64,")[1]}}else{I.value[0]=l;const a=new FileReader;a.readAsDataURL(l.raw),a.onload=()=>{const f=a.result;R.value=f.split("data:application/pdf;base64,")[1]}}},me=(l,e)=>{Y.value.clearFiles();const a=l[0];a.uid=le(),Y.value.handleStart(a)},ge=(l,e)=>{R.value=""};async function ye(){R.value==""?F("Please upload your application document"):(await z("/api/getAcademicTranscript/"+n.value.id,{AcademicTranscript:R.value}),L("uploading your Academic transcript successfully"),N.value=!1)}return W({}),(l,e)=>{const a=Ue,u=we,f=De,ke=Pe,X=Ae,he=Ee,k=$e,b=Ne,Ce=Ie,Ve=Re;return r(),_(Fe,null,[i("div",qe,[ze,i("div",He,[i("div",We,[i("div",null,h(n.value.name),1),i("div",null,h(n.value.email),1)]),i("div",Me,[je,i("pre",null,"UPI:                      "+h(n.value.upi),1),i("pre",null,"AUID:                   "+h(n.value.auid),1),i("pre",null,"Preferred Email:   "+h(n.value.email),1),n.value.currentlyOverseas===null?(r(),_("div",Qe,Ge)):n.value.currentlyOverseas===!0?(r(),_("div",Je,Ye)):n.value.currentlyOverseas===!1?(r(),_("div",Xe,ll)):p("",!0),n.value.enrolDetails===null?(r(),_("div",al,ol)):(r(),_("div",sl,[i("pre",null,"Enrol Detail:  "+h(n.value.enrolDetails),1)])),n.value.studentDegree===null?(r(),_("div",il,ul)):(r(),_("div",dl,[i("pre",null,"Degree:  "+h(n.value.studentDegree),1)]))])]),i("div",rl,[cl,i("div",{onClick:oe},"cv"),i("div",{onClick:te},"Academic Transcript"),t(u,{onClick:se},{default:o(()=>[vl,t(a,{class:"el-icon--right"},{default:o(()=>[t(Z(Oe))]),_:1})]),_:1})])]),t(u,{class:"profile-update",onClick:ie},{default:o(()=>[pl]),_:1}),t(X,{modelValue:M.value,"onUpdate:modelValue":e[6]||(e[6]=s=>M.value=s),title:"Upload File",class:"dialog-Upload-container"},{default:o(()=>[$.value===!1?(r(),y(u,{key:0,onClick:e[0]||(e[0]=s=>$.value=!0)},{default:o(()=>[_l]),_:1})):p("",!0),N.value===!1?(r(),y(u,{key:1,onClick:e[1]||(e[1]=s=>N.value=!0)},{default:o(()=>[fl]),_:1})):p("",!0),i("div",null,[N.value===!0?(r(),_("div",ml,[gl,i("div",null,[t(f,{limit:1,ref_key:"upload_cv",ref:q,accept:"application/pdf","file-list":I.value,"onUpdate:file-list":e[2]||(e[2]=s=>I.value=s),"on-change":fe,"on-exceed":me,"on-remove":ge,action:"",drag:""},{tip:o(()=>[kl]),default:o(()=>[t(a,{class:"el-icon--upload"},{default:o(()=>[t(Z(ee))]),_:1}),yl]),_:1},8,["file-list"]),i("div",null,[t(u,{onClick:ye},{default:o(()=>[hl]),_:1}),t(u,{onClick:e[3]||(e[3]=s=>N.value=!1)},{default:o(()=>[Cl]),_:1})])])])):p("",!0)]),t(ke),i("div",null,[$.value===!0?(r(),_("div",Vl,[bl,i("div",null,[t(f,{limit:1,ref_key:"upload_cv",ref:q,accept:"application/pdf","file-list":C.value,"onUpdate:file-list":e[4]||(e[4]=s=>C.value=s),"on-change":ce,"on-exceed":ve,"on-remove":pe,action:"",drag:""},{tip:o(()=>[wl]),default:o(()=>[t(a,{class:"el-icon--upload"},{default:o(()=>[t(Z(ee))]),_:1}),Ul]),_:1},8,["file-list"])]),i("div",null,[t(u,{onClick:_e},{default:o(()=>[Dl]),_:1}),t(u,{onClick:e[5]||(e[5]=s=>$.value=!1)},{default:o(()=>[Pl]),_:1})])])):p("",!0)])]),_:1},8,["modelValue"]),t(X,{modelValue:O.value,"onUpdate:modelValue":e[29]||(e[29]=s=>O.value=s),title:"Quick Update",class:"dialog-container",width:"80%"},{default:o(()=>[t(he,null,{default:o(()=>[U.value===!1?(r(),y(u,{key:0,onClick:e[7]||(e[7]=s=>U.value=!0)},{default:o(()=>[Al]),_:1})):p("",!0),w.value===!1?(r(),y(u,{key:1,onClick:e[8]||(e[8]=s=>w.value=!0)},{default:o(()=>[El]),_:1})):p("",!0),D.value===!1?(r(),y(u,{key:2,onClick:e[9]||(e[9]=s=>D.value=!0)},{default:o(()=>[$l]),_:1})):p("",!0),P.value===!1?(r(),y(u,{key:3,onClick:e[10]||(e[10]=s=>P.value=!0)},{default:o(()=>[Nl]),_:1})):p("",!0),A.value===!1?(r(),y(u,{key:4,onClick:e[11]||(e[11]=s=>A.value=!0)},{default:o(()=>[Il]),_:1})):p("",!0),E.value===!1?(r(),y(u,{key:5,onClick:e[12]||(e[12]=s=>E.value=!0)},{default:o(()=>[Rl]),_:1})):p("",!0)]),_:1}),t(Ce,{"label-position":"left",model:v.value},{default:o(()=>[U.value===!0?(r(),_("div",Fl,[t(b,{label:"Name",prop:"name",rules:{required:!0,message:"name can not be empty",trigger:"blur"}},{default:o(()=>[t(k,{modelValue:v.value.name,"onUpdate:modelValue":e[13]||(e[13]=s=>v.value.name=s),placeholder:`origin:  ${n.value.name}`},null,8,["modelValue","placeholder"]),t(u,{onClick:e[14]||(e[14]=s=>{U.value=!1,delete v.value.name})},{default:o(()=>[Ll]),_:1})]),_:1})])):p("",!0),w.value===!0?(r(),_("div",Tl,[t(b,{label:"Email",prop:"email",rules:{required:!0,message:"Email can not be empty",trigger:"blur"}},{default:o(()=>[t(k,{modelValue:v.value.email,"onUpdate:modelValue":e[15]||(e[15]=s=>v.value.email=s),placeholder:`origin:  ${n.value.email}`},null,8,["modelValue","placeholder"]),S.value===!0?(r(),_("div",xl,[t(k,{modelValue:B.value,"onUpdate:modelValue":e[16]||(e[16]=s=>B.value=s),placeholder:"Validation Code"},null,8,["modelValue"])])):p("",!0),t(u,{onClick:e[17]||(e[17]=s=>{S.value=!0,de(v.value.email)})},{default:o(()=>[Ol]),_:1}),S.value===!0?(r(),y(u,{key:1,onClick:e[18]||(e[18]=s=>re(v.value.email,B.value))},{default:o(()=>[Sl]),_:1})):p("",!0),t(u,{onClick:e[19]||(e[19]=s=>{w.value=!1,delete v.value.email})},{default:o(()=>[Bl]),_:1})]),_:1})])):p("",!0),D.value===!0?(r(),_("div",ql,[t(b,{label:"UPI",prop:"UPI",rules:{required:!0,message:"UPI can not be empty",trigger:"blur"}},{default:o(()=>[t(k,{modelValue:v.value.upi,"onUpdate:modelValue":e[20]||(e[20]=s=>v.value.upi=s),placeholder:`origin:  ${n.value.upi}`},null,8,["modelValue","placeholder"]),t(u,{onClick:e[21]||(e[21]=s=>{D.value=!1,delete v.value.upi})},{default:o(()=>[zl]),_:1})]),_:1})])):p("",!0),P.value===!0?(r(),_("div",Hl,[t(b,{label:"AUID",rules:{required:!0,message:"auid can not be empty and auid must be a number",trigger:"blur"}},{default:o(()=>[t(k,{modelValue:v.value.auid,"onUpdate:modelValue":e[22]||(e[22]=s=>v.value.auid=s),placeholder:`Note auid must be a number. origin:  ${n.value.auid}`},null,8,["modelValue","placeholder"]),t(u,{onClick:e[23]||(e[23]=s=>{P.value=!1,delete v.value.auid})},{default:o(()=>[Wl]),_:1})]),_:1})])):p("",!0),A.value===!0?(r(),_("div",Ml,[t(b,{label:"Enrol Details",rules:{required:!0,message:"Enrol details can not be empty",trigger:"blur"}},{default:o(()=>[t(k,{modelValue:v.value.enrolDetails,"onUpdate:modelValue":e[24]||(e[24]=s=>v.value.enrolDetails=s),placeholder:`origin:  ${n.value.enrolDetails}`},null,8,["modelValue","placeholder"]),t(u,{onClick:e[25]||(e[25]=s=>{A.value=!1,delete v.value.enrolDetails})},{default:o(()=>[jl]),_:1})]),_:1})])):p("",!0),E.value===!0?(r(),_("div",Ql,[t(b,{label:"Student Degree",rules:{required:!0,message:"Student degree can not be empty",trigger:"blur"}},{default:o(()=>[t(k,{modelValue:v.value.studentDegree,"onUpdate:modelValue":e[26]||(e[26]=s=>v.value.studentDegree=s),placeholder:`origin:  ${n.value.studentDegree}`},null,8,["modelValue","placeholder"]),t(u,{onClick:e[27]||(e[27]=s=>{E.value=!1,delete v.value.studentDegree})},{default:o(()=>[Zl]),_:1})]),_:1})])):p("",!0)]),_:1},8,["model"]),t(Ve,{class:"dialog-footer"},{default:o(()=>[t(u,{onClick:ne},{default:o(()=>[Gl]),_:1}),t(u,{onClick:e[28]||(e[28]=s=>ue(v.value))},{default:o(()=>[Jl]),_:1})]),_:1})]),_:1},8,["modelValue"])],64)}}});const oa=Be(Kl,[["__scopeId","data-v-4d482a6f"]]);export{oa as default};
