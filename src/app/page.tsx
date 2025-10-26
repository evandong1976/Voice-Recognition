"use client";

import { useEffect, useRef, useState } from "react";

function App() {
  const statusRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("Listening...");

  useEffect(() => {
    if (typeof window === "undefined") return; // ensure client-side

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();
      
      console.log("Heard:", transcript);
      setStatus(`Heard: "${transcript}"`);

      if (statusRef.current)
        statusRef.current.textContent = `Heard: "${transcript}"`;


      if (transcript.includes("open github"))
        window.open("https://github.com", "_blank");
      else if (transcript.includes("open google"))
        window.open("https://www.google.com", "_blank");
      else if (transcript.includes("open linkedin"))
        window.open("https://www.linkedin.com", "_blank");
    };

    recognition.onerror = (e: any) => {
      setStatus("Restarting listener...");
      if (statusRef.current)
        statusRef.current.textContent = "Restarting listener...";
      recognition.start(); // automatically restart
    };

    recognition.onend = () => {
      setStatus("Restarting listener...");
      if (statusRef.current)
        statusRef.current.textContent = "Restarting listener...";
      recognition.start(); // automatically restart
    };

    recognition.start();

    return () => recognition.stop();
  }, []);


  return (
    <div className="relative w-screen h-screen bg-linear-to-br from-purple-700 to-blue-500 flex flex-col items-center justify-center overflow-hidden">
      <h1 className="text-white text-5xl font-bold drop-shadow-lg mb-8">
        🎤 Voice Command
      </h1>
      <div
        className="px-6 py-3 rounded-2xl bg-white/20 text-white text-xl shadow-lg transition-transform duration-300"
        id="status"
      >
        {status}
      </div>
    </div>
  );
}

export default App;