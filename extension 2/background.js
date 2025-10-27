chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.command === "open" && message.url) {
    chrome.tabs.create({ url: message.url });
  }

  if (message.command === "click" && message.target && sender.tab?.id) {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: (target) => {
        // Select all buttons, links, and input buttons
        const elements = Array.from(
          document.querySelectorAll(
            "button, a, input[type=button], input[type=submit]"
          )
        );

        const lowerTarget = target.toLowerCase();
        let found = false;

        for (const el of elements) {
          const text = (el.innerText || el.value || "").trim().toLowerCase();
          if (text.includes(lowerTarget)) {
            el.click();
            found = true;
            console.log("Clicked:", text, el.tagName);
            break;
          }
        }

        if (!found)
          console.log("No matching clickable element found for:", target);
      },
      args: [message.target],
    });
  }


});
