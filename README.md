## Social App

## Contributors
- BAERT Romain
- MONDESIR Malik
- PERRADIN Nicolas

# Installation
1. The project contains 3 main folders which are: `client/`, `server/` and `socket/`.
2. In the root folder, you will need to rename the `.env.example` file to `.env` and fill it with your credentials if necessary.
3. You just need to run `npm run build` and `npm start` to launch the Docker containers.

> Experimental: create fixtures with `npm run migrate` (usage will be displayed)

## Authentication
- Authentication is required to access the website content.
- Logging in on multiple devices with the same account is restricted.
- No email address verification is done, use any username you like.
- A chat between 2 users is unlocked when they become friends by following each other.