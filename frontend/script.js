const form = document.getElementById("predictionForm");
const result = document.getElementById("result");
const prediction = document.getElementById("prediction");
const message = document.getElementById("message");
const errorBox = document.getElementById("error");
const submitButton = document.getElementById("submitButton");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  result.classList.add("hidden");
  errorBox.classList.add("hidden");
  submitButton.disabled = true;
  submitButton.querySelector("span:first-child").textContent = "Calculating your estimate…";

  const payload = {
    study_hours: Number(document.getElementById("study_hours").value),
    attendance: Number(document.getElementById("attendance").value),
    previous_score: Number(document.getElementById("previous_score").value),
  };

  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Prediction failed. Please try again.");

    prediction.textContent = `${data.predicted_score}/100`;
    message.textContent = `Based on ${data.features_used.study_hours} study hours/day, ${data.features_used.attendance}% attendance, and a previous score of ${data.features_used.previous_score}.`;
    result.classList.remove("hidden");
  } catch (error) {
    errorBox.textContent = error.message || "Something went wrong. Please try again.";
    errorBox.classList.remove("hidden");
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span:first-child").textContent = "See my prediction";
  }
});
