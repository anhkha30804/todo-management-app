# Stage 1: Build NestJS application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies to keep the image light
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy distribution from Stage 1
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]
