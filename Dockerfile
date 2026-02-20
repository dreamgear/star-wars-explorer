# Use a lightweight Nginx image
FROM nginx:alpine

# Copy the static assets to the Nginx html directory
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Fix permissions so nginx user can read files
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
