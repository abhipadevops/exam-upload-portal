// =====================================================
// Azure Function URL
// Replace this with your Function App URL
// =====================================================
const functionUrl = "https://exam-upload-api.azurewebsites.net/api/UploadAnswerSheet";

// =====================================================
// Upload Form
// =====================================================
document.getElementById("uploadForm").addEventListener("submit", async function (e) {

    e.preventDefault();

    const message = document.getElementById("message");
    message.style.color = "black";
    message.innerHTML = "Uploading...";

    // Read form values
    const studentName = document.getElementById("studentName").value.trim();
    const rollNumber = document.getElementById("rollNumber").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const examName = document.getElementById("examName").value.trim();

    const fileInput = document.getElementById("answerSheet");
    const answerSheet = fileInput.files[0];

    if (!answerSheet) {
        message.style.color = "red";
        message.innerHTML = "Please select an answer sheet.";
        return;
    }

    try {

        const response = await fetch(functionUrl, {
            method: "POST",
            headers: {
                "Content-Type": answerSheet.type,
                "x-file-name": answerSheet.name,
                "x-student-name": studentName,
                "x-roll-number": rollNumber,
                "x-subject": subject,
                "x-exam-name": examName
            },
            body: answerSheet
        });

        if (!response.ok) {

            const errorText = await response.text();

            message.style.color = "red";
            message.innerHTML =
                "Upload failed.<br><br>Status : " +
                response.status +
                "<br><br>" +
                errorText;

            return;
        }

        const result = await response.json();

        if (result.success) {

            message.style.color = "green";

            message.innerHTML =
                "<b>✅ Upload Successful</b><br><br>" +
                "<b>File :</b> " + result.fileName + "<br><br>" +
                "<b>OCR Preview</b><br><br>" +
                (result.ocrPreview && result.ocrPreview.length > 0
                    ? result.ocrPreview.join("<br>")
                    : "No OCR text returned.");

            document.getElementById("uploadForm").reset();

        } else {

            message.style.color = "red";
            message.innerHTML =
                "❌ " + (result.message || "Unknown error");

        }

    }
    catch (err) {

        console.error(err);

        message.style.color = "red";
        message.innerHTML =
            "<b>JavaScript Error</b><br><br>" +
            err.message;
    }

});