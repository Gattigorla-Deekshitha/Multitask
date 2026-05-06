FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Install serve to run the production build
RUN npm install -g serve

EXPOSE 3000

# Start the app with serve on the dynamic port
CMD serve -s dist -l $PORT
