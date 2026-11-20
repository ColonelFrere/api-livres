# Image de base officielle, version fixée (pas "latest")
FROM node:20-alpine

# Métadonnées de l'image
LABEL maintainer="Walid <waliddehak2004@gmail.com>" \
      project="api-livres" \
      version="1.0.0"

# Dossier de travail dans le conteneur
WORKDIR /app

# On copie d'abord les fichiers de dépendances (meilleure utilisation du cache)
COPY package*.json ./
RUN npm ci --omit=dev

# Puis le code
COPY src ./src

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

# On ne lance pas l'app en root (bonne pratique de sécurité)
USER node

CMD ["npm", "start"]