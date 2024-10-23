![logo](https://github.com/user-attachments/assets/79fb0f6f-c736-4b61-a543-8cd711502878)

A new way of chatting with people. With MyChat, you can join a chat using a username, see who's online, send and receive messages and pictures, and even send likes by double-tapping on each message. Experience a fresh, engaging way of communication.

## Features

- Real-time chat with other users
- See online status of users
- Send and receive images
- Like messages with a double tap
- Private messaging

## Getting Started

To run this project locally, you need to run the API, WebSocket server, and the mobile app.

### Prerequisites

Ensure you have the latest version of NodeJS installed on your machine.

### Installing Dependencies
```bash
npm i
```

### Running the WebSocket Server

```bash
node server/index.js
```

### Running the API

```bash
node server/api.js
```

### Running the Mobile App

```bash
cd app && npm run start
```

## Architecture

![image](https://github.com/user-attachments/assets/c880ea0f-2e34-4565-a651-ebad5b4025a1)


### Database

For this project, we are using LowDB—a JSON-based database for mockup projects. It is responsible for retrieving and saving sessions and messages. In a real-world scenario, you could replace LowDB with a relational database like PostgreSQL by re-implementing the module.

### WebSocket

The WebSocket handles real-time messaging and user connections. It supports the following events:

- `user connected`: Notifies all users when a new user joins the chat.
- `session`: Returns the session information to the connected user.
- `users`: Notifies the connected user of the other signed-in users.
- `private message`: Sends a private message to both the sender and receiver.
- `like message`: Likes or unlikes a message.
- `private chat`: Handles private chat connections and returns the message history between two users.
- `user disconnected`: Notifies all users when a user disconnects.

### API

The API handles file uploads. The mobile app sends the file to the API, which uploads it to a cloud storage service like Cloudinary and returns the image URL. The mobile app can then send messages with the correct image URL.

- **Endpoint:** `/upload` – Receives base64-encoded files and uploads them to Cloudinary.

### Mobile App

The mobile app uses two main contexts:

- **Socket Context:** Manages the socket connection and session retrieval.
- **Chat Context:** Handles chat operations such as sending messages, sending likes, etc.

The app was created using Expo SDK 51 and utilizes Expo Router for navigation. It supports both light and dark modes.


## Future Improvements
Given the 5-day development timeline, I focused on the essential features. However, in a real-world scenario, I would implement the following improvements:

- **Push Notifications:** The app currently lacks a push notification system, which is essential for a messaging app. In a real-world scenario, I would integrate Firebase Cloud Messaging (FCM) for Android and Apple Push Notification Service (APNS) for iOS, using AWS Simple Notification Service (SNS) as the intermediary to manage notifications across platforms.
- **Clustered WebSocket Server:** Scale the WebSocket server into a [cluster](https://socket.io/get-started/private-messaging-part-4/) where multiple workers would handle requests for improved performance.
- **Real Database**: Replace LowDB with a relational database like PostgreSQL or a NoSQL alternative to handle data more efficiently.
- **Authentication:** Implement a sign-in and sign-out system with token-based authentication. The token would be used both in the WebSocket middleware and API requests.
- **User Avatar Customization:** Allow users to change or customize their avatars for an improved user experience.
- **Paginated Message Retrieval:** Modify the project to retrieve messages using paginated API requests. The WebSocket would only handle new messages or updates, while the mobile app would fetch data using Tanstack Query for more efficient message and user retrieval.

