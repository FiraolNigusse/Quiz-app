// Function to add a question (Teacher Mode)
function addQuestion() {
    let questionInput = document.getElementById("questionInput").value.trim();
    let option1 = document.getElementById("option1").value.trim();
    let option2 = document.getElementById("option2").value.trim();
    let option3 = document.getElementById("option3").value.trim();
    let correctAnswer = document.getElementById("correctAnswer").value.trim();

    if (!questionInput || !option1 || !option2 || !option3 || !correctAnswer) {
        alert("Please fill all fields.");
        return;
    }

    // Retrieve existing questions or initialize an empty array
    let questions = JSON.parse(localStorage.getItem("questions") || "[]");

    // Add new question object
    let newQuestion = {
        question: questionInput,
        options: [option1, option2, option3],
        correct: correctAnswer
    };

    questions.push(newQuestion);

    // Save updated questions to localStorage
    localStorage.setItem("questions", JSON.stringify(questions));

    // Clear input fields
    document.getElementById("questionInput").value = "";
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
    document.getElementById("correctAnswer").value = "";

    // Update Teacher's view
    updateQuestionList();
}

// Function to update the Teacher Panel with questions
function updateQuestionList() {
    let questionList = document.getElementById("questionList");
    if (!questionList) return; // Ensure it runs only on the teacher's page

    questionList.innerHTML = ""; // Clear list

    let questions = JSON.parse(localStorage.getItem("questions") || "[]");

    questions.forEach((q, index) => {
        let questionItem = document.createElement("div");
        questionItem.innerHTML = `
            <p>${index + 1}. ${q.question}</p>
            <button onclick="deleteQuestion(${index})">❌ Delete</button>
        `;
        questionList.appendChild(questionItem);
    });
}

// Function to delete a question
function deleteQuestion(index) {
    let questions = JSON.parse(localStorage.getItem("questions") || "[]");
    questions.splice(index, 1); // Remove the selected question
    localStorage.setItem("questions", JSON.stringify(questions));
    updateQuestionList(); // Refresh UI
}

// Function to load and display questions on the student page
function loadQuestions() {
    let studentQuiz = document.getElementById("studentQuiz");
    if (!studentQuiz) return; // Ensure this runs only on the student page

    studentQuiz.innerHTML = ""; // Clear previous content

    let questions = JSON.parse(localStorage.getItem("questions") || "[]");

    if (questions.length === 0) {
        studentQuiz.innerHTML = "<p>No questions available yet.</p>";
        return;
    }

    questions.forEach((q, index) => {
        let questionContainer = document.createElement("div");
        questionContainer.classList.add("question-block");
        
        let optionsHTML = q.options.map(opt => 
            `<label><input type="radio" name="question${index}" value="${opt}"> ${opt}</label><br>`
        ).join("");

        questionContainer.innerHTML = `
            <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
            ${optionsHTML}
        `;

        studentQuiz.appendChild(questionContainer);
    });
}

// Function to calculate and show the grade
function submitQuiz() {
    let questions = JSON.parse(localStorage.getItem("questions") || "[]");
    let score = 0;

    questions.forEach((q, index) => {
        let selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption && selectedOption.value === q.correct) {
            score++;
        }
    });

    let totalQuestions = questions.length;
    let percentage = ((score / totalQuestions) * 100).toFixed(2);
    document.getElementById("result").innerHTML = `Your Score: ${score}/${totalQuestions} (${percentage}%)`;
}

// Ensure the correct function loads depending on the page
document.addEventListener("DOMContentLoaded", () => {
    updateQuestionList(); // For teacher page
    loadQuestions(); // For student page
});
