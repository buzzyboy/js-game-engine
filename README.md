To start the project

```
npm start
```


To create a game, a ServerGameApplication and ClientGameApplication are created respectively
in Node and on the browser. When a GameObject is marked as replicated = true on the server,
every tick (15 times a second), all updated properties are broadcasted to all clients.
