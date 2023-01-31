# Social App
> A social network for motorcycle enthusiasts

## Authors
- BAERT Romain
- MONDESIR Malik

## Preview (DEPRECATED as Vercel doesn't support Docker)
This project is hosted on vercel: [https://social-app-pink.vercel.app/](https://social-app-pink.vercel.app/)

> **Note**: you can run the project locally by following the steps below.

# Installation
1. The project contains 3 sub folders which are: `./client/`, `./server/` and `./socket/`.
2. In the root folder, you will need to rename the `./.env.example` file to `./.env` and fill it.
3. You just need to run `npm run build` and `npm start` to launch the Docker containers.

> **Note**: if the installation with Docker ever fails, there's still a way to run the project locally with few extra steps (refer to steps 4 to 6).

4. In all 3 sub folders, run `npm install` to install the dependencies.
5. In `./client/package.json`, change the proxy to `http://localhost:5000`.
6. Modify the `./.env` files so it uses the local database string: `DB_CONN=mongodb://root:password@127.0.0.1:27017/SocialApp?authSource=admin`
7. Copy the aforementioned `./.env` file, copy-paste in each of the 3 sub folders and run `npm start` in each folder.

## Fixtures
- Use fixtures with `npm run migrate [seed|drop|refresh]` (usage will be displayed in the terminal).
- If docker installation fails, you can use `node migrate.js mongodb[+srv]://<user>:<pass>@<host>[/<db>]` with the MongoDB connection string.
- You can also refer to the `package.json` file in the root folder or `./server/migrate.js` for more information.

## Authentication
- Authentication is required to access the website content.
- Logging in on multiple devices with the same account is restricted.
- No email address verification is done, use any username you like. If you forget it, you can still contact us to recover it.

## Rooms
- A room is a place where several users can chat with each other many at a time.
- There's a set limit of members per room.
- Besides the rooms for each motorcycle brand, we've created general rooms that have less restrictions.
- A room is also the only place where you can send a message request (aka following someone).
- The user being followed can accept or decline the request on their chat page.
- But you can still cancel it in your own chat page.

## Chat
- A chat between 2 users is unlocked when they become friends by following each other.
- In the use-case above, it means that both users have at least a room in common.
- **Note**: for a better experience, we store those messages in our database.

## Chatbot
- The chatbot is available at the top of the chat page.
- We **don't** store those messages and they will disappear once the session ends (logging out for example).

## Extra
- Browse the website on your mobile device and see how responsive it is.
- To see how realtime was implemented, try using 2 accounts on different browsers (or one in a private window) and make them interact with each other.