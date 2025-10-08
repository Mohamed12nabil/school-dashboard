document.addEventListener("DOMContentLoaded", () => {
  const studentName = document.getElementById("studentName");
  const studentClass = document.getElementById("studentClass");
  const attendanceDate = document.getElementById("attendanceDate");
  const attendanceStatus = document.getElementById("attendanceStatus");
  const addAttendanceBtn = document.getElementById("addAttendanceBtn");
  const attendanceBody = document.getElementById("attendanceBody");

  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

  // 📅 دالة اليوم والتاريخ بالعربي
  function formatDate(dateString) {
    const days = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    const formatted = `${dayName} ${date.toLocaleDateString("ar-EG")}`;
    return formatted;
  }

  // 🧮 عند الضغط على زر تسجيل
  addAttendanceBtn.addEventListener("click", () => {
    const name = studentName.value.trim();
    const className = studentClass.value.trim();
    const date = attendanceDate.value;
    const status = attendanceStatus.value;

    if (!name || !className || !date) {
      alert("من فضلك أدخل اسم الطالب والصف والتاريخ");
      return;
    }

    const record = {
      id: Date.now(),
      name,
      className,
      date,
      status,
    };

    attendance.push(record);
    localStorage.setItem("attendance", JSON.stringify(attendance));
    renderAttendance();
    clearForm();
  });

  // 🧹 تفريغ الحقول
  function clearForm() {
    studentName.value = "";
    studentClass.value = "";
    attendanceDate.value = "";
    attendanceStatus.value = "حاضر";
  }

  // 📋 عرض السجل
  function renderAttendance() {
    attendanceBody.innerHTML = "";

    if (attendance.length === 0) {
      attendanceBody.innerHTML = `<tr><td colspan="4">لا توجد سجلات بعد</td></tr>`;
      return;
    }

    attendance.forEach((a) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${a.name}</td>
        <td>${a.className}</td>
        <td>${formatDate(a.date)}</td>
        <td>${a.status}</td>
      `;
      attendanceBody.appendChild(row);
    });
  }

  renderAttendance();
});
