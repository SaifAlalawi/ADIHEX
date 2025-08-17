document.getElementById("registrationForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("studentName").value;
  const id = document.getElementById("studentId").value;
  const allDays = document.getElementById("allDays").checked;
  let days = [];

  if (allDays) {
    days = ["30-08-2025","31-08-2025","01-09-2025","02-09-2025","03-09-2025","04-09-2025","05-09-2025","06-09-2025","07-09-2025"];
  } else {
    document.querySelectorAll("input[name='days']:checked").forEach((el) => {
      days.push(el.value);
    });
  }

  if (!name || !id || days.length === 0) {
    alert("يرجى تعبئة جميع الحقول واختيار الأيام.");
    return;
  }

  // تخزين محلي
  const registration = { name, id, days };
  localStorage.setItem("registration", JSON.stringify(registration));

  // رسالة شكر
  const thankYouMessage = document.getElementById("thankYouMessage");
  thankYouMessage.innerHTML = `شكرًا لك ${name}!<br>تم تسجيل حضورك في الأيام: <br>${days.join(" - ")}`;
  thankYouMessage.classList.remove("hidden");

  // إخفاء الفورم
  document.getElementById("registrationForm").classList.add("hidden");
});
