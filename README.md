# Star Wars Explorer

A modern, responsive web application for exploring the Star Wars universe. Data is fetched from the [SWAPI](https://swapi.py4e.com/documentation) (via swapi.py4e.com mirror).

## Features
- **Browse Categories**: People, Planets, Starships.
- **Search**: Real-time filtering of data.
- **Sorting**: Click headers to sort by name, population, cost, etc.
- **Design**: Glassmorphism UI with smooth transitions.

## Local Development
Requires [Node.js](https://nodejs.org/).

1.  Clone the repo.
2.  Run the simple dev server:
    ```bash
    node server.js
    ```
3.  Open `http://localhost:3000`.

## Deployment

### Prerequisites
This app runs behind a **Traefik reverse proxy** for SSL and routing.
Traefik configuration lives in a separate repo: [`dreamgear/gopher`](https://github.com/dreamgear/gopher).
Ensure Traefik is running and the `proxy-net` Docker network exists before deploying this app.

### Docker Compose (Recommended)

```bash
docker compose up -d --build
```

The app registers itself with Traefik via Docker labels in `docker-compose.yml`.
It will be available at `https://one.dreamgearweb.com`.

### Standalone Docker (without Traefik)

```bash
docker build -t star-wars-explorer .
docker run -d -p 8080:80 star-wars-explorer
```

Access at `http://localhost:8080`.

### Manual Deployment (Nginx/Apache)
Simply copy all files in this directory to your web server's root directory (e.g., `/var/www/html`).
Ensure `index.html`, `style.css`, and the `src` folder are preserved.

## Project Structure
- `index.html`: Entry point and Import Map.
- `src/`: Vue.js source code (Views, Components, Services).
- `style.css`: Global styles and variables.
- `server.js`: Lightweight local development server.
