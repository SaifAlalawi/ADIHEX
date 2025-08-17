const arabicMonths = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
];
const arabicWeekdays = [
  "الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت","الأحد"
];

function formatArabicDate(d) {
  const date = new Date(d);
  const weekday = arabicWeekdays[(date.getDay()+6)%7];
  const day = date.getDate();
  const month = arabicMonths[date.getMonth()];
  const year = date.getFullYear();
  return `${weekday} ${day} ${month} ${year}`;
}

function buildEventDays() {
  const start = new Date("2025-08-30");
  const end = new Date("2025-09-07");
  const days = [];
  for(let d=new Date(start); d<=end; d.setDate(d.getDate()+1)){
    const iso = d.toISOString().slice(0,10);
    days.push({id: iso, label: formatArabicDate(iso)});
  }
  return days;
}

const daysList = buildEventDays();

const form = document.getElementById("registrationForm");
const nameInput = document.getElementById("name");
const uidInput = document.getElementById("uid");
const daysContainer = document.getElementById("daysContainer");

const errorName = document.getElementById("error-name");
const errorUID = document.getElementById("error-uid");
const errorDays = document.getElementById("error-days");

const successMessage = document.getElementById("successMessage");
const userName = document.getElementById("userName");
const userUID = document.getElementById("userUID");
const userDays = document.getElementById("userDays");

const resetBtn = document.getElementById("resetBtn");
const newRegistrationBtn = document.getElementById("newRegistrationBtn");
const finishBtn = document.getElementById("finishBtn");
const eventDaysDiv = document.getElementById("eventDays");

let selectedDays = [];

// Render days checkboxes
daysList.forEach(d=>{
  const label = document.createElement("label");
  label.className="day-label";
  label.innerHTML = `<span>${d.label}</span><input type="checkbox" value="${d.id}">`;
  const checkbox = label.querySelector("input");
  checkbox.addEventListener("change", ()=>{
    if(checkbox.checked){
      selectedDays.push(d.id);
      label.classList.add("selected");
    } else {
      selectedDays = selectedDays.filter(x=>x!==d.id);
      label.classList.remove("selected");
    }
  });
  daysContainer.appendChild(label);
});

// Render event schedule
daysList.forEach(d=>{
  const div = document.createElement("div");
  div.innerHTML = `<span class="dot"></span><span>${d.label}</span>`;
  eventDaysDiv.appendChild(div);
});

form.addEventListener("submit", e=>{
  e.preventDefault();
  let valid = true;
  errorName.textContent = "";
  errorUID.textContent = "";
  errorDays.textContent = "";

  if(!nameInput.value.trim()){
    errorName.textContent = "الاسم مطلوب";
    valid=false;
  }
  if(!uidInput.value.trim()){
    errorUID.textContent = "الرقم الجامعي مطلوب";
    valid=false;
  }
  if(selectedDays.length===0){
    errorDays.textContent="اختر يومًا واحدًا على الأقل";
    valid=false;
  }

  if(!valid) return;

  // Save locally
  try {
    const prev = JSON.parse(localStorage.getItem("adife_2025_regs")||"[]");
    prev.push({name:nameInput.value, uid:uidInput.value, selectedDays, timestamp: new Date().toISOString()});
    localStorage.setItem("adife_2025_regs", JSON.stringify(prev));
  } catch{}

  // Show success
  form.classList.add("hidden");
  userName.textContent=nameInput.value;
  userUID.textContent=uidInput.value;
  userDays.innerHTML="";
  selectedDays.slice().sort().forEach(id=>{
    const li=document.createElement("li");
    li.textContent=formatArabicDate(id);
    userDays.appendChild(li);
  });
  successMessage.classList.remove("hidden");
});

resetBtn.addEventListener("click", ()=>{
  nameInput.value="";
  uidInput.value="";
  selectedDays=[];
  document.querySelectorAll(".day-label input").forEach(c=>c.checked=false);
  document.querySelectorAll(".day-label").forEach(l=>l.classList.remove("selected"));
  errorName.textContent="";
  errorUID.textContent="";
  errorDays.textContent="";
});

newRegistrationBtn.addEventListener("click", ()=>{
  successMessage.classList.add("hidden");
  form.classList.remove("hidden");
  resetBtn.click();
});

finishBtn.addEventListener("click", ()=>{
  window.location.reload();
});
