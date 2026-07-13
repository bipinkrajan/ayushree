import{SUPABASE as m}from"../config/supabase.config.js";import{CLINIC as x}from"../config/clinic.config.js";import{HEALTH_ISSUES as A}from"../config/libraries.js";const $="ayusree.admin.v1";let i={token:null,clinicId:null,name:"",tab:"patients",patients:[],current:null,offers:[],clinic:null,lists:{doctor:[],treatment:[],medicine:[],advice_do:[],advice_dont:[]}},v=null;const d=e=>document.getElementById(e),s=(e="")=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),ke=e=>i.token;function r(e){const t=d("toast");t.textContent=e,t.classList.add("show"),clearTimeout(t._t),t._t=setTimeout(()=>t.classList.remove("show"),1800)}const L=e=>e&&e.length?e.slice().sort((t,n)=>new Date(n.created_at)-new Date(t.created_at))[0]:null;function q(e){return Object.assign({apikey:m.anonKey,Authorization:"Bearer "+(i.token||m.anonKey),"Content-Type":"application/json"},e||{})}async function B(e,t){const n=await fetch(`${m.url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:m.anonKey,"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})}),a=await n.json().catch(()=>({}));if(!n.ok)throw new Error(a.error_description||a.msg||a.error_code||a.error||"HTTP "+n.status);return a}async function o(e,t,n={}){const a=q(n.prefer?{Prefer:n.prefer}:null),l=await fetch(`${m.url}/rest/v1/${t}`,{method:e,headers:a,body:n.body?JSON.stringify(n.body):void 0});if(l.status===401)throw N(),new Error("session expired");if(!l.ok)throw new Error(await l.text());const c=await l.text();return c?JSON.parse(c):null}const G=(e,t)=>o("POST",`rpc/${e}`,{body:t});async function S(e,t){const n=await fetch(`${m.url}/functions/v1/${e}`,{method:"POST",headers:{apikey:m.anonKey,Authorization:"Bearer "+i.token,"Content-Type":"application/json"},body:JSON.stringify(t||{})}),a=await n.json().catch(()=>({}));if(!n.ok)throw new Error(a.error||"HTTP "+n.status);return a}const F={doctor:"doctor / therapist",treatment:"treatment",medicine:"medicine",advice_do:"advice (to do)",advice_dont:"advice (not to do)"};async function C(){const e=await o("GET","lists?select=kind,label&order=label.asc"),t={doctor:[],treatment:[],medicine:[],advice_do:[],advice_dont:[]};(e||[]).forEach(n=>{t[n.kind]&&t[n.kind].push({label:n.label})}),i.lists=t}async function J(e){const t=(prompt("Add new "+(F[e]||e)+":")||"").trim();if(t){try{await o("POST","lists",{body:{clinic_id:i.clinicId,kind:e,label:t}})}catch{}i.lists[e].some(n=>n.label===t)||i.lists[e].push({label:t}),document.querySelectorAll(`select[data-listkind="${e}"]`).forEach(n=>{const a=document.createElement("option");a.textContent=t,n.appendChild(a),n.value=t}),document.querySelectorAll(`.chips[data-listkind="${e}"]`).forEach(n=>{const a=document.createElement("button");a.type="button",a.className="chip on",a.dataset.id=t,a.textContent=t,n.appendChild(a)}),r("Added")}}async function K(){const e=localStorage.getItem($);if(e&&(i=Object.assign(i,JSON.parse(e))),z(),i.token){try{await C(),await I()}catch{}b()}else M()}async function I(){const e=await o("GET","clinics?select=*");i.clinic=e&&e[0]||null,i.clinic&&i.clinic.logo_url&&(document.querySelector(".topbar-logo").src=i.clinic.logo_url)}function U(){localStorage.setItem($,JSON.stringify({token:i.token,clinicId:i.clinicId,name:i.name}))}function z(){d("login-btn").onclick=O,d("password").addEventListener("keydown",e=>{e.key==="Enter"&&O()}),d("logout").onclick=N,d("tab-patients").onclick=()=>{i.tab="patients",i.current=null,b()},d("tab-offers").onclick=()=>{i.tab="offers",b()},d("tab-staff").onclick=()=>{i.tab="staff",b()},d("tab-branding").onclick=()=>{i.tab="branding",b()},d("view").addEventListener("click",te),d("view").addEventListener("change",ee)}async function O(){const e=d("email").value.trim().toLowerCase(),t=d("password").value,n=d("login-err");n.classList.add("hidden");const a=d("login-btn");a.disabled=!0,a.textContent="Logging in\u2026";try{const l=await B(e,t);i.token=l.access_token;const c=await o("GET","staff?select=clinic_id,name,role");if(!c||!c.length)throw new Error("no staff record");i.clinicId=c[0].clinic_id,i.name=c[0].name,U(),d("password").value="",await C(),await I(),i.tab="patients",b()}catch(l){n.textContent="Login error: "+(l.message||"unknown"),n.classList.remove("hidden")}finally{a.disabled=!1,a.textContent="Log in"}}function N(){i={token:null,clinicId:null,name:"",tab:"patients",patients:[],current:null,offers:[]},localStorage.removeItem($),M()}function M(){d("login").classList.remove("hidden"),d("app").classList.add("hidden")}function b(){d("login").classList.add("hidden"),d("app").classList.remove("hidden"),d("who").textContent=i.name||"",d("tab-patients").classList.toggle("active",i.tab==="patients"),d("tab-offers").classList.toggle("active",i.tab==="offers"),d("tab-staff").classList.toggle("active",i.tab==="staff"),d("tab-branding").classList.toggle("active",i.tab==="branding"),i.tab==="offers"?k():i.tab==="staff"?T():i.tab==="branding"?pe():i.current?w():g()}async function g(){d("view").innerHTML='<p class="muted">Loading\u2026</p>';try{i.patients=await o("GET","patients?select=id,op_number,name,mobile,last_visit_at&order=name.asc"),D()}catch(e){d("view").innerHTML=`<p class="err">${s(e.message)}</p>`}}function D(e=""){const t=e.toLowerCase(),n=i.patients.filter(a=>!t||(a.name||"").toLowerCase().includes(t)||(a.op_number||"").toLowerCase().includes(t));d("view").innerHTML=`
    <div class="searchbar">
      <input id="search" placeholder="Search by name or OP number" value="${s(e)}">
      <button class="btn" data-act="new-patient">+ New Patient</button>
    </div>
    <div class="plist">
      ${n.map(a=>`
        <div class="pitem" data-act="open" data-id="${a.id}">
          <div><div class="op">${s(a.op_number)}</div><div>${s(a.name)}</div></div>
          <div class="meta">${s(a.mobile||"")}<br>${a.last_visit_at||""}</div>
        </div>`).join("")||'<p class="muted">No patients yet. Add one.</p>'}
    </div>`,d("search").oninput=a=>D(a.target.value)}function V(){const e=new Date().getFullYear(),t=String(i.patients.length+1).padStart(x.opNumber.seqPadding,"0");return`${i.clinic&&i.clinic.op_prefix||x.opNumber.prefix}-${e}-${t}`}async function u(e){d("view").innerHTML='<p class="muted">Loading\u2026</p>';const a=(await o("GET",`patients?id=eq.${e}&select=${encodeURIComponent("*,visits(*),diagnoses(*),treatments(*),medicines(*),reminders(*),appointments(*)")}`))[0];i.current={patient:a,visit:L(a.visits)||{},diagnosis:L(a.diagnoses)||{},treatment:L(a.treatments)||{},medicines:a.medicines||[],reminders:a.reminders||[],followup:(a.appointments||[]).find(l=>l.type==="followup")||{}},w()}function W(){i.current={patient:{id:null,op_number:V()},visit:{},diagnosis:{},treatment:{},medicines:[],reminders:[],followup:{}},w()}function Y(e,t,n){return`<div class="chips" data-chips="${e}">${t.map(a=>`<button type="button" class="chip ${(n||[]).includes(a.id)?"on":""}" data-id="${a.id}">${s(a.en)}</button>`).join("")}</div>`}function _(e,t,n){const a=(i.lists[t]||[]).map(l=>`<option ${l.label===n?"selected":""}>${s(l.label)}</option>`).join("");return`<div class="addrow"><select data-f="${e}" data-listkind="${t}"><option value=""></option>${a}</select><button type="button" class="btn sm light" data-act="add-list" data-kind="${t}">\uFF0B</button></div>`}function R(e,t,n){const a=i.lists[t]||[];return`<div class="chips" data-chips="${e}" data-listkind="${t}">${a.map(l=>`<button type="button" class="chip ${(n||[]).includes(l.label)?"on":""}" data-id="${s(l.label)}">${s(l.label)}</button>`).join("")}</div><button type="button" class="btn sm light" data-act="add-list" data-kind="${t}" style="margin-top:6px">\uFF0B Add advice</button>`}function w(){const e=i.current,t=e.patient,n=e.visit,a=e.diagnosis,l=e.treatment,c=e.followup,h=(p,j,E="en")=>p.map(P=>`<option ${P[E]===j?"selected":""}>${s(P[E])}</option>`).join("");d("view").innerHTML=`
    <button class="back" data-act="back">\u2039 All patients</button>

    <div class="card"><h3>Registration</h3>
      <div class="row2">
        <div class="field"><label>OP Number</label><input data-f="op_number" value="${s(t.op_number||"")}"></div>
        <div class="field"><label>Name</label><input data-f="name" value="${s(t.name||"")}"></div>
        <div class="field"><label>Age</label><input data-f="age" type="number" value="${s(t.age??"")}"></div>
        <div class="field"><label>Mobile</label><input data-f="mobile" value="${s(t.mobile||"")}"></div>
        <div class="field"><label>Address</label><input data-f="address" value="${s(t.address||"")}"></div>
        <div class="field"><label>Referred by</label><input data-f="referred_by" value="${s(t.referred_by||"")}"></div>
      </div>
      <h4>Health information</h4>
      <div class="row2">
        <div class="field"><label>Height (cm)</label><input data-f="height_cm" type="number" min="0" step="0.1" value="${s(t.height_cm??"")}"></div>
        <div class="field"><label>Weight (kg)</label><input data-f="weight_kg" type="number" min="0" step="0.1" value="${s(t.weight_kg??"")}"></div>
        <div class="field"><label>Body fat (%)</label><input data-f="body_fat_pct" type="number" min="0" step="0.1" value="${s(t.body_fat_pct??"")}"></div>
        <div class="field"><label>Visceral fat</label><input data-f="visceral_fat" type="number" min="0" step="0.1" value="${s(t.visceral_fat??"")}"></div>
        <div class="field"><label>BMR (kcal/day)</label><input data-f="bmr_kcal" type="number" min="0" step="1" value="${s(t.bmr_kcal??"")}"></div>
        <div class="field"><label>BMI</label><input data-f="bmi" type="number" min="0" step="0.1" value="${s(t.bmi??"")}"></div>
        <div class="field"><label>Water (%)</label><input data-f="water_pct" type="number" min="0" step="0.1" value="${s(t.water_pct??"")}"></div>
        <div class="field"><label>Protein (%)</label><input data-f="protein_pct" type="number" min="0" step="0.1" value="${s(t.protein_pct??"")}"></div>
      </div>
      <button class="btn block" data-act="save-patient">${t.id?"Save patient":"Create patient"}</button>
    </div>

    ${t.id?Q(n,a,l,c):'<p class="muted">Create the patient first, then add records and set a login PIN.</p>'}
  `}function Q(e,t,n,a){return`
    <div class="card"><h3>Login PIN</h3>
      <div class="field"><label>Set / reset PIN (share with patient)</label><input data-f="pin" placeholder="e.g. 1234"></div>
      <button class="btn light" data-act="set-pin">Save PIN</button>
      <p class="pin-note">Patient logs in with their OP number + this PIN.</p>
    </div>

    <div class="card"><h3>Current issue</h3>
      <div class="field"><label>Main issue</label><input data-f="issue" value="${s(e.issue||"")}"></div>
      <div class="field"><label>History / symptoms</label><textarea data-f="history">${s(e.history||"")}</textarea></div>
      <div class="field"><label>Medicines / treatments already taken</label><textarea data-f="previous_treatment">${s(e.previous_treatment||"")}</textarea></div>
      <div class="field"><label>Other health issues</label>${Y("other_issues",A,e.other_issues)}</div>
      <div class="field"><label>Other (specify) \u2014 separate multiple with commas</label><input data-f="other_specify" value="${s((e.other_issues||[]).filter(l=>!A.some(c=>c.id===l)).join(", "))}"></div>
      <button class="btn block" data-act="save-visit">Save current issue</button>
    </div>

    <div class="card"><h3>Diagnosis (doctor only)</h3>
      <div class="field"><label>Diagnosis</label><textarea data-f="dx_text">${s(t.text||"")}</textarea></div>
      <div class="field"><label>Clinical notes</label><textarea data-f="dx_notes">${s(t.notes||"")}</textarea></div>
      <label class="switch-row"><input type="checkbox" data-f="dx_share" ${t.shared_with_patient?"checked":""}> Share diagnosis with patient</label>
      <button class="btn block" data-act="save-diagnosis">Save diagnosis</button>
    </div>

    <div class="card"><h3>Treatment plan</h3>
      <div class="row2">
        <div class="field"><label>Suggested by (doctor / therapist)</label>${_("tr_by","doctor",n.by_doctor)}</div>
        <div class="field"><label>Treatment</label>${_("tr_name","treatment",n.name)}</div>
        <div class="field"><label>Duration (days)</label><input data-f="tr_days" type="number" value="${s(n.duration_days||30)}"></div>
      </div>
      <div class="field"><label>Therapy instructions</label><textarea data-f="tr_instr">${s(n.instructions||"")}</textarea></div>
      <div class="field"><label>Advice \u2014 what to do</label>${R("advice_do","advice_do",n.advice_do)}</div>
      <div class="field"><label>Advice \u2014 what not to do</label>${R("advice_dont","advice_dont",n.advice_dont)}</div>
      <button class="btn block" data-act="save-treatment">Save treatment</button>
    </div>

    <div class="card"><h3>Medicines</h3>
      <div id="medlist">${(i.current.medicines||[]).map(X).join("")||'<p class="muted">None yet.</p>'}</div>
      <div class="row2">
        <div class="field"><label>Medicine</label>${_("m_name","medicine","")}</div>
        <div class="field"><label>Timing</label><input data-f="m_timing" placeholder="7:00 AM, 7:00 PM"></div>
        <div class="field"><label>Dosage</label><input data-f="m_dosage" placeholder="15 ml with warm water"></div>
        <div class="field"><label>Before / after food</label><select data-f="m_food"><option value="before">Before food</option><option value="after">After food</option></select></div>
        <div class="field"><label>Refill date</label><input data-f="m_refill" type="date"></div>
        <div class="field"><label>Instructions</label><input data-f="m_instr"></div>
      </div>
      <button class="btn light" data-act="add-medicine">+ Add medicine</button>
    </div>

    <div class="card"><h3>Reminders</h3>
      <div id="remlist">${(i.current.reminders||[]).map(Z).join("")||'<p class="muted">None yet.</p>'}</div>
      <div class="row2">
        <div class="field"><label>Time</label><input data-f="r_time" type="time"></div>
        <div class="field"><label>Medicine / item (from your medicines)</label>${_("r_med","medicine","")}</div>
      </div>
      <button class="btn light" data-act="add-reminder">+ Add reminder</button>
    </div>

    <div class="card"><h3>Follow-up appointment</h3>
      <div class="row2">
        <div class="field"><label>Date</label><input data-f="f_date" type="date" value="${s(a.date||"")}"></div>
        <div class="field"><label>Time</label><input data-f="f_time" type="time" value="${s(a.time||"")}"></div>
      </div>
      <button class="btn block" data-act="save-followup">Save follow-up</button>
    </div>

    <div class="card"><h3>Danger zone</h3>
      <button class="btn danger" data-act="del-patient">Delete this patient</button>
      <p class="pin-note">Permanently removes the patient and all their records.</p>
    </div>`}const X=e=>`<div class="med"><div class="top"><strong>${s(e.name)}</strong>
  <button class="btn danger sm" data-act="del-medicine" data-id="${e.id}">Remove</button></div>
  <div class="muted">${s(e.timing||"")} \xB7 ${s(e.dosage||"")} \xB7 ${e.food==="after"?"after food":"before food"}</div></div>`,Z=e=>`<div class="med"><div class="top"><strong>${s(e.time)} \u2014 ${s(e.label)}</strong>
  <button class="btn danger sm" data-act="del-reminder" data-id="${e.id}">Remove</button></div></div>`;function f(){const e={};return document.querySelectorAll("[data-f]").forEach(t=>{e[t.dataset.f]=t.type==="checkbox"?t.checked:t.value}),document.querySelectorAll("[data-chips]").forEach(t=>{e[t.dataset.chips]=[...t.querySelectorAll(".chip.on")].map(n=>n.dataset.id)}),e}function ee(e){const t=e.target.dataset&&e.target.dataset.act;t==="offer-image"&&he(e.target),t==="brand-logo"&&e.target.files[0]&&H(e.target.files[0],600,.85).then(n=>{v=n;const a=d("brand-preview");a&&(a.src=n,a.classList.remove("hidden"))})}async function te(e){const t=e.target.closest(".chip");if(t){t.classList.toggle("on");return}const n=e.target.closest("[data-act]");if(!n)return;const a=n.dataset.act,l=n.dataset.id,c={"new-patient":W,open:()=>u(l),back:()=>{i.current=null,g()},"save-patient":ae,"set-pin":ne,"save-visit":se,"save-diagnosis":de,"save-treatment":le,"add-medicine":oe,"del-medicine":()=>ce(l),"add-reminder":re,"del-reminder":()=>fe(l),"save-followup":ue,"del-patient":ie,"add-list":()=>J(n.dataset.kind),"add-offer":ge,"del-offer":()=>_e(l),"save-branding":me,"add-staff":ve,"del-staff":()=>be(l)};if(c[a]){e.preventDefault();try{await c[a]()}catch(h){r(h.message.slice(0,80))}}}async function ae(){const e=f(),t=a=>a===""||a==null?null:Number(a),n={name:e.name,age:t(e.age),mobile:e.mobile,address:e.address,referred_by:e.referred_by,op_number:e.op_number,height_cm:t(e.height_cm),weight_kg:t(e.weight_kg),body_fat_pct:t(e.body_fat_pct),visceral_fat:t(e.visceral_fat),bmr_kcal:t(e.bmr_kcal),bmi:t(e.bmi),water_pct:t(e.water_pct),protein_pct:t(e.protein_pct)};if(i.current.patient.id)await o("PATCH",`patients?id=eq.${i.current.patient.id}`,{body:n}),r("Saved");else{const a=await o("POST","patients",{body:Object.assign({clinic_id:i.clinicId},n),prefer:"return=representation"});i.current.patient=a[0],r("Patient created"),await g(),w()}}async function ie(){i.current.patient.id&&confirm("Delete this patient and ALL their records permanently? This cannot be undone.")&&(await o("DELETE",`patients?id=eq.${i.current.patient.id}`),r("Patient deleted"),i.current=null,await g())}async function ne(){const e=(f().pin||"").trim();if(!e)return r("Enter a PIN");await G("set_patient_pin",{p_patient_id:i.current.patient.id,p_pin:e}),r("PIN saved")}async function se(){const e=f(),t=(e.other_specify||"").split(",").map(a=>a.trim()).filter(Boolean),n=[...e.other_issues||[],...t];await o("POST","visits",{body:{patient_id:i.current.patient.id,issue:e.issue,history:e.history,previous_treatment:e.previous_treatment,other_issues:n}}),r("Saved"),await u(i.current.patient.id)}async function de(){const e=f();await o("POST","diagnoses",{body:{patient_id:i.current.patient.id,text:e.dx_text,notes:e.dx_notes,shared_with_patient:!!e.dx_share}}),r("Saved"),await u(i.current.patient.id)}async function le(){const e=f();await o("POST","treatments",{body:{patient_id:i.current.patient.id,by_doctor:e.tr_by,name:e.tr_name,duration_days:Number(e.tr_days)||30,instructions:e.tr_instr,advice_do:e.advice_do||[],advice_dont:e.advice_dont||[]}}),r("Saved"),await u(i.current.patient.id)}async function oe(){const e=f();e.m_name&&(await o("POST","medicines",{body:{patient_id:i.current.patient.id,name:e.m_name,type:"kashayam",timing:e.m_timing,dosage:e.m_dosage,food:e.m_food,instructions:e.m_instr,refill_date:e.m_refill||null}}),r("Added"),await u(i.current.patient.id))}async function ce(e){await o("DELETE",`medicines?id=eq.${e}`),r("Removed"),await u(i.current.patient.id)}async function re(){const e=f();if(!e.r_time||!e.r_med)return;const t=e.r_med,n=t.toLowerCase(),a=/thailam|oil|external|lepam/.test(n)?"external":/kashayam/.test(n)?"kashayam":"medicine";await o("POST","reminders",{body:{patient_id:i.current.patient.id,time:e.r_time,label:t,kind:a}}),r("Added"),await u(i.current.patient.id)}async function fe(e){await o("DELETE",`reminders?id=eq.${e}`),r("Removed"),await u(i.current.patient.id)}async function ue(){const e=f(),t=i.current.patient.id;await o("DELETE",`appointments?patient_id=eq.${t}&type=eq.followup`),await o("POST","appointments",{body:{patient_id:t,date:e.f_date,time:e.f_time,type:"followup",status:"upcoming",reminder_mode:"both"}}),r("Saved"),await u(t)}function pe(){const e=i.clinic||{};v=null,d("view").innerHTML=`
    <div class="card"><h3>Clinic branding</h3>
      <p class="muted">These apply to both the patient app and this admin console. Changes go live after the apps reload.</p>
      <div class="field"><label>Logo</label>
        <input type="file" accept="image/*" data-act="brand-logo">
        <img id="brand-preview" class="offer-img ${e.logo_url?"":"hidden"}" src="${s(e.logo_url||"")}">
      </div>
      <div class="row2">
        <div class="field"><label>Clinic name</label><input data-f="b_name" value="${s(e.name||"")}"></div>
        <div class="field"><label>Theme colour</label><input data-f="b_color" type="color" value="${s(e.theme_color||"#245b35")}"></div>
        <div class="field"><label>OP number prefix</label><input data-f="b_prefix" value="${s(e.op_prefix||"AY-OP")}"></div>
      </div>
      <div class="field"><label>Google review link</label><input data-f="b_review" value="${s(e.review_url||"")}"></div>
      <button class="btn block" data-act="save-branding">Save branding</button>
    </div>`}async function me(){const e=f(),t={name:e.b_name,theme_color:e.b_color,op_prefix:e.b_prefix,review_url:e.b_review};v&&(t.logo_url=v),await o("PATCH",`clinics?id=eq.${i.clinicId}`,{body:t}),Object.assign(i.clinic,t),v&&(document.querySelector(".topbar-logo").src=v),v=null,r("Branding saved")}async function T(){d("view").innerHTML='<p class="muted">Loading\u2026</p>';let e=[];try{e=(await S("manage-staff",{action:"list"})).staff||[]}catch(t){d("view").innerHTML=`<div class="card"><p class="err">${s(t.message)}</p><p class="muted">If this says Not Found, the manage-staff function is not deployed yet \u2014 see the setup guide.</p></div>`;return}d("view").innerHTML=`
    <div class="card"><h3>Staff logins</h3>
      ${e.map(t=>`<div class="med"><div class="top"><strong>${s(t.name)}</strong>
        ${t.self?'<span class="muted">you</span>':`<button class="btn danger sm" data-act="del-staff" data-id="${t.id}">Remove</button>`}</div>
        <div class="muted">${s(t.email)} \xB7 ${s(t.role)}</div></div>`).join("")||'<p class="muted">No staff yet.</p>'}
    </div>
    <div class="card"><h3>Add staff login</h3>
      <div class="row2">
        <div class="field"><label>Full name</label><input data-f="st_name"></div>
        <div class="field"><label>Email</label><input data-f="st_email" type="email"></div>
        <div class="field"><label>Password (6+ characters)</label><input data-f="st_pass"></div>
        <div class="field"><label>Role</label><select data-f="st_role"><option value="admin">Admin (full access)</option><option value="doctor">Doctor / staff</option></select></div>
      </div>
      <button class="btn block" data-act="add-staff">Create staff login</button>
      <p class="pin-note">They log in at ayu-sree.in/admin/ with this email + password.</p>
    </div>`}async function ve(){const e=f();if(!e.st_email||!e.st_pass){r("Enter email and password");return}await S("manage-staff",{action:"create",email:e.st_email,password:e.st_pass,name:e.st_name,role:e.st_role}),r("Staff added"),T()}async function be(e){confirm("Remove this staff login?")&&(await S("manage-staff",{action:"delete",staff_id:e}),r("Removed"),T())}let y=null;async function k(){d("view").innerHTML='<p class="muted">Loading\u2026</p>',i.offers=await o("GET","offers?select=*&order=id.desc"),d("view").innerHTML=`
    <div class="card"><h3>Add offer / update</h3>
      <div class="field"><label>Image (optional)</label><input type="file" accept="image/*" data-act="offer-image"><img id="offer-preview" class="offer-img hidden"></div>
      <div class="field"><label>Header (bold)</label><input data-f="o_title"></div>
      <div class="field"><label>Description</label><textarea data-f="o_body"></textarea></div>
      <div class="field"><label>Badge (optional)</label><input data-f="o_badge" placeholder="Offer / New"></div>
      <button class="btn block" data-act="add-offer">Publish offer</button>
    </div>
    <div class="card"><h3>Published offers</h3>
      ${i.offers.map(e=>`<div class="med"><div class="top"><strong>${s(e.title||"")}</strong>
        <button class="btn danger sm" data-act="del-offer" data-id="${e.id}">Delete</button></div>
        <div class="muted">${s(e.body||"")}</div>${e.image_url?`<img class="offer-img" src="${s(e.image_url)}">`:""}</div>`).join("")||'<p class="muted">No offers yet.</p>'}
    </div>`}function he(e){e.files[0]&&H(e.files[0]).then(t=>{y=t;const n=d("offer-preview");n.src=t,n.classList.remove("hidden")})}async function ge(){const e=f();if(!e.o_title&&!y)return r("Add a header or image");await o("POST","offers",{body:{clinic_id:i.clinicId,title:e.o_title,body:e.o_body,badge:e.o_badge||null,image_url:y||null,active:!0}}),y=null,r("Published"),k()}async function _e(e){await o("DELETE",`offers?id=eq.${e}`),r("Deleted"),k()}function H(e,t=900,n=.72){return new Promise(a=>{const l=new FileReader;l.onload=()=>{const c=new Image;c.onload=()=>{const h=Math.min(1,t/c.width),p=document.createElement("canvas");p.width=Math.round(c.width*h),p.height=Math.round(c.height*h),p.getContext("2d").drawImage(c,0,0,p.width,p.height),a(p.toDataURL("image/jpeg",n))},c.onerror=()=>a(l.result),c.src=l.result},l.readAsDataURL(e)})}K();
