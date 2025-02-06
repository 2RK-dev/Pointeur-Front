# Étape 1 : Construction de l'application
FROM node:18 AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install --force


# Copier tout le projet dans le conteneur
COPY . .

# Construire le projet Next.js
RUN npm run build

# Étape 2 : Préparer l'image pour la production
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires de l'étape de build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port utilisé par Next.js
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "start"]
