# Google Cloud Run Deployment

This project is configured for deployment on Google Cloud Run using NGINX to serve the statically built React application.

## Files added for deployment:
- \`Dockerfile\`: A multi-stage build that first builds the React app, and then packages it with NGINX.
- \`nginx.conf.template\`: The NGINX configuration file which sets up gzip compression, caching, SPA routing, and dynamically uses the \`PORT\` provided by Google Cloud Run.
- \`.dockerignore\`: Helps to keep the Docker image small and the build fast by ignoring unnecessary files.

## How to Deploy to Cloud Run

1. Make sure you have the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated.
2. Run the following command from the root of this project:
   \`\`\`bash
   gcloud run deploy my-app-name --source . --region us-central1 --allow-unauthenticated
   \`\`\`
   This will automatically use the \`Dockerfile\` to build the container using Cloud Build and deploy it to Cloud Run.

Enjoy your highly concurrent, lightweight React application!
