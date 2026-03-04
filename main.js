// main.js
document.addEventListener('DOMContentLoaded', () => {
    // Data Questions - 10 Pertanyaan
    const questions = [
        // 5 Pertanyaan sebelumnya (dengan penjelasan lebih detail)
        {
            question: "Apa ibukota Indonesia?",
            options: ["Surabaya", "Bandung", "Jakarta", "Medan"],
            correct: 2,
            explanation: "Jakarta adalah ibukota Indonesia sejak 17 Agustus 1945. Sebelumnya, ibukota Indonesia pernah berada di Yogyakarta (1946-1948) dan Bukittinggi (1948-1949)."
        },
        {
            question: "Siapa penemu bola lampu?",
            options: ["Nikola Tesla", "Thomas Edison", "Albert Einstein", "Alexander Graham Bell"],
            correct: 1,
            explanation: "Thomas Edison mematenkan bola lampu listrik praktis pertama pada tahun 1879. Namun, Humphry Davy telah menemukan lampu listrik pertama (arc lamp) pada tahun 1802."
        },
        {
            question: "Berapa hasil dari 8 × 7?",
            options: ["48", "56", "64", "72"],
            correct: 1,
            explanation: "8 × 7 = 56. Tips mudah: 7 × 8 = 56, atau ingat 5+6=11, 1+1=2, dan 8-6=2."
        },
        {
            question: "Planet terbesar di tata surya adalah?",
            options: ["Mars", "Saturnus", "Jupiter", "Neptunus"],
            correct: 2,
            explanation: "Jupiter adalah planet terbesar dengan diameter 142.984 km - bisa memuat 1.300 Bumi! Massanya 2,5 kali lipat dari semua planet lain jika digabungkan."
        },
        {
            question: "Tahun berapa Indonesia merdeka?",
            options: ["1942", "1945", "1948", "1950"],
            correct: 1,
            explanation: "Indonesia merdeka pada 17 Agustus 1945. Proklamasi dibacakan Soekarno-Hatta di Jalan Pegangsaan Timur No. 56, Jakarta."
        },
        
        // 5 Pertanyaan BARU
        {
            question: "Hewan apa yang dikenal sebagai 'Raja Hutan'?",
            options: ["Harimau", "Gajah", "Singa", "Macan Tutul"],
            correct: 2,
            explanation: "Singa dikenal sebagai 'Raja Hutan' karena keberanian dan kekuatannya. Meski sebenarnya singa hidup di padang rumput (savana), bukan di hutan!"
        },
        {
            question: "Apa nama lapisan atmosfer yang paling dekat dengan Bumi?",
            options: ["Troposfer", "Stratosfer", "Mesosfer", "Termosfer"],
            correct: 0,
            explanation: "Troposfer adalah lapisan terbawah (0-12 km dari permukaan Bumi). Di sinilah tempat terjadinya awan, hujan, dan fenomena cuaca lainnya."
        },
        {
            question: "Siapa penulis novel 'Laskar Pelangi'?",
            options: ["Andrea Hirata", "Pramoedya Ananta Toer", "Tere Liye", "Dee Lestari"],
            correct: 0,
            explanation: "Andrea Hirata menulis Laskar Pelangi (2005) berdasarkan pengalaman masa kecilnya di Belitung. Buku ini laris hingga 5 juta eksemplar!"
        },
        {
            question: "Apa ibu kota Jepang?",
            options: ["Osaka", "Kyoto", "Tokyo", "Hiroshima"],
            correct: 2,
            explanation: "Tokyo adalah ibu kota Jepang sejak 1869. Sebelumnya, Kyoto adalah ibu kota selama lebih dari 1.000 tahun (794-1868)."
        },
        {
            question: "Berapa jumlah provinsi di Indonesia saat ini?",
            options: ["34", "35", "36", "37"],
            correct: 3, // Index 3 = option ke-4 (37)
            explanation: "Indonesia memiliki 37 provinsi pada tahun 2024. Provinsi termuda adalah Papua Selatan, Papua Tengah, dan Papua Pegunungan (hasil pemekaran Papua)."
        }
    ];

    // DOM Elements
    const welcomeScreen = document.getElementById('welcomeScreen');
    const quizContent = document.getElementById('quizContent');
    const startQuizBtn = document.getElementById('startQuizBtn');
    
    const timerEl = document.getElementById('time');
    const streakCountEl = document.getElementById('streak-count');
    const progressFill = document.getElementById('progress-fill');
    const questionNumberEl = document.getElementById('question-number');
    const questionEl = document.querySelector('.question');
    const optionsContainer = document.querySelector('.options');
    const feedbackEl = document.getElementById('feedback');
    const explanationEl = document.getElementById('explanation');
    const resultSection = document.querySelector('.result');
    const scoreEl = document.getElementById('score');
    const totalEl = document.getElementById('total');
    const percentEl = document.getElementById('percent');
    const summaryEl = document.getElementById('summary');
    const reviewEl = document.getElementById('review');
    const restartBtn = document.querySelector('.restart-btn');
    const quizHeader = document.querySelector('.quiz-header');
    
    // Next button
    const nextBtn = document.getElementById('nextBtn');

    // Quiz State
    let currentQuestionIndex = 0;
    let score = 0;
    let streak = 0;
    let timer;
    let timeLeft = 15;
    let quizCompleted = false;
    let userAnswers = [];
    let locked = false;
    let waitingForNext = false;

    // Set total questions
    totalEl.textContent = questions.length;

    // Event Listeners
    startQuizBtn.addEventListener('click', startQuiz);
    restartBtn.addEventListener('click', restartQuiz);
    nextBtn.addEventListener('click', handleNextClick);

    // Function to start quiz
    function startQuiz() {
        // Fade out welcome screen
        welcomeScreen.style.animation = 'fadeOut 0.5s ease forwards';
        
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            quizContent.style.display = 'block';
            quizContent.style.animation = 'fadeIn 0.6s ease';
            
            // Load first question
            loadQuestion();
        }, 400);
    }

    // Add fadeOut animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);

    // Functions
    function loadQuestion() {
        // Reset state for new question
        locked = false;
        waitingForNext = false;
        clearInterval(timer);
        
        // Hide next button
        nextBtn.style.display = 'none';
        nextBtn.classList.remove('highlight');
        
        // Remove waiting class from header
        quizHeader.classList.remove('waiting');
        
        // Reset timer color
        timerEl.style.color = '';
        
        // Update progress bar
        updateProgressBar();
        
        // Check if quiz is completed
        if (currentQuestionIndex >= questions.length) {
            showResults();
            return;
        }

        // Get current question
        const currentQ = questions[currentQuestionIndex];
        
        // Update question number
        questionNumberEl.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
        
        // Update question text
        questionEl.textContent = currentQ.question;
        
        // Clear and create options
        optionsContainer.innerHTML = '';
        currentQ.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option';
            optionBtn.textContent = option;
            optionBtn.dataset.index = index;
            optionBtn.addEventListener('click', () => handleOptionClick(index));
            optionsContainer.appendChild(optionBtn);
        });

        // Reset timer
        timeLeft = 15;
        timerEl.textContent = timeLeft;
        
        // Clear feedback and explanation
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
        explanationEl.textContent = '';
        explanationEl.style.display = 'none';
        
        // Start timer
        startTimer();
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;

            // Visual warning when time is low
            if (timeLeft <= 5) {
                timerEl.style.color = '#ff0404';
                timerEl.style.fontWeight = 'bold';
            }

            if (timeLeft <= 0) {
                clearInterval(timer);
                if (!locked && !quizCompleted && !waitingForNext) {
                    handleTimeOut();
                }
            }
        }, 1000);
    }

    function handleTimeOut() {
        locked = true;
        streak = 0;
        streakCountEl.textContent = streak;
        
        // Disable all options
        disableOptions();
        
        // Show feedback
        feedbackEl.textContent = '⏰ Time\'s up!';
        feedbackEl.className = 'feedback wrong';
        
        // Record answer
        const currentQ = questions[currentQuestionIndex];
        userAnswers.push({
            question: currentQ.question,
            userAnswer: 'No answer (time out)',
            correctAnswer: currentQ.options[currentQ.correct],
            isCorrect: false,
            explanation: currentQ.explanation
        });

        // Show explanation
        explanationEl.textContent = currentQ.explanation;
        explanationEl.style.display = 'block';
        
        // Show next button
        showNextButton();
    }

    function handleOptionClick(selectedIndex) {
        if (locked || quizCompleted || waitingForNext) return;
        
        locked = true;
        clearInterval(timer);
        
        const currentQ = questions[currentQuestionIndex];
        const isCorrect = selectedIndex === currentQ.correct;
        
        // Disable all options
        disableOptions();
        
        // Highlight correct/wrong answer
        highlightAnswers(selectedIndex, currentQ.correct);
        
        // Update score and streak
        if (isCorrect) {
            score++;
            streak++;
            scoreEl.textContent = score;
            streakCountEl.textContent = streak;
            
            feedbackEl.textContent = '✅ Correct!';
            feedbackEl.className = 'feedback correct';
        } else {
            streak = 0;
            streakCountEl.textContent = streak;
            
            feedbackEl.textContent = '❌ Wrong!';
            feedbackEl.className = 'feedback wrong';
        }
        
        // Record answer
        userAnswers.push({
            question: currentQ.question,
            userAnswer: currentQ.options[selectedIndex],
            correctAnswer: currentQ.options[currentQ.correct],
            isCorrect: isCorrect,
            explanation: currentQ.explanation
        });

        // Show explanation
        explanationEl.textContent = currentQ.explanation;
        explanationEl.style.display = 'block';
        
        // Show next button
        showNextButton();
    }

    function showNextButton() {
        waitingForNext = true;
        quizHeader.classList.add('waiting');
        nextBtn.style.display = 'flex';
        
        // Highlight next button if answer was wrong
        const lastAnswer = userAnswers[userAnswers.length - 1];
        if (lastAnswer && !lastAnswer.isCorrect) {
            nextBtn.classList.add('highlight');
        } else {
            nextBtn.classList.remove('highlight');
        }
    }

    function handleNextClick() {
        if (!waitingForNext) return;
        
        // Move to next question
        currentQuestionIndex++;
        loadQuestion();
    }

    function disableOptions() {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.disabled = true;
            option.classList.add('locked');
        });
    }

    function highlightAnswers(selected, correct) {
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            if (index === correct) {
                option.classList.add('correct');
            } else if (index === selected && selected !== correct) {
                option.classList.add('wrong');
            }
        });
    }

    function updateProgressBar() {
        const progress = (currentQuestionIndex / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    function showResults() {
        quizCompleted = true;
        
        // Hide quiz elements
        document.querySelector('.quiz-header').style.display = 'none';
        document.querySelector('.progress-bar').style.display = 'none';
        questionNumberEl.style.display = 'none';
        questionEl.style.display = 'none';
        optionsContainer.style.display = 'none';
        feedbackEl.style.display = 'none';
        explanationEl.style.display = 'none';
        nextBtn.style.display = 'none';
        
        // Show result section
        resultSection.style.display = 'block';
        restartBtn.style.display = 'inline-block';
        
        // Calculate percentage
        const percentage = Math.round((score / questions.length) * 100);
        percentEl.textContent = percentage;
        
        // Show summary with motivational message
        let message = '';
        let emoji = '';
        
        if (percentage === 100) {
            emoji = '🏆🌟';
            message = 'LUAR BIASA! Sempurna! Kamu jenius!';
        } else if (percentage >= 80) {
            emoji = '🎯🔥';
            message = 'KEREN! Hampir sempurna! Pertahankan!';
        } else if (percentage >= 60) {
            emoji = '👍💪';
            message = 'Cukup bagus! Tingkatkan lagi ya!';
        } else if (percentage >= 40) {
            emoji = '📚✨';
            message = 'Terus belajar, kamu pasti bisa lebih baik!';
        } else {
            emoji = '🌱💫';
            message = 'Jangan menyerah! Setiap usaha adalah pembelajaran!';
        }
        
        summaryEl.innerHTML = `${emoji} ${message} ${emoji}`;
        
        // Generate review
        generateReview();
    }

    function generateReview() {
        reviewEl.innerHTML = '<div class="review-title">📋 Review Jawaban</div>';
        
        userAnswers.forEach((item, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = `review-item ${item.isCorrect ? 'is-correct' : 'is-wrong'}`;
            
            reviewItem.innerHTML = `
                <div class="review-question">${index + 1}. ${item.question}</div>
                <div class="review-meta">
                    <div class="review-line">
                        <span class="review-label">Jawaban kamu: </span>
                        <span class="review-value">${item.userAnswer}</span>
                    </div>
                    <div class="review-line">
                        <span class="review-label">Jawaban benar: </span>
                        <span class="review-value">${item.correctAnswer}</span>
                    </div>
                    <div class="review-line">
                        <span class="review-label">📝 </span>
                        <span class="review-value">${item.explanation}</span>
                    </div>
                    <div class="badge ${item.isCorrect ? 'ok' : 'bad'}">
                        ${item.isCorrect ? '✓ Benar' : '✗ Salah'}
                    </div>
                </div>
            `;
            
            reviewEl.appendChild(reviewItem);
        });
    }

    function restartQuiz() {
        // Reset all state
        currentQuestionIndex = 0;
        score = 0;
        streak = 0;
        quizCompleted = false;
        userAnswers = [];
        locked = false;
        waitingForNext = false;
        
        // Reset UI
        scoreEl.textContent = '0';
        streakCountEl.textContent = '0';
        
        // Hide result section and show welcome screen
        resultSection.style.display = 'none';
        restartBtn.style.display = 'none';
        quizContent.style.display = 'none';
        welcomeScreen.style.display = 'block';
        welcomeScreen.style.animation = 'fadeIn 0.6s ease';
        
        // Reset timer color
        timerEl.style.color = '';
        
        // Remove waiting class
        quizHeader.classList.remove('waiting');
    }
});