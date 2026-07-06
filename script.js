document.getElementById("uploadForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const studentName = document.getElementById("studentName").value;
    const rollNumber = document.getElementById("rollNumber").value;
    const subject = document.getElementById("subject").value;
    const examName = document.getElementById("examName").value;
    const answerSheet = document.getElementById("answerSheet").files[0];

    if (!answerSheet) {
        document.getElementById("message").innerHTML = "Please select a file.";
        return;
    }

    document.getElementById("message").innerHTML =
        `Ready to upload <strong>${answerSheet.name}</strong> for ${studentName}.`;
});