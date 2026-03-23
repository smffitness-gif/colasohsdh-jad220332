const BASE_URL = 'https://attendancesystem-ln29.onrender.com/api';
const token = localStorage.getItem("token");

let attendanceData = [];

// LOAD STUDENTS

async function loadStudents() {
    const tbody = document.getElementById("attendanceBody");
    if (!tbody) return;

    try {
        const res = await fetch(`${BASE_URL}/students/teacher`, {
            headers: { Authorization: "Bearer " + token }
        });

        if (!res.ok) throw new Error("Failed to fetch students");

        const students = await res.json();
        tbody.innerHTML = "";
        attendanceData = [];

        students.forEach(student => {
            // Initialize each student as PRESENT by default
            attendanceData.push({
                student: student._id,
                status: "present"   // default present
            });

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.studentId}</td>
                <td>${student.studentName}</td>
                <td>
                    <label>
                        <input type="radio"
                               name="status_${student._id}"
                               value="present"
                               onclick="setStatus('${student._id}','present')"
                               checked> <!-- checked by default -->
                        Present
                    </label>
                    <label>
                        <input type="radio"
                               name="status_${student._id}"
                               value="absent"
                               onclick="setStatus('${student._id}','absent')">
                        Absent
                    </label>
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (err) {
        console.error(err);
        alert("Failed to load students: " + err.message);
    }
}

// SET STATUS
function setStatus(studentId, status) {
    const existing = attendanceData.find(r => r.student === studentId);
    if (existing) existing.status = status;
}

// SAVE ATTENDANCE
async function saveAttendance() {
    const date = document.getElementById("attendanceDate").value;

    if (!date) {
        alert("Please select a date");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/attendance/mark`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                date: date,
                records: attendanceData
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Attendance saved successfully ");
        } else {
            alert(data.message || "Error saving attendance ");
        }

    } catch (err) {
        console.error(err);
        alert("Server error: " + err.message);
    }
}

// Automatically load students when page loads
document.addEventListener("DOMContentLoaded", loadStudents);