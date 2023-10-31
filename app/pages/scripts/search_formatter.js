/**
 * This code looks at the time passed since each induction search result
 * has been completed, and updates the search result to reflect the validity
 * of the specific record.
 */

/** Select the dates on the records, as well as the records */
let arrayDates = Array.from(document.getElementsByClassName("dateCompleted"));
let arrayStatuses = Array.from(document.getElementsByClassName("status"));
console.log("selected data ", arrayDates, "and ", arrayStatuses);


/** Convert SQLite datetime to JavaScript Date object */
let convertedDates = [];

arrayDates.forEach(element => {
    convertedDates.push({
        date: new Date(element.innerHTML),
        element: element
    });
});

console.log("Converted dates to JavScript date objects");
console.log("Analyzing date values...")


/**  Get the current date and time */
let currentDate = new Date();


/** Get the date and time for one year ago */
let oneYearAgo = new Date();
oneYearAgo.setFullYear(currentDate.getFullYear() - 1);


/** Compare dates, and add appropriate stylized text into the Status divs */
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
