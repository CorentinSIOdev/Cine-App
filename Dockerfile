# Utiliser l'image officielle de Node avec la version 22-alpine
FROM node:22-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier tous les fichiers du projet dans le conteneur
COPY . .

# Construire l'application
RUN npm run build

# Exposer le port sur lequel l'application sera servie
EXPOSE 3000

# Démarrer l'application en utilisant le serveur web intégré à React
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
