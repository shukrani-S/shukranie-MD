# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port (optional, if using HTTP server, e.g. Express)
EXPOSE 3000

# Start the bot using control.js
CMD ["node", "control.js"]
