import{t as s,L as m,getLang as k}from"./i18n.js";import{getData as u,isDoctor as v}from"./store.js";import{CLINIC as g}from"../config/clinic.config.js";import{HEALTH_ISSUES as D,TREATMENTS as P,MEDICINES as K,ADVICE as w}from"../config/libraries.js";import{card as i,row as n,pill as I,field as d,input as p,textarea as f,select as h,button as $,chipSelect as x,doctorOnly as R,esc as l}from"./components.js";const b=t=>t?new Date(t+(t.length===10?"T00:00:00":"")).toLocaleDateString(k()==="ml"?"ml-IN":"en-GB",{day:"2-digit",month:"short",year:"numeric"}):"-",T=(t,e)=>{const a=t.find(r=>r.id===e);return a?m(a):e},y=(t,e)=>`<div class="ro-block"><div class="ro-label">${s(t)}</div><div class="ro-text">${l(e||"-")}</div></div>`,N=(t,e,a="")=>e&&e.length?e.map(r=>I(T(t,r),a)).join(""):`<span class="muted-note">${s("none")}</span>`;export function dashboard(){const t=u(),e=t.patient,a=t.treatment.durationDays,r=t.progress.completedDays,c=t.currentIssue.otherIssues.map(o=>T(D,o));return`
    ${i("opNumber",`<div class="op-number">${l(e.opNumber)}</div>`,{cls:"op-card"})}
    ${i("patientOverview",`
      ${n("name",e.name)}
      ${n("age",e.age)}
      ${n("mobile",e.mobile)}
      ${n("address",e.address)}
      ${n("joined",b(e.joined))}
      ${n("lastVisit",b(e.lastVisit))}
    `)}
    ${i("latestHealth",`
      ${I(t.currentIssue.issue,"red")}
      ${c.map(o=>I(o,"orange")).join("")}
      ${n("treatmentJourney",`${s("day")} ${r} ${s("of")} ${a}`,!0)}
      <div class="progress"><div class="progress-bar" style="width:${Math.round(r/a*100)}%"></div></div>
    `)}
    ${i("todaysReminders",`
      ${t.reminders.map(o=>n(o.time,o.label,!0)).join("")}
      ${$("markComplete",{action:"mark-complete"})}
    `)}
    ${i("nextFollowup",`
      ${n("date",b(t.followup.date))}
      ${n("time",t.followup.time)}
      ${$("viewAppointment",{cls:"light",action:"goto-followup"})}
    `)}`}function F(t){const e=v();return`
    <div class="flyer">
      ${t.image?`<img class="flyer-img" src="${l(t.image)}" alt="">`:`<div class="flyer-banner" style="background:${l(t.color||"#245b35")}">
         ${t.badge?`<span class="flyer-badge">${l(m(t.badge))}</span>`:""}
         <div class="flyer-title">${l(m(t.title))}</div>
       </div>`}
      <div class="flyer-body">
        ${t.image?`<div class="flyer-title dark">${l(m(t.title))}</div>`:""}
        <p>${l(m(t.body))}</p>
        <div class="flyer-actions">
          <button class="btn small orange" data-action="share-ad" data-id="${t.id}"><span class="share-ic">\u2934</span> ${s("share")}</button>
          ${e?`<button class="btn small light" data-action="delete-ad" data-id="${t.id}">${s("remove")}</button>`:""}
        </div>
      </div>
    </div>`}export function ads(){const t=u(),e=t.ads&&t.ads.length?`<div class="flyers">${t.ads.map(F).join("")}</div>`:`<p class="muted-note">${s("none")}</p>`,a=v()?`
    <form data-form="newad">
    ${i("addOffer",`
      <div class="field">
        <label>${s("offerImage")}</label>
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
      ${d("otherIssues",x("otherIssues",D.map(c=>({id:c.id,label:m(c)})),r.otherIssues))}
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
        <div class="ro-label">${s("otherIssues")}</div>
        <div>${N(D,r.otherIssues,"orange")}</div>
      `)}`}export function diagnosis(){const e=u().diagnosis;return v()?`
    <form data-form="diagnosis">
    ${i("diagnosis",`
      ${R()}
      ${d("diagnosis",f("text",e.text))}
      ${d("clinicalNotes",f("notes",e.notes))}
      <label class="switch-row">
        <input type="checkbox" name="sharedWithPatient" ${e.sharedWithPatient?"checked":""}>
        <span>${s("shareWithPatient")}</span>
      </label>
      ${$("saveDiagnosis",{action:"save-diagnosis"})}
    `)}
    </form>`:e.sharedWithPatient?i("diagnosis",`
      ${y("diagnosis",e.text)}
      ${y("clinicalNotes",e.notes)}`):i("diagnosis",`<p class="muted-note">\u{1F512} ${s("hiddenFromPatient")}</p>`)}export function treatment(){const t=u(),e=t.treatment,a=t.pathya;if(!v())return`
      ${i("treatmentPlan",`
        ${n("treatmentBy",e.by)}
        ${n("treatmentName",e.name)}
        ${n("duration",e.durationDays)}
        ${y("therapyInstructions",e.instructions)}
      `)}
      ${i("adviceDo",N(w.do,a.adviceDo))}
      ${i("adviceNotDo",N(w.dont,a.adviceDont,"orange"))}`;const r=g.doctors.map(o=>({value:o.name,label:o.name})),c=P.map(o=>({value:m(o),label:m(o)}));return`
    <form data-form="treatment">
    ${i("treatmentPlan",`
      ${d("treatmentBy",h("by",r,e.by))}
      ${d("treatmentName",h("name",c,e.name))}
      ${d("duration",p("durationDays",e.durationDays,"number"))}
      ${d("therapyInstructions",f("instructions",e.instructions))}
    `)}
    ${i("adviceDo",x("adviceDo",w.do.map(o=>({id:o.id,label:m(o)})),a.adviceDo))}
    ${i("adviceNotDo",x("adviceDont",w.dont.map(o=>({id:o.id,label:m(o)})),a.adviceDont))}
    ${$("saveTreatment",{action:"save-treatment"})}
    </form>`}export function medicine(){const e=u().medicines.map(o=>`
    <div class="med-item">
      <div class="med-head">
        <strong>${l(o.name)}</strong>
        <span class="pill ${o.type==="thailam"?"orange":""}">${l(o.timing)}</span>
      </div>
      <div class="row"><span class="label">${s("dosage")}</span><span class="value">${l(o.dosage)}</span></div>
      <div class="row"><span class="label">${s("foodTiming")}</span><span class="value">${o.food==="before"?s("beforeFood"):s("afterFood")}</span></div>
      ${o.instructions?`<p class="med-note">${l(o.instructions)}</p>`:""}
      <div class="refill-row">
        <span>\u{1F48A} ${s("refillBody")} <strong>${b(o.refillDate)}</strong></span>
        <button class="btn small orange" data-action="refill" data-id="${o.id}">${s("refillReorder")}</button>
      </div>
    </div>`).join(""),a=i("currentMedicines",e||`<p class="muted-note">${s("none")}</p>`);if(!v())return a;const r=[{value:"before",label:s("beforeFood")},{value:"after",label:s("afterFood")}],c=K.map(o=>({value:m(o),label:m(o)}));return`
    ${a}
    <form data-form="medicine">
    ${i("addMedicine",`
      ${d("medicineName",h("name",c,c[0].value))}
      ${d("timing",p("timing","7:00 AM, 7:00 PM"))}
      ${d("dosage",p("dosage","15 ml with warm water"))}
      ${d("foodTiming",h("food",r,"before"))}
      ${d("specialInstructions",f("instructions",""))}
      ${$("addMedicineReminder",{action:"add-medicine"})}
    `)}
    </form>`}export function reminders(){const t=u(),e=r=>t.reminders.filter(c=>c.kind===r),a=r=>r.length?r.map(c=>n(c.time,c.label,!0)).join(""):`<p class="muted-note">${s("none")}</p>`;return`
    ${i("enableNotifications",`
      <p class="muted-note" id="notif-status"></p>
      ${$("enableNotifications",{action:"toggle-notif",cls:"light",attrs:'id="notif-toggle"'})}
    `)}
    ${i("todaysReminders",a(t.reminders))}
    ${g.features.kashayamReminders&&e("kashayam").length?i("kashayamReminders",a(e("kashayam"))):""}
    ${g.features.externalApplication&&e("external").length?i("externalApplication",a(e("external"))):""}
    ${i("appointmentReminder",t.appointments.map(r=>n(b(r.date),r.time,!0)).join("")||`<p class="muted-note">${s("none")}</p>`)}`}export function contacts(){const t=g.contact,e=g.doctors[0],a=(t.phone||"").replace(/[^\d+]/g,""),r=(t.whatsapp||"").replace(/[^\d]/g,"");return`
    ${i("contactsTitle",`
      ${n("doctorLabel",e.name)}
      ${n("phoneLabel",t.phone)}
      ${t.email?n("emailLabel",t.email):""}
      ${n("address",m(t.address))}
    `)}
    ${i("",`
      <div class="contact-actions">
        <a class="contact-btn" href="tel:${l(a)}"><span>\u{1F4DE}</span>${s("call")}</a>
        <a class="contact-btn" href="https://wa.me/${l(r)}" target="_blank" rel="noopener"><span>\u{1F4AC}</span>${s("whatsapp")}</a>
        <a class="contact-btn" href="mailto:${l(t.email||"")}"><span>\u2709</span>${s("email")}</a>
        <a class="contact-btn" href="${l(t.mapUrl)}" target="_blank" rel="noopener"><span>\u{1F4CD}</span>${s("directions")}</a>
      </div>
    `)}
    ${i("patientReview",`
      <p class="muted-note">${s("reviewText")}</p>
      ${$("googleReview",{cls:"orange",action:"google-review"})}
    `)}`}export function followup(){const e=u().followup;if(!v())return i("followupAppointment",`
      ${n("followupDate",b(e.date))}
      ${n("followupTime",e.time)}`);const a=[{value:"both",label:s("reminderBoth")},{value:"day",label:s("reminderDay")},{value:"hours",label:s("reminderHours")}];return`
    <form data-form="followup">
    ${i("followupAppointment",`
      ${d("followupDate",p("date",e.date,"date"))}
      ${d("followupTime",p("time",e.time,"time"))}
      ${d("reminder",h("reminderMode",a,e.reminderMode))}
      ${$("createAppointment",{action:"create-appointment"})}
    `)}
    </form>`}export function review(){return i("patientReview",`
    <p class="muted-note">${s("reviewText")}</p>
    ${$("googleReview",{cls:"orange",action:"google-review"})}
    ${$("maybeLater",{cls:"light",action:"goto-dashboard"})}`)}export const SCREENS={dashboard:{render:dashboard,titleKey:"titleDashboard"},ads:{render:ads,titleKey:"adsTitle"},visit:{render:visit,titleKey:"newPatientVisit"},diagnosis:{render:diagnosis,titleKey:"diagnosis"},treatment:{render:treatment,titleKey:"treatmentPlan"},medicine:{render:medicine,titleKey:"medicinesIntake"},reminders:{render:reminders,titleKey:"remindersTitle"},contacts:{render:contacts,titleKey:"contactsTitle"},followup:{render:followup,titleKey:"followupAppointment"},review:{render:review,titleKey:"patientReview"}};
