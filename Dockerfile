# Usa Node oficial
FROM node:20

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia todo o resto
COPY . .

# Expõe a porta da API
EXPOSE 3000

# Comando para rodar a API
CMD ["node", "src/app.js"]
