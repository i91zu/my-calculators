// 1. نظام إنتقال الصفحات السلس (Single Page Application Logic)
function showSection(sectionId) {
    // إخفاء كل الصفحات
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // إظهار الصفحة المطلوبة
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // تحديث روابط القائمة النشطة
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        // ربط تفعيل الرابط إذا تطابق مع اسم المقطع الحالي للـ SPA
        if (link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        }
    });
    
    // غلق القائمة الجانبية في الجوال بعد الضغط
    document.getElementById('navMenu').classList.remove('open');
    
    // التمرير لأعلى الصفحة بسلاسة
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. التحكم بقائمة الجوال (Hamburger Menu)
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('navMenu').classList.toggle('open');
});

// 3. نظام الوضع الداكن الذكي وتذكره تلقائياً
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
});

// 4. تشغيل تمدد وتقلص عناصر الـ FAQ بصورة سلسة
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        faqItem.classList.toggle('active');
    });
});

// ==========================================
// 5. العمليات الحسابية لحاسبة النسبة المئوية
// ==========================================
function calcPercentage() {
    const num = parseFloat(document.getElementById('percentNum').value);
    const percent = parseFloat(document.getElementById('percentAmount').value);
    const resultBox = document.getElementById('percentResult');

    if (isNaN(num) || !num || isNaN(percent) || percent < 0) {
        resultBox.innerHTML = "⚠️ يرجى إدخال قيم صحيحة وموجبة.";
        return;
    }

    const calculatedValue = (num * percent) / 100;
    resultBox.innerHTML = `🎯 <strong>${percent}%</strong> من العدد <strong>${num}</strong> هي: <span style="color:var(--primary); font-size:1.3rem;">${calculatedValue.toFixed(2)}</span>`;
}

// ==========================================
// 6. العمليات الحسابية لحاسبة المعدل الدراسي
// ==========================================
function addSubjectRow() {
    const container = document.getElementById('subjectsContainer');
    const newRow = document.createElement('div');
    newRow.className = 'subject-row';
    newRow.innerHTML = `
        <input type="text" placeholder="اسم المادة (اختياري)" class="sub-name">
        <input type="number" placeholder="الدرجة أو النقاط" class="sub-grade" step="0.01" min="0">
        <input type="number" placeholder="الساعات" class="sub-hours" min="1">
    `;
    container.appendChild(newRow);
}

function calculateGPA() {
    const system = parseFloat(document.getElementById('gpaSystem').value);
    const grades = document.querySelectorAll('.sub-grade');
    const hours = document.querySelectorAll('.sub-hours');
    const resultBox = document.getElementById('gpaResult');

    let totalPoints = 0;
    let totalHours = 0;
    let isValid = true;

    for (let i = 0; i < grades.length; i++) {
        const grade = parseFloat(grades[i].value);
        const hour = parseFloat(hours[i].value);

        if (!isNaN(grade) && !isNaN(hour)) {
            if (grade > system || grade < 0 || hour <= 0) {
                isValid = false;
                break;
            }
            totalPoints += (grade * hour);
            totalHours += hour;
        }
    }

    if (!isValid || totalHours === 0) {
        resultBox.innerHTML = `⚠️ يرجى إدخال درجات صحيحة لا تتجاوز نظام المعدل المختار (${system}) وساعات أكبر من 0.`;
        return;
    }

    const finalGPA = totalPoints / totalHours;
    resultBox.innerHTML = `🎓 معدلك الدراسي هو: <span style="color:var(--accent); font-size:1.4rem;">${finalGPA.toFixed(2)}</span> من <strong>${system}.00</strong>`;
}

// ==========================================
// 7. العمليات الحسابية لحاسبة العمر
// ==========================================
function calculateAge() {
    const birthInput = document.getElementById('birthDate').value;
    const resultBox = document.getElementById('ageResult');

    if (!birthInput) {
        resultBox.innerHTML = "⚠️ يرجى تحديد تاريخ ميلادك أولاً.";
        return;
    }

    const birthDate = new Date(birthInput);
    const today = new Date();

    if (birthDate > today) {
        resultBox.innerHTML = "⚠️ تاريخ الميلاد لا يمكن أن يكون في المستقبل!";
        return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    resultBox.innerHTML = `🎉 عمرك الحالي هو: <strong>${years}</strong> سنة، و <strong>${months}</strong> شهر، و <strong>${days}</strong> يوم.`;
}

// ==========================================
// 8. العمليات الحسابية لحساب الأيام بين تاريخين
// ==========================================
function calculateDateDiff() {
    const startInput = document.getElementById('startDate').value;
    const endInput = document.getElementById('endDate').value;
    const resultBox = document.getElementById('dateDiffResult');

    if (!startInput || !endInput) {
        resultBox.innerHTML = "⚠️ يرجى تحديد كلا التاريخين.";
        return;
    }

    const start = new Date(startInput);
    const end = new Date(endInput);
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    resultBox.innerHTML = `⏳ الفارق الزمني بين التاريخين المحددين هو: <span style="color:var(--primary); font-size:1.2rem; font-weight:bold;">${diffDays} يوم</span>`;
}

// ==========================================
// 9. التعامل مع نموذج الاتصال المعدل واجهة العميل
// ==========================================
function handleContactSubmit(event) {
    event.preventDefault();
    const resultBox = document.getElementById('contactResult');
    
    resultBox.classList.remove('hidden');
    resultBox.style.color = 'var(--text-main)';
    resultBox.innerHTML = "📨 شكراً لتواصلك معنا. حالياً يمكن التواصل معنا عبر البريد الإلكتروني الموضح في الموقع.";
    
    document.getElementById('contactForm').reset();
}