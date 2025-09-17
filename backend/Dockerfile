FROM node:lts
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ENV NODE_ENV=production
EXPOSE 4040
CMD ["npm", "start"]