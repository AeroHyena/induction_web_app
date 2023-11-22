# Induction App

This web app is created with the purpose of performing site orentation digitally.

It allows a user to complete their orientation/induction, and it keeps track of the indcution performed to track when it expires.

There is additional functionality which is locked behind authentication, and the main induction itself requires a passcode or login session in order to prevent competitors to access site data via the orientation video.

# Instructions

- Use ` npm run jsdoc` to generate documentation for the app.
- After cloning the repositiory, make sure to run `npm install`
- To run the web app on your device, you can use `npm run devStart`
- Voila! The app should be running. You can access the app on your browser at `localhost:8080`

The app includes a test account that you can use to access all the routes:

```
username: admin@email.com
password: Admin
```

# Routes

Here are all the main routes and their functionalities:

- / - The main page where orientation is performed. There is a video that the user must watch, along with a form the user needs to complete in order to submit the orientation. The form and video is locked behind a passcode in order to keep data secure from competitors.
- /group-inductions - This route is used to perform multiple orientations at once by a health and safety officer. The officer is responsible for ensureing that the individuals have watched the video in full, as well as caputing their information into the app.
- /search - This route allows you to search for existing induction data. You can check is a specific individual has already performed their induction, along with their information, as well as the date of the orientation,
- /report - This route is used to generate a report of any expired and/or soon expiring orientations. A pdf copy of the data can be downloaded, and the user can delete any expired induction data if they see it neccessary.
- /dashboard - This route contains multiple settings and options. Passcodes and be accessed and manipulated, Accounts can be adjusted, there is an option for automated report emailing, and there is a section for viewing the app's logs.
