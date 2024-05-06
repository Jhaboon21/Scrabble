# Scrabble Game
This is an application made with JavaScript, React, Node, HTML, CSS, Express, WebSockets, Restful API. The API I used is: https://developer.wordnik.com/ which was used to get the value of the created words from the user and add points to their score.
The game can be played by first logging in or creating an account, then creating a game room and sharing the unique code with another user. The code will allow them to join the room and the two users can play a game of scrabble.
The back-end will handle the user related operations and as well as the game data, such as the room's id, player 1, player 2, and their respective scores. The front-end handles the user experience and how they can interact with the game and can communicate with the other player by sending messages/data using WebSockets

## Available Scripts

In the project directory for the backend, run:

### `psql < scrabble.sql`
This will create the database on your local machine, 
then run:

### `npm install`
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\

In the project directory for the frontend, run:

### `npm install`
### `npm start`
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Additional Things I plan on adding later:
- placing tiles should adhere by some rules like being placed/connected to middle tile.
- users can only place a single word/line at a time
- special spots on the board for double/triple letter/word
- visualize how many points a letter is
- a way to save a game for later (the room exists in the database but unless they remember the code, they can't get back in.)
