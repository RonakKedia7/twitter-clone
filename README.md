# Twitter Clone

A full-stack mobile Twitter/X clone built using React Native, Expo Router, Express.js, MongoDB, and Clerk Authentication.

This application allows users to create posts, upload images, interact through likes and comments, receive notifications, follow other users, and manage profiles in a modern mobile-first interface inspired by Twitter/X.

---

# Project Links

| Resource           | Link                                                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GitHub Repository  | [https://github.com/RonakKedia7/twitter-clone](https://github.com/RonakKedia7/twitter-clone)                                                                                                           |
| Backend Deployment | [https://twitter-clone-afrt.onrender.com](https://twitter-clone-afrt.onrender.com)                                                                                                                     |
| APK Build          | [https://expo.dev/accounts/ronakkedia/projects/twitter/builds/4874c140-dd8d-4871-a09a-52d3bc57143b](https://expo.dev/accounts/ronakkedia/projects/twitter/builds/4874c140-dd8d-4871-a09a-52d3bc57143b) |

---

# Features

## Authentication

* Full authentication using Clerk
* Google Sign In
* Persistent sessions
* Protected API routes
* Secure token-based authentication flow

## Posts

* Create posts
* Delete posts
* Upload post images
* Like and unlike posts
* User-based post feeds
* Single post retrieval

## Comments

* Add comments to posts
* Delete comments
* Post-specific comment threads

## Notifications

* Like notifications
* Comment notifications
* Follow notifications
* Delete notifications

## User Profiles

* Dynamic user profile pages
* Edit profile functionality
* Follow and unfollow users
* Current authenticated user profile

## Additional Features

* React Query based API state management
* Modular scalable architecture
* Pull to refresh
* Gesture support
* Native mobile navigation
* Optimized component structure
* Responsive mobile-first design

---

# Tech Stack

## Mobile Application

| Technology                   | Purpose                           |
| ---------------------------- | --------------------------------- |
| React Native                 | Mobile application framework      |
| Expo                         | React Native development platform |
| Expo Router                  | File-based routing                |
| TypeScript                   | Static type checking              |
| NativeWind                   | Tailwind CSS for React Native     |
| React Query                  | Server state management           |
| Axios                        | API communication                 |
| Clerk                        | Authentication                    |
| React Native Reanimated      | Animations                        |
| React Native Gesture Handler | Gesture handling                  |

---

## Backend

| Technology    | Purpose                     |
| ------------- | --------------------------- |
| Node.js       | JavaScript runtime          |
| Express.js    | Backend framework           |
| MongoDB       | Database                    |
| Mongoose      | MongoDB ODM                 |
| Clerk Express | Authentication middleware   |
| Cloudinary    | Image uploads               |
| Multer        | Multipart form handling     |
| Arcjet        | Security and bot protection |

---

# Monorepo Structure

```txt
twitter-clone/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── mobile/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (tabs)/
│   │   ├── users/
│   │   ├── sso-callback.tsx
│   │   └── _layout.tsx
│   │
│   ├── components/
│   │   ├── home/
│   │   ├── notifications/
│   │   └── profile/
│   │
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── assets/
│   ├── data/
│   ├── package.json
│   └── .env
```

---

# Mobile Routing Structure

## Authentication Routes

```txt
/(auth)
├── index.tsx
```

## Main Tab Routes

```txt
/(tabs)
├── index.tsx
├── notifications.tsx
├── profile.tsx
├── search.tsx
```

## Dynamic User Routes

```txt
/users/[username].tsx
```

---

# Backend API Endpoints

## User Routes

Base Route:

```txt
/api/users
```

| Method | Endpoint                | Protected | Description                    |
| ------ | ----------------------- | --------- | ------------------------------ |
| GET    | `/profile/:username`    | No        | Get user profile by username   |
| POST   | `/sync`                 | Yes       | Sync authenticated user        |
| GET    | `/me`                   | Yes       | Get current authenticated user |
| PUT    | `/profile`              | Yes       | Update current user profile    |
| POST   | `/follow/:targetUserId` | Yes       | Follow or unfollow a user      |

---

## Post Routes

Base Route:

```txt
/api/posts
```

| Method | Endpoint          | Protected | Description                              |
| ------ | ----------------- | --------- | ---------------------------------------- |
| GET    | `/`               | No        | Get all posts                            |
| GET    | `/:postId`        | No        | Get single post                          |
| GET    | `/user/:username` | No        | Get posts by username                    |
| POST   | `/`               | Yes       | Create a post with optional image upload |
| POST   | `/:postId/like`   | Yes       | Like or unlike a post                    |
| DELETE | `/:postId`        | Yes       | Delete a post                            |

---

## Comment Routes

Base Route:

```txt
/api/comments
```

| Method | Endpoint        | Protected | Description             |
| ------ | --------------- | --------- | ----------------------- |
| GET    | `/post/:postId` | No        | Get comments for a post |
| POST   | `/post/:postId` | Yes       | Create a comment        |
| DELETE | `/:commentId`   | Yes       | Delete a comment        |

---

## Notification Routes

Base Route:

```txt
/api/notifications
```

| Method | Endpoint           | Protected | Description         |
| ------ | ------------------ | --------- | ------------------- |
| GET    | `/`                | Yes       | Get notifications   |
| DELETE | `/:notificationId` | Yes       | Delete notification |

---

# Environment Variables

## Backend `.env`

```env
PORT=5001
NODE_ENV=development

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

MONGO_URI=your_mongodb_connection_string

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## Mobile `.env`

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_API_BASE_URL=https://twitter-clone-afrt.onrender.com/api
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/RonakKedia7/twitter-clone.git
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs locally on:

```txt
http://localhost:5001
```

---

# Mobile Setup

```bash
cd mobile
npm install
npx expo start
```

Run the application using:

* Android Emulator
* iOS Simulator
* Physical Device using Expo Go

---

# Search Screen Status

The search screen currently contains placeholder trending/search data and is planned for future backend integration.

---

# Future Improvements

* Backend-powered search
* Infinite scrolling feed
* Push notifications
* Media optimization
* Bookmark posts
* Video upload support
* Real-time updates
* Web version

---

# Author

Ronak Kedia

| Platform | Link                                                             |
| -------- | ---------------------------------------------------------------- |
| GitHub   | [https://github.com/RonakKedia7](https://github.com/RonakKedia7) |

---

# Notes

* Authentication is fully managed using Clerk.
* Images are uploaded and hosted using Cloudinary.
* Database is hosted on MongoDB Atlas.
* Backend APIs are deployed on Render.
* Mobile application is built using Expo SDK 54.

---

# License

This project is developed for learning and portfolio purposes.
