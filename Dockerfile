# Stage 1: Install dependencies
FROM node:22-slim AS deps
WORKDIR /app

# Salin file yang diperlukan untuk instalasi dependencies
RUN apt-get update && apt-get install -y git && apt-get clean

RUN git clone https://github.com/faisolavolut/julong-lib.git src/lib

COPY package.json package-lock.json ./
# Install dependencies
RUN npm install

WORKDIR /app/src/lib

RUN npm install

WORKDIR /app

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
COPY --from=builder /app ./
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "start"]
