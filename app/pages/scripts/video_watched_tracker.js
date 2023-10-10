const video = document.getElementById("video");

video.addEventListener("ended", () => {
    const formDiv = document.getElementById("formDiv");
    formDiv.setAttribute("watched", "true");

    // Create a hidden form element to ship the watched status with the submitted data
    const form = document.getElementById("form")
    const hiddenField = document.createElement('input');

    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', 'videoWatched');
    hiddenField.setAttribute('value', true);

    form.appendChild(hiddenField);

    console.log(form, hiddenField);
});