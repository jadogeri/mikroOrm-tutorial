FROM node:lts-alpine
ENV PORT=3000
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
EXPOSE 3000
CMD ["npm", "run", "start"]
