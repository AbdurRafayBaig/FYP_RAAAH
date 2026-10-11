# Application Server (Node.js + Express.js) - artifact "REST API" in the Deployment Diagram (SRS Fig. 45)

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
# The optional dependency is the embedded PostgreSQL used only for local development
RUN npm ci --omit=dev --omit=optional && npm cache clean --force
COPY src ./src
USER node
EXPOSE 5000
# Bring the schema up to date (idempotent), then serve
CMD ["sh", "-c", "node src/db/migrate.js && exec node src/server.js"]
