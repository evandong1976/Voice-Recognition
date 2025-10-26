(() => {
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    console.log("❌ Speech recognition not supported");
    return;
  }

  if (window.hasRunSpeechRecognition) return;
  window.hasRunSpeechRecognition = true;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  recognition.phrases = []

  let isListening = false;
  let lastCommand = "";

  function safeStart() {
    if (isListening) return;
    try {
      recognition.start();
      isListening = true;
      console.log("🎙️ Listening...");
    } catch (err) {
      console.warn("⚠️ Could not start:", err.message);
    }
  }

  recognition.onstart = () => {
    isListening = true;
    console.log("🎤 Started listening");
  };

  recognition.onresult = (event) => {
    // Grab the latest transcript
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript.trim().toLowerCase();

    console.log(result.isFinal ? "✅ Final:" : "💬 Interim:", transcript);

    // React only when confident (final) or when interim matches a known command
    if (!result.isFinal && !/open|click/.test(transcript)) return;

    if (transcript === lastCommand) return;
    lastCommand = transcript;

    // --- Commands ---
    if (transcript.includes("open github")) {
      chrome.runtime.sendMessage({
        command: "open",
        url: "https://github.com",
      });
    } else if (transcript.includes("open google")) {
      chrome.runtime.sendMessage({
        command: "open",
        url: "https://www.google.com",
      });
    } else if (transcript.includes("open youtube")) {
      chrome.runtime.sendMessage({
        command: "open",
        url: "https://www.youtube.com",
      });
    } else if (transcript.includes("open gmail")) {
      chrome.runtime.sendMessage({
        command: "open",
        url: "https://www.gmail.com",
      });
    } else if (transcript.includes("open linkedin")) {
      chrome.runtime.sendMessage({
        command: "open",
        url: "https://www.linkedin.com",
      });
    } else if (transcript.startsWith("click ")) {
      console.log("please click");
      const target = transcript.replace("click ", "").trim();

      chrome.runtime.sendMessage({ command: "click", target });
    }
  };

  recognition.onend = () => {
    isListening = false;
    console.log("🔁 Restarting listener...");
    setTimeout(() => safeStart(), 1000);
  };

  safeStart();
})();
