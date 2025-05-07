# 🎵 MusicVerse - Your Vinyl Music Universe

MusicVerse is a modern e-commerce web application prototype designed for **vinyl collectors and music lovers**. It provides rich album metadata (such as analog vs. digital recordings, remastering status, catalog numbers, etc.), which is often missing from traditional online music stores. It also includes a built-in AI chatbot to enhance user interaction and support.

## 🚀 Features

- 🎶 Detailed album information via the **Discogs API**
- 💬 AI-powered chatbot assistant built with **Chatbase**
- 🎨 Stylish and responsive front-end UI
- 🧠 Collector-friendly categories like *Analog*, *Digital Remasters*, *Bundles*
- 💡 Featured and categorized albums loaded dynamically
- 📦 Backend integration with OpenAI API (optional for local testing)

## 🛠 Tech Stack

- **HTML, CSS, JavaScript**
- **Discogs API** (album data)
- **OpenAI / Chatbase** (AI chatbot)
- **Node.js / Express** (backend)
- **GitHub Pages** (for deployment)

## 📁 File Structure

```plaintext
MusicVerse/
├── index.html
├── albums.html
├── product-detail.html
├── offers.html
├── css/
│   ├── styles.css
│   └── chatbot.css
├── js/
│   ├── album-renderer.js
│   ├── discogs-api.js
│   ├── albums.js
│   └── chatbot.js
├── server/
│   ├── index.js          # (Optional backend for OpenAI/Express)
│   └── package.json
├── shared-styles.html
├── header.html
└── .env (excluded)
