

// Handle employee number input
let element = document.getElementById("employeeNumber");

function showEmployeeNumber() {
    document.getElementById("employeeNumberContainer").style.display = "block";
    element.required = true;
}
  
function hideEmployeeNumber() {
    document.getElementById("employeeNumberContainer").style.display = "none";
    element.required = false;
}