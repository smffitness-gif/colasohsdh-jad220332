const BASE_URL = "https://attendancesystem-ln29.onrender.com/api";
const token = localStorage.getItem("token");



// Get year from localStorage
const year = localStorage.getItem("year");
if (!year) {
    alert("Please select a year first from the dashboard!");
    window.location.href = "dashboard.html"; // redirect if no year
}

// Function to generate report
async function generateReport() {
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    if (!fromDate || !toDate) {
        alert("Please select both start and end dates.");
        return;
    }

    console.log("Sending to backend:", { from: fromDate, to: toDate, year: Number(year) });

    try {
        const res = await fetch(`${BASE_URL}/report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                from: fromDate,
                to: toDate,
                year: Number(year) // send year as number
            }),
        });

        const data = await res.json();

        console.log("Report data received:", data);

        const tbody = document.getElementById("reportBody");
        tbody.innerHTML = "";

        if (!data.length) {
            alert("No attendance data found for this year and date range.");
            return;
        }

        data.forEach(s => {
            const absent = s.totalDays - s.presentDays;

            const row = `
                <tr>
                    <td>${s.studentId}</td>
                    <td>${s.studentName}</td>
                    <td>${s.totalDays}</td>
                    <td>${absent}</td>
                    <td>${s.presentDays}</td>
                    <td>${s.percentage}%</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (err) {
        console.error(err);
        alert("Error generating report");
    }
}

function downloadPDF() {
    const tbody = document.getElementById("reportBody");
    if (!tbody || tbody.rows.length === 0) {
        alert("No data to download. Please generate report first.");
        return;
    }

    const dept = localStorage.getItem("department") || "Unknown Department";
    const year = localStorage.getItem("year") || "N/A";
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    const tableColumn = ["ID", "Name", "Total Days", "Absent", "Present", "%"];
    const tableRows = [];

    for (let i = 0; i < tbody.rows.length; i++) {
        const cells = tbody.rows[i].cells;
        const rowData = [
            cells[0].innerText,
            cells[1].innerText,
            cells[2].innerText,
            cells[3].innerText,
            cells[4].innerText,
            cells[5].innerText
        ];
        tableRows.push(rowData);
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 15; // initial y position

    // College Header
    doc.setFontSize(16);
    doc.text("THANTHAI HANS ROEVER COLLEGE (AUTONOMOUS)", 14, y);
    y += 8;
    doc.setFontSize(14);
    doc.text("Affiliated to Bharathidasan University", 14, y);
    y += 7;
    doc.text("Accredited with 'A' Grade by NAAC (3rd cycle) with CGPA 3.23 out of 4", 14, y);
    y += 7;
    doc.text("ELAMBALUR(P.O), PERAMBALUR-621 220", 14, y);
    y += 10; // add extra space before department/year info

    // Department, Year, Date range
    doc.setFontSize(12);
    doc.text("Attendance Report", 14, y);
    y +=6;
    doc.text(`Department: ${dept}`, 14, y);
    y += 6;
    doc.text(`Year: ${year}`, 14, y);
    y += 6;
    if (fromDate && toDate) {
        doc.text(`Date: ${fromDate} to ${toDate}`, 14, y);
        y += 8; // extra space before table
    } else {
        y += 8;
    }

    // Table
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: y,
        styles: { fontSize: 10 }
    });

    doc.save(`Attendance_Report_${dept}_Year_${year}.pdf`);
}