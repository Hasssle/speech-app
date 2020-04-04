const utterThis = new SpeechSynthesisUtterance();
const synth = window.speechSynthesis;
let wordList, voices;

// Create voice selector element on page
const createVoiceList = () => {
  // // Get list of available speaking voices
  voices = synth.getVoices();

  // Loop through voices and output them to the select element on the page
  voices.forEach((voice) => {
    const select = document.querySelector("select");
    const option = document.createElement("option");
    option.textContent = `${voice.name} ( ${voice.lang} )`;
    option.setAttribute("data-name", voice.name);

    if (voice.name === "Moira") {
      option.selected = true; // Set this voice as default
    }

    select.appendChild(option);
  });
};

// Check if voices are available, run function onchange event
if (synth.onvoiceschanged !== "undefined") {
  synth.onvoiceschanged = createVoiceList;
}

//  Upload local json file
const openFile = (e) => {
  file = e.target.files[0];
  fetch(file.name)
    .then((response) => response.json())
    .then((data) => (wordList = data));
};

// Speak function based on selected word list
const speak = (wordList) => {
  const selectedVoice = document
    .querySelector("select")
    .selectedOptions[0].getAttribute("data-name");
  const button = document.querySelector("button");

  // Check to see if file has been selected
  if (!wordList) {
    alert("Please select a json file");
    return;
  }

  // Set the voice type based on select option on page
  voices.forEach((voice, index) => {
    if (voice.name === selectedVoice) {
      utterThis.voice = voices[index];
    }
  });

  // Speak each word in the list
  utterThis.text = wordList;
  synth.speak(utterThis);

  // Change button context
  button.innerHTML = "Stop Speaking";
  utterThis.onend = () => {
    button.innerHTML = "Speak";
  };
};

const stopSpeaking = () => {
  synth.cancel();
  document.querySelector("button").innerHTML = "Speak";
};

// Open file dialoge picker on button click
document.querySelector("input").addEventListener("change", openFile);

// Change button context if speaking is active
document.querySelector("button").addEventListener("click", (e) => {
  e.target.innerHTML === "Speak" ? speak(wordList) : stopSpeaking();
});
