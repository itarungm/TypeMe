const time = document.getElementById("time");
const score = document.getElementById("score");
const inputBox = document.getElementById("inputBox");
const rando = document.getElementById("rando");
const typer = document.getElementById("typer");
const gameOverBox = document.getElementById("gameOverBox");
const yes = document.getElementById("yes");
const no = document.getElementById("no");
const highScore = document.getElementById("highScore");
const modalCall = document.getElementById("modalCall");
const scoreBoard = document.getElementById('scoreBoard');
const errSound = document.getElementById('errSound');

dictionaryLength = 200;
dictionary = [];
maxTimeInSeconds = 60;
gameOver = false;
timerStarted = false;
wrongWord = false;
let xhr = new XMLHttpRequest();

xhr.open(
  "GET",
  `https://random-word-api.herokuapp.com/word?number=${dictionaryLength}`,
  true
);

xhr.onload = () => {
  if (xhr.status === 200) {
    dictionary = JSON.parse(xhr.responseText);
    rando.innerText = dictionary[0];
    inputBox.focus();
  } else {
    console.error("Something went wrong");
  }
};

xhr.send();

let hScore = localStorage.getItem("highScore");
if (!+hScore) {
  localStorage.setItem("highScore", JSON.stringify(0));
  highScore.innerText = hScore ? hScore : 0;
} else {
  highScore.innerText = hScore ? hScore : 0;
}

time.innerText = maxTimeInSeconds;
inputBox.addEventListener('keydown', function(event) {
  const key = event.key;
  if (key === "Backspace") {
    inputBox.style.color='black';
      wrongWord=false;
  }
});

inputBox.addEventListener("input", onTextChange);
function onTextChange(e) {
  if (!timerStarted) {
    startTimer();
  }
  if(!wrongWord){

    for(let i=0;i<e.target.value?.length;i++){
      if(rando.innerText[i]!==e.target.value[i]){
        inputBox.style.color='red';
        errSound.play();
        wrongWord=true;
        break;
      }
    }
  }
 
  // e.target.value?.map((ltrs)=>{
  //   ltrs
  // })
  if (rando.innerText.trim() == e.target.value.trim()) {
    inputBox.value = "";
    rando.innerText = dictionary[getRandomArbitrary(0, dictionaryLength)];
    score.innerText = parseInt(score.innerText) + 10;
    wrongWord=false;
  }
}

function startTimer() {
  timerStarted = true;
  let intervalId = setInterval(() => {
    maxTimeInSeconds = maxTimeInSeconds - 1;
    time.innerText = maxTimeInSeconds;
    if (maxTimeInSeconds === 0) {
      clearInterval(intervalId);
      calculateHighScore();
      showScoreBoard();
      typer.className = "hidden";
      gameOverBox.classList.remove("hidden");
    }
  }, 1000);
}

function calculateHighScore(){
    let highScoreFromStore = +localStorage.getItem("highScore");
    if (+score.innerText>highScoreFromStore) {
      localStorage.setItem("highScore", score.innerText);
      highScore.innerText = score.innerText;
    }
}

function showScoreBoard(){
    scoreBoard.innerText = score.innerText;
    modalCall.click();
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

yes.addEventListener("click", () => {
  resetAll();
  gameOverBox.className = "hidden";
  typer.classList.remove("hidden");
});

function resetAll() {
  gameOver = false;
  maxTimeInSeconds = 60;
  time.innerText = maxTimeInSeconds;
  score.innerText = 0;
  inputBox.value = "";
  inputBox.focus();
  timerStarted = false;
}
