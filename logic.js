let quizCategory = null;
let numberofQuestions = null;
let currentQuestion = null;

const configContainer = document.querySelector(".configContainer");
const quizContainer = document.querySelector(".quizContainer");
const answerOptions = document.querySelector(".answerOptions");
const nextQuestionBtn = document.querySelector(".nextQuestionBtn");
const questionIndexHistory = []; //This is just a list where we store the indexes (numbers) of questions we've already shown.
const questionStatus = document.querySelector(".questionStatus");
const timerDisplay = document.querySelector(".timeDuration"); //select the para of time
const resultContainer = document.querySelector(".resultContainer");
let correctAnswerCount = 0;
const tryagainBtn = document.querySelector(".tryAgainBtn");
const startQuizBtn = document.querySelector(".startQuizBtn");

const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;

// Display the quizresult and hide the quiz container
const showQuizResult = () => {
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";

  const resultText = `You answered <b>${correctAnswerCount}</b> of <b>${numberofQuestions}</b> questions correctly. Great effort!`
  document.querySelector(".resultMessage").innerHTML = resultText;
}

// Initialize the Start Timer for the current question
const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}`;

    if (currentTime <= 0) {
      clearInterval(timer);
      highlightCorrectAnswer();
      answerOptions.querySelectorAll(".answerOption").forEach((option) => option.style.pointerEvents = "none");
      nextQuestionBtn.style.visibility = "visible";

      quizContainer.querySelector(".quizTimer").style.background = "#c31402";
    }
  }, 1000)
}

// Clear and reset the timer
const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timerDisplay.textContent = `${currentTime}`;
}

//.find() returns the first element in the array that satisfies the condition
// Fetch random question based on seleted category
const getRandomQuestion = () => {
  const categoryData = Questions.find((cat) => cat.category.toLowerCase() === quizCategory.toLowerCase());
  if (!categoryData || !categoryData.questions || categoryData.questions.length === 0) return null;

  // Show the results if all ques have been used
  if (questionIndexHistory.length >= Math.min(categoryData.questions.length, numberofQuestions)) {
    return showQuizResult();
  }

  const availableQuestions = categoryData.questions.filter((_, index) => !questionIndexHistory.includes(index)); //This filters the full question list, keeping only those whose index is not in the questionIndexHistory
  if (availableQuestions.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const RandomQuestion = availableQuestions[randomIndex];

  const originalIndex = categoryData.questions.indexOf(RandomQuestion);
  // console.log(originalIndex);
  if (originalIndex !== -1) {
    questionIndexHistory.push(originalIndex);
  }

  return RandomQuestion;
};


//Always Highlight the correct option and show its icon after any option is clicked
const highlightCorrectAnswer = () => {
  const correctOption = answerOptions.querySelectorAll(".answerOption")[currentQuestion.correctAnswer];
  // console.log(correctOption.textContent); //answer option
  correctOption.classList.add("correct");

  const iconHTML = `<span class = "material-symbols-outlined">check_circle</span>`;
  correctOption.insertAdjacentHTML("beforeend", iconHTML);
}


const handleAnswer = (option, answerIndex) => {
  clearInterval(timer);

  const isCorrect = currentQuestion.correctAnswer === answerIndex; //gets the index of correct option
  option.classList.add(isCorrect ? "correct" : "incorrect");

  //Highlight correct answer
  !isCorrect ? highlightCorrectAnswer() : correctAnswerCount++;

  //Disable furthur clicks
  answerOptions.querySelectorAll(".answerOption").forEach((option) => option.style.pointerEvents = "none");

  //Insert icon based on correctness
  const iconHTML = `<span class = "material-symbols-outlined">${isCorrect ? 'check_circle' : 'cancel'}</span>`;
  option.insertAdjacentHTML("beforeend", iconHTML);

  //
  nextQuestionBtn.style.visibility = "visible";
}

const renderQuestion = () => {
  currentQuestion = getRandomQuestion();
  // console.log(currentQuestion); //{question: 'What does HTML stand for?', options: Array(4), correctAnswer: 1}

  if (!currentQuestion) return console.warn("No question found for this category.");


  resetTimer();
  startTimer();

  //Update the UI
  answerOptions.innerHTML = "";
  document.querySelector(".quizQuestion").textContent = currentQuestion.question;
  nextQuestionBtn.style.visibility = "hidden";
  questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberofQuestions}</b> Questions`;
  quizContainer.querySelector(".quizTimer").style.background = "#32313C";




  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answerOption");
    li.textContent = option;
    console.log(li);

    answerOptions.appendChild(li);
    console.log(index, option);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
};

// Reset the quiz and return to configuration container
const resetQuiz = () => {
  resetTimer();
  correctAnswerCount = 0;
  questionIndexHistory.length = 0;
  configContainer.style.display = "block";
  resultContainer.style.display = "none";

   // Remove previously active buttons
  document.querySelectorAll(".categoryOption.active, .questionOption.active").forEach((btn) => {
    btn.classList.remove("active");
  });
}

// Start the quiz and render the random question
const startQuiz = () => {
  configContainer.style.display = "none";
  // resultContainer.style.display = "none";
  quizContainer.style.display = "block";

  // Update the quiz category and number of questions
  quizCategory = configContainer.querySelector(".categoryOption.active").textContent;
  numberofQuestions = parseInt(configContainer.querySelector(".questionOption.active").textContent);

  renderQuestion();

}

// Highlight the selected option on click category or no. of questions
document.querySelectorAll(".categoryOption, .questionOption").forEach((option) => {
  option.addEventListener("click", () => {
    // Remove active class from all siblings in the same group
    const group = option.classList.contains("categoryOption")
      ? document.querySelectorAll(".categoryOption")
      : document.querySelectorAll(".questionOption");

    group.forEach((el) => el.classList.remove("active"));
    option.classList.add("active");
  });
});

// renderQuestion();


nextQuestionBtn.addEventListener("click", renderQuestion);
tryagainBtn.addEventListener("click", resetQuiz);
startQuizBtn.addEventListener("click", startQuiz);