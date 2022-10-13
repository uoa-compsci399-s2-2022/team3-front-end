import{d as P,g as h,Y as x,z as I,M as A,N as z,k as F,n as R,O as S,q as B,K as M,o as D,e as C,w as l,a as $,b as e,c as G,x as H,F as L,G as b,V as X,a0 as E,U as Y,X as J,a1 as Z,aa as ee,aC as le,a4 as te,a7 as ae,v as oe,s as se,u as N,Q as ne,a2 as ue,aD as ie,aE as re,t as de,a9 as me,_ as pe}from"./index.594ced5a.js";/* empty css                   *//* empty css                   *//* empty css                 *//* empty css                    *//* empty css               *//* empty css                 *//* empty css                     *//* empty css                  */const ce={class:"dialog-footer"},fe=b("Cancel"),_e=b("Add"),be=P({__name:"AddUser",props:{visible:null},emits:["refreshUserTable"],setup(c,{emit:k}){const f=c,y=()=>{k("refreshUserTable")},r="140px",v=h([]),t=x({});I("api/groups").then(d=>{console.log(d),v.value=d});const m=()=>{X("api/users",t).then(d=>{E({message:"Add user successfully",type:"success"}),f.visible.visible=!1,y()}).catch(d=>{E({message:d.response.data.message,type:"error"})})};return(d,u)=>{const a=A,n=z,g=F,p=R,V=S,U=B,w=M;return D(),C(w,{modelValue:c.visible.visible,"onUpdate:modelValue":u[6]||(u[6]=o=>c.visible.visible=o),title:"Add User"},{footer:l(()=>[$("span",ce,[e(U,{onClick:u[5]||(u[5]=o=>c.visible.visible=!1)},{default:l(()=>[fe]),_:1}),e(U,{type:"primary",onClick:m},{default:l(()=>[_e]),_:1})])]),default:l(()=>[e(V,{model:t},{default:l(()=>[e(n,{label:"User ID","label-width":r},{default:l(()=>[e(a,{modelValue:t.userID,"onUpdate:modelValue":u[0]||(u[0]=o=>t.userID=o),autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(n,{label:"Password","label-width":r},{default:l(()=>[e(a,{modelValue:t.password,"onUpdate:modelValue":u[1]||(u[1]=o=>t.password=o),autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(n,{label:"Email","label-width":r},{default:l(()=>[e(a,{modelValue:t.email,"onUpdate:modelValue":u[2]||(u[2]=o=>t.email=o),autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(n,{label:"Name","label-width":r},{default:l(()=>[e(a,{modelValue:t.name,"onUpdate:modelValue":u[3]||(u[3]=o=>t.name=o),autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(n,{label:"Groups","label-width":r},{default:l(()=>[e(p,{multiple:"",modelValue:t.groups,"onUpdate:modelValue":u[4]||(u[4]=o=>t.groups=o),placeholder:"Please select the user groups"},{default:l(()=>[(D(!0),G(L,null,H(v.value,o=>(D(),C(g,{key:o.groupName,label:o.groupName,value:o.groupName},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])}}}),ve={class:"dialog-footer"},ge=b("Cancel"),Ve=b("Submit"),Ue=P({__name:"EditUser",props:{visible:null,currentUser:null},emits:["refreshUserTable"],setup(c,{emit:k}){const f=c,y=()=>{k("refreshUserTable")},r="140px",v=h([]),t=x({}),m=h({}),d=x({});I("api/UserProfile/"+f.currentUser.id).then(a=>{m.value.name=a.name,m.value.auid=a.auid,m.value.upi=a.upi,m.value.email=a.email,m.value.enrolDetails=a.enrolDetails,m.value.studentDegree=a.studentDegree,m.value.groups=a.groups,t.name=a.name,t.auid=a.auid,t.upi=a.upi,t.email=a.email,t.enrolDetails=a.enrolDetails,t.studentDegree=a.studentDegree,d.groups=a.groups}).catch(a=>console.log(a)),I("api/groups").then(a=>{console.log(a),v.value=a});const u=()=>{Y("api/UserProfile/"+f.currentUser.id,{data:t}).then(a=>{E({message:"Edit user successfully",type:"success"}),f.visible.visible=!1,y()}).catch(a=>{E({message:a.response.data.message,type:"error"})}),Y("api/userGroupManagement/"+f.currentUser.id,{data:d}).then(a=>{E({message:"Edit user groups successfully",type:"success"}),f.visible.visible=!1,y()}).catch(a=>{E({message:a.response.data.message,type:"error"})})};return(a,n)=>{const g=A,p=z,V=F,U=R,w=S,o=B,i=M;return D(),C(i,{modelValue:c.visible.visible,"onUpdate:modelValue":n[8]||(n[8]=s=>c.visible.visible=s),title:"Edit User"},{footer:l(()=>[$("span",ve,[e(o,{onClick:n[7]||(n[7]=s=>c.visible.visible=!1)},{default:l(()=>[ge]),_:1}),e(o,{type:"primary",onClick:u},{default:l(()=>[Ve]),_:1})])]),default:l(()=>[e(w,{model:t},{default:l(()=>[e(p,{label:"Name","label-width":r},{default:l(()=>[e(g,{modelValue:t.name,"onUpdate:modelValue":n[0]||(n[0]=s=>t.name=s),autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(p,{label:"AUID","label-width":r},{default:l(()=>[e(g,{modelValue:t.auid,"onUpdate:modelValue":n[1]||(n[1]=s=>t.auid=s),autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(p,{label:"UPI","label-width":r},{default:l(()=>[e(g,{modelValue:t.upi,"onUpdate:modelValue":n[2]||(n[2]=s=>t.upi=s),autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(p,{label:"Email","label-width":r},{default:l(()=>[e(g,{modelValue:t.email,"onUpdate:modelValue":n[3]||(n[3]=s=>t.email=s),autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(p,{label:"EnrollDetails","label-width":r},{default:l(()=>[e(g,{modelValue:t.enrolDetails,"onUpdate:modelValue":n[4]||(n[4]=s=>t.enrolDetails=s),autocomplete:"off"},null,8,["modelValue"])]),_:1}),e(p,{label:"StudentDegree","label-width":r},{default:l(()=>[e(U,{modelValue:t.studentDegree,"onUpdate:modelValue":n[5]||(n[5]=s=>t.studentDegree=s),placeholder:"Please select the user Degree"},{default:l(()=>[e(V,{label:"Undergraduate",value:"Undergraduate"}),e(V,{label:"Postgraduate",value:"Postgraduate"})]),_:1},8,["modelValue"])]),_:1}),e(p,{label:"Groups","label-width":r},{default:l(()=>[e(U,{multiple:"",modelValue:d.groups,"onUpdate:modelValue":n[6]||(n[6]=s=>d.groups=s),placeholder:"Please select the user groups"},{default:l(()=>[(D(!0),G(L,null,H(v.value,s=>(D(),C(V,{key:s.groupName,label:s.groupName,value:s.groupName},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])}}}),he={class:"page-container"},De=b("Add User"),ye=b("Batch Invite"),Ee=b("Edit "),we=b("Delete "),Ce={class:"dialog-footer"},ke=b("Cancel"),Te=b("Confirm"),$e=P({__name:"ManageUser",setup(c){const k=J();Z();const f=x({visible:!1}),y=x({visible:!1}),r=h(!1),v=h({}),t=h({}),m=h(!0),d=()=>{f.visible=!0},u=h(""),a=ee(()=>V.value.filter(o=>!u.value||o.id.toLowerCase().includes(u.value.toLowerCase()))),n=(o,i)=>{y.visible=!0,t.value=i},g=(o,i)=>{r.value=!0,v.value=i},p=()=>{me("api/users/"+v.value.id).then(o=>{E({message:"Delete user success",type:"success"}),r.value=!1,U()}).catch(o=>{E({message:o.response.data.message,type:"error"})})},V=h([]),U=()=>{I("api/users").then(o=>{V.value=[],o.forEach(i=>{V.value.push({id:i.id,email:i.email,name:i.name,groups:i.groups,createDateTime:ue(i.createDateTime).format("DD-MM-YYYY HH:mm:ss")})}),m.value=!1}).catch(o=>{console.log(o)})},w=()=>{U()};return U(),(o,i)=>{const s=B,O=le,T=te,W=A,j=ae,q=M,K=oe;return D(),G(L,null,[$("div",he,[e(O,null,{default:l(()=>[e(s,{type:"primary",icon:N(ie),onClick:d},{default:l(()=>[De]),_:1},8,["icon"]),e(s,{type:"primary",icon:N(re),onClick:i[0]||(i[0]=_=>N(k).push("/manageuser/batch-invite-user"))},{default:l(()=>[ye]),_:1},8,["icon"])]),_:1}),se((D(),C(j,{data:N(a),style:{width:"100%"}},{default:l(()=>[e(T,{label:"ID",prop:"id"}),e(T,{label:"Email",prop:"email"}),e(T,{label:"Name",prop:"name"}),e(T,{label:"Groups",prop:"groups"}),e(T,{align:"right"},{header:l(()=>[e(W,{modelValue:u.value,"onUpdate:modelValue":i[1]||(i[1]=_=>u.value=_),size:"small",placeholder:"Type to search"},null,8,["modelValue"])]),default:l(_=>[e(s,{size:"small",onClick:Q=>n(_.$index,_.row)},{default:l(()=>[Ee]),_:2},1032,["onClick"]),e(s,{size:"small",type:"danger",onClick:Q=>g(_.$index,_.row)},{default:l(()=>[we]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"])),[[K,m.value]])]),e(q,{modelValue:r.value,"onUpdate:modelValue":i[3]||(i[3]=_=>r.value=_),title:"Delete Confirm",width:"30%"},{footer:l(()=>[$("span",Ce,[e(s,{onClick:i[2]||(i[2]=_=>r.value=!1)},{default:l(()=>[ke]),_:1}),e(s,{type:"danger",onClick:p},{default:l(()=>[Te]),_:1})])]),default:l(()=>[$("span",null,"Please confirm to delete the user: "+de(v.value.id),1)]),_:1},8,["modelValue"]),e(be,{visible:f,onRefreshUserTable:w},null,8,["visible"]),y.visible?(D(),C(Ue,{key:0,visible:y,onRefreshUserTable:w,currentUser:t.value},null,8,["visible","currentUser"])):ne("",!0)],64)}}});const Ye=pe($e,[["__scopeId","data-v-acf59740"]]);export{Ye as default};
