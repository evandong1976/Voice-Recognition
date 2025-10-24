chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.command === "open" && message.url) {
    chrome.tabs.create({ url: message.url });
  }

  if (message.command === "click" && message.target && sender.tab?.id) {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: (target) => {
        // Try clicking elements that match the spoken word
        const buttons = Array.from(
          document.querySelectorAll(
            "button, a, input[type=button], input[type=submit]"
          )
        );
        const lowerTarget = target.toLowerCase();

        let found = false;
        for (const btn of buttons) {
          const text = (btn.innerText || btn.value || "").trim().toLowerCase();
          if (text.includes(lowerTarget)) {
            btn.click();
            found = true;
            console.log("Clicked:", text);
            break;
          }
        }

        if (!found) console.log("No matching button found for:", target);
      },
      args: [message.target],
    });
  }
});
