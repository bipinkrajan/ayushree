import{t as o}from"./i18n.js";function s(e=""){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const n=(e,t,a={})=>`
  <div class="card ${a.cls||""}">
    ${e?`<div class="card-title">${a.rawTitle?e:o(e)}</div>`:""}
    ${t}
  </div>`,i=(e,t,a=!1)=>`
  <div class="row"><span class="label">${a?e:o(e)}</span>
  <span class="value">${s(t)}</span></div>`,d=(e,t="")=>`<span class="pill ${t}">${s(e)}</span>`,r=(e,t)=>`
  <div class="field"><label>${o(e)}</label>${t}</div>`,p=(e,t="",a="text")=>`<input name="${e}" type="${a}" value="${s(t)}">`,$=(e,t="")=>`<textarea name="${e}">${s(t)}</textarea>`,u=(e,t,a)=>`
  <select name="${e}">
    ${t.map(c=>`<option value="${s(c.value)}" ${c.value===a?"selected":""}>${s(c.label)}</option>`).join("")}
  </select>`,v=(e,t={})=>`<button class="btn ${t.cls||""}" ${t.attrs||""} ${t.action?`data-action="${t.action}"`:""}>${t.raw?e:o(e)}</button>`,x=(e,t,a=[])=>`
  <div class="chips" data-chipselect="${e}">
    ${t.map(c=>`
      <button type="button" class="chip ${a.includes(c.id)?"on":""}" data-id="${c.id}">${s(c.label)}</button>
    `).join("")}
  </div>`,m=()=>`<div class="doctor-only">${o("doctorOnly")}</div>`;function b(e){let t=document.getElementById("toast");t||(t=document.createElement("div"),t.id="toast",document.body.appendChild(t)),t.textContent=e,t.classList.add("show"),clearTimeout(t._t),t._t=setTimeout(()=>t.classList.remove("show"),1800)}export{v as button,n as card,x as chipSelect,m as doctorOnly,s as esc,r as field,p as input,d as pill,i as row,u as select,$ as textarea,b as toast};
