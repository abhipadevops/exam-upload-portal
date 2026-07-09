const functionUrl =
"https://exam-upload-api-gdeab2d0e5exf9az.centralindia-01.azurewebsites.net/api/UploadAnswerSheet";

document.getElementById("uploadForm").addEventListener("submit", async function(event){

    event.preventDefault();

    const studentName =
    document.getElementById("studentName").value;

    const rollNumber =
    document.getElementById("rollNumber").value;

    const subject =
    document.getElementById("subject").value;

    const examName =
    document.getElementById("examName").value;

    const answerSheet =
    document.getElementById("answerSheet").files[0];

    document.getElementById("message").innerHTML =
    "Uploading...";

    try{

        const response=
        await fetch(functionUrl,{

            method:"POST",

            headers:{

                "Content-Type":answerSheet.type,

                "x-file-name":answerSheet.name,

                "x-student-name":studentName,

                "x-roll-number":rollNumber,

                "x-subject":subject,

                "x-exam-name":examName

            },

            body:answerSheet

        });

        const result=
        await response.json();

        if(result.success){

            document.getElementById("message").innerHTML =
            "✅ Upload Successful";

            document.getElementById("uploadForm").reset();

        }
        else{

            document.getElementById("message").innerHTML =
            result.message;

        }

    }
    catch(ex){

        document.getElementById("message").innerHTML =
        ex.message;

    }

});