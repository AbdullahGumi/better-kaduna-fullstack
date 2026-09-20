FROM node:22-alpine

# Install OpenSSL for Prisma engine compatibility on Alpine
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Copy Prisma schema files
COPY prisma/ prisma/

# Install dependencies and generate Prisma client
RUN yarn install --frozen-lockfile --production=false
RUN npx prisma generate

# Set NODE_ENV for production build to ensure consistent behavior
ENV NODE_ENV=production

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the Next.js application
CMD ["yarn", "start"]
