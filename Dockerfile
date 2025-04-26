# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy root package.json and install root dependencies (concurrently)
COPY package.json package-lock.json ./
RUN npm install

# Copy frontend and backend folders
COPY frontend ./frontend
COPY backend ./backend

# Install dependencies for frontend
RUN cd frontend && npm install

# Install dependencies for backend
RUN cd backend && npm install

# Build frontend (assuming Next.js/React)
RUN cd frontend && npm run build && cd ..

# Expose frontend (3000) and backend (assume 5000) ports
EXPOSE 3000 5000

# Start both servers concurrently
CMD ["npm", "start"]
