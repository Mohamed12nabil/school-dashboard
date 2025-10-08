document.addEventListener("DOMContentLoaded", () => {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  let exams = JSON.parse(localStorage.getItem("exams")) || [];
  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  const examSubject = document.getElementById("examSubject");
  const examDate = document.getElementById("examDate");
  const maxScore = document.getElementById("maxScore");
  const addExamBtn = document.getElementById("addExamBtn");
  const examSelect = document.getElementById("examSelect");

  const studentSelect = document.getElementById("studentSelect");
  const studentScore = document.getElementById("studentScore");
  const studentLevel = document.getElementById("studentLevel");
  const studentWarning = document.getElementById("studentWarning");
  const addScoreBtn = document.getElementById("addScoreBtn");
  const scoresBody = document.getElementById("scoresBody");

  // ✅ تحميل البيانات
  function loadData() {
    examSelect.innerHTML = "";
    studentSelect.innerHTML = "";

    exams.forEach((exam) => {
      const opt = document.createElement("option");
      opt.value = exam.id;
      opt.textContent = `${exam.subject} (${exam.date})`;
      examSelect.appendChild(opt);
    });

    students.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.name;
      opt.textContent = `${s.name} - ${s.class}`;
      studentSelect.appendChild(opt);
    });
  }

  // 🧾 إضافة امتحان جديد
  addExamBtn.addEventListener("click", () => {
    const subject = examSubject.value.trim();
    const date = examDate.value;
    const max = parseFloat(maxScore.value);

    if (!subject || !date || !max) {
      alert("من فضلك أدخل جميع بيانات الامتحان");
      return;
    }

    const newExam = {
      id: Date.now(),
      subject,
      date,
      maxScore: max,
    };

    exams.push(newExam);
    localStorage.setItem("exams", JSON.stringify(exams));
    loadData();
    alert("تمت إضافة الامتحان بنجاح ✅");
    examSubject.value = "";
    examDate.value = "";
    maxScore.value = "";
  });

  // 🧮 تسجيل درجة أو غياب الطالب
  addScoreBtn.addEventListener("click", () => {
    const examId = parseInt(examSelect.value);
    const studentName = studentSelect.value;
    const attended = document.getElementById("studentAttended").value;
    const score = parseFloat(studentScore.value);
    const level = studentLevel.value;
    const warning = studentWarning.value.trim();

    if (!examId || !studentName) {
      alert("من فضلك اختر الامتحان والطالب");
      return;
    }

    const exam = exams.find((e) => e.id === examId);
    if (!exam) return;

    // لو الطالب لم يحضر الامتحان
    if (attended === "no") {
      const result = {
        id: Date.now(),
        examId,
        studentName,
        subject: exam.subject,
        date: exam.date,
        score: "-",
        maxScore: exam.maxScore,
        status: "لم يحضر",
        level: "غير محدد",
        warning: "تغيب عن الامتحان 🚫",
      };

      scores.push(result);
      localStorage.setItem("scores", JSON.stringify(scores));
      renderScores();
      alert("تم تسجيل غياب الطالب عن الامتحان ⚠️");
      studentScore.value = "";
      studentWarning.value = "";
      return;
    }

    // لو حضر الامتحان
    if (isNaN(score)) {
      alert("من فضلك أدخل الدرجة للطالب");
      return;
    }

    const status = score >= exam.maxScore * 0.5 ? "ناجح" : "راسب";

    const result = {
      id: Date.now(),
      examId,
      studentName,
      subject: exam.subject,
      date: exam.date,
      score,
      maxScore: exam.maxScore,
      status,
      level,
      warning: status === "راسب" ? warning || "لم يذاكر جيدًا ❌" : warning,
    };

    scores.push(result);
    localStorage.setItem("scores", JSON.stringify(scores));
    renderScores();
    studentScore.value = "";
    studentWarning.value = "";
  });

  // 📊 عرض النتائج
  function renderScores() {
    scoresBody.innerHTML = "";
    if (scores.length === 0) {
      scoresBody.innerHTML = "<tr><td colspan='8'>لا توجد درجات بعد</td></tr>";
      return;
    }

    scores.forEach((s) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${s.studentName}</td>
        <td>${s.subject}</td>
        <td>${s.date}</td>
        <td>${s.score}</td>
        <td>${s.maxScore}</td>
        <td style="color:${
          s.status === "ناجح" ? "green" : s.status === "راسب" ? "red" : "orange"
        }; font-weight:bold;">
          ${s.status}
        </td>
        <td>${s.level || "-"}</td>
        <td style="color:${s.warning ? "red" : "gray"};">
          ${s.warning || "-"}
        </td>
      `;

      // لون الصف حسب النتيجة
      if (s.status === "راسب") {
        row.style.backgroundColor = "#ffebee"; // أحمر فاتح
      } else if (s.status === "ناجح") {
        row.style.backgroundColor = "#e8f5e9"; // أخضر فاتح
      } else if (s.status === "لم يحضر") {
        row.style.backgroundColor = "#fff3e0"; // برتقالي فاتح
      }

      scoresBody.appendChild(row);
    });
  }

  // أول تشغيل
  loadData();
  renderScores();
});
