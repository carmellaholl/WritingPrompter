// main program js //////////////////////////////
const btn = document.querySelector(".start-button");
const start = document.querySelector(".start");
let currGenre = document.getElementById("genre-select");
const main = document.querySelector(".main");
const rounds = parseInt(document.getElementById("rounds-select").value);
let time; //= parseInt(document.getElementById("time-select").value); // whole minute value
let inputBox;
let currentPrompt;
let timeDisplay;
let column;

const horrorPrompts = [
  "A family inherits a manor haunted by its former residents.",
  "Two siblings take shelter in an old abandoned house during a sudden rainstorm.",
  "A library is haunted by the ghost of a former librarian",
  "A group of friends stay in a haunted cabin",
  "A group of teachers must band together to remove the curse placed on the school before it is too late.",
  "A young man can't get a voice out of his head.",
  "A group of hikers are being chased by a masked killer with unknown intentions",
  "The family dog always gets uneasy walking past the neighbors house, now we know why.",
];
const romancePrompts = [
  "A cafe meet-cute",
  "Write about a first kiss",
  "Two characters fall in love at a museum",
  "Highschool sweethearts run into each other after an unresolved and unexplained break up.",
  "Two opposites find themselves",
];
const scifiPrompts = [
    "write something sci fi",
];

function toggleStartScreen() {
  if (start.style.visibility == "hidden") {
    start.style.visibility = "visible";
  } else {
    start.style.visibility = "hidden";
  }
}

function togglePromptScreen() {
  if (start.style.visibility == "hidden") {
    start.style.visibility = "visible";
  } else {
    start.style.visibility = "hidden";
  }
}


// counts down a given time
function countDown(time) {
        console.log(time);

return new Promise((resolve) => {
    let timeLeft = time * 60;
    updateTime(timeLeft); // show starting time immediately

    const downloadTimer = setInterval(function () {
      timeLeft -= 1;
      updateTime(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(downloadTimer);
        resolve();
      }
    }, 1000); 
  });
}

function updateTime(time) {
  timeDisplay.textContent = time.toString();
}

function nextRound() {
    getRandomPrompt();
    main.appendChild(column);
    // main.appendChild(timeDisplay);
    // main.appendChild(currentPrompt);    
    // main.appendChild(inputBox);

    // start timer
    countDown(time, () => {
    // when this round's timer finishes, start the next round
    currentRound++;
    if (currentRound <= rounds) {
      nextRound();
    }
  });    
}

btn.addEventListener("click", async () => {
  time = parseInt(document.getElementById("time-select").value); // whole minute value
  // variable must be set later, as it is 
  // immediately set to default (1) on start screen load

  // hide start screen
  toggleStartScreen();

  // generating and displaying prompt + time
  column = document.createElement("div");
  currentPrompt = document.createElement("p");
  timeDisplay = document.createElement("p");
  inputBox = document.createElement("textarea");

  currentPrompt.classList.add("prompt");
  timeDisplay.classList.add("timer");
  inputBox.classList.add("input");
  column.classList.add("game-column");

  inputBox.maxLength = 999;
  inputBox.placeholder = "Start typing here...";

  column.appendChild(currentPrompt);
  column.appendChild(inputBox);
  column.appendChild(timeDisplay);
 console.log(column);
  console.log(main);

  currentRound = 0;

  // runs functionality for each round
  for (let i = 0; i < rounds; i++) {
    nextRound();
    await countDown(time); // wait for this round's timer to finish
  }
  
    main.removeChild(column);

    toggleStartScreen();
});

function getRandomPrompt() {
  if (currGenre.value == "horror") {
    currentPrompt.textContent =
      horrorPrompts[Math.floor(Math.random() * horrorPrompts.length)];
  } else if (currGenre.value == "romance") {
    currentPrompt.textContent =
      romancePrompts[Math.floor(Math.random() * romancePrompts.length)];
  } else if (currGenre.value == "sci-fi") {
    currentPrompt.textContent =
      scifiPrompts[Math.floor(Math.random() * scifiPrompts.length)];
  }
}
