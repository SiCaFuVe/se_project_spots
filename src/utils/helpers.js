export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (!btn) {
    console.log("setButtonText: Button is null");
  }
  btn.textContent = isLoading ? loadingText : defaultText;
}

// check whats in the console
