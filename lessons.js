document.addEventListener("DOMContentLoaded", () => {
  const lessonName = document.getElementById("lessonName");
  const lessonSubject = document.getElementById("lessonSubject");
  const lessonClass = document.getElementById("lessonClass");
  const lessonTeacher = document.getElementById("lessonTeacher");
  const lessonDate = document.getElementById("lessonDate");
  const lessonNotes = document.getElementById("lessonNotes");
  const addLessonBtn = document.getElementById("addLessonBtn");
  const lessonsBody = document.getElementById("lessonsBody");

  let lessons = JSON.parse(localStorage.getItem("lessons")) || [];

  // 🧾 حفظ الدرس
  addLessonBtn.addEventListener("click", () => {
    const name = lessonName.value.trim();
    const subject = lessonSubject.value.trim();
    const className = lessonClass.value.trim();
    const teacher = lessonTeacher.value.trim();
    const date = lessonDate.value;
    const notes = lessonNotes.value.trim();

    if (!name || !subject || !className || !teacher || !date) {
      alert("من فضلك أدخل جميع البيانات المطلوبة");
      return;
    }

    const lesson = {
      id: Date.now(),
      name,
      subject,
      className,
      teacher,
      date,
      notes,
    };

    lessons.push(lesson);
    localStorage.setItem("lessons", JSON.stringify(lessons));
    renderLessons();
    clearForm();
  });

  // 🧹 تفريغ الحقول
  function clearForm() {
    lessonName.value = "";
    lessonSubject.value = "";
    lessonClass.value = "";
    lessonTeacher.value = "";
    lessonDate.value = "";
    lessonNotes.value = "";
  }

  // 📋 عرض الدروس
  function renderLessons() {
    lessonsBody.innerHTML = "";
    if (lessons.length === 0) {
      lessonsBody.innerHTML = "<tr><td colspan='7'>لا توجد دروس بعد</td></tr>";
      return;
    }

    lessons.forEach((l) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${l.name}</td>
        <td>${l.subject}</td>
        <td>${l.className}</td>
        <td>${l.teacher}</td>
        <td>${l.date}</td>
        <td>${l.notes || "-"}</td>
        <td>
          <button onclick="editLesson(${l.id})">✏️ تعديل</button>
          <button onclick="deleteLesson(${l.id})">🗑️ حذف</button>
        </td>
      `;
      lessonsBody.appendChild(row);
    });
  }

  // ✏️ تعديل درس
  window.editLesson = (id) => {
    const lesson = lessons.find((l) => l.id === id);
    if (!lesson) return;

    lessonName.value = lesson.name;
    lessonSubject.value = lesson.subject;
    lessonClass.value = lesson.className;
    lessonTeacher.value = lesson.teacher;
    lessonDate.value = lesson.date;
    lessonNotes.value = lesson.notes;

    deleteLesson(id);
  };

  // 🗑️ حذف درس
  window.deleteLesson = (id) => {
    if (confirm("هل تريد حذف هذا الدرس؟")) {
      lessons = lessons.filter((l) => l.id !== id);
      localStorage.setItem("lessons", JSON.stringify(lessons));
      renderLessons();
    }
  };

  renderLessons();
});
