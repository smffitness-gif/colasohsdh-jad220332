const BASE_URL = "https://attendancesystem-ln29.onrender.com/api";

const token = localStorage.getItem("token");

// LOGIN FUNCTION
async function login() {

    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPass").value;
    const message = document.getElementById("loginMsg");

    if (!username || !password) {
        message.innerText = "Please enter username and password";
        return;
    }

    try {

        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();


        if (response.ok) {

    localStorage.setItem("token", data.token);
    localStorage.setItem("year", data.year);
    localStorage.setItem("department", data.department);
    localStorage.setItem("currentUser", JSON.stringify(data));

    // ROLE BASED ROUTING
    if (data.role === "departmentAdmin") {

        window.location.href = "departmentAdmin.html";

    } else if (data.role === "teacher") {

        window.location.href = "teacher-dashboard.html";

    } else if (data.role === "admin") {

        window.location.href = "admin-dashboard.html";

    } else if (data.role === "masterAdmin") {

        window.location.href = "master-dashboard.html";

    }

}

   

    } catch (error) {

        message.innerText = "Server Error";
        console.error(error);

    }

}


// BUTTON CLICK EVENT
document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", login);
    }

});


// CHECK LOGIN USER
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser && window.location.pathname.includes("home.html")) {

    window.location.href = "index.html";

}


// SHOW USER INFO
let userInfo = document.getElementById("userInfo");

if (userInfo && currentUser) {

    userInfo.innerText =
        currentUser.department + " Department - " + currentUser.year + " Year";

}


// LOGOUT FUNCTION
function logout() {

    localStorage.clear();

    window.location.href = "index.html";

}