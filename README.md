## ABOUT

This is a little app to dump stock data into a rethinkDB database.

Data is getting pulled from here: http://stooq.com/db/h/

## TO SETUP

Setup and start Rethink for your local system.
`npm install`

## TO RUN

Dev with Nodemon: NODE_ENV=development nodemon index.js
Dev without Nodemon: NODE_ENV=development node index.js
Prod: NODE_ENV=production node index.js