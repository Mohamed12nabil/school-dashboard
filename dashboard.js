document.addEventListener("DOMContentLoaded", () => {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
  const scores = JSON.parse(localStorage.getItem("scores")) || [];

  // 🔹 حساب الإحصائيات
  const totalStudents = students.length;
  const totalAbsents = attendance.filter((a) => a.status === "غائب").length;
  const totalFails = scores.filter((s) => s.status === "راسب").length;
  const totalWarnings = scores.filter(
    (s) => s.warning && s.warning.trim() !== ""
  ).length;

  // 🔹 حساب متوسط الدرجات
  const validScores = scores.filter(
    (s) => !isNaN(s.score) && s.status !== "لم يحضر"
  );
  const avgScore =
    validScores.length > 0
      ? (
          validScores.reduce((sum, s) => sum + parseFloat(s.score), 0) /
          validScores.length
        ).toFixed(1)
      : 0;

  // 🔹 عرض القيم في الكروت
  document.getElementById("totalStudents").textContent = totalStudents;
  document.getElementById("totalAbsents").textContent = totalAbsents;
  document.getElementById("totalFails").textContent = totalFails;
  document.getElementById("totalWarnings").textContent = totalWarnings;
  document.getElementById("avgScore").textContent = avgScore + "%";

  // 🔹 رسم بياني باستخدام Chart.js
  const ctx = document.getElementById("scoreChart").getContext("2d");

  const passed = scores.filter((s) => s.status === "ناجح").length;
  const failed = scores.filter((s) => s.status === "راسب").length;
  const absent = scores.filter((s) => s.status === "لم يحضر").length;

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["ناجحين", "راسبين", "غائبين"],
      datasets: [
        {
          data: [passed, failed, absent],
          backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
});
