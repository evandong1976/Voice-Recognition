// Use browser speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Set up continuous listening
recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = "en-US";

const statusEl = document.getElementById("status");

recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript
    .trim()
    .toLowerCase();
  console.log("Heard:", transcript);
  statusEl.textContent = `Heard: "${transcript}"`;

  if (transcript.includes("open github")) {
    window.open("https://github.com", "_blank");
  } else if (transcript.includes("open google")) {
    window.open("https://www.google.com", "_blank");
  } else if (transcript.includes("open linkedin")) {
    window.open("https://www.linkedin.com", "_blank");
  }
};

recognition.onerror = (e) => {
  console.error("Speech recognition error:", e);
  statusEl.textContent = "Error: " + e.error;
};

recognition.onend = () => {
  statusEl.textContent = "Restarting listener...";
  recognition.start(); // restart automatically
};

// Start listening
recognition.start();
