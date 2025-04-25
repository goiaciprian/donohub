FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx run-many --target=build --all=true

# Stage 2: Production image
FROM node:23-alpine AS production

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/prisma ./prisma

# Generate prisma client
RUN npx prisma generate

# Set environment variables (optional, adjust as needed)
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
