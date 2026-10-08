// main program js //////////////////////////////
const btn = document.querySelector(".start-button");
let currGenre = document.getElementById("genre-select");
const main = document.querySelector(".main");
let inputBox;
let rounds;
let time;
let timeDisplay;
let column;
let inputMap = new Map();

// to do: create contents of Responses page
//            should be able to go through inputMap and output all prompts and given responses
//            ui undecided
//        edge case tests
//        add more prompts to horrorPrompts
//        improve ui

// note: each round is 1 second each for testing, move back to regular by changing line 83 back to time * 60

const horrorPrompts = [
  "A family inherits a manor haunted by its former residents.",
  "Two siblings take shelter in an old abandoned house during a sudden rainstorm.",
  "A library is haunted by the ghost of a former librarian",
  "A group of friends stay in a haunted cabin",
  "A group of teachers must band together to remove the curse placed on the school before it is too late.",
  "A group of hikers are being chased by a masked killer with unknown intentions",
  "A bet turns into an unforgettable experience",
  "A mirror in an antique shop shows the reflections of ghosts.",
  "A person buys a seemingly innocuous object at a yard sale, only to discover it's haunted.",
  "Tourists encounter a ghostly tour guide who leads them to mysterious and strange places.",
];
const romancePrompts = [
  "A cafe meet-cute",
  "A character goes on an online date with someone that lied about their looks.",
  "Two characters fall in love at a museum",
  "Highschool sweethearts run into each other after a sudden and unresolved break up.",
  "A teacher falls for her student's single parent.",
  "A popular character falls for an unpopular character.",
  "There's a misunderstanding between a couple that is destined to be together.",
  "A character comes home for the holidays.",
  "One character is actually a mystical creature living a normal human life for a short time.",
  "A rich character hides their true wealth to find true love.",
  "Characters fall in love at a wedding.",
  "Two characters vowed years prior to marrying each other if they had not yet found love.",
  "Two people that know each other only from an online game meet for the first time.",
  "Two people have a secret relationship.",
];
const scifiPrompts = [
  "A scientist creates a race of genetically engineered beings with specific traits.",
  "An archaeological dig uncovers artifacts of an advanced alien race, leading to unintended consequences for humanity.",
  "An ordinary person inherits a mysterious alien artifact from a distant relative, leading them on an intergalactic quest.",
  "An alien race invades Earth, but their true intentions are not what they seem.",
  "A sentient artificial life form starts to question its existence and purpose.",
  "A group of scientists discovers evidence of powerful otherworldly beings living inside a black hole.",
  "Astronauts wake up one day on their journey through space to see a group of stars coming toward them on their own.",
  "An astronaut thinks they landed on a desolate planet before discovering ancient runes in a cliff wall.",
  "Four friends go to a local film festival and somehow become trapped inside one of the films",
  "Write about a society where people make clones of their loved ones before they die, ensuring no one has to experience permanent loss.",
  "Write about a zoo on a distant planet, populated with genetically engineered creatures from across the galaxy.",
  "Write about a network of interconnected space stations and habitats forming an archipelago, each station a microcosm of culture and technology with its own laws and customs.",
  "A search and rescue mission leads to the discovery of an alien colony hidden in the Alaskan wilderness.",
];

function toggleStartScreen() {
  if (start.style.visibility == "hidden") {
    start.style.visibility = "visible";
  } else {
    start.style.visibility = "hidden";
  }
}

// counts down a given time
function countDown(time) {
  console.log(time);
  inputBox = document.querySelector(".input");

  return new Promise((resolve) => {
    let timeLeft = time * 60;
    updateTime(timeLeft); // show starting time immediately

    const downloadTimer = setInterval(function () {
      timeLeft -= 1;
      updateTime(timeLeft);

      if (timeLeft <= 0) {
        inputMap.set(recentPrompt, inputBox.value);
        clearInterval(downloadTimer);
        resolve();
      }
    }, 1000);
  });
}

function updateTime(time) {
  timeDisplay.textContent = time.toString();
}

let recentPrompt;

function getRandomPrompt(genre, promptEl) {
  recentPrompt = "";

  let list;
  if (genre === "horror") list = horrorPrompts;
  else if (genre === "romance") list = romancePrompts;
  else list = scifiPrompts;

  // Pick from unused prompts; reset if all used
  let available = list
    .map((_, i) => i)
    .filter((i) => !usedPromptInd.includes(`${genre}-${i}`));

  if (available.length === 0) {
    usedPromptInd = usedPromptInd.filter((k) => !k.startsWith(`${genre}-`));
    available = list.map((_, i) => i);
  }

  const idx = available[Math.floor(Math.random() * available.length)];
  recentPrompt = list[idx];
  usedPromptInd.push(`${genre}-${idx}`);
  promptEl.textContent = list[idx];
}

function buildColumn() {
  const column = document.createElement("div");
  const prompt = document.createElement("p");
  const timer = document.createElement("p");
  const input = document.createElement("textarea");

  prompt.classList.add("prompt");
  timer.classList.add("timer");
  input.classList.add("input");
  column.classList.add("game-column");

  input.maxLength = 2000;
  input.placeholder = "Start typing here...";

  column.append(prompt, input, timer);
  return { column, prompt, timer };
}

let responsesDiv;
let responseText;
let responsesPromptSelectColumn;
let responsesViewTextColumn;

// create "recent responses" panel
responsesDiv = document.createElement("div");
responsesDiv.classList.add("response-div");
responsesDiv.id = "recent-responses";

// column consisting list of prompts
responsesPromptSelectColumn = document.createElement("div");
responsesPromptSelectColumn.classList.add("responses-prompt-select-column");

// column containing response for selected prompt
responsesViewTextColumn = document.createElement("div");
responsesViewTextColumn.classList.add("responses-text-view-column");

const promptBtns = document.getElementsByClassName(
  "recent-responses-prompt-btn",
);
responseText = document.createElement("p");
responseText.classList.add("response-text");

responsesViewTextColumn.appendChild(responseText);

function buildRecentResponses() {
  // remove the existing panel before rebuilding it.
  document.getElementById("recent-responses")?.remove();

  const heading = document.createElement("p");
  heading.textContent = "Recent responses";
  heading.classList.add("response-heading");

  responsesDiv.appendChild(heading);
  heading.classList.add("response-heading");

  // render the inputMap prompt contents
  for (const [prompt] of inputMap.entries()) {
    const promptButton = document.createElement("button");
    promptButton.classList.add("recent-responses-prompt-btn");
    promptButton.textContent = prompt;
    responsesPromptSelectColumn.appendChild(promptButton);
  }

  /*
   * If there are no saved prompts, display a default message.
   */
  if (inputMap.size === 0) {
    const noResponsesText = document.createElement("p");

    noResponsesText.textContent = "No recent responses";
    noResponsesText.classList.add("no-responses-text");

    responsesPromptSelectColumn.appendChild(noResponsesText);
  }

  // Add both columns to the panel.
  responsesDiv.appendChild(responsesPromptSelectColumn);
  responsesDiv.appendChild(responsesViewTextColumn);
  main.appendChild(responsesDiv);
}

responsesDiv.addEventListener("click", (e) => {
  e.stopPropagation();

  const promptButton = e.target.closest(".recent-responses-prompt-btn");

  // ignore clicks that were not on a prompt button.
  if (!promptButton) {
    return;
  }

  const prompt = promptButton.textContent;
  const response = inputMap.get(prompt);

  // clear the previously displayed response.
  responseText.textContent = "";

  // display a default message when no response was provided.
  if (!response || response.length === 0) {
    responseText.textContent = "No response provided";
    return;
  }

  // display the saved response.
  responseText.textContent = response;
});

const responsesBtn = document.getElementById("responses-btn");
responsesBtn.addEventListener("click", async (e) => {
  toggleStartScreen();
  e.stopPropagation();

  buildRecentResponses();
});

const start = document.querySelector(".start");
const startBtn = document.querySelector(".start-button");

startBtn.addEventListener("click", async () => {
  console.log("start clicked");
  inputMap.clear();

  time = parseInt(document.getElementById("time-select").value);
  rounds = parseInt(document.getElementById("rounds-select").value);
  toggleStartScreen();

  usedPromptInd = [];

  for (let i = 0; i < rounds; i++) {
    const { column, prompt, timer } = buildColumn();
    timeDisplay = timer;
    main.appendChild(column);
    getRandomPrompt(currGenre.value, prompt);

    await countDown(time);
    main.removeChild(column);
  }

  console.log(inputMap);

  toggleStartScreen();
});
