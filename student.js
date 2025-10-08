let students = JSON.parse(localStorage.getItem("students")) || [];
let attendanceList = JSON.parse(localStorage.getItem("attendanceList")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const addStudentBtn = document.getElementById("addStudentBtn");
  const studentsBody = document.getElementById("studentsBody");

  addStudentBtn.addEventListener("click", () => {
    const name = document.getElementById("studentName").value.trim();
    const studentClass = document.getElementById("studentClass").value.trim();
    const phone = document.getElementById("studentPhone").value.trim();
    const address = document.getElementById("studentAddress").value.trim();

    if (!name || !studentClass) {
      alert("من فضلك أدخل اسم الطالب والصف الدراسي");
      return;
    }

    const newStudent = {
      id: Date.now(),
      name,
      class: studentClass,
      phone,
      address,
    };

    students.push(newStudent);
    localStorage.setItem("students", JSON.stringify(students));

    renderStudents();
    clearForm();
  });

  function renderStudents() {
    studentsBody.innerHTML = "";

    if (students.length === 0) {
      studentsBody.innerHTML =
        "<tr><td colspan='5'>لا يوجد طلاب حتى الآن</td></tr>";
      return;
    }

    students.forEach((student) => {
      const absences = attendanceList.filter(
        (r) =>
          r.name === student.name &&
          r.class === student.class &&
          r.status === "غائب"
      );

      const absenceCount = absences.length;
      let lastAbsence = "-";
      if (absenceCount > 0) {
        const sortedAbsences = absences.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        lastAbsence = sortedAbsences[0].date;
      }

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.class}</td>
        <td style="color:${
          absenceCount > 0 ? "red" : "green"
        }; font-weight:bold;">
          ${absenceCount > 0 ? absenceCount + " يوم" : "لا يوجد"}
        </td>
        <td>${lastAbsence}</td>
        <td>
          <button onclick="editStudent(${student.id})">✏️ تعديل</button>
          <button onclick="deleteStudent(${student.id})">🗑️ حذف</button>
        </td>
      `;
      studentsBody.appendChild(row);
    });
  }

  window.editStudent = (id) => {
    const student = students.find((s) => s.id === id);
    if (!student) return;

    document.getElementById("studentName").value = student.name;
    document.getElementById("studentClass").value = student.class;
    document.getElementById("studentPhone").value = student.phone;
    document.getElementById("studentAddress").value = student.address;

    deleteStudent(id);
  };

  window.deleteStudent = (id) => {
    if (confirm("هل تريد حذف هذا الطالب؟")) {
      students = students.filter((s) => s.id !== id);
      localStorage.setItem("students", JSON.stringify(students));
      renderStudents();
    }
  };

  function clearForm() {
    document.getElementById("studentName").value = "";
    document.getElementById("studentClass").value = "";
    document.getElementById("studentPhone").value = "";
    document.getElementById("studentAddress").value = "";
  }

  renderStudents();
});
