import{SUPABASE as v}from"../config/supabase.config.js";import{CLINIC as x}from"../config/clinic.config.js";import{HEALTH_ISSUES as C}from"../config/libraries.js";const y="ayusree.admin.v1";let a={token:null,clinicId:null,name:"",tab:"patients",patients:[],current:null,offers:[],clinic:null,lists:{doctor:[],treatment:[],medicine:[],advice_do:[],advice_dont:[]}},b=null;const d=e=>document.getElementById(e),s=(e="")=>String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Ee=e=>a.token;function o(e){const t=d("toast");t.textContent=e,t.classList.add("show"),clearTimeout(t._t),t._t=setTimeout(()=>t.classList.remove("show"),1800)}const $=e=>e&&e.length?e.slice().sort((t,n)=>new Date(n.created_at)-new Date(t.created_at))[0]:null;function q(e){return Object.assign({apikey:v.anonKey,Authorization:"Bearer "+(a.token||v.anonKey),"Content-Type":"application/json"},e||{})}async function B(e,t){const n=await fetch(`${v.url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:v.anonKey,"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})}),i=await n.json().catch(()=>({}));if(!n.ok)throw new Error(i.error_description||i.msg||i.error_code||i.error||"HTTP "+n.status);return i}async function c(e,t,n={}){const i=q(n.prefer?{Prefer:n.prefer}:null),l=await fetch(`${v.url}/rest/v1/${t}`,{method:e,headers:i,body:n.body?JSON.stringify(n.body):void 0});if(l.status===401)throw N(),new Error("session expired");if(!l.ok)throw new Error(await l.text());const r=await l.text();return r?JSON.parse(r):null}const G=(e,t)=>c("POST",`rpc/${e}`,{body:t});async function S(e,t){const n=await fetch(`${v.url}/functions/v1/${e}`,{method:"POST",headers:{apikey:v.anonKey,Authorization:"Bearer "+a.token,"Content-Type":"application/json"},body:JSON.stringify(t||{})}),i=await n.json().catch(()=>({}));if(!n.ok)throw new Error(i.error||"HTTP "+n.status);return i}const F={doctor:"doctor / therapist",treatment:"treatment",medicine:"medicine",advice_do:"advice (to do)",advice_dont:"advice (not to do)"};async function A(){const e=await c("GET","lists?select=kind,label&order=label.asc"),t={doctor:[],treatment:[],medicine:[],advice_do:[],advice_dont:[]};(e||[]).forEach(n=>{t[n.kind]&&t[n.kind].push({label:n.label})}),a.lists=t}async function J(e){const t=(prompt("Add new "+(F[e]||e)+":")||"").trim();if(t){try{await c("POST","lists",{body:{clinic_id:a.clinicId,kind:e,label:t}})}catch{}a.lists[e].some(n=>n.label===t)||a.lists[e].push({label:t}),document.querySelectorAll(`select[data-listkind="${e}"]`).forEach(n=>{const i=document.createElement("option");i.textContent=t,n.appendChild(i),n.value=t}),document.querySelectorAll(`.chips[data-listkind="${e}"]`).forEach(n=>{const i=document.createElement("button");i.type="button",i.className="chip on",i.dataset.id=t,i.textContent=t,n.appendChild(i)}),o("Added")}}async function K(){const e=localStorage.getItem(y);if(e&&(a=Object.assign(a,JSON.parse(e))),z(),a.token){try{await A(),await O()}catch{}h()}else R()}async function O(){const e=await c("GET","clinics?select=*");a.clinic=e&&e[0]||null,a.clinic&&a.clinic.logo_url&&(document.querySelector(".topbar-logo").src=a.clinic.logo_url)}function U(){localStorage.setItem(y,JSON.stringify({token:a.token,clinicId:a.clinicId,name:a.name}))}function z(){d("login-btn").onclick=I,d("password").addEventListener("keydown",e=>{e.key==="Enter"&&I()}),d("logout").onclick=N,d("tab-patients").onclick=()=>{a.tab="patients",a.current=null,h()},d("tab-offers").onclick=()=>{a.tab="offers",h()},d("tab-staff").onclick=()=>{a.tab="staff",h()},d("tab-branding").onclick=()=>{a.tab="branding",h()},d("view").addEventListener("click",te),d("view").addEventListener("change",ee)}async function I(){const e=d("email").value.trim().toLowerCase(),t=d("password").value,n=d("login-err");n.classList.add("hidden");const i=d("login-btn");i.disabled=!0,i.textContent="Logging in\u2026";try{const l=await B(e,t);a.token=l.access_token;const r=await c("GET","staff?select=clinic_id,name,role");if(!r||!r.length)throw new Error("no staff record");a.clinicId=r[0].clinic_id,a.name=r[0].name,U(),d("password").value="",await A(),await O(),a.tab="patients",h()}catch(l){n.textContent="Login error: "+(l.message||"unknown"),n.classList.remove("hidden")}finally{i.disabled=!1,i.textContent="Log in"}}function N(){a={token:null,clinicId:null,name:"",tab:"patients",patients:[],current:null,offers:[]},localStorage.removeItem(y),R()}function R(){d("login").classList.remove("hidden"),d("app").classList.add("hidden")}function h(){d("login").classList.add("hidden"),d("app").classList.remove("hidden"),d("who").textContent=a.name||"",d("tab-patients").classList.toggle("active",a.tab==="patients"),d("tab-offers").classList.toggle("active",a.tab==="offers"),d("tab-staff").classList.toggle("active",a.tab==="staff"),d("tab-branding").classList.toggle("active",a.tab==="branding"),a.tab==="offers"?T():a.tab==="staff"?k():a.tab==="branding"?me():a.current?_():g()}async function g(){d("view").innerHTML='<p class="muted">Loading\u2026</p>';try{a.patients=await c("GET","patients?select=id,op_number,name,mobile,last_visit_at&order=name.asc"),D()}catch(e){d("view").innerHTML=`<p class="err">${s(e.message)}</p>`}}function D(e=""){const t=e.toLowerCase(),n=a.patients.filter(i=>!t||(i.name||"").toLowerCase().includes(t)||(i.op_number||"").toLowerCase().includes(t));d("view").innerHTML=`
    <div class="searchbar">
      <input id="search" placeholder="Search by name or OP number" value="${s(e)}">
      <button class="btn" data-act="new-patient">+ New Patient</button>
    </div>
    <div class="plist">
      ${n.map(i=>`
        <div class="pitem" data-act="open" data-id="${i.id}">
          <div><div class="op">${s(i.op_number)}</div><div>${s(i.name)}</div></div>
          <div class="meta">${s(i.mobile||"")}<br>${i.last_visit_at||""}</div>
        </div>`).join("")||'<p class="muted">No patients yet. Add one.</p>'}
    </div>`,d("search").oninput=i=>D(i.target.value)}function V(){const e=new Date().getFullYear(),t=String(a.patients.length+1).padStart(x.opNumber.seqPadding,"0");return`${a.clinic&&a.clinic.op_prefix||x.opNumber.prefix}-${e}-${t}`}async function p(e){d("view").innerHTML='<p class="muted">Loading\u2026</p>';const i=(await c("GET",`patients?id=eq.${e}&select=${encodeURIComponent("*,visits(*),diagnoses(*),treatments(*),medicines(*),reminders(*),appointments(*)")}`))[0];a.current={patient:i,visit:$(i.visits)||{},diagnosis:$(i.diagnoses)||{},treatment:$(i.treatments)||{},medicines:i.medicines||[],reminders:i.reminders||[],followup:(i.appointments||[]).find(l=>l.type==="followup")||{}},_()}function W(){a.current={patient:{id:null,op_number:V()},visit:{},diagnosis:{},treatment:{},medicines:[],reminders:[],followup:{}},_()}function Y(e,t,n){return`<div class="chips" data-chips="${e}">${t.map(i=>`<button type="button" class="chip ${(n||[]).includes(i.id)?"on":""}" data-id="${i.id}">${s(i.en)}</button>`).join("")}</div>`}function L(e,t,n){const i=(a.lists[t]||[]).map(l=>`<option ${l.label===n?"selected":""}>${s(l.label)}</option>`).join("");return`<div class="addrow"><select data-f="${e}" data-listkind="${t}"><option value=""></option>${i}</select><button type="button" class="btn sm light" data-act="add-list" data-kind="${t}">\uFF0B</button></div>`}function M(e,t,n){const i=a.lists[t]||[];return`<div class="chips" data-chips="${e}" data-listkind="${t}">${i.map(l=>`<button type="button" class="chip ${(n||[]).includes(l.label)?"on":""}" data-id="${s(l.label)}">${s(l.label)}</button>`).join("")}</div><button type="button" class="btn sm light" data-act="add-list" data-kind="${t}" style="margin-top:6px">\uFF0B Add advice</button>`}function _(){const e=a.current,t=e.patient,n=e.visit,i=e.diagnosis,l=e.treatment,r=e.followup,u=(m,H,E="en")=>m.map(P=>`<option ${P[E]===H?"selected":""}>${s(P[E])}</option>`).join("");d("view").innerHTML=`
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

    ${t.id?Q(n,i,l,r):'<p class="muted">Create the patient first, then add records and set a login PIN.</p>'}
  `}function Q(e,t,n,i){return`
    <div class="card"><h3>Login PIN</h3>
      <div class="field"><label>Set / reset PIN (share with patient)</label><input data-f="pin" placeholder="e.g. 1234"></div>
      <button class="btn light" data-act="set-pin">Save PIN</button>
      <p class="pin-note">Patient logs in with their OP number + this PIN.</p>
    </div>

    <div class="card"><h3>Current issue</h3>
      <div class="field"><label>Main issue</label><input data-f="issue" value="${s(e.issue||"")}"></div>
      <div class="field"><label>History / symptoms</label><textarea data-f="history">${s(e.history||"")}</textarea></div>
      <div class="field"><label>Medicines / treatments already taken</label><textarea data-f="previous_treatment">${s(e.previous_treatment||"")}</textarea></div>
      <div class="field"><label>Other health issues</label>${Y("other_issues",C,e.other_issues)}</div>
      <div class="field"><label>Other (specify) \u2014 separate multiple with commas</label><input data-f="other_specify" value="${s((e.other_issues||[]).filter(l=>!C.some(r=>r.id===l)).join(", "))}"></div>
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
        <div class="field"><label>Suggested by (doctor / therapist)</label>${L("tr_by","doctor",n.by_doctor)}</div>
        <div class="field"><label>Treatment</label>${L("tr_name","treatment",n.name)}</div>
        <div class="field"><label>Duration (days)</label><input data-f="tr_days" type="number" value="${s(n.duration_days||30)}"></div>
      </div>
      <div class="field"><label>Therapy instructions</label><textarea data-f="tr_instr">${s(n.instructions||"")}</textarea></div>
      <div class="field"><label>Advice \u2014 what to do</label>${M("advice_do","advice_do",n.advice_do)}</div>
      <div class="field"><label>Advice \u2014 what not to do</label>${M("advice_dont","advice_dont",n.advice_dont)}</div>
      <button class="btn block" data-act="save-treatment">Save treatment</button>
    </div>

    <div class="card"><h3>Medicines</h3>
      <div id="medlist">${(a.current.medicines||[]).map(X).join("")||'<p class="muted">None yet.</p>'}</div>
      <div class="row2">
        <div class="field"><label>Medicine</label>${L("m_name","medicine","")}</div>
        <div class="field"><label>Reminder time</label><input data-f="m_timing" type="time"></div>
        <div class="field"><label>Dosage</label><input data-f="m_dosage" placeholder="15 ml with warm water"></div>
        <div class="field"><label>Before / after food</label><select data-f="m_food"><option value="before">Before food</option><option value="after">After food</option></select></div>
        <div class="field"><label>Refill date</label><input data-f="m_refill" type="date"></div>
        <div class="field"><label>Instructions</label><input data-f="m_instr"></div>
      </div>
      <button class="btn light" data-act="add-medicine">+ Save medicine</button>
    </div>

    <div class="card"><h3>Reminders</h3>
      <div id="remlist">${(a.current.reminders||[]).map(Z).join("")||'<p class="muted">None yet.</p>'}</div>
    </div>

    <div class="card"><h3>Follow-up appointment</h3>
      <div class="row2">
        <div class="field"><label>Date</label><input data-f="f_date" type="date" value="${s(i.date||"")}"></div>
        <div class="field"><label>Time</label><input data-f="f_time" type="time" value="${s(i.time||"")}"></div>
      </div>
      <button class="btn block" data-act="save-followup">Save follow-up</button>
    </div>

    <div class="card"><h3>Danger zone</h3>
      <button class="btn danger" data-act="del-patient">Delete this patient</button>
      <p class="pin-note">Permanently removes the patient and all their records.</p>
    </div>`}const X=e=>{const t=(a.current.reminders||[]).filter(n=>n.medicine_id===e.id);return`<div class="med"><div class="top"><strong>${s(e.name)}</strong>
    <button class="btn danger sm" data-act="del-medicine" data-id="${e.id}">Remove</button></div>
    <div class="muted">${s(e.dosage||"")} \xB7 ${e.food==="after"?"after food":"before food"}</div>
    ${e.instructions?`<div class="muted">${s(e.instructions)}</div>`:""}
    ${t.length?`<div class="reminder-times">Reminders: ${t.map(n=>s(n.time)).join(", ")}</div>`:""}
    <div class="medicine-reminder-row">
      <input type="time" data-reminder-time="${e.id}" value="${/^\d{2}:\d{2}/.test(e.timing||"")?s(e.timing.slice(0,5)):""}">
      <button class="btn light sm" data-act="add-med-reminder" data-id="${e.id}">+ Add Reminder</button>
    </div>
  </div>`},Z=e=>`<div class="med"><div class="top"><strong>${s(e.time)} \u2014 ${s(e.label)}</strong>
  <button class="btn danger sm" data-act="del-reminder" data-id="${e.id}">Remove</button></div>
  <div class="muted">${s(e.dosage||"")} ${e.food?`\xB7 ${e.food==="after"?"after food":"before food"}`:""}</div>
  ${e.instructions?`<div class="muted">${s(e.instructions)}</div>`:""}</div>`;function f(){const e={};return document.querySelectorAll("[data-f]").forEach(t=>{e[t.dataset.f]=t.type==="checkbox"?t.checked:t.value}),document.querySelectorAll("[data-chips]").forEach(t=>{e[t.dataset.chips]=[...t.querySelectorAll(".chip.on")].map(n=>n.dataset.id)}),e}function ee(e){const t=e.target.dataset&&e.target.dataset.act;t==="offer-image"&&ge(e.target),t==="brand-logo"&&e.target.files[0]&&j(e.target.files[0],600,.85).then(n=>{b=n;const i=d("brand-preview");i&&(i.src=n,i.classList.remove("hidden"))})}async function te(e){const t=e.target.closest(".chip");if(t){t.classList.toggle("on");return}const n=e.target.closest("[data-act]");if(!n)return;const i=n.dataset.act,l=n.dataset.id,r={"new-patient":W,open:()=>p(l),back:()=>{a.current=null,g()},"save-patient":ae,"set-pin":ne,"save-visit":se,"save-diagnosis":de,"save-treatment":le,"add-medicine":oe,"del-medicine":()=>re(l),"add-med-reminder":()=>ce(l),"add-reminder":ue,"del-reminder":()=>fe(l),"save-followup":pe,"del-patient":ie,"add-list":()=>J(n.dataset.kind),"add-offer":_e,"del-offer":()=>we(l),"save-branding":ve,"add-staff":be,"del-staff":()=>he(l)};if(r[i]){e.preventDefault();try{await r[i]()}catch(u){o(u.message.slice(0,80))}}}async function ae(){const e=f(),t=i=>i===""||i==null?null:Number(i),n={name:e.name,age:t(e.age),mobile:e.mobile,address:e.address,referred_by:e.referred_by,op_number:e.op_number,height_cm:t(e.height_cm),weight_kg:t(e.weight_kg),body_fat_pct:t(e.body_fat_pct),visceral_fat:t(e.visceral_fat),bmr_kcal:t(e.bmr_kcal),bmi:t(e.bmi),water_pct:t(e.water_pct),protein_pct:t(e.protein_pct)};if(a.current.patient.id)await c("PATCH",`patients?id=eq.${a.current.patient.id}`,{body:n}),o("Saved");else{const i=await c("POST","patients",{body:Object.assign({clinic_id:a.clinicId},n),prefer:"return=representation"});a.current.patient=i[0],o("Patient created"),await g(),_()}}async function ie(){a.current.patient.id&&confirm("Delete this patient and ALL their records permanently? This cannot be undone.")&&(await c("DELETE",`patients?id=eq.${a.current.patient.id}`),o("Patient deleted"),a.current=null,await g())}async function ne(){const e=(f().pin||"").trim();if(!e)return o("Enter a PIN");await G("set_patient_pin",{p_patient_id:a.current.patient.id,p_pin:e}),o("PIN saved")}async function se(){const e=f(),t=(e.other_specify||"").split(",").map(i=>i.trim()).filter(Boolean),n=[...e.other_issues||[],...t];await c("POST","visits",{body:{patient_id:a.current.patient.id,issue:e.issue,history:e.history,previous_treatment:e.previous_treatment,other_issues:n}}),o("Saved"),await p(a.current.patient.id)}async function de(){const e=f();await c("POST","diagnoses",{body:{patient_id:a.current.patient.id,text:e.dx_text,notes:e.dx_notes,shared_with_patient:!!e.dx_share}}),o("Saved"),await p(a.current.patient.id)}async function le(){const e=f();await c("POST","treatments",{body:{patient_id:a.current.patient.id,by_doctor:e.tr_by,name:e.tr_name,duration_days:Number(e.tr_days)||30,instructions:e.tr_instr,advice_do:e.advice_do||[],advice_dont:e.advice_dont||[]}}),o("Saved"),await p(a.current.patient.id)}async function oe(){const e=f();e.m_name&&(await c("POST","medicines",{body:{patient_id:a.current.patient.id,name:e.m_name,type:"kashayam",timing:e.m_timing,dosage:e.m_dosage,food:e.m_food,instructions:e.m_instr,refill_date:e.m_refill||null}}),o("Added"),await p(a.current.patient.id))}async function re(e){await c("DELETE",`medicines?id=eq.${e}`),o("Removed"),await p(a.current.patient.id)}async function ce(e){const t=(a.current.medicines||[]).find(u=>u.id===e),i=[...document.querySelectorAll("[data-reminder-time]")].find(u=>u.dataset.reminderTime===e)?.value||"";if(!t||!i)return o("Select a reminder time");if((a.current.reminders||[]).some(u=>u.medicine_id===e&&(u.time||"").slice(0,5)===i))return o("This reminder already exists");const l=t.name.toLowerCase(),r=/thailam|oil|external|lepam/.test(l)?"external":/kashayam/.test(l)?"kashayam":"medicine";await c("POST","reminders",{body:{patient_id:a.current.patient.id,medicine_id:t.id,time:i,label:t.name,kind:r,dosage:t.dosage||"",food:t.food||"",instructions:t.instructions||""}}),o("Reminder added"),await p(a.current.patient.id)}async function ue(){const e=f();if(!e.r_time||!e.r_med)return;const t=e.r_med,n=t.toLowerCase(),i=/thailam|oil|external|lepam/.test(n)?"external":/kashayam/.test(n)?"kashayam":"medicine";await c("POST","reminders",{body:{patient_id:a.current.patient.id,time:e.r_time,label:t,kind:i}}),o("Added"),await p(a.current.patient.id)}async function fe(e){await c("DELETE",`reminders?id=eq.${e}`),o("Removed"),await p(a.current.patient.id)}async function pe(){const e=f(),t=a.current.patient.id;await c("DELETE",`appointments?patient_id=eq.${t}&type=eq.followup`),await c("POST","appointments",{body:{patient_id:t,date:e.f_date,time:e.f_time,type:"followup",status:"upcoming",reminder_mode:"both"}}),o("Saved"),await p(t)}function me(){const e=a.clinic||{};b=null,d("view").innerHTML=`
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
    </div>`}async function ve(){const e=f(),t={name:e.b_name,theme_color:e.b_color,op_prefix:e.b_prefix,review_url:e.b_review};b&&(t.logo_url=b),await c("PATCH",`clinics?id=eq.${a.clinicId}`,{body:t}),Object.assign(a.clinic,t),b&&(document.querySelector(".topbar-logo").src=b),b=null,o("Branding saved")}async function k(){d("view").innerHTML='<p class="muted">Loading\u2026</p>';let e=[];try{e=(await S("manage-staff",{action:"list"})).staff||[]}catch(t){d("view").innerHTML=`<div class="card"><p class="err">${s(t.message)}</p><p class="muted">If this says Not Found, the manage-staff function is not deployed yet \u2014 see the setup guide.</p></div>`;return}d("view").innerHTML=`
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
    </div>`}async function be(){const e=f();if(!e.st_email||!e.st_pass){o("Enter email and password");return}await S("manage-staff",{action:"create",email:e.st_email,password:e.st_pass,name:e.st_name,role:e.st_role}),o("Staff added"),k()}async function he(e){confirm("Remove this staff login?")&&(await S("manage-staff",{action:"delete",staff_id:e}),o("Removed"),k())}let w=null;async function T(){d("view").innerHTML='<p class="muted">Loading\u2026</p>',a.offers=await c("GET","offers?select=*&order=id.desc"),d("view").innerHTML=`
    <div class="card"><h3>Add offer / update</h3>
      <div class="field"><label>Image (optional)</label><input type="file" accept="image/*" data-act="offer-image"><img id="offer-preview" class="offer-img hidden"></div>
      <div class="field"><label>Header (bold)</label><input data-f="o_title"></div>
      <div class="field"><label>Description</label><textarea data-f="o_body"></textarea></div>
      <div class="field"><label>Badge (optional)</label><input data-f="o_badge" placeholder="Offer / New"></div>
      <button class="btn block" data-act="add-offer">Publish offer</button>
    </div>
    <div class="card"><h3>Published offers</h3>
      ${a.offers.map(e=>`<div class="med"><div class="top"><strong>${s(e.title||"")}</strong>
        <button class="btn danger sm" data-act="del-offer" data-id="${e.id}">Delete</button></div>
        <div class="muted">${s(e.body||"")}</div>${e.image_url?`<img class="offer-img" src="${s(e.image_url)}">`:""}</div>`).join("")||'<p class="muted">No offers yet.</p>'}
    </div>`}function ge(e){e.files[0]&&j(e.files[0]).then(t=>{w=t;const n=d("offer-preview");n.src=t,n.classList.remove("hidden")})}async function _e(){const e=f();if(!e.o_title&&!w)return o("Add a header or image");await c("POST","offers",{body:{clinic_id:a.clinicId,title:e.o_title,body:e.o_body,badge:e.o_badge||null,image_url:w||null,active:!0}}),w=null,o("Published"),T()}async function we(e){await c("DELETE",`offers?id=eq.${e}`),o("Deleted"),T()}function j(e,t=900,n=.72){return new Promise(i=>{const l=new FileReader;l.onload=()=>{const r=new Image;r.onload=()=>{const u=Math.min(1,t/r.width),m=document.createElement("canvas");m.width=Math.round(r.width*u),m.height=Math.round(r.height*u),m.getContext("2d").drawImage(r,0,0,m.width,m.height),i(m.toDataURL("image/jpeg",n))},r.onerror=()=>i(l.result),r.src=l.result},l.readAsDataURL(e)})}K();
