# Note Ninja :notebook:

![Note Ninja screenshot](https://user-images.githubusercontent.com/6896632/85963487-4bec6400-b9f9-11ea-97ef-9329193b7747.png)
Note Ninja is a fully end to end encrypted notes app made with React and Node.js. I created this to learn React, so don't be surprised if you see any weirdness in the code.

The notes get encrypted automatically on the client side without the user having to worry about encryption keys and what not. There used to be a link to a blog post written by me explaining the process but I've since taken that site down. But the gist of it is, an encryption key gets generated on the client side during sign-up, this key itself gets encrypted using the account password. At this point, the plain text password is too valuable to be sent out even to the server because it can be used to decrypt and obtain the key. So the password gets hashed (without a salt so that it can be hashed again during login) before being sent to the server along with the "encrypted encryption key" :sweat_smile:. The server then treats it as a normal password and does the standard procedure of using bcrypt to hash it again (this time more securely) before being stored.

The server doesn't even know that there's any encryption going on with the notes :shushing_face:. It's all handled on the client side. I know there are shortcomings of this method, specially because it's a web app and we can never trust the browser. But this was made for me to learn React, and not to be used in production :innocent:.

## Demo
A live demo can be found at: [https://notes.thimal.me/](https://notes.thimal.me/).

## Setup

### Node.js API
#### Running The API Server
```
# change to the api directory
$ cd api

# install dependencies
$ npm install

# start the server
$ npm start
```

### React Client
#### Running The Development Server
```
# change to the note-ninja-client directory
$ cd note-ninja-client

# install dependencies
$ npm install

# build the app for production
$ npm run start
```

#### Building For Production
```
# change to the note-ninja-client directory
$ cd note-ninja-client

# install dependencies
$ npm install

# build the app for production
$ npm run build
```

You can then deploy the files generated in the `build` directory to a static file server.
