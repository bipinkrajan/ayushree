import{t as o,L as c,getLang as k}from"./i18n.js";import{getData as u,isDoctor as v}from"./store.js";import{CLINIC as g}from"../config/clinic.config.js";import{HEALTH_ISSUES as D,TREATMENTS as R,MEDICINES as A,ADVICE as w}from"../config/libraries.js";import{card as n,row as i,pill as x,field as r,input as m,textarea as f,select as h,button as p,chipSelect as I,doctorOnly as K,esc as l}from"./components.js";const b=t=>t?new Date(t+(t.length===10?"T00:00:00":"")).toLocaleDateString(k()==="ml"?"ml-IN":"en-GB",{day:"2-digit",month:"short",year:"numeric"}):"-",T=(t,e)=>{const a=t.find(d=>d.id===e);return a?c(a):e},y=(t,e)=>`<div class="ro-block"><div class="ro-label">${o(t)}</div><div class="ro-text">${l(e||"-")}</div></div>`,N=(t,e,a="")=>e&&e.length?e.map(d=>x(T(t,d),a)).join(""):`<span class="muted-note">${o("none")}</span>`;function L(){const t=u(),e=t.patient,a=t.treatment.durationDays,d=t.progress.completedDays,$=t.currentIssue.otherIssues.map(s=>T(D,s));return`
    ${n("opNumber",`<div class="op-number">${l(e.opNumber)}</div>`,{cls:"op-card"})}
    ${n("patientOverview",`
      ${i("name",e.name)}
      ${i("age",e.age)}
      ${i("mobile",e.mobile)}
      ${i("address",e.address)}
      ${i("joined",b(e.joined))}
      ${i("lastVisit",b(e.lastVisit))}
    `)}
    ${n("latestHealth",`
      ${x(t.currentIssue.issue,"red")}
      ${$.map(s=>x(s,"orange")).join("")}
      ${i("treatmentJourney",`${o("day")} ${d} ${o("of")} ${a}`,!0)}
      <div class="progress"><div class="progress-bar" style="width:${Math.round(d/a*100)}%"></div></div>
    `)}
    ${n("todaysReminders",`
      ${t.reminders.map(s=>i(s.time,s.label,!0)).join("")}
      ${p("markComplete",{action:"mark-complete"})}
    `)}
    ${n("nextFollowup",`
      ${i("date",b(t.followup.date))}
      ${i("time",t.followup.time)}
      ${p("viewAppointment",{cls:"light",action:"goto-followup"})}
    `)}`}function B(t){const e=v();return`
    <div class="flyer">
      ${t.image?`<img class="flyer-img" src="${l(t.image)}" alt="">`:`<div class="flyer-banner" style="background:${l(t.color||"#245b35")}">
         ${t.badge?`<span class="flyer-badge">${l(c(t.badge))}</span>`:""}
         <div class="flyer-title">${l(c(t.title))}</div>
       </div>`}
      <div class="flyer-body">
        ${t.image?`<div class="flyer-title dark">${l(c(t.title))}</div>`:""}
        <p>${l(c(t.body))}</p>
        <div class="flyer-actions">
          <button class="btn small orange" data-action="share-ad" data-id="${t.id}"><span class="share-ic">\u2934</span> ${o("share")}</button>
          ${e?`<button class="btn small light" data-action="delete-ad" data-id="${t.id}">${o("remove")}</button>`:""}
        </div>
      </div>
    </div>`}function M(){const t=u(),e=t.ads&&t.ads.length?`<div class="flyers">${t.ads.map(B).join("")}</div>`:`<p class="muted-note">${o("none")}</p>`,a=v()?`
    <form data-form="newad">
    ${n("addOffer",`
      <div class="field">
        <label>${o("offerImage")}</label>
        <input type="file" accept="image/*" name="image" id="ad-image">
        <img id="ad-preview" class="ad-preview hidden" alt="">
      </div>
      ${r("offerHeader",m("title",""))}
      ${r("offerText",f("body",""))}
      ${p("publishOffer",{action:"publish-ad"})}
    `)}
    </form>`:"";return e+a}function O(){const t=u(),e=t.patient,a=t.currentIssue;return v()?`
    <form data-form="visit">
    ${n("patientOverview",`
      ${r("opNumber",m("opNumber",e.opNumber))}
      ${r("name",m("name",e.name))}
      ${r("age",m("age",e.age,"number"))}
      ${r("mobileNumber",m("mobile",e.mobile))}
      ${r("address",f("address",e.address))}
      ${r("referredBy",m("referredBy",e.referredBy))}
    `)}
    ${n("currentHealthIssue",`
      ${r("issue",m("issue",a.issue))}
      ${r("history",f("history",a.history))}
      ${r("previousTreatment",f("previousTreatment",a.previousTreatment))}
      ${r("otherIssues",I("otherIssues",D.map(d=>({id:d.id,label:c(d)})),a.otherIssues))}
      ${p("saveVisit",{action:"save-visit"})}
    `)}
    </form>`:`
      ${n("patientOverview",`
        ${i("opNumber",e.opNumber)}
        ${i("name",e.name)}
        ${i("age",e.age)}
        ${i("mobileNumber",e.mobile)}
        ${i("address",e.address)}
        ${i("referredBy",e.referredBy)}
      `)}
      ${n("currentHealthIssue",`
        ${i("issue",a.issue)}
        ${y("history",a.history)}
        ${y("previousTreatment",a.previousTreatment)}
        <div class="ro-label">${o("otherIssues")}</div>
        <div>${N(D,a.otherIssues,"orange")}</div>
      `)}`}function P(){const e=u().diagnosis;return v()?`
    <form data-form="diagnosis">
    ${n("diagnosis",`
      ${K()}
      ${r("diagnosis",f("text",e.text))}
      ${r("clinicalNotes",f("notes",e.notes))}
      <label class="switch-row">
        <input type="checkbox" name="sharedWithPatient" ${e.sharedWithPatient?"checked":""}>
        <span>${o("shareWithPatient")}</span>
      </label>
      ${p("saveDiagnosis",{action:"save-diagnosis"})}
    `)}
    </form>`:e.sharedWithPatient?n("diagnosis",`
      ${y("diagnosis",e.text)}
      ${y("clinicalNotes",e.notes)}`):n("diagnosis",`<p class="muted-note">\u{1F512} ${o("hiddenFromPatient")}</p>`)}function j(){const t=u(),e=t.treatment,a=t.pathya;if(!v())return`
      ${n("treatmentPlan",`
        ${i("treatmentBy",e.by)}
        ${i("treatmentName",e.name)}
        ${i("duration",e.durationDays)}
        ${y("therapyInstructions",e.instructions)}
      `)}
      ${n("adviceDo",N(w.do,a.adviceDo))}
      ${n("adviceNotDo",N(w.dont,a.adviceDont,"orange"))}`;const d=g.doctors.map(s=>({value:s.name,label:s.name})),$=R.map(s=>({value:c(s),label:c(s)}));return`
    <form data-form="treatment">
    ${n("treatmentPlan",`
      ${r("treatmentBy",h("by",d,e.by))}
      ${r("treatmentName",h("name",$,e.name))}
      ${r("duration",m("durationDays",e.durationDays,"number"))}
      ${r("therapyInstructions",f("instructions",e.instructions))}
    `)}
    ${n("adviceDo",I("adviceDo",w.do.map(s=>({id:s.id,label:c(s)})),a.adviceDo))}
    ${n("adviceNotDo",I("adviceDont",w.dont.map(s=>({id:s.id,label:c(s)})),a.adviceDont))}
    ${p("saveTreatment",{action:"save-treatment"})}
    </form>`}function E(){const e=u().medicines.map(s=>`
    <div class="med-item">
      <div class="med-head">
        <strong>${l(s.name)}</strong>
        <span class="pill ${s.type==="thailam"?"orange":""}">${l(s.timing)}</span>
      </div>
      <div class="row"><span class="label">${o("dosage")}</span><span class="value">${l(s.dosage)}</span></div>
      <div class="row"><span class="label">${o("foodTiming")}</span><span class="value">${s.food==="before"?o("beforeFood"):o("afterFood")}</span></div>
      ${s.instructions?`<p class="med-note">${l(s.instructions)}</p>`:""}
      <div class="refill-row">
        <span>\u{1F48A} ${o("refillBody")} <strong>${b(s.refillDate)}</strong></span>
        <button class="btn small orange" data-action="refill" data-id="${s.id}">${o("refillReorder")}</button>
      </div>
    </div>`).join(""),a=n("currentMedicines",e||`<p class="muted-note">${o("none")}</p>`);if(!v())return a;const d=[{value:"before",label:o("beforeFood")},{value:"after",label:o("afterFood")}],$=A.map(s=>({value:c(s),label:c(s)}));return`
    ${a}
    <form data-form="medicine">
    ${n("addMedicine",`
      ${r("medicineName",h("name",$,$[0].value))}
      ${r("timing",m("timing","7:00 AM, 7:00 PM"))}
      ${r("dosage",m("dosage","15 ml with warm water"))}
      ${r("foodTiming",h("food",d,"before"))}
      ${r("specialInstructions",f("instructions",""))}
      ${p("addMedicineReminder",{action:"add-medicine"})}
    `)}
    </form>`}function S(){const t=u(),e=d=>t.reminders.filter($=>$.kind===d),a=d=>d.length?d.map($=>i($.time,$.label,!0)).join(""):`<p class="muted-note">${o("none")}</p>`;return`
    ${n("enableNotifications",`
      <p class="muted-note" id="notif-status"></p>
      ${p("enableNotifications",{action:"toggle-notif",cls:"light",attrs:'id="notif-toggle"'})}
    `)}
    ${n("todaysReminders",a(t.reminders))}
    ${g.features.kashayamReminders&&e("kashayam").length?n("kashayamReminders",a(e("kashayam"))):""}
    ${g.features.externalApplication&&e("external").length?n("externalApplication",a(e("external"))):""}
    ${n("appointmentReminder",t.appointments.map(d=>i(b(d.date),d.time,!0)).join("")||`<p class="muted-note">${o("none")}</p>`)}`}function F(){const t=g.contact,e=g.doctors[0],a=(t.phone||"").replace(/[^\d+]/g,""),d=(t.whatsapp||"").replace(/[^\d]/g,"");return`
    ${n("contactsTitle",`
      ${i("doctorLabel",e.name)}
      ${i("phoneLabel",t.phone)}
      ${t.email?i("emailLabel",t.email):""}
      ${i("address",c(t.address))}
    `)}
    ${n("",`
      <div class="contact-actions">
        <a class="contact-btn" href="tel:${l(a)}"><span>\u{1F4DE}</span>${o("call")}</a>
        <a class="contact-btn" href="https://wa.me/${l(d)}" target="_blank" rel="noopener"><span>\u{1F4AC}</span>${o("whatsapp")}</a>
        <a class="contact-btn" href="mailto:${l(t.email||"")}"><span>\u2709</span>${o("email")}</a>
        <a class="contact-btn" href="${l(t.mapUrl)}" target="_blank" rel="noopener"><span>\u{1F4CD}</span>${o("directions")}</a>
      </div>
    `)}
    ${n("patientReview",`
      <p class="muted-note">${o("reviewText")}</p>
      ${p("googleReview",{cls:"orange",action:"google-review"})}
    `)}`}function H(){const e=u().followup;if(!v())return n("followupAppointment",`
      ${i("followupDate",b(e.date))}
      ${i("followupTime",e.time)}`);const a=[{value:"both",label:o("reminderBoth")},{value:"day",label:o("reminderDay")},{value:"hours",label:o("reminderHours")}];return`
    <form data-form="followup">
    ${n("followupAppointment",`
      ${r("followupDate",m("date",e.date,"date"))}
      ${r("followupTime",m("time",e.time,"time"))}
      ${r("reminder",h("reminderMode",a,e.reminderMode))}
      ${p("createAppointment",{action:"create-appointment"})}
    `)}
    </form>`}function C(){return n("patientReview",`
    <p class="muted-note">${o("reviewText")}</p>
    ${p("googleReview",{cls:"orange",action:"google-review"})}
    ${p("maybeLater",{cls:"light",action:"goto-dashboard"})}`)}const J={dashboard:{render:L,titleKey:"titleDashboard"},ads:{render:M,titleKey:"adsTitle"},visit:{render:O,titleKey:"newPatientVisit"},diagnosis:{render:P,titleKey:"diagnosis"},treatment:{render:j,titleKey:"treatmentPlan"},medicine:{render:E,titleKey:"medicinesIntake"},reminders:{render:S,titleKey:"remindersTitle"},contacts:{render:F,titleKey:"contactsTitle"},followup:{render:H,titleKey:"followupAppointment"},review:{render:C,titleKey:"patientReview"}};export{J as SCREENS,M as ads,F as contacts,L as dashboard,P as diagnosis,H as followup,E as medicine,S as reminders,C as review,j as treatment,O as visit};
