FROM node:20
 
WORKDIR /app
 
COPY . /app/
 
RUN npm ci
 
EXPOSE 3000
 
CMD ["node", "app.js"]