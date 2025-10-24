const statusEl = document.getElementById("status");

// Use browser speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";

recognition.onstart = () => {
  statusEl.textContent = "Listening...";
  console.log("It has started")
};

recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript
    .trim()
    .toLowerCase();

  statusEl.textContent = `Heard: "${transcript}"`;
  console.log("Heard:", transcript);

  if (transcript.includes("open github")) {
    chrome.tabs.create({ url: "https://github.com" });
  } else if (transcript.includes("open google")) {
    chrome.tabs.create({ url: "https://www.google.com" });
  } else if (transcript.includes("open linkedin")) {
    chrome.tabs.create({ url: "https://www.linkedin.com" });
  }

  


};

recognition.start();
console.log("It has begun listening")