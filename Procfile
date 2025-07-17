web: cd client && npm start
# Alternative pour démarrer le serveur backend :
# web: npm start

# Configuration pour Railway
[build]
  builder = "npx @railway/app-interface@latest"
  buildCommand = "cd client && npm install && npm run build"
  startCommand = "cd client && npm start"

[build.environment]
  NODE_VERSION = "18.x"
  NPM_CONFIG_PRODUCTION = "false"
  NPM_CONFIG_LEGACY_PEER_DEPS = "true"
  NODE_ENV = "production"

[deploy]
  startCommand = "cd client && npm start"
