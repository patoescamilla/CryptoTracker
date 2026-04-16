FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# El directorio de logs se crea en tiempo de ejecución
EXPOSE 3001
CMD ["node", "index.js"]