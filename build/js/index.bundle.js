!function(){"use strict";document.addEventListener("DOMContentLoaded",(()=>{(()=>{const e=document.getElementById("carCost"),t=document.getElementById("engineVolume"),n=document.getElementById("calculateButton"),c=document.getElementById("decree140"),l=document.getElementById("resultCarCost"),r=document.getElementById("resultDuty"),o=document.getElementById("resultCustomsFee"),a=document.getElementById("resultRecyclingFee"),u=document.getElementById("resultEPTS"),s=document.getElementById("resultTotal"),d=1/3.57,m=e=>{const t=document.getElementById(e);return t?t.value:null},i=e=>new Intl.NumberFormat("ru-BY",{style:"currency",currency:"EUR",minimumFractionDigits:2,maximumFractionDigits:2}).format(e);n&&n.addEventListener("click",(()=>{const n=parseFloat(e.value)||0,y=parseFloat(t.value)||0,E=m("carType"),g=m("engineType"),v=m("carAge"),B=!!c&&c.checked;if(n<=0||y<=0)return void alert("Пожалуйста, заполните все обязательные поля корректно");let C=0,I=0;"auto"===E?"under3"===v?(C=((e,t,n)=>{let c,l;c=e<=8500?.54*e:.48*e,l=e<=8500?2.5*t:e<=16700?3.5*t:e<=42300?5.5*t:e<=84500?7.5*t:e<=169e3?15*t:20*t;let r=Math.max(c,l);return n&&(r/=2),r})(n,y,B),I=544*d):"3to5"===v?(C=((e,t)=>{let n;return n=e<=1e3?1.5*e:e<=1500?1.7*e:e<=1800?2.5*e:e<=2300?2.7*e:e<=3e3?3*e:3.6*e,t&&(n/=2),n})(y,B),I=1089*d):"over5"===v&&(C=((e,t)=>{let n;return n=e<=1e3?3*e:e<=1500?3.2*e:e<=1800?3.5*e:e<=2300?4.8*e:e<=3e3?5*e:5.7*e,t&&(n/=2),n})(y,B),I=1089*d):"moto"===E&&(C=((e,t)=>{let n;return n=t<=800?.15*e:.1*e,n+.2*(e+n)})(n,y),I=0),"electric"===g&&(C=0);const x=120*d,L=70*d,_=C+x+I+L;l.textContent=i(n),r.textContent=i(C),o.textContent=i(x),a.textContent=i(I),u.textContent=i(L),s.textContent=i(_)})),(()=>{const e=document.querySelectorAll(".calculator__select");e.forEach((t=>{const n=t.querySelector(".calculator__select-header"),c=t.querySelectorAll(".calculator__select-item"),l=t.querySelector(".calculator__select-current"),r=t.querySelector('input[type="hidden"]');n.addEventListener("click",(()=>{e.forEach((e=>{e!==t&&e.classList.remove("active")})),t.classList.toggle("active")})),c.forEach((e=>{e.addEventListener("click",(()=>{l.textContent=e.textContent,r&&(r.value=e.dataset.value),c.forEach((e=>{e.dataset.selected="false"})),e.dataset.selected="true",t.classList.remove("active")}))}))})),document.addEventListener("click",(t=>{t.target.closest(".calculator__select")||e.forEach((e=>{e.classList.remove("active")}))}))})(),initTooltips()})()}))}();