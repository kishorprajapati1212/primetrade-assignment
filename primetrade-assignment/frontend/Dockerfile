FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Vite's default port
EXPOSE 5173 

# The --host flag is required for Vite to be accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]