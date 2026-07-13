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

let result;
try {
    result = await response.json();
} catch (err) {
    const text = await response.text();
    document.getElementById("message").innerHTML =
        "❌ Upload failed. Server returned: " + text;
    return;
}

if (result.success) {
    document.getElementById("message").innerHTML =
        "✅ Upload Successful<br>OCR Preview:<br>" +
        (result.ocrPreview ? result.ocrPreview.join("<br>") : "No preview available");

    document.getElementById("uploadForm").reset();
} else {
    document.getElementById("message").innerHTML = "❌ Error: " + result.message;
}
