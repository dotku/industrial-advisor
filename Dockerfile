# Use official Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root package.json and install root dependencies (concurrently)
COPY package.json ./
RUN pnpm install

# Copy frontend and backend folders
COPY frontend ./frontend
COPY backend ./backend

# Install dependencies for frontend
RUN cd frontend && pnpm install

# Install dependencies for backend
RUN cd backend && pnpm install

# Build frontend (assuming Next.js/React)
RUN cd frontend && pnpm run build && cd ..

# Expose frontend (3000) and backend (assume 5000) ports
EXPOSE 3000 5000

# Start both servers concurrently
CMD ["npm", "start"]
