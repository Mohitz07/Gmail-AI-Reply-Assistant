function getCurrentEmailText() {
  const originalEmail = document.querySelector("div.a3s.aiL");
  return originalEmail ? originalEmail.innerText.trim() : "";
}

function insertReplyToEditor(replyText) {
  const editor = document.querySelector("div[aria-label='Message Body']");
  if (editor) {
    editor.innerText = replyText;
    editor.focus();
  } else {
    alert("Could not find Gmail reply editor.");
  }
}

function insertAIReplyButton() {
  const toolbar = document.querySelector("div[aria-label='More send options']") ||
                  document.querySelector("div[aria-label='More options']");

  if (!toolbar || document.getElementById("ai-reply-wrapper")) return;

  // Create wrapper for right-side placement
  const wrapper = document.createElement("div");
  wrapper.id = "ai-reply-wrapper";

  // Create tone selector
  const toneSelector = document.createElement("select");
  toneSelector.id = "tone-selector";
  ["formal", "friendly", "funny"].forEach(tone => {
    const option = document.createElement("option");
    option.value = tone;
    option.text = tone.charAt(0).toUpperCase() + tone.slice(1);
    toneSelector.appendChild(option);
  });

  // Create AI-Reply button
  const button = document.createElement("button");
  button.id = "ai-reply-button";
  button.innerText = "AI-Reply";

  button.onclick = async () => {
    const emailContent = getCurrentEmailText();
    if (!emailContent) {
      alert("Could not extract email content");
      return;
    }

    const selectedTone = toneSelector.value;

    try {
      const response = await fetch("http://127.0.0.1:8080/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent, tone: selectedTone })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const replyText = await response.text();
      console.log("AI reply:", replyText);
      insertReplyToEditor(replyText);
    } catch (err) {
      console.error("Fetch failed:", err);
      alert("AI Reply failed: " + err.message);
    }
  };

  // Assemble and inject
  wrapper.appendChild(toneSelector);
  wrapper.appendChild(button);

  // Make parent flex and append
  toolbar.parentElement.style.display = "flex";
  toolbar.parentElement.appendChild(wrapper);
}

// Re-run on DOM changes
const observer = new MutationObserver(() => {
  insertAIReplyButton();
});
observer.observe(document.body, { childList: true, subtree: true });
