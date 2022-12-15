## Social App

## Contributors
- BAERT Romain
- MONDESIR Malik
- PERRADIN Nicolas

# Installation
1. The project contains 3 main folders which are: `client/`, `server/` and `socket/`.
2. In the root folder, you will need to rename the `.env.example` file to `.env` and fill it with your credentials if necessary.
3. In each of them, run the following command: `npm install && npm start`.

> Experimental: create fixtures with `node server/initDB.js` (usage will be displayed)

## Authentication
- Authentication is required to access the website content.
- Logging in on multiple devices with the same account is restricted.
- No email address verification is done, use any username you like.
- Tags preferences are done during the registration.
- A chat between 2 users is unlocked when they become friends by following each other.