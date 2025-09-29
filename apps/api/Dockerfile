# Dockerfile สำหรับ NestJS API — ใช้ Node 20 LTS
FROM node:20-alpine AS base
WORKDIR /app

# ติดตั้ง pnpm
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# คัดลอกไฟล์ workspace ที่จำเป็น
COPY ../../pnpm-workspace.yaml ./
COPY ../../package.json ./
COPY ../../pnpm-lock.yaml ./
COPY ./package.json ./apps/api/

# ติดตั้ง dependencies (เฉพาะที่จำเป็นต่อการ build)
RUN pnpm install --filter api... --workspace-root

# คัดลอกซอร์สโค้ด
COPY . ./apps/api

WORKDIR /app/apps/api

# สร้างโปรเจกต์
RUN pnpm build

# เปิดพอร์ตและคำสั่งเริ่ม
EXPOSE 4000
CMD ["pnpm", "start:prod"]


