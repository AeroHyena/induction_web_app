const table = document.getElementById("inductionTable");
let counter = 2;
let names = [
    "name",
    "id_passport",
    "employeeNr",
    "contractor"
];

// Add an event listener to the table to listen for input events on input elements
table.addEventListener("input", function (event) {
    const target = event.target;
    if (isInputInNewestRow(target)) {
        addEmptyRow();
    }
});

function isInputInNewestRow(input) {
    const row = input.closest('.inductionTableRow');
    const newestRow = table.lastElementChild;
    return row === newestRow;
}

function addEmptyRow() {
    // Create a new row
    const newRow = document.createElement("div");
    newRow.className = "inductionTableRow";

    // Create input fields for the new row
    for (let i = 0; i < 4; i++) {
        const newInput = document.createElement("input");
        newInput.name = (names[i] + counter);
        const cell = document.createElement("div");
        cell.className = "inductionTableItem";
        cell.appendChild(newInput);
        newRow.appendChild(cell);
    }
    counter++;
    // Insert the new row at the end of the table
    table.appendChild(newRow);
}
