# Stage 1: Install dependencies
FROM node:22-slim AS deps
WORKDIR /app

# Install dependensi sistem untuk Puppeteer
RUN apt-get update && apt-get install -y \
    git \
    chromium \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxrender1 \
    && apt-get clean

# Install Chromium
RUN which chromium

# Set environment variable untuk Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Salin file yang diperlukan untuk instalasi dependencies
RUN git clone https://github.com/faisolavolut/julong-lib.git src/lib

# Salin file package.json dan package-lock.json dari root
COPY package.json package-lock.json ./

# Salin file package.json dari workspace (agar npm install membaca dependencies-nya)
COPY src/lib/package*.json src/lib/

RUN npm install

# Stage 2: Build aplikasi
FROM node:22-slim AS builder
WORKDIR /app

# Salin dependencies dari stage sebelumnya
COPY --from=deps /app/node_modules ./node_modules

# Salin semua file dari project
COPY . .

# Deklarasikan ARG untuk build time
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NODE_ENV
ARG NEXT_PUBLIC_API_PORTAL
ARG NEXT_PUBLIC_API_MPP
ARG NEXT_PUBLIC_MAIN_URL
ARG NEXT_PUBLIC_API_RECRUITMENT
ARG NEXT_PUBLIC_API_ONBOARDING
ARG NEXT_PUBLIC_MODE
ARG NEXT_PUBLIC_NAME

# Deklarasikan ENV untuk runtime
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_API_PORTAL=${NEXT_PUBLIC_API_PORTAL}
ENV NEXT_PUBLIC_API_MPP=${NEXT_PUBLIC_API_MPP}
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_MAIN_URL=${NEXT_PUBLIC_MAIN_URL}
ENV NEXT_PUBLIC_API_RECRUITMENT=${NEXT_PUBLIC_API_RECRUITMENT}
ENV NEXT_PUBLIC_MODE=${NEXT_PUBLIC_MODE}
ENV NEXT_PUBLIC_API_ONBOARDING=${NEXT_PUBLIC_API_ONBOARDING}
ENV NEXT_PUBLIC_NAME=${NEXT_PUBLIC_NAME}

# Debugging untuk melihat nilai ARG
RUN echo "NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}" && \
    echo "NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}" && \
    echo "NEXT_PUBLIC_MAIN_URL=${NEXT_PUBLIC_MAIN_URL}" && \
    echo "NEXT_PUBLIC_API_RECRUITMENT=${NEXT_PUBLIC_API_RECRUITMENT}" && \
    echo "NEXT_PUBLIC_MODE=${NEXT_PUBLIC_MODE}" && \
    echo "NEXT_PUBLIC_API_ONBOARDING=${NEXT_PUBLIC_API_ONBOARDING}" && \
    echo "NEXT_PUBLIC_NAME=${NEXT_PUBLIC_NAME}" && \
    echo "NODE_ENV=${NODE_ENV}"

# Debugging untuk memastikan ENV tersedia
RUN echo "NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}" > .env && \
    echo "NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}" >> .env && \
    echo "NEXT_PUBLIC_API_PORTAL=${NEXT_PUBLIC_API_PORTAL}" >> .env && \
    echo "NEXT_PUBLIC_API_MPP=${NEXT_PUBLIC_API_MPP}" >> .env && \
    echo "NEXT_PUBLIC_MAIN_URL=${NEXT_PUBLIC_MAIN_URL}" >> .env && \
    echo "NEXT_PUBLIC_API_RECRUITMENT=${NEXT_PUBLIC_API_RECRUITMENT}" >> .env && \
    echo "NEXT_PUBLIC_API_ONBOARDING=${NEXT_PUBLIC_API_ONBOARDING}" >> .env && \
    echo "NEXT_PUBLIC_MODE=${NEXT_PUBLIC_MODE}" >> .env && \
    echo "NEXT_PUBLIC_NAME=${NEXT_PUBLIC_NAME}" >> .env && \
    echo "NODE_ENV=${NODE_ENV}" >> .env

# Debug: Tampilkan isi file .env
RUN cat .env

# Build aplikasi
RUN npm run build

# Stage 3: Jalankan aplikasi
FROM node:22-slim AS runner
WORKDIR /app

# Salin Chromium dan dependensi sistem dari stage builder
COPY --from=deps /usr/bin/chromium /usr/bin/chromium
COPY --from=deps /usr/lib/chromium /usr/lib/chromium
COPY --from=deps /usr/share/chromium /usr/share/chromium

# Salin library sistem yang diperlukan
COPY --from=deps /usr/lib/x86_64-linux-gnu /usr/lib/x86_64-linux-gnu
COPY --from=deps /lib/x86_64-linux-gnu /lib/x86_64-linux-gnu

# Salin aplikasi yang sudah di-build
COPY --from=builder /app ./

EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "start"]