

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


// Handle contractor name input
let element2 = document.getElementById("contractorName");

function showContractor() {
    document.getElementById("contractorNameContainer").style.display = "block";
    element2.required = true;
}
  
function hideContractor() {
    document.getElementById("contractorNameContainer").style.display = "none";
    element2.required = false;
}