import{t as o,L as m,getLang as k}from"./i18n.js";import{getData as u,isDoctor as v}from"./store.js";import{CLINIC as b}from"../config/clinic.config.js";import{HEALTH_ISSUES as D,TREATMENTS as P,MEDICINES as F,ADVICE as w}from"../config/libraries.js";import{card as i,row as n,pill as I,field as d,input as p,textarea as f,select as h,button as $,chipSelect as x,doctorOnly as K,esc as c}from"./components.js";const g=t=>t?new Date(t+(t.length===10?"T00:00:00":"")).toLocaleDateString(k()==="ml"?"ml-IN":"en-GB",{day:"2-digit",month:"short",year:"numeric"}):"-",T=(t,e)=>{const a=t.find(r=>r.id===e);return a?m(a):e},y=(t,e)=>`<div class="ro-block"><div class="ro-label">${o(t)}</div><div class="ro-text">${c(e||"-")}</div></div>`,N=(t,e,a="")=>e&&e.length?e.map(r=>I(T(t,r),a)).join(""):`<span class="muted-note">${o("none")}</span>`;export function dashboard(){const t=u(),e=t.patient,a=t.treatment.durationDays,r=t.progress.completedDays,l=t.currentIssue.otherIssues.map(s=>T(D,s));return`
    ${i("opNumber",`<div class="op-number">${c(e.opNumber)}</div>`,{cls:"op-card"})}
    ${i("patientOverview",`
      ${n("name",e.name)}
      ${n("age",e.age)}
      ${n("mobile",e.mobile)}
      ${n("address",e.address)}
      ${n("joined",g(e.joined))}
      ${n("lastVisit",g(e.lastVisit))}
    `)}
    ${i("latestHealth",`
      ${I(t.currentIssue.issue,"red")}
      ${l.map(s=>I(s,"orange")).join("")}
      ${n("treatmentJourney",`${o("day")} ${r} ${o("of")} ${a}`,!0)}
      <div class="progress"><div class="progress-bar" style="width:${Math.round(r/a*100)}%"></div></div>
    `)}
    ${i("todaysReminders",`
      ${t.reminders.map(s=>n(s.time,s.label,!0)).join("")}
      ${$("markComplete",{action:"mark-complete"})}
    `)}
    ${i("nextFollowup",`
      ${n("date",g(t.followup.date))}
      ${n("time",t.followup.time)}
      ${$("viewAppointment",{cls:"light",action:"goto-followup"})}
    `)}`}function R(t){const e=v();return`
    <div class="flyer">
      ${t.image?`<img class="flyer-img" src="${c(t.image)}" alt="">`:`<div class="flyer-banner" style="background:${c(t.color||"#245b35")}">
         ${t.badge?`<span class="flyer-badge">${c(m(t.badge))}</span>`:""}
         <div class="flyer-title">${c(m(t.title))}</div>
       </div>`}
      <div class="flyer-body">
        ${t.image?`<div class="flyer-title dark">${c(m(t.title))}</div>`:""}
        <p>${c(m(t.body))}</p>
        <div class="flyer-actions">
          <button class="btn small orange" data-action="share-ad" data-id="${t.id}"><span class="share-ic">\u2934</span> ${o("share")}</button>
          ${e?`<button class="btn small light" data-action="delete-ad" data-id="${t.id}">${o("remove")}</button>`:""}
        </div>
      </div>
    </div>`}export function ads(){const t=u(),e=t.ads&&t.ads.length?`<div class="flyers">${t.ads.map(R).join("")}</div>`:`<p class="muted-note">${o("none")}</p>`,a=v()?`
    <form data-form="newad">
    ${i("addOffer",`
      <div class="field">
        <label>${o("offerImage")}</label>
        <input type="file" accept="image/*" name="image" id="ad-image">
        <img id="ad-preview" class="ad-preview hidden" alt="">
      </div>
      ${d("offerHeader",p("title",""))}
      ${d("offerText",f("body",""))}
      ${$("publishOffer",{action:"publish-ad"})}
    `)}
    </form>`:"";return e+a}export function visit(){const t=u(),e=t.patient,a=t.health||{},r=t.currentIssue;return v()?`
    <form data-form="visit">
    ${i("patientOverview",`
      ${d("opNumber",p("opNumber",e.opNumber))}
      ${d("name",p("name",e.name))}
      ${d("age",p("age",e.age,"number"))}
      ${d("mobileNumber",p("mobile",e.mobile))}
      ${d("address",f("address",e.address))}
      ${d("referredBy",p("referredBy",e.referredBy))}
    `)}
    ${i("currentHealthIssue",`
      ${d("issue",p("issue",r.issue))}
      ${d("history",f("history",r.history))}
      ${d("previousTreatment",f("previousTreatment",r.previousTreatment))}
      ${d("otherIssues",x("otherIssues",D.map(l=>({id:l.id,label:m(l)})),r.otherIssues))}
      ${$("saveVisit",{action:"save-visit"})}
    `)}
    </form>`:`
      ${i("patientOverview",`
        ${n("opNumber",e.opNumber)}
        ${n("name",e.name)}
        ${n("age",e.age)}
        ${n("mobileNumber",e.mobile)}
        ${n("address",e.address)}
        ${n("referredBy",e.referredBy)}
      `)}
      ${i("healthInformation",`
        ${n("height",a.heightCm===""?"":`${a.heightCm} cm`)}
        ${n("weight",a.weightKg===""?"":`${a.weightKg} kg`)}
        ${n("bodyFat",a.bodyFatPct===""?"":`${a.bodyFatPct}%`)}
        ${n("visceralFat",a.visceralFat)}
        ${n("bmr",a.bmrKcal===""?"":`${a.bmrKcal} kcal/day`)}
        ${n("bmi",a.bmi)}
        ${n("bodyWater",a.waterPct===""?"":`${a.waterPct}%`)}
        ${n("protein",a.proteinPct===""?"":`${a.proteinPct}%`)}
      `)}
      ${i("currentHealthIssue",`
        ${n("issue",r.issue)}
        ${y("history",r.history)}
        ${y("previousTreatment",r.previousTreatment)}
        <div class="ro-label">${o("otherIssues")}</div>
        <div>${N(D,r.otherIssues,"orange")}</div>
      `)}`}export function diagnosis(){const e=u().diagnosis;return v()?`
    <form data-form="diagnosis">
    ${i("diagnosis",`
      ${K()}
      ${d("diagnosis",f("text",e.text))}
      ${d("clinicalNotes",f("notes",e.notes))}
      <label class="switch-row">
        <input type="checkbox" name="sharedWithPatient" ${e.sharedWithPatient?"checked":""}>
        <span>${o("shareWithPatient")}</span>
      </label>
      ${$("saveDiagnosis",{action:"save-diagnosis"})}
    `)}
    </form>`:e.sharedWithPatient?i("diagnosis",`
      ${y("diagnosis",e.text)}
      ${y("clinicalNotes",e.notes)}`):i("diagnosis",`<p class="muted-note">\u{1F512} ${o("hiddenFromPatient")}</p>`)}export function treatment(){const t=u(),e=t.treatment,a=t.pathya;if(!v())return`
      ${i("treatmentPlan",`
        ${n("treatmentBy",e.by)}
        ${n("treatmentName",e.name)}
        ${n("duration",e.durationDays)}
        ${y("therapyInstructions",e.instructions)}
      `)}
      ${i("adviceDo",N(w.do,a.adviceDo))}
      ${i("adviceNotDo",N(w.dont,a.adviceDont,"orange"))}`;const r=b.doctors.map(s=>({value:s.name,label:s.name})),l=P.map(s=>({value:m(s),label:m(s)}));return`
    <form data-form="treatment">
    ${i("treatmentPlan",`
      ${d("treatmentBy",h("by",r,e.by))}
      ${d("treatmentName",h("name",l,e.name))}
      ${d("duration",p("durationDays",e.durationDays,"number"))}
      ${d("therapyInstructions",f("instructions",e.instructions))}
    `)}
    ${i("adviceDo",x("adviceDo",w.do.map(s=>({id:s.id,label:m(s)})),a.adviceDo))}
    ${i("adviceNotDo",x("adviceDont",w.dont.map(s=>({id:s.id,label:m(s)})),a.adviceDont))}
    ${$("saveTreatment",{action:"save-treatment"})}
    </form>`}export function medicine(){const e=u().medicines.map(s=>`
    <div class="med-item">
      <div class="med-head">
        <strong>${c(s.name)}</strong>
        <span class="pill ${s.type==="thailam"?"orange":""}">${c(s.timing)}</span>
      </div>
      <div class="row"><span class="label">${o("dosage")}</span><span class="value">${c(s.dosage)}</span></div>
      <div class="row"><span class="label">${o("foodTiming")}</span><span class="value">${s.food==="before"?o("beforeFood"):o("afterFood")}</span></div>
      ${s.instructions?`<p class="med-note">${c(s.instructions)}</p>`:""}
      <div class="refill-row">
        <span>\u{1F48A} ${o("refillBody")} <strong>${g(s.refillDate)}</strong></span>
        <button class="btn small orange" data-action="refill" data-id="${s.id}">${o("refillReorder")}</button>
      </div>
    </div>`).join(""),a=i("currentMedicines",e||`<p class="muted-note">${o("none")}</p>`);if(!v())return a;const r=[{value:"before",label:o("beforeFood")},{value:"after",label:o("afterFood")}],l=F.map(s=>({value:m(s),label:m(s)}));return`
    ${a}
    <form data-form="medicine">
    ${i("addMedicine",`
      ${d("medicineName",h("name",l,l[0].value))}
      ${d("timing",p("timing","7:00 AM, 7:00 PM"))}
      ${d("dosage",p("dosage","15 ml with warm water"))}
      ${d("foodTiming",h("food",r,"before"))}
      ${d("specialInstructions",f("instructions",""))}
      ${$("addMedicineReminder",{action:"add-medicine"})}
    `)}
    </form>`}export function reminders(){const t=u(),e=r=>t.reminders.filter(l=>l.kind===r),a=r=>r.length?r.map(l=>`<div class="med-item reminder-item">
        <div class="med-head"><strong>${c(l.label)}</strong><span class="pill">${c(l.time)}</span></div>
        ${l.dosage?n("dosage",l.dosage):""}
        ${l.food?n("foodTiming",l.food==="after"?o("afterFood"):o("beforeFood")):""}
        ${l.instructions?`<p class="med-note">${c(l.instructions)}</p>`:""}
      </div>`).join(""):`<p class="muted-note">${o("none")}</p>`;return`
    ${i("enableNotifications",`
      <p class="muted-note" id="notif-status"></p>
      ${$("enableNotifications",{action:"toggle-notif",cls:"light",attrs:'id="notif-toggle"'})}
    `)}
    ${i("todaysReminders",a(t.reminders))}
    ${b.features.kashayamReminders&&e("kashayam").length?i("kashayamReminders",a(e("kashayam"))):""}
    ${b.features.externalApplication&&e("external").length?i("externalApplication",a(e("external"))):""}
    ${i("appointmentReminder",t.appointments.map(r=>n(g(r.date),r.time,!0)).join("")||`<p class="muted-note">${o("none")}</p>`)}`}export function contacts(){const t=b.contact,e=b.doctors[0],a=(t.phone||"").replace(/[^\d+]/g,""),r=(t.whatsapp||"").replace(/[^\d]/g,"");return`
    ${i("contactsTitle",`
      ${n("doctorLabel",e.name)}
      ${n("phoneLabel",t.phone)}
      ${t.email?n("emailLabel",t.email):""}
      ${n("address",m(t.address))}
    `)}
    ${i("",`
      <div class="contact-actions">
        <a class="contact-btn" href="tel:${c(a)}"><span>\u{1F4DE}</span>${o("call")}</a>
        <a class="contact-btn" href="https://wa.me/${c(r)}" target="_blank" rel="noopener"><span>\u{1F4AC}</span>${o("whatsapp")}</a>
        <a class="contact-btn" href="mailto:${c(t.email||"")}"><span>\u2709</span>${o("email")}</a>
        <a class="contact-btn" href="${c(t.mapUrl)}" target="_blank" rel="noopener"><span>\u{1F4CD}</span>${o("directions")}</a>
      </div>
    `)}
    ${i("patientReview",`
      <p class="muted-note">${o("reviewText")}</p>
      ${$("googleReview",{cls:"orange",action:"google-review"})}
    `)}`}export function followup(){const e=u().followup;if(!v())return i("followupAppointment",`
      ${n("followupDate",g(e.date))}
      ${n("followupTime",e.time)}`);const a=[{value:"both",label:o("reminderBoth")},{value:"day",label:o("reminderDay")},{value:"hours",label:o("reminderHours")}];return`
    <form data-form="followup">
    ${i("followupAppointment",`
      ${d("followupDate",p("date",e.date,"date"))}
      ${d("followupTime",p("time",e.time,"time"))}
      ${d("reminder",h("reminderMode",a,e.reminderMode))}
      ${$("createAppointment",{action:"create-appointment"})}
    `)}
    </form>`}export function review(){return i("patientReview",`
    <p class="muted-note">${o("reviewText")}</p>
    ${$("googleReview",{cls:"orange",action:"google-review"})}
    ${$("maybeLater",{cls:"light",action:"goto-dashboard"})}`)}export const SCREENS={dashboard:{render:dashboard,titleKey:"titleDashboard"},ads:{render:ads,titleKey:"adsTitle"},visit:{render:visit,titleKey:"newPatientVisit"},diagnosis:{render:diagnosis,titleKey:"diagnosis"},treatment:{render:treatment,titleKey:"treatmentPlan"},medicine:{render:medicine,titleKey:"medicinesIntake"},reminders:{render:reminders,titleKey:"remindersTitle"},contacts:{render:contacts,titleKey:"contactsTitle"},followup:{render:followup,titleKey:"followupAppointment"},review:{render:review,titleKey:"patientReview"}};
