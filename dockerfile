# Habits Tracker — lingkungan pengembangan
# Node 24 adalah Active LTS per Agustus 2026.

FROM node:24-alpine

WORKDIR /app

# Salin manifest lebih dulu supaya lapisan npm install ikut ter-cache
COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
