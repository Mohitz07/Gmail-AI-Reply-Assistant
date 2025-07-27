function generateEmail() {
  const emailContent = document.getElementById("emailContent").value;
  const tone = document.getElementById("tone").value;

  fetch("/api/email/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      emailContent: emailContent,
      tone: tone
    })
  })
  .then(response => response.text())
  .then(data => {
    document.getElementById("responseBox").innerText = data;
  })
  .catch(error => {
    document.getElementById("responseBox").innerText = "Error: " + error.message;
  });
}
