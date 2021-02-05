# ItchDB
ItchDB is a Scratch Cloud Interface for making HTTP requests, managing a Cloud Database, and doing various things with the Scratch API. It allows for easy setup, but rich customizability. With just 4 lines of code, you can set up ItchDB in the Repl.it environment as an always-online cloud solution.

## Documentation
#### `Itch.Database(config)`
Creates a new Itch Database using the specified configuration object. Example:
```js
var Database = new Itch.Database({
	username: "YodaLightsabr",  // The Scratch username to use when accessing the API
	password: "123456",         // The Scratch password to use when accessing the API
	project: "12345678",        // The Scratch project to connect to
	webserver: "true",          // Weather or not to enable the default webserver
	port: 8080                  // Only required if webserver is true; the port to open the webserver on
});
```
#### `Database.start()`
Initializes the database and cloud server. Example:
```js
Database.start();
```
#### `Database.query`
Provides a set of functions for direct access to the database. (Uses the Quick.db database.) Example:
```js
var Query = Database.query;
```
#### `Query.get(key)`
Get a key from Quick.db. Example:
```js
console.log(Query.get("users"));
```
#### `Query.set(key, value)`
Set a key in Quick.db. Example:
```js
Query.set("users", {});
```
#### `Query.push(key, value)`
Push to an array in Quick.db. Example:
```js
Query.push("users.active", "YodaLightsabr");
```
#### `Query.delete(key)`
Delete a key from Quick.db. Example:
```js
Query.delete("users");
```

## Quick Setup
To quickly get set up, make sure you are using the latest stable ItchDB sprite in your Scratch project and that all cloud variables are properly linked. Then, make sure your `index.js`, or main file, contains:
```js
const ItchDB = require('./itch.db.js');
const config = {
  username: "YodaLightsabr",
  password: process.env.PASSWORD,
  project: "483796537",
  webserver: true,
  port: 8080
};
var database = new ItchDB.Database(config);
database.start();
```
Make sure to update it to match your project.

## Development
ItchDB is full of bugs and issues, and we need people like you to help find them! Please open an issue if you come across any bugs, flaws, deprecations, or just things to improve in general. I'm also open for pull requests!
