const GOOGLE_SHEET_URL = "ضع هنا رابط Web App النهائي من Google Apps Script";

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
const allDaysCheckbox = document.getElementById("allDays");

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

let selectedDays = [];

// Render days labels مع علامة ✔ على اليسار
daysList.forEach(d=>{
  const label = document.createElement("label");
  label.className="day-label";
  label.innerHTML = `<span>${d.label}</span><input type="checkbox" value="${d.id}" style="display:none">`;
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

  label.addEventListener("click", ()=>{
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event('change'));
  });

  daysContainer.appendChild(label);
});

// اختيار كل الأيام
allDaysCheckbox.addEventListener("change", ()=>{
  const checked = allDaysCheckbox.checked;
  selectedDays = checked ? daysList.map(d=>d.id) : [];
  document.querySelectorAll(".day-label input").forEach((c, i)=>{
    c.checked = checked;
    if(checked){
      c.parentElement.classList.add("selected");
    } else {
      c.parentElement.classList.remove("selected");
    }
  });
});

// Form submit مع preventDefault و catch
form.addEventListener("submit", e=>{
  e.preventDefault();

  // Reset errors
  errorName.textContent="";
  errorUID.textContent="";
  errorDays.textContent="";

  let valid = true;
  if(!nameInput.value.trim()){ errorName.textContent="الاسم مطلوب"; valid=false; }
  if(!uidInput.value.trim()){ errorUID.textContent="الرقم الجامعي مطلوب"; valid=false; }
  if(selectedDays.length===0){ errorDays.textContent="اختر يومًا واحدًا على الأقل"; valid=false; }
  if(!valid) return;

  // إرسال البيانات لـ Google Sheet
  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    body: JSON.stringify({name:nameInput.value, uid:uidInput.value, selectedDays}),
    headers: {"Content-Type":"application/json"}
  })
  .then(res=>res.json())
  .then(data=>{
    // عرض رسالة النجاح
    form.classList.add("hidden");
    userName.textContent=nameInput.value;
    userUID.textContent=uidInput.value;
    userDays.innerHTML="";
    selectedDays.slice().sort().forEach(id=>{
      const li = document.createElement("li");
      li.textContent = formatArabicDate(id);
      userDays.appendChild(li);
    });
    successMessage.classList.remove("hidden");
  })
  .catch(err=>{
    console.error("Error sending to Google Sheet:", err);
    alert("حدث خطأ أثناء إرسال البيانات. تأكد من رابط Google Sheet.");
  });
});

// Reset form
resetBtn.addEventListener("click", ()=>{
  nameInput.value="";
  uidInput.value="";
  selectedDays=[];
  allDaysCheckbox.checked = false;
  document.querySelectorAll(".day-label input").forEach(c=>c.checked=false);
  document.querySelectorAll(".day-label").forEach(l=>l.classList.remove("selected"));
  errorName.textContent="";
  errorUID.textContent="";
  errorDays.textContent="";
});

// New registration
newRegistrationBtn.addEventListener("click", ()=>{
  successMessage.classList.add("hidden");
  form.classList.remove("hidden");
  resetBtn.click();
});

// Finish
finishBtn.addEventListener("click", ()=>{
  form.classList.add("hidden");
  successMessage.innerHTML = `<p class="bold">شكرًا لك على التسجيل!</p>
  <p>أهلًا وسهلًا بك في معرض أبوظبي الدولي للصيد والفروسية 2025 🎉</p>`;
  successMessage.classList.remove("hidden");
});
