# codeclauseinternshipnewaggre
A dynamic web application that fetches and displays real-time news articles from various categories using the [NewsAPI.org]

# 📰 News Aggregator Web App

A dynamic web application that fetches and displays real-time news articles from various categories using the [NewsAPI.org](https://newsapi.org/) service. Built with **Java (Spring Boot)** on the backend and **HTML, CSS, JavaScript** on the frontend, this app demonstrates API integration, category-based filtering, and responsive design.

---



---

## 🎯 Features

- 🔎 Category-based news browsing (`General`, `Technology`, `Business`, `Health`, `Sports`, etc.)
- 🧠 Short summaries for each article
- 🌍 External links to read full articles
- 📱 Responsive design with user-friendly layout
- 🚀 Backend integration with [NewsAPI](https://newsapi.org/)
- 🔐 CORS enabled for frontend-backend communication

---

## 🛠️ Tech Stack

### Backend:
- Java 17+
- Spring Boot
- RestTemplate
- Maven
- NewsAPI Integration

### Frontend:
- HTML5, CSS3
- Vanilla JavaScript
- Fetch API

---

## 📁 Project Structure
├── src/
│ ├── main/
│ │ ├── java/
│ │ │ └── com.newsaggregator/
│ │ │ ├── NewsAggregatorApplication.java
│ │ │ ├── controller/NewsController.java
│ │ │ └── config/CorsConfig.java
│ │ └── resources/
│ │ ├── application.properties
│ │ └── static/index.html
├── pom.xml
└── README.md

