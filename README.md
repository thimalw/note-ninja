# Note Ninja
Note Ninja is a fully end to end encrypted in browser notes app made with React and Node.js. The notes get encrypted automatically on the client side without the need of an encryption key to be entered by the user. This process is explained in detail on [this blog post](https://debug.cafe/a-fully-encrypted-notes-app/).

## Demo
A live demo can be found at: [https://notes.thimal.me/](https://notes.thimal.me/).

## Setup

### Running The API Server
```
# change to the api directory
$ cd api

# install dependencies
$ npm install

# start the server
$ npm start
```

### Building The React Client
```
# change to the note-ninja-client directory
$ cd note-ninja-client

# install dependencies
$ npm install

# build the app for production
$ npm run build
```

You can then deploy the files generated in the `build` directory to a static file server.
