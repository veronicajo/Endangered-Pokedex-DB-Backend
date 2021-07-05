# endangered-pokedex-db-backend

## About
Backend portion of a CRUD website that displays information on endangered species using JavaScript, Node.js, Express, and SQL to receive requests form and send data to the client side.

MySQL was utilized to store data and requires the user to be on the OSU VPN in order to create, read, update, or delete data stored in the database.

Completed website including the front end can be viewed here: http://ancient-basin-64099.herokuapp.com/


## To get started:

- `git clone` the repo 
- Make a .env file in the root of the project for your MySQL DB credentials to be stored in your local machine. The dotenv process should know how to fetch the credentials as needed. 
- `npm install` this should get all the node modules needed
- `npm start` will run nodemon so you don't have to restart the process every time a change is made
- Navigate to `localhost:60500` to see the server app running locally

Deploy to where you will be hosting.