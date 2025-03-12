#!/bin/bash

# Set variables
REGION="ap-south-1"
ECR_URI="651706777681.dkr.ecr.ap-south-1.amazonaws.com/merulife-dev"
IMAGE_TAG="latest"
DATABASE_URL="postgresql://postgres:postgresdevtest@database-1.cbmawk6q0lfh.ap-south-1.rds.amazonaws.com:5432/merulifedev?schema=public"

# Log in to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_URI

# Pull the latest image from ECR
echo "Pulling the Docker image..."
docker pull $ECR_URI:$IMAGE_TAG

# Stop and remove any existing container named 'merulife-container'
echo "Stopping and removing existing container..."
docker stop merulife-container || true
docker rm merulife-container || true

# Run the new container with the DATABASE_URL environment variable
echo "Running the new container..."
docker run -d --name merulife-container -p 3000:3000 \
  -e DATABASE_URL="$DATABASE_URL" \
  $ECR_URI:$IMAGE_TAG

echo "Deployment complete!"
