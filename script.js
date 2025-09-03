// গ্লোবাল ভেরিয়েবল
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let studentName = '';
let selectedClass = '';
let selectedSubject = '';
let totalQuestions = 10;
let timer = 30;
let timerInterval = null;
let userAnswers = [];
let subjectScores = {};

// পার্টিকেল সিস্টেম ইনিশিয়ালাইজেশন
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// পেজ লোড হলে পার্টিকেল সিস্টেম চালু করা
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    
    // বাটনে রিপল ইফেক্ট যোগ করা
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-primary')) {
            const ripple = e.target.querySelector('.btn-ripple');
            if (ripple) {
                ripple.style.width = '0';
                ripple.style.height = '0';
                setTimeout(() => {
                    ripple.style.width = '300px';
                    ripple.style.height = '300px';
                }, 10);
            }
        }
    });
});

// কুইজ শুরু করার ফাংশন
function startQuiz() {
    // ইনপুট ভ্যালিডেশন
    studentName = document.getElementById('student-name').value.trim();
    totalQuestions = parseInt(document.getElementById('question-count').value);
    
    if (!studentName) {
        // কাস্টম অ্যালার্ট ইফেক্ট
        const nameInput = document.getElementById('student-name');
        nameInput.style.borderColor = '#ff6b6b';
        nameInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            nameInput.style.borderColor = '';
            nameInput.style.animation = '';
        }, 500);
        alert('দয়া করে তোমার নাম লেখো!');
        return;
    }
    
    // সব বিষয় মিশ্রিত মোড সেট করা
    selectedSubject = 'mixed';
    selectedClass = 'all'; // সব শ্রেণীর প্রশ্ন
    
    // প্রশ্ন প্রস্তুত করা
    prepareQuestions();
    
    // স্ক্রিন পরিবর্তন
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    
    // প্রথম প্রশ্ন লোড
    loadQuestion();
}

// প্রশ্ন প্রস্তুত করার ফাংশন
function prepareQuestions() {
    currentQuestions = [];
    subjectScores = {};
    
    // সব বিষয় ও সব শ্রেণী থেকে প্রশ্ন নেওয়া
    const subjects = ['history', 'geography', 'physical_science', 'life_science', 'english', 'bengali'];
    const classes = [5, 6, 7, 8];
    
    subjects.forEach(subject => {
        subjectScores[subject] = { correct: 0, total: 0 };
        
        classes.forEach(classNum => {
            if (questionBank[subject] && questionBank[subject][classNum]) {
                const subjectQuestions = questionBank[subject][classNum];
                subjectQuestions.forEach(q => {
                    q.subject = subject;
                    q.class = classNum;
                    currentQuestions.push(q);
                });
            }
        });
    });
    
    // প্রশ্ন শাফল করা এবং নির্দিষ্ট সংখ্যক নেওয়া
    currentQuestions = shuffleArray(currentQuestions).slice(0, totalQuestions);
    totalQuestions = currentQuestions.length;
}

// র‍্যান্ডম প্রশ্ন নির্বাচন
function getRandomQuestions(questions, count) {
    const shuffled = shuffleArray([...questions]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// অ্যারে শাফল করার ফাংশন
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// প্রশ্ন লোড করার ফাংশন
function loadQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showResults();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    
    // প্রশ্ন আপডেট
    document.getElementById('question').textContent = question.question;
    
    // প্রগ্রেস আপডেট
    updateProgress();
    
    // অপশন তৈরি
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(index);
        
        // স্ট্যাগার্ড অ্যানিমেশন
        optionDiv.style.opacity = '0';
        optionDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            optionDiv.style.transition = 'all 0.3s ease';
            optionDiv.style.opacity = '1';
            optionDiv.style.transform = 'translateY(0)';
        }, index * 100);
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // টাইমার শুরু
    startTimer();
}

// অপশন নির্বাচন
function selectOption(selectedIndex) {
    clearInterval(timerInterval);
    
    const question = currentQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    // ক্লিক ইফেক্ট যোগ করা
    options[selectedIndex].style.transform = 'scale(0.95)';
    setTimeout(() => {
        options[selectedIndex].style.transform = '';
    }, 150);
    
    // সঠিক উত্তর দেখানো
    options[question.correct].classList.add('correct');
    
    // ভুল উত্তর দেখানো
    if (selectedIndex !== question.correct) {
        options[selectedIndex].classList.add('incorrect');
    }
    
    // স্কোর আপডেট
    const isCorrect = selectedIndex === question.correct;
    if (isCorrect) {
        score++;
        if (subjectScores[question.subject]) {
            subjectScores[question.subject].correct++;
        }
    }
    
    if (subjectScores[question.subject]) {
        subjectScores[question.subject].total++;
    }
    
    // উত্তর সংরক্ষণ
    userAnswers.push({
        question: question.question,
        options: question.options,
        correctAnswer: question.correct,
        userAnswer: selectedIndex,
        isCorrect: isCorrect,
        explanation: question.explanation,
        subject: question.subject
    });
    
    // পরবর্তী প্রশ্নে যাওয়া
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 2000);
}

// প্রশ্ন এড়িয়ে যাওয়া
function skipQuestion() {
    clearInterval(timerInterval);
    
    const question = currentQuestions[currentQuestionIndex];
    
    // স্কোর আপডেট (এড়িয়ে গেলে ভুল হিসেবে গণ্য)
    if (subjectScores[question.subject]) {
        subjectScores[question.subject].total++;
    }
    
    // উত্তর সংরক্ষণ
    userAnswers.push({
        question: question.question,
        options: question.options,
        correctAnswer: question.correct,
        userAnswer: -1, // -1 মানে এড়িয়ে গেছে
        isCorrect: false,
        explanation: question.explanation,
        subject: question.subject
    });
    
    currentQuestionIndex++;
    loadQuestion();
}

// টাইমার শুরু
function startTimer() {
    timer = 30;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timer--;
        updateTimerDisplay();
        
        if (timer <= 0) {
            clearInterval(timerInterval);
            skipQuestion(); // সময় শেষ হলে এড়িয়ে যাওয়া
        }
    }, 1000);
}

// টাইমার ডিসপ্লে আপডেট
function updateTimerDisplay() {
    document.getElementById('timer-text').textContent = timer;
    const percentage = (timer / 30) * 100;
    document.getElementById('timer-bar').style.setProperty('--width', percentage + '%');
    
    // রঙ পরিবর্তন
    const timerBar = document.getElementById('timer-bar');
    if (timer <= 10) {
        timerBar.style.background = `conic-gradient(#ff6b6b ${percentage}%, #e1e5e9 0)`;
    } else if (timer <= 20) {
        timerBar.style.background = `conic-gradient(#ffc107 ${percentage}%, #e1e5e9 0)`;
    } else {
        timerBar.style.background = `conic-gradient(#28a745 ${percentage}%, #e1e5e9 0)`;
    }
}

// প্রগ্রেস আপডেট
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    
    // বাংলা সংখ্যায় কাউন্টার
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const currentNum = (currentQuestionIndex + 1).toString().split('').map(d => bengaliNumbers[parseInt(d)]).join('');
    const totalNum = totalQuestions.toString().split('').map(d => bengaliNumbers[parseInt(d)]).join('');
    
    document.getElementById('question-counter').textContent = `${currentNum} / ${totalNum}`;
}

// ফলাফল দেখানো
function showResults() {
    clearInterval(timerInterval);
    
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // স্কোর সার্কেল অ্যানিমেশন
    const scoreCircle = document.getElementById('score-circle');
    setTimeout(() => {
        scoreCircle.style.setProperty('--score', percentage + '%');
    }, 500);
    
    // বাংলা সংখ্যায় পার্সেন্টেজ
    const bengaliPercentage = percentage.toString().split('').map(d => {
        const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return bengaliNumbers[parseInt(d)] || d;
    }).join('');
    
    document.getElementById('score-percentage').textContent = bengaliPercentage + '%';
    document.getElementById('student-info').textContent = `অভিনন্দন, ${studentName}!`;
    
    const bengaliScore = score.toString().split('').map(d => {
        const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return bengaliNumbers[parseInt(d)];
    }).join('');
    
    const bengaliTotal = totalQuestions.toString().split('').map(d => {
        const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return bengaliNumbers[parseInt(d)];
    }).join('');
    
    document.getElementById('score-details').textContent = `তুমি ${bengaliTotal}টি প্রশ্নের মধ্যে ${bengaliScore}টি সঠিক উত্তর দিয়েছো`;
    
    // পারফরম্যান্স ব্যাজ
    const badge = document.getElementById('performance-badge');
    if (percentage >= 90) {
        badge.textContent = '🏆 চমৎকার!';
        badge.className = 'performance-badge badge-excellent';
    } else if (percentage >= 70) {
        badge.textContent = '👍 ভালো!';
        badge.className = 'performance-badge badge-good';
    } else if (percentage >= 50) {
        badge.textContent = '👌 মন্দ নয়!';
        badge.className = 'performance-badge badge-average';
    } else {
        badge.textContent = '💪 আরো চেষ্টা করো!';
        badge.className = 'performance-badge badge-poor';
    }
    
    // বিষয়ভিত্তিক ফলাফল
    showSubjectBreakdown();
}

// বিষয়ভিত্তিক ফলাফল দেখানো
function showSubjectBreakdown() {
    const container = document.getElementById('subject-breakdown');
    let html = '<h3>বিষয়ভিত্তিক ফলাফল:</h3>';
    
    Object.keys(subjectScores).forEach(subject => {
        const subjectData = subjectScores[subject];
        if (subjectData.total > 0) {
            const subjectPercentage = Math.round((subjectData.correct / subjectData.total) * 100);
            html += `
                <div class="subject-score">
                    <span class="subject-name">${subjectNames[subject]}:</span>
                    <span class="subject-result">${subjectData.correct}/${subjectData.total} (${subjectPercentage}%)</span>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
}

// উত্তর দেখানো
function showAnswers() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('answer-screen').style.display = 'block';
    
    const container = document.getElementById('answer-list');
    let html = '';
    
    userAnswers.forEach((answer, index) => {
        const questionNum = (index + 1).toString().split('').map(d => {
            const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            return bengaliNumbers[parseInt(d)];
        }).join('');
        
        html += `
            <div class="answer-item ${answer.isCorrect ? 'correct-answer' : 'incorrect-answer'}">
                <div class="answer-header">
                    <span class="question-number">প্রশ্ন ${questionNum}</span>
                    <span class="subject-tag">${subjectNames[answer.subject]}</span>
                </div>
                <div class="question-text">${answer.question}</div>
                <div class="answer-options">
                    ${answer.options.map((option, i) => `
                        <div class="answer-option ${i === answer.correctAnswer ? 'correct-option' : ''} ${i === answer.userAnswer ? 'user-option' : ''}">
                            ${option} ${i === answer.correctAnswer ? '✓' : ''} ${i === answer.userAnswer && i !== answer.correctAnswer ? '✗' : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="explanation">
                    <strong>ব্যাখ্যা:</strong> ${answer.explanation}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ফলাফলে ফিরে যাওয়া
function backToResults() {
    document.getElementById('answer-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
}

// কুইজ পুনরায় শুরু
function restartQuiz() {
    // সব ভেরিয়েবল রিসেট
    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    subjectScores = {};
    clearInterval(timerInterval);
    
    // স্ক্রিন রিসেট
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('answer-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    
    // ফর্ম রিসেট
    document.getElementById('student-name').value = '';
    document.getElementById('question-count').value = '10';
}

// কুইজ বন্ধ করা
function quitQuiz() {
    if (confirm('তুমি কি সত্যিই কুইজ বন্ধ করতে চাও?')) {
        restartQuiz();
    }
}

// শেক অ্যানিমেশন CSS যোগ করা
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);