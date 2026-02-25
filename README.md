# 🎓 SMVDU Alumni & Events Portal

A dynamic web application built with **Next.js** and **Tailwind CSS**, designed to manage alumni profiles, university events, and campus visit requests. This project integrates MongoDB, Google OAuth, Mapbox, Google Sheets, Cloudinary, and email services to deliver a seamless experience for both users and administrators.

---

## 🚀 Features

- 📅 Event Management — Admins can create, update, and display university events.
- 🧑‍🎓 Alumni Directory — Alumni data is synced with **Google Sheets** and MongoDB.
- 📬 Campus Visit Requests — Email notifications sent to designated university contacts.
- 📍 Map Integration — Interactive maps powered by Mapbox.
- 🔐 Authentication — Secure login via Google OAuth2.
- 🖼️ Cloudinary Integration — Alumni profile images are uploaded and served via Cloudinary CDN.

---

## 🛠️ Tech Stack

| Technology     | Purpose                          |
|----------------|----------------------------------|
| Next.js        | React framework for SSR & routing |
| Tailwind CSS   | Utility-first styling             |
| MongoDB        | Database for events & alumni      |
| Mapbox         | Location mapping                  |
| Google OAuth2  | Authentication                    |
| Nodemailer     | Email notifications               |
| Google Sheets  | Alumni data storage & syncing     |
| Cloudinary     | Image hosting & optimization      |

---

### 🔐 Environment Variables
Create a `.env.local` file in the root directory and add the following:

```bash

env
# Admin Emails
NEXT_PUBLIC_EVENTS_ADMIN=sachinanand@gmail.com
EVENTS_ADMIN=sachinanand@gmail.com

# Campus Visit Notifications
RECEIVE_CAMPUS_VISIT_MAIL=sachinanand@gmail.com

# Footer Contact Info
REACT_APP_CONTACT_PHONE=+91-9999999999
REACT_APP_CONTACT_EMAIL=sachinanand@gmail.com

# Node Environment
NODE_ENV=development

# Email Configuration
EMAIL_USER=smvdualumniprojecteg@gmail.com
EMAIL_PASS=abcd abcd abcd abcd
EMAIL_PORT=587
EMAIL_HOST=smtp.gmail.com

# Authentication
NEXTAUTH_SECRET=secret
AUTH_GOOGLE_ID=923749273492743-sadfiuaenfkaseg8w3ur93ujrn.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=adfdklf-asdfjofs-aoijef39infene

# Database
MONGODB_URI=mongodb://localhost:27017/alumnidb

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.efhiauniuandfviunaskfdq93ujrinefbsnknavsdsdaoifnioandfin
MAPBOX_ACCESS_TOKEN=pk.efhiauniuandfviunaskfdq93ujrinefbsnknavsdsdaoifnioandfin
NEXT_PUBLIC_MAPBOX_API_KEY=pk.eyJ1Ijoic2F2b3J5IiwiYSI6ImNsdHU2bDZnYTBzNzQya3BqMTM0MHlyMWsifQ

# Base URL
NEXT_PUBLIC_BASE_URL=https://localhost:3000

# Google Sheets 
GOOGLE_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..." 
GOOGLE_SHEET_ID=your_google_sheet_id 

# Cloudinary 
CLOUDINARY_CLOUD_NAME=your_cloud_name 
CLOUDINARY_API_KEY=your_api_key 
CLOUDINARY_API_SECRET=your_api_secret

⚠️ All values above are placeholders. Replace with actual credentials for production.

```

---

### 🧪 Development
```bash
npm run dev
```

---

### 📦 Build
```bash
npm run build
```

---

### 📊 Data Sources
Alumni: Partially synced from public/data.xlsx and MongoDB.

Events: Fully managed via MongoDB.

Images: Stored in /public/alumni and /public/events.

---

### 📄 Reports
Project reports are saved in the /Report directory.
