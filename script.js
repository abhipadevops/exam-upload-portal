const functionUrl =
  "https://exam-upload-api-gdeab2d0e5exf9az.centralindia-01.azurewebsites.net/api/UploadAnswerSheet";

document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const form = event.currentTarget;
    const message = document.getElementById("message");
    const submitButton = form.querySelector('button[type="submit"]');

    const studentName = document
      .getElementById("studentName")
      .value.trim();

    const rollNumber = document
      .getElementById("rollNumber")
      .value.trim();

    const subject = document
      .getElementById("subject")
      .value.trim();

    const examName = document
      .getElementById("examName")
      .value.trim();

    const fileInput = document.getElementById("answerSheet");
    const answerSheet = fileInput.files[0];

    message.style.color = "black";
    message.textContent = "";

    if (!studentName) {
      message.style.color = "red";
      message.textContent = "Please enter the student name.";
      return;
    }

    if (!rollNumber) {
      message.style.color = "red";
      message.textContent = "Please enter the roll number.";
      return;
    }

    if (!subject) {
      message.style.color = "red";
      message.textContent = "Please enter the subject.";
      return;
    }

    if (!examName) {
      message.style.color = "red";
      message.textContent = "Please enter the exam name.";
      return;
    }

    if (!answerSheet) {
      message.style.color = "red";
      message.textContent = "Please select an answer sheet.";
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png"
    ];

    if (!allowedTypes.includes(answerSheet.type)) {
      message.style.color = "red";
      message.textContent =
        "Only PDF, JPG, JPEG and PNG files are allowed.";
      return;
    }

    const maximumFileSize = 10 * 1024 * 1024;

    if (answerSheet.size > maximumFileSize) {
      message.style.color = "red";
      message.textContent =
        "The answer sheet must not exceed 10 MB.";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Uploading and processing...";

    message.style.color = "black";
    message.textContent =
      "Uploading answer sheet and processing the document...";

    try {
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type":
            answerSheet.type || "application/octet-stream",
          "x-file-name": answerSheet.name,
          "x-student-name": studentName,
          "x-roll-number": rollNumber,
          "x-subject": subject,
          "x-exam-name": examName
        },
        body: answerSheet
      });

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "The Function App returned an invalid response."
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Upload failed with status ${response.status}.`
        );
      }

      message.style.color = "green";
      message.innerHTML =
        "<b>✅ Upload Successful</b><br><br>" +
        "<b>File:</b> " +
        result.fileName +
        "<br><br>" +
        "The document was read successfully and its extracted data was saved internally for AI evaluation.";

      form.reset();
    } catch (error) {
      console.error(error);

      message.style.color = "red";
      message.textContent = `Upload failed: ${error.message}`;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Upload";
    }
  });