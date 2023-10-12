let arrayDates = Array.from(document.getElementsByClassName("dateCompleted"));
let arrayStatuses = Array.from(document.getElementsByClassName("status"));
console.log("selected data ", arrayDates, "and ", arrayStatuses);
let convertedDates = [];

// Convert SQLite datetime to JavaScript Date object
arrayDates.forEach(element => {
    convertedDates.push({
        date: new Date(element.innerHTML),
        element: element
    });
});

console.log("Converted dates to JavScript date objects");
console.log("Analyzing date values...")

// Get current date and time
let currentDate = new Date();

// Get the date and time for one year ago
let oneYearAgo = new Date();
oneYearAgo.setFullYear(currentDate.getFullYear() - 1);


// Compare dates and add appropriate stylized text into the Status divs
convertedDates.forEach((item, index) => {
    console.log("Checking ", item);

    if (item.date > oneYearAgo) {
        arrayStatuses[index].innerHTML = "Valid";
        arrayStatuses[index].style.color = "green";
        console.log("This induction record is still valid");
    } else {
        arrayStatuses[index].innerHTML = "Expired";
        arrayStatuses[index].style.color = "red";
        console.log("This induction record has expired");
    };
});
