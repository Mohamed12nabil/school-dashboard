document.addEventListener("DOMContentLoaded", () => {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  let payments = JSON.parse(localStorage.getItem("payments")) || [];

  const studentSelect = document.getElementById("studentSelect");
  const paymentMonth = document.getElementById("paymentMonth");
  const paymentAmount = document.getElementById("paymentAmount");
  const paymentStatus = document.getElementById("paymentStatus");
  const addPaymentBtn = document.getElementById("addPaymentBtn");
  const paymentsBody = document.getElementById("paymentsBody");

  let editId = null;

  // 🧍‍♂️ تحميل الطلاب في القائمة
  function loadStudents() {
    studentSelect.innerHTML = "";
    if (students.length === 0) {
      const opt = document.createElement("option");
      opt.textContent = "لا يوجد طلاب مسجلين";
      opt.disabled = true;
      opt.selected = true;
      studentSelect.appendChild(opt);
      return;
    }

    students.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s.name;
      opt.textContent = `${s.name} - ${s.class}`;
      studentSelect.appendChild(opt);
    });
  }

  // 💾 حفظ أو تعديل السجل
  addPaymentBtn.addEventListener("click", () => {
    const studentName = studentSelect.value;
    const month = paymentMonth.value;
    const amount = paymentAmount.value;
    const status = paymentStatus.value;

    if (!studentName || !month) {
      alert("من فضلك اختر اسم الطالب وحدد الشهر");
      return;
    }

    if (paymentStatus.value === "مدفوع" && !amount) {
      alert("من فضلك أدخل المبلغ في حالة الدفع");
      return;
    }

    if (editId) {
      const p = payments.find((x) => x.id === editId);
      p.name = studentName;
      p.month = month;
      p.amount = amount;
      p.status = status;
      editId = null;
      addPaymentBtn.textContent = "💾 حفظ السجل";
      alert("تم تعديل الشهرية بنجاح ✅");
    } else {
      payments.push({
        id: Date.now(),
        name: studentName,
        month,
        amount,
        status,
      });
    }

    localStorage.setItem("payments", JSON.stringify(payments));
    renderPayments();
    clearForm();
  });

  // 🧾 عرض جميع السجلات
  function renderPayments() {
    paymentsBody.innerHTML = "";
    if (payments.length === 0) {
      paymentsBody.innerHTML = "<tr><td colspan='5'>لا توجد بيانات</td></tr>";
      return;
    }

    payments.forEach((p) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.month}</td>
      <td>${p.amount || "-"}</td>
      <td>${p.status}</td>
      <td>
        <button onclick="editPayment(${p.id})">✏️ تعديل</button>
        <button onclick="deletePayment(${p.id})">🗑️ حذف</button>
      </td>
    `;

      // ✅ لون الصف حسب الحالة
      if (p.status === "مدفوع") {
        row.style.backgroundColor = "#e8f5e9"; // أخضر فاتح
      } else if (p.status === "غير مدفوع") {
        row.style.backgroundColor = "#ffebee"; // أحمر فاتح
      }

      paymentsBody.appendChild(row);
    });
  }

  // ✏️ تعديل
  window.editPayment = (id) => {
    const p = payments.find((x) => x.id === id);
    if (!p) return;

    studentSelect.value = p.name;
    paymentMonth.value = p.month;
    paymentAmount.value = p.amount;
    paymentStatus.value = p.status;

    editId = id;
    addPaymentBtn.textContent = "🔁 تحديث الشهرية";
  };

  // 🗑️ حذف
  window.deletePayment = (id) => {
    if (confirm("هل تريد حذف هذا السجل؟")) {
      payments = payments.filter((p) => p.id !== id);
      localStorage.setItem("payments", JSON.stringify(payments));
      renderPayments();
    }
  };

  // 🟠 دالة تضيف الطلاب اللي ما دفعوش تلقائيًا
  function markUnpaidStudents() {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7); // مثال: 2025-10

    students.forEach((student) => {
      const alreadyPaid = payments.some(
        (p) => p.name === student.name && p.month === currentMonth
      );

      if (!alreadyPaid) {
        payments.push({
          id: Date.now() + Math.random(),
          name: student.name,
          month: currentMonth,
          amount: 0,
          status: "غير مدفوع",
        });
      }
    });

    localStorage.setItem("payments", JSON.stringify(payments));
  }

  function clearForm() {
    paymentMonth.value = "";
    paymentAmount.value = "";
    paymentStatus.value = "مدفوع";
  }

  // 🟢 عند فتح الصفحة: حمّل الطلاب + أضف الغير مدفوعين
  loadStudents();
  markUnpaidStudents();
  renderPayments();
});
// 🧾 إنشاء تقرير PDF شهري
document.getElementById("generateReportBtn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const currentMonth = new Date().toISOString().slice(0, 7);
  const payments = JSON.parse(localStorage.getItem("payments")) || [];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("تقرير الشهريات الشهرية", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text(`الشهر: ${currentMonth}`, 105, 30, { align: "center" });

  let y = 45;
  doc.setFont("helvetica", "normal");
  doc.text("الاسم", 20, y);
  doc.text("الشهر", 70, y);
  doc.text("المبلغ", 110, y);
  doc.text("الحالة", 160, y);
  y += 8;

  payments.forEach((p) => {
    doc.text(p.name, 20, y);
    doc.text(p.month, 70, y);
    doc.text(`${p.amount || "-"}`, 110, y);
    doc.text(p.status, 160, y);
    y += 8;
    if (y > 270) {
      // صفحة جديدة عند الامتلاء
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`تقرير-الشهريات-${currentMonth}.pdf`);
});
