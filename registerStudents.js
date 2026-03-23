const BASE_URL = "https://attendancesystem-ln29.onrender.com/api";
const token = localStorage.getItem("token");

// Check if form exists
const form = document.getElementById("uploadForm");


//Manual Add Student Function

async function addStudent() {
    const studentName = document.getElementById("studentName").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const year = localStorage.getItem("year");
    const department = localStorage.getItem("department");

    if (!studentName || !studentId || !year || !department) {
        alert("Please fill all fields and select a year.");
        return;
    }

    if (!token) {
        alert("No token found! Please log in.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/students/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                studentName,
                studentId,
                year: Number(year),

            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Student Registered Successfully");
            document.getElementById("studentName").value = "";
            document.getElementById("studentId").value = "";
        } else {
            alert(data.message || "Registration Failed");
        }
    } catch (err) {
        console.error(err);
        alert("Server Error");
    }
}


//Excel Upload Handler

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const file = document.getElementById("file").files[0];
        if (!file) {
            document.getElementById("result").innerHTML =
                "<span style='color:red'>Please select an Excel file</span>";
            return;
        }

        const year = localStorage.getItem("year");
        const department = localStorage.getItem("department");

        if (!year || !department) {
            document.getElementById("result").innerHTML =
                "<span style='color:red'>Year or Department not set in your profile.</span>";
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("year", year);
        formData.append("department", department);

        try {
            const res = await fetch(`${BASE_URL}/upload`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok) {
                document.getElementById("result").innerHTML =
                    `<span style="color:green">Upload Successful</span><br>${JSON.stringify(data)}`;
            } else {
                document.getElementById("result").innerHTML =
                    `<span style="color:red">${data.message || "Upload failed"}</span>`;
            }
        } catch (err) {
            console.error(err);
            document.getElementById("result").innerHTML =
                "<span style='color:red'>Upload failed. Please try again.</span>";
        }
    });
}