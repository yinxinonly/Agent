#!/bin/bash

# Get the current commit SHA
COMMIT_SHA=$(git rev-parse HEAD)

# Build the Docker image
docker build -t employee-management .

docker push employee-management

