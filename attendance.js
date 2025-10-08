document.addEventListener("DOMContentLoaded", () => {
  let attendanceList = JSON.parse(localStorage.getItem("attendanceList")) || [];
  const addBtn = document.getElementById("addAttendanceBtn");
  const tbody = document.getElementById("attendanceBody");
  const filterClass = document.getElementById("filterClass");

  let editId = null;

  // إضافة أو تعديل سجل
  addBtn.addEventListener("click", () => {
    const name = document.getElementById("studentName").value.trim();
    const studentClass = document.getElementById("studentClass").value.trim();
    const date = document.getElementById("attendanceDate").value;
    const status = document.getElementById("attendanceStatus").value;

    if (!name || !studentClass || !date) {
      alert("من فضلك أدخل اسم الطالب، الصف، والتاريخ.");
      return;
    }

    if (editId) {
      const record = attendanceList.find((r) => r.id === editId);
      if (record) {
        record.name = name;
        record.class = studentClass;
        record.date = date;
        record.status = status;
      }
      editId = null;
      addBtn.textContent = "تسجيل";
      alert("تم تحديث السجل ✅");
    } else {
      const record = {
        id: Date.now(),
        name,
        class: studentClass,
        date,
        status,
      };
      attendanceList.push(record);
    }

    localStorage.setItem("attendanceList", JSON.stringify(attendanceList));
    renderAttendance();
    clearForm();
  });

  // عرض السجلات
  function renderAttendance() {
    tbody.innerHTML = "";
    let selectedClass = filterClass.value;
    let filteredList =
      selectedClass === "الكل"
        ? attendanceList
        : attendanceList.filter((r) => r.class === selectedClass);

    if (filteredList.length === 0) {
      tbody.innerHTML = "<tr><td colspan='6'>لا يوجد سجلات حضور</td></tr>";
      return;
    }

    filteredList.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.class}</td>
        <td>${item.date}</td>
        <td style="color:${item.status === "غائب" ? "red" : "green"}">
          ${item.status}
        </td>
        <td></td>
      `;

      const actionCell = row.querySelector("td:last-child");

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️ تعديل";
      editBtn.addEventListener("click", () => editRecord(item.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️ حذف";
      deleteBtn.addEventListener("click", () => deleteRecord(item.id));

      const historyBtn = document.createElement("button");
      historyBtn.textContent = "📅 سجل الغياب";
      historyBtn.addEventListener("click", () =>
        showAbsenceHistory(item.name, item.class)
      );

      actionCell.appendChild(editBtn);
      actionCell.appendChild(deleteBtn);
      actionCell.appendChild(historyBtn);

      tbody.appendChild(row);
    });
  }

  // تعديل سجل
  function editRecord(id) {
    const record = attendanceList.find((r) => r.id === id);
    if (!record) return;

    document.getElementById("studentName").value = record.name;
    document.getElementById("studentClass").value = record.class;
    document.getElementById("attendanceDate").value = record.date;
    document.getElementById("attendanceStatus").value = record.status;

    editId = id;
    addBtn.textContent = "تحديث السجل";
  }

  // حذف سجل
  function deleteRecord(id) {
    if (confirm("هل تريد حذف هذا السجل؟")) {
      attendanceList = attendanceList.filter((r) => r.id !== id);
      localStorage.setItem("attendanceList", JSON.stringify(attendanceList));
      renderAttendance();
    }
  }

  // 🟢 سجل الغياب لطالب
  // 🟢 عرض سجل الغياب لطالب داخل مودال منبثق
  function showAbsenceHistory(name, studentClass) {
    const modal = document.getElementById("absenceModal");
    const closeBtn = modal.querySelector(".close-btn");
    const details = document.getElementById("absenceDetails");

    const absences = attendanceList.filter(
      (r) => r.name === name && r.class === studentClass && r.status === "غائب"
    );

    if (absences.length === 0) {
      details.innerHTML = `<b>الطالب ${name}</b> لم يتغيب من قبل ✅`;
    } else {
      const sorted = absences.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      let html = `<b>📖 سجل الغياب للطالب:</b> ${name}<br><br>`;
      html += `<ul style="list-style:none; padding:0;">`;
      sorted.forEach((a, i) => {
        html += `<li>🗓️ <b>${i + 1}</b> - ${a.date}</li>`;
      });
      html += `</ul>`;

      details.innerHTML = html;
    }

    // عرض المودال
    modal.style.display = "block";

    // غلق المودال عند الضغط على ×
    closeBtn.onclick = () => (modal.style.display = "none");

    // غلق المودال عند الضغط خارجها
    window.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };
  }

  function clearForm() {
    document.getElementById("studentName").value = "";
    document.getElementById("studentClass").value = "";
    document.getElementById("attendanceDate").value = "";
    document.getElementById("attendanceStatus").value = "حاضر";
  }

  filterClass.addEventListener("change", renderAttendance);
  renderAttendance();
});
