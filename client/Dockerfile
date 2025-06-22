# === Build stage ===
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# === Production stage ===
FROM node:18-alpine
WORKDIR /app

# Copy only the necessary output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# Run the standalone server
CMD ["node", "server.js"]
