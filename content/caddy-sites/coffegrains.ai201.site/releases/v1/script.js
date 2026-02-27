const joinBtn = document.getElementById("joinBtn");
const formMsg = document.getElementById("formMsg");
const emailInput = document.getElementById("email");

if (joinBtn && formMsg && emailInput) {
  joinBtn.addEventListener("click", () => {
    if (!emailInput.value || !emailInput.checkValidity()) {
      formMsg.textContent = "Enter a valid email address first.";
      return;
    }

    formMsg.textContent = "Thanks, you're on the roast drop list.";
    emailInput.value = "";
  });
}
