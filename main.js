// تخزين الدروس في localStorage
let lessons = JSON.parse(localStorage.getItem("lessons")) || [];
let loggedIn = localStorage.getItem("isLoggedIn");

// عناصر DOM
const loginSection = document.getElementById("loginSection");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const addLessonBtn = document.getElementById("addLessonBtn");
const lessonBody = document.getElementById("lessonBody");

// بيانات تسجيل الدخول التجريبية
const adminUser = {
  email: "admin@demo.com",
  password: "admin123",
};

// تسجيل الدخول
loginBtn.addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;
  const msg = document.getElementById("loginMsg");

  if (email === adminUser.email && password === adminUser.password) {
    localStorage.setItem("isLoggedIn", true);
    msg.textContent = "تم تسجيل الدخول بنجاح ✅";
    msg.style.color = "green";
    showDashboard();
  } else {
    msg.textContent = "بيانات الدخول غير صحيحة ❌";
    msg.style.color = "red";
  }
});

// تسجيل الخروج
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  location.reload();
});

// عرض لوحة التحكم
function showDashboard() {
  loginSection.classList.add("hidden");
  dashboard.classList.remove("hidden");
  document.getElementById("userLabel").textContent = "مرحبًا، admin@demo.com";
  renderLessons();
}

// إضافة درس
addLessonBtn.addEventListener("click", () => {
  const title = document.getElementById("lessonTitle").value;
  const teacher = document.getElementById("lessonTeacher").value;
  const date = document.getElementById("lessonDate").value;
  const time = document.getElementById("lessonTime").value;
  const desc = document.getElementById("lessonDesc").value;

  if (!title || !teacher || !date) {
    alert("من فضلك أدخل بيانات الدرس كاملة.");
    return;
  }

  const lesson = {
    id: Date.now(),
    title,
    teacher,
    date,
    time,
    desc,
  };

  lessons.push(lesson);
  localStorage.setItem("lessons", JSON.stringify(lessons));
  renderLessons();
  clearForm();
});

// عرض الدروس في الجدول
function renderLessons() {
  lessonBody.innerHTML = "";
  if (lessons.length === 0) {
    lessonBody.innerHTML = "<tr><td colspan='5'>لا يوجد دروس حالياً</td></tr>";
    return;
  }

  lessons.forEach((lesson) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${lesson.title}</td>
      <td>${lesson.teacher}</td>
      <td>${lesson.date}</td>
      <td>${lesson.time || "-"}</td>
      <td>
        <button onclick="deleteLesson(${lesson.id})">حذف</button>
      </td>
    `;
    lessonBody.appendChild(row);
  });
}

// حذف درس
function deleteLesson(id) {
  if (confirm("هل تريد حذف هذا الدرس؟")) {
    lessons = lessons.filter((l) => l.id !== id);
    localStorage.setItem("lessons", JSON.stringify(lessons));
    renderLessons();
  }
}

// مسح الحقول بعد الإضافة
function clearForm() {
  document.getElementById("lessonTitle").value = "";
  document.getElementById("lessonTeacher").value = "";
  document.getElementById("lessonDate").value = "";
  document.getElementById("lessonTime").value = "";
  document.getElementById("lessonDesc").value = "";
}

// لو المستخدم داخل بالفعل
if (loggedIn) showDashboard();
