import{t as i,L as m,getLang as k}from"./i18n.js";import{getData as u,isDoctor as v}from"./store.js";import{CLINIC as b}from"../config/clinic.config.js";import{HEALTH_ISSUES as T,TREATMENTS as K,MEDICINES as P,ADVICE as w,LAB_TESTS as F}from"../config/libraries.js";import{card as n,row as s,pill as D,field as d,input as p,textarea as f,select as h,button as $,chipSelect as x,doctorOnly as R,esc as c}from"./components.js";const g=t=>t?new Date(t+(t.length===10?"T00:00:00":"")).toLocaleDateString(k()==="ml"?"ml-IN":"en-GB",{day:"2-digit",month:"short",year:"numeric"}):"-",N=(t,e)=>{const a=t.find(o=>o.id===e);return a?m(a):e},y=(t,e)=>`<div class="ro-block"><div class="ro-label">${i(t)}</div><div class="ro-text">${c(e||"-")}</div></div>`,I=(t,e,a="")=>e&&e.length?e.map(o=>D(N(t,o),a)).join(""):`<span class="muted-note">${i("none")}</span>`;export function dashboard(){const t=u(),e=t.patient,a=t.treatment.durationDays,o=t.progress.completedDays,l=t.currentIssue.otherIssues.map(r=>N(T,r));return`
    ${n("opNumber",`<div class="op-number">${c(e.opNumber)}</div>`,{cls:"op-card"})}
    ${n("patientOverview",`
      ${s("name",e.name)}
      ${s("age",e.age)}
      ${s("mobile",e.mobile)}
      ${s("address",e.address)}
      ${s("joined",g(e.joined))}
      ${s("lastVisit",g(e.lastVisit))}
    `)}
    ${n("latestHealth",`
      ${D(t.currentIssue.issue,"red")}
      ${l.map(r=>D(r,"orange")).join("")}
      ${s("treatmentJourney",`${i("day")} ${o} ${i("of")} ${a}`,!0)}
      <div class="progress"><div class="progress-bar" style="width:${Math.round(o/a*100)}%"></div></div>
    `)}
    ${n("todaysReminders",`
      ${t.reminders.map(r=>s(r.time,r.label,!0)).join("")}
      ${$("markComplete",{action:"mark-complete"})}
    `)}
    ${n("nextFollowup",`
      ${s("date",g(t.followup.date))}
      ${s("time",t.followup.time)}
      ${$("viewAppointment",{cls:"light",action:"goto-followup"})}
    `)}`}function B(t){const e=v();return`
    <div class="flyer">
      ${t.image?`<img class="flyer-img" src="${c(t.image)}" alt="">`:`<div class="flyer-banner" style="background:${c(t.color||"#245b35")}">
         ${t.badge?`<span class="flyer-badge">${c(m(t.badge))}</span>`:""}
         <div class="flyer-title">${c(m(t.title))}</div>
       </div>`}
      <div class="flyer-body">
        ${t.image?`<div class="flyer-title dark">${c(m(t.title))}</div>`:""}
        <p>${c(m(t.body))}</p>
        <div class="flyer-actions">
          <button class="btn small orange" data-action="share-ad" data-id="${t.id}"><span class="share-ic">\u2934</span> ${i("share")}</button>
          ${e?`<button class="btn small light" data-action="delete-ad" data-id="${t.id}">${i("remove")}</button>`:""}
        </div>
      </div>
    </div>`}export function ads(){const t=u(),e=t.ads&&t.ads.length?`<div class="flyers">${t.ads.map(B).join("")}</div>`:`<p class="muted-note">${i("none")}</p>`,a=v()?`
    <form data-form="newad">
    ${n("addOffer",`
      <div class="field">
        <label>${i("offerImage")}</label>
        <input type="file" accept="image/*" name="image" id="ad-image">
        <img id="ad-preview" class="ad-preview hidden" alt="">
      </div>
      ${d("offerHeader",p("title",""))}
      ${d("offerText",f("body",""))}
      ${$("publishOffer",{action:"publish-ad"})}
    `)}
    </form>`:"";return e+a}export function visit(){const t=u(),e=t.patient,a=t.health||{},o=t.currentIssue;return v()?`
    <form data-form="visit">
    ${n("patientOverview",`
      ${d("opNumber",p("opNumber",e.opNumber))}
      ${d("name",p("name",e.name))}
      ${d("age",p("age",e.age,"number"))}
      ${d("mobileNumber",p("mobile",e.mobile))}
      ${d("address",f("address",e.address))}
      ${d("referredBy",p("referredBy",e.referredBy))}
    `)}
    ${n("currentHealthIssue",`
      ${d("issue",p("issue",o.issue))}
      ${d("history",f("history",o.history))}
      ${d("previousTreatment",f("previousTreatment",o.previousTreatment))}
      ${d("otherIssues",x("otherIssues",T.map(l=>({id:l.id,label:m(l)})),o.otherIssues))}
      ${$("saveVisit",{action:"save-visit"})}
    `)}
    </form>`:`
      ${n("patientOverview",`
        ${s("opNumber",e.opNumber)}
        ${s("name",e.name)}
        ${s("age",e.age)}
        ${s("mobileNumber",e.mobile)}
        ${s("address",e.address)}
        ${s("referredBy",e.referredBy)}
      `)}
      ${n("healthInformation",`
        ${s("height",a.heightCm===""?"":`${a.heightCm} cm`)}
        ${s("weight",a.weightKg===""?"":`${a.weightKg} kg`)}
        ${s("bodyFat",a.bodyFatPct===""?"":`${a.bodyFatPct}%`)}
        ${s("visceralFat",a.visceralFat)}
        ${s("bmr",a.bmrKcal===""?"":`${a.bmrKcal} kcal/day`)}
        ${s("bmi",a.bmi)}
        ${s("bodyWater",a.waterPct===""?"":`${a.waterPct}%`)}
        ${s("protein",a.proteinPct===""?"":`${a.proteinPct}%`)}
      `)}
      ${n("currentHealthIssue",`
        ${s("issue",o.issue)}
        ${y("history",o.history)}
        ${y("previousTreatment",o.previousTreatment)}
        <div class="ro-label">${i("otherIssues")}</div>
        <div>${I(T,o.otherIssues,"orange")}</div>
      `)}`}export function diagnosis(){const e=u().diagnosis;return v()?`
    <form data-form="diagnosis">
    ${n("diagnosis",`
      ${R()}
      ${d("diagnosis",f("text",e.text))}
      ${d("clinicalNotes",f("notes",e.notes))}
      <label class="switch-row">
        <input type="checkbox" name="sharedWithPatient" ${e.sharedWithPatient?"checked":""}>
        <span>${i("shareWithPatient")}</span>
      </label>
      ${$("saveDiagnosis",{action:"save-diagnosis"})}
    `)}
    </form>`:e.sharedWithPatient?n("diagnosis",`
      ${y("diagnosis",e.text)}
      ${y("clinicalNotes",e.notes)}`):n("diagnosis",`<p class="muted-note">\u{1F512} ${i("hiddenFromPatient")}</p>`)}export function treatment(){const t=u(),e=t.treatment,a=t.pathya;if(!v())return`
      ${n("treatmentPlan",`
        ${s("treatmentBy",e.by)}
        ${s("treatmentName",e.name)}
        ${s("duration",e.durationDays)}
        ${y("therapyInstructions",e.instructions)}
      `)}
      ${n("adviceDo",I(w.do,a.adviceDo))}
      ${n("adviceNotDo",I(w.dont,a.adviceDont,"orange"))}`;const o=b.doctors.map(r=>({value:r.name,label:r.name})),l=K.map(r=>({value:m(r),label:m(r)}));return`
    <form data-form="treatment">
    ${n("treatmentPlan",`
      ${d("treatmentBy",h("by",o,e.by))}
      ${d("treatmentName",h("name",l,e.name))}
      ${d("duration",p("durationDays",e.durationDays,"number"))}
      ${d("therapyInstructions",f("instructions",e.instructions))}
    `)}
    ${n("adviceDo",x("adviceDo",w.do.map(r=>({id:r.id,label:m(r)})),a.adviceDo))}
    ${n("adviceNotDo",x("adviceDont",w.dont.map(r=>({id:r.id,label:m(r)})),a.adviceDont))}
    ${$("saveTreatment",{action:"save-treatment"})}
    </form>`}export function medicine(){const e=u().medicines.map(r=>`
    <div class="med-item">
      <div class="med-head">
        <strong>${c(r.name)}</strong>
        <span class="pill ${r.type==="thailam"?"orange":""}">${c(r.timing)}</span>
      </div>
      <div class="row"><span class="label">${i("dosage")}</span><span class="value">${c(r.dosage)}</span></div>
      <div class="row"><span class="label">${i("foodTiming")}</span><span class="value">${r.food==="before"?i("beforeFood"):i("afterFood")}</span></div>
      ${r.instructions?`<p class="med-note">${c(r.instructions)}</p>`:""}
      <div class="refill-row">
        <span>\u{1F48A} ${i("refillBody")} <strong>${g(r.refillDate)}</strong></span>
        <button class="btn small orange" data-action="refill" data-id="${r.id}">${i("refillReorder")}</button>
      </div>
    </div>`).join(""),a=n("currentMedicines",e||`<p class="muted-note">${i("none")}</p>`);if(!v())return a;const o=[{value:"before",label:i("beforeFood")},{value:"after",label:i("afterFood")}],l=P.map(r=>({value:m(r),label:m(r)}));return`
    ${a}
    <form data-form="medicine">
    ${n("addMedicine",`
      ${d("medicineName",h("name",l,l[0].value))}
      ${d("timing",p("timing","7:00 AM, 7:00 PM"))}
      ${d("dosage",p("dosage","15 ml with warm water"))}
      ${d("foodTiming",h("food",o,"before"))}
      ${d("specialInstructions",f("instructions",""))}
      ${$("addMedicineReminder",{action:"add-medicine"})}
    `)}
    </form>`}export function reminders(){const t=u(),e=o=>t.reminders.filter(l=>l.kind===o),a=o=>o.length?o.map(l=>`<div class="med-item reminder-item">
        <div class="med-head"><strong>${c(l.label)}</strong><span class="pill">${c(l.time)}</span></div>
        ${l.dosage?s("dosage",l.dosage):""}
        ${l.food?s("foodTiming",l.food==="after"?i("afterFood"):i("beforeFood")):""}
        ${l.instructions?`<p class="med-note">${c(l.instructions)}</p>`:""}
      </div>`).join(""):`<p class="muted-note">${i("none")}</p>`;return`
    ${n("enableNotifications",`
      <p class="muted-note" id="notif-status"></p>
      ${$("enableNotifications",{action:"toggle-notif",cls:"light",attrs:'id="notif-toggle"'})}
    `)}
    ${n("todaysReminders",a(t.reminders))}
    ${b.features.kashayamReminders&&e("kashayam").length?n("kashayamReminders",a(e("kashayam"))):""}
    ${b.features.externalApplication&&e("external").length?n("externalApplication",a(e("external"))):""}
    ${n("appointmentReminder",t.appointments.map(o=>s(g(o.date),o.time,!0)).join("")||`<p class="muted-note">${i("none")}</p>`)}`}export function tests(){const t=new Set(u().testsToDo||[]),e=F.map(a=>({...a,selectedTests:a.tests.filter(o=>t.has(o.id))})).filter(a=>a.selectedTests.length);return e.length?e.map(a=>n(m(a),`
    <div class="patient-test-list">${a.selectedTests.map(o=>`
      <div class="patient-test-item"><span class="test-check">\u2713</span><span>${c(o.label)}</span></div>
    `).join("")}</div>`,{rawTitle:!0})).join(""):n("testsToBeDone",`<p class="muted-note">${i("noTestsSelected")}</p>`)}export function contacts(){const t=b.contact,e=b.doctors[0],a=(t.phone||"").replace(/[^\d+]/g,""),o=(t.whatsapp||"").replace(/[^\d]/g,"");return`
    ${n("contactsTitle",`
      ${s("doctorLabel",e.name)}
      ${s("phoneLabel",t.phone)}
      ${t.email?s("emailLabel",t.email):""}
      ${s("address",m(t.address))}
    `)}
    ${n("",`
      <div class="contact-actions">
        <a class="contact-btn" href="tel:${c(a)}"><span>\u{1F4DE}</span>${i("call")}</a>
        <a class="contact-btn" href="https://wa.me/${c(o)}" target="_blank" rel="noopener"><span>\u{1F4AC}</span>${i("whatsapp")}</a>
        <a class="contact-btn" href="mailto:${c(t.email||"")}"><span>\u2709</span>${i("email")}</a>
        <a class="contact-btn" href="${c(t.mapUrl)}" target="_blank" rel="noopener"><span>\u{1F4CD}</span>${i("directions")}</a>
      </div>
    `)}
    ${n("patientReview",`
      <p class="muted-note">${i("reviewText")}</p>
      ${$("googleReview",{cls:"orange",action:"google-review"})}
    `)}`}export function followup(){const e=u().followup;if(!v())return n("followupAppointment",`
      ${s("followupDate",g(e.date))}
      ${s("followupTime",e.time)}`);const a=[{value:"both",label:i("reminderBoth")},{value:"day",label:i("reminderDay")},{value:"hours",label:i("reminderHours")}];return`
    <form data-form="followup">
    ${n("followupAppointment",`
      ${d("followupDate",p("date",e.date,"date"))}
      ${d("followupTime",p("time",e.time,"time"))}
      ${d("reminder",h("reminderMode",a,e.reminderMode))}
      ${$("createAppointment",{action:"create-appointment"})}
    `)}
    </form>`}export function review(){return n("patientReview",`
    <p class="muted-note">${i("reviewText")}</p>
    ${$("googleReview",{cls:"orange",action:"google-review"})}
    ${$("maybeLater",{cls:"light",action:"goto-dashboard"})}`)}export const SCREENS={dashboard:{render:dashboard,titleKey:"titleDashboard"},ads:{render:ads,titleKey:"adsTitle"},visit:{render:visit,titleKey:"newPatientVisit"},diagnosis:{render:diagnosis,titleKey:"diagnosis"},treatment:{render:treatment,titleKey:"treatmentPlan"},medicine:{render:medicine,titleKey:"medicinesIntake"},reminders:{render:reminders,titleKey:"remindersTitle"},tests:{render:tests,titleKey:"testsToBeDone"},contacts:{render:contacts,titleKey:"contactsTitle"},followup:{render:followup,titleKey:"followupAppointment"},review:{render:review,titleKey:"patientReview"}};
