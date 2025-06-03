# 📊 Sensor Dashboard Frontend

A responsive, dark-themed frontend for a real-time sensor data dashboard. Built using **Next JS**, **React**, **Tailwind CSS**, and **Chart.js**, this project enables users to visualize temperature and pressure data, apply time-based filters, and log in securely.

---

## 🚀 Features

- 🔐 Secure login form with email/password and password visibility toggle  
- 📈 Line charts for real-time temperature and pressure data  
- 🗓️ Custom timestamp range filter  
- 📱 Fully responsive across all devices  
- 🎨 Clean, modern dark UI with Tailwind CSS  
- 🧠 State management using custom store hooks

---

## 🛠️ Tech Stack

- **Framework:** React / Next.js  
- **Styling:** Tailwind CSS  
- **Charting:** Chart.js via `react-chartjs-2` and `Recharts`
- **Icons:** Lucide Icons, React Icons  
- **State Management:** React Hooks  

---

## 📦 Installation
```bash
git clone https://github.com/Adiijha/n0c-Assignment-frontend.git
cd n0c-Assignment-frontend
npm install
````

---

## 🧪 Development

```bash
npm run dev
```

Runs the app locally at [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Production Build

```bash
npm run build
npm run start
```

To preview the production build locally.

---

## 🔁 PM2 Setup (For Deployment)

If using PM2 to serve the frontend:

```bash
pm2 start npm --name frontend -- start
```

To update after pulling new changes:

```bash
git pull
npm install
npm run build
pm2 reload frontend
```

---

## 🌐 NGINX Setup (Optional)

If serving static files after `npm run build`, use this NGINX configuration:

```nginx
server {
  listen 80;
  server_name yourdomain.com;

  root /var/www/frontend/out;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

> 🔄 No need to restart NGINX after frontend updates when serving static files.

---

## 🧱 Project Structure

```
📦 n0c-Assignment-frontend
├── app/
│   ├── (auth)/signin/page.tsx
│   ├── (auth)/signup/page.tsx
│   ├── dashboard/
│   │   ├── Header.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── landingPage/page.tsx
│   ├── landingPage/AuthInitializer.tsx
│   └── landingPage/layoutWrapper.tsx
├── layout/
│   ├── Footer.tsx
│   └── Header.tsx
├── lib/
│   └── api.ts
├── store/
│   └── authStore.ts
├── styles/
│   └── globals.css
├── public/
├── .env
├── next.config.js
├── tsconfig.json
├── postcss.config.mjs
├── README.md

```

---

## ⚙️ Environment Variables (Optional)

If your app fetches data from an API, add a `.env.local` file in the root:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api-endpoint.com
```

---

## 🔗 Backend Integration


[👉 Backend Repo](https://github.com/adiijha/n0c-Assignment-backend)

---

## 🤝 Contributing

Have suggestions or improvements?
Feel free to open an issue or submit a pull request!

---

## 📄 License

This project is licensed under the **MIT License**.

```
