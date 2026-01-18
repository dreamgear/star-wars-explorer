# Traefik Management Guide

You are using **Traefik** as a reverse proxy. This means "Virtual Hosts" are configured dynamically using **Docker Labels** on your application containers. You rarely need to touch the main Traefik container.

## 1. Renaming a Domain
To change the domain for an existing app (e.g., moving from `one.dreamgearweb.com` to `starwars.dreamgearweb.com`):

1.  Open the application's `docker-compose.yml`.
2.  Find the `labels` section.
3.  Update the `Host` rule:
    ```yaml
    labels:
      - "traefik.http.routers.starwars.rule=Host(`starwars.dreamgearweb.com`)"
    ```
4.  Apply changes:
    ```bash
    docker compose up -d
    ```
    Traefik will detect the change and automatically request a new SSL certificate.

## 2. Adding a New Application
To add a second app (e.g., `two.dreamgearweb.com`), create a new `docker-compose.yml` for it.

**Rules:**
1.  **Unique Router Name**: You must replace `starwars` with a unique name for this app (e.g., `app2`).
2.  **Network**: The container MUST join the `proxy-net` network.

**Template:**
```yaml
version: '3'

services:
  web:
    image: nginx:alpine # Or your app image
    labels:
      - "traefik.enable=true"
      # UNIQUE ROUTER NAME (app2)
      - "traefik.http.routers.app2.rule=Host(`two.dreamgearweb.com`)"
      - "traefik.http.routers.app2.entrypoints=websecure"
      - "traefik.http.routers.app2.tls.certresolver=myresolver"
    networks:
      - proxy-net
    restart: always

networks:
  proxy-net:
    external: true
```

## 3. Troubleshooting
- **Logs**: Check Traefik logs to see certificate generation status:
  `docker logs traefik`
- **Network**: If an app is unreachable (504 Gateway Timeout), ensure it is attached to `proxy-net`.
