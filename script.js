document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const statusMessage = document.getElementById("statusMessage");

  const functionUrl =
    "https://exam-upload-api-gdeab2d0e5exf9az.centralindia-01.azurewebsites.net/api/UploadAnswerSheet";

  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const studentName =
      document.getElementById("studentName").value.trim();

    const rollNumber =
      document.getElementById("rollNumber").value.trim();

    const subject =
      document.getElementById("subject").value.trim();

    const examName =
      document.getElementById("examName").value.trim();

    const fileInput =
      document.getElementById("answerSheet");

    const file = fileInput.files[0];

    statusMessage.textContent = "";

    if (!studentName) {
      statusMessage.textContent =
        "Please enter the student name.";
      return;
    }

    if (!rollNumber) {
      statusMessage.textContent =
        "Please enter the roll number.";
      return;
    }

    if (!subject) {
      statusMessage.textContent =
        "Please enter the subject.";
      return;
    }

    if (!examName) {
      statusMessage.textContent =
        "Please enter the exam name.";
      return;
    }

    if (!file) {
      statusMessage.textContent =
        "Please select an answer sheet file.";
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {
      statusMessage.textContent =
        "Only PDF, JPG and PNG files are allowed.";
      return;
    }

    const maximumFileSize =
      10 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      statusMessage.textContent =
        "File size must not exceed 10 MB.";
      return;
    }

    const submitButton =
      uploadForm.querySelector(
        'button[type="submit"]'
      );

    submitButton.disabled = true;
    submitButton.textContent =
      "Uploading and processing...";

    statusMessage.textContent =
      "Uploading answer sheet and running OCR...";

    try {
      const response = await fetch(
        functionUrl,
        {
          method: "POST",
          headers: {
            "Content-Type":
              file.type ||
              "application/octet-stream",
            "x-file-name": file.name,
            "x-student-name":
              studentName,
            "x-roll-number":
              rollNumber,
            "x-subject":
              subject,
            "x-exam-name":
              examName
          },
          body: file
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
          "Upload failed."
        );
      }

      statusMessage.innerHTML = "";

      const successHeading =
        document.createElement("h3");

      successHeading.textContent =
        "✅ Upload Successful";

      const fileParagraph =
        document.createElement("p");

      fileParagraph.textContent =
        `File: ${result.fileName}`;

      const processingParagraph =
        document.createElement("p");

      processingParagraph.textContent =
        "OCR completed and the extracted data was saved internally for AI evaluation.";

      statusMessage.appendChild(
        successHeading
      );

      statusMessage.appendChild(
        fileParagraph
      );

      statusMessage.appendChild(
        processingParagraph
      );

      uploadForm.reset();
    } catch (error) {
      console.error(error);

      statusMessage.textContent =
        `Upload failed: ${error.message}`;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent =
        "Upload Answer Sheet";
    }
  });
});