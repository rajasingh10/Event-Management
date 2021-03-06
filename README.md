# Event-Management-NodeJS-ReactJS

Fully developed, scalable APIs for Event management system, developed using **Node.js**, **Express.js**
Front-end using **React.js** (front-end Currently in development)

## App is LIVE
- `https://eventmanagement2022.herokuapp.com/`

### Features:

- Application have only one super admin
- Admin can add multiple events with the attributes like (Event Name, Date, Details
  Thumbnail / Banner Image etc.). Events are open for all branch (Students from any branch can participate)
- Admin can add only 1 faculty from each branch who will have moderator access.
  Means they can view / edit / approve students who belongs to their branch.
- In order to participate in any of the events, students need to sign up first. During
  first time login a random 4 digit OTP will be sent to email id to verify if the email
  id is valid or not. (Only one time) – (using NodeMailer)
- Faculties can (approve / reject) new registered students. Once approved then
  only students will be able to see all the listed events.
- Students can participate in multiple events, only condition is (there is shouldn’t be any time overlap between any 2 or more events).
- Admin can be able to see all the events in a tabular list format with pagination and sorting features.
- Admin can be able to see in the form charts and graph how many students have participated in a specific event.
- Faculties are moderator and for reporting purpose they should be able to visualize
  allocation of their students across multiple events.
- Token Based authentication (using JWT).
- used cookies to store token 
- for each registration sending ticket in mail using NodeMailer
- This app is Mobile Responsive

**You can also**:

- Create, update, delete events.
- Student Login,Admin Login,Faculty Login.

### Technologies used:

- node.js - evented I/O for the backend
- Express - fast node.js network app framework
- reactJS - libraries for front-end development
- MongoDB - database
- JWT - Authentication


## Steps to run the project locally:

- Clone the repo.
- Switch to `development` branch for running in development mode.
- Make sure you have `npm` Node.js & MongoDB Atlas.
- Create a `.env` file in the server directory.
- It should include the database url, port, etc.
  ###### .env file example
  \*DB_URL=mongodb+srv://**_:_**@eventmanagement.ul235.mongodb.net/_\*\*?retryWrites=true&w=majority_<br/>
  _PRIVATE_KEY=secret_<br/>
  _PORT=3000_<br/>
  _ACCESS_TOKEN_SECRET_<br/>
  _CLIENT_ID_<br/>
  _CLIENT_SECRET_<br/>
  _REDIRECT_URI_<br/>
  _REFRESH_TOKEN_<br/>
  <br/>
- Enter the `server` folder using `cd server` and run `npm install` then run `npm run dev`.
- Then enter the `client` using `cd client` folder and run `npm install` then run `npm start`.
- server will start at `http://localhost:3000`
- Go to `http://localhost:3001` to see the application running.

