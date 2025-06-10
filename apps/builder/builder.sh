#!/bin/bash

export AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="ap-south-1"
export USER_CLIENT_PATH="$USER_CLIENT_PATH"
export USER_SERVER_PATH="$USER_SERVER_PATH"

export GIT_REPOSITORY__URL="$GIT_REPOSITORY__URL"

echo "🔧 Starting clone"
echo "Repo URL: $GIT_REPOSITORY__URL"
echo "Bucket: $S3_BUCKET_NAME"


git clone "$GIT_REPOSITORY__URL" /home/app/output || {
  echo "[ERROR] ❌ Git clone failed please check the repository URL"
  exit 1
}

cd /home/app/output || {
  echo "❌ Failed to change directory to /home/app/output"
  exit 1
}


if [ ! -f "shipper.config.json" ]; then
  echo " [ERROR] ❌ shipper.config.json not found"
  exit 1
fi

# Run the Node.js file (index.js)
if [ -f "/home/app/index.js" ]; then
  echo "🔧 Running Node.js file: index.js"
  node /home/app/index.js || {
    echo "[ERROR] ❌ Failed to execute index.js"
    exit 1
  }
else
  echo "[ERROR] ❌ index.js not found"
  exit 1
fi

if [ ! -f "/home/app/output/shipper.env" ]; then
  echo "[ERROR] ❌ shipper.env not found"
  exit 1
fi

. /home/app/output/shipper.env || {
  echo "[ERROR] ❌ Failed to source shipper.env"
  exit 1
}

if [[ "$USER_CLIENT_PATH" == true  &&  "$CLIENT_PATH" == "client" ]]; then
echo "CLIENT_IS_HERE"
# goes on client directory

cd /home/app/output/$CLIENT_PATH || {
  echo "[ERROR] ❌ Failed to change directory to client"
  exit 1
}

# Check if package.json exists
if [ ! -f "/home/app/output/client/package.json" ]; then
  echo "[ERROR] ❌ package.json noot found"
  exit 1
fi

if [ ! -f "/home/app/output/client/package-lock.json" ]; then
  echo "[ERROR] ❌ package-lock.json not found"
  exit 1
fi


# Install dependencies
if [ -n "$INSTALL_COMMAND" ] && [ "$INSTALL_COMMAND" != "undefined" ]; then
  echo "🔧 Running install command: $INSTALL_COMMAND"
  eval "$INSTALL_COMMAND" 2>&1 | sed 's/^/[INSTALL] /' || {
    echo "[ERROR] ❌ Install command failed"
    exit 1
  }
elif [ -n "$CLIENT_INSTALL_CMD" ]; then
 echo "🔧 Running custom install command: $CLIENT_INSTALL_CMD"
  eval "$CLIENT_INSTALL_CMD" 2>&1 | sed 's/^/[INSTALL] /' || {
    echo "[ERROR] ❌ Client install command failed"
    exit 1
  }
else
  echo "🔧 Running npm ci as fallback"
  npm ci 2>&1 | sed 's/^/[INSTALL] /' || {
    echo "[ERROR] ❌ npm ci failed"
    exit 1
  }
fi


# Build the project
if [ -n "$BUILD_COMMAND" ] && [ "$BUILD_COMMAND" != "undefined" ]; then
  echo "🔧 Running build command: $BUILD_COMMAND"
  eval "$BUILD_COMMAND" 2>&1 | sed 's/^/[BUILD] /' || {
    echo "[ERROR] ❌ build command failed"
    exit 1
  }
elif [ -n "$CLIENT_BUILD_CMD" ]; then
 echo "🔧 Running custom build command: $CLIENT_BUILD_CMD"
  eval "$CLIENT_BUILD_CMD" 2>&1 | sed 's/^/[BUILD] /' || {
    echo "[ERROR] ❌ Client build command failed"
    exit 1
  }
else
  echo "🔧 Running npm run build as fallback"
  npm run build 2>&1 | sed 's/^/[BUILD] /' || {
    echo "[ERROR] ❌ npm run build failed"
    exit 1
  }
fi

# Check if the build folder exists
if [ -d "$OUTPUT_DIRECTORY" ] && [ "$OUTPUT_DIRECTORY" != "undefined" ]; then
  echo "[INFO] ✅ Build directory found: $OUTPUT_DIRECTORY"
elif [ -d "$CLIENT_OUTPUT_DIR" ] && [ "$CLIENT_OUTPUT_DIR" != "undefined" ]; then
  echo "[INFO] ✅ Build directory found: $CLIENT_OUTPUT_DIR"
else
  echo "[ERROR] ❌ Build failed: No valid output directory found"
  exit 1
fi


if [ -d "$OUTPUT_DIRECTORY" ] && [ "$OUTPUT_DIRECTORY" != "undefined" ]; then
  aws s3 cp --region ap-south-1 --recursive "$OUTPUT_DIRECTORY" s3://$S3_CLIENT_BUCKET_NAME/$USER_PROJECT_IDENTITY/client
elif [ -d "$CLIENT_OUTPUT_DIR" ] && [ "$CLIENT_OUTPUT_DIR" != "undefined" ]; then
  aws s3 cp --region ap-south-1 --recursive "$CLIENT_OUTPUT_DIR" s3://$S3_CLIENT_BUCKET_NAME/$USER_PROJECT_IDENTITY/client
else
  aws s3 cp --region ap-south-1 --recursive dist s3://$S3_CLIENT_BUCKET_NAME/$USER_PROJECT_IDENTITY/client
fi
fi

# for server code

if [[ "$USER_SERVER_PATH" == true && "$SERVER_PATH" == "server" ]]; then

echo "SERVER_IS_HERE"
# goes on server directory
cd /home/app/output/$SERVER_PATH || {
  echo "[ERROR] ❌ Failed to change directory to server"
  exit 1
}

# Check if package.json exists
if [ ! -f "/home/app/output/server/package.json" ]; then
  echo "[ERROR] ❌ package.json not found for server"
  exit 1
fi

# Check if package-lock.json exists
if [ ! -f "/home/app/output/server/package-lock.json" ]; then
  echo "[SERVER] ❌ package-lock.json not found for server"
  exit 1
fi

# Create AWS ECR repository if it doesn't exist
if  ! aws ecr describe-repositories --region ap-south-1 --repository-names "$AWS_ECR_REPOSITORY_NAME" > /dev/null 2>&1; then
  echo "🔧 Creating AWS ECR repository: $AWS_ECR_REPOSITORY_NAME"
  aws ecr create-repository --region ap-south-1 --repository-name "$AWS_ECR_REPOSITORY_NAME" || {
    echo "❌ Failed to create AWS ECR repository"
    exit 1
  }
else
  echo "✅ AWS ECR repository already exists: $AWS_ECR_REPOSITORY_NAME"
fi

if [ -f "/home/app/output/server/tsconfig.json" ]; then

docker build -t "$IMAGE_NAME":v2 -f /home/app/Dockerfile.ts.server . || {
  echo "❌ Docker build failed"
  exit 1
}
else
  docker build -t "$IMAGE_NAME":v2 -f /home/app/Dockerfile.js.server . || {
    echo "❌ Docker build failed"
    exit 1
  }
fi


aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 730335220956.dkr.ecr.ap-south-1.amazonaws.com

docker tag $IMAGE_NAME:v2 "$AWS_ECR_REPOSITORY_URL/$AWS_ECR_REPOSITORY_NAME":v3 || {
  echo "❌ Docker tag failed2"
  exit 1
} 

docker push "$AWS_ECR_REPOSITORY_URL/$AWS_ECR_REPOSITORY_NAME":v3 || {
  echo "❌ Docker push failed3"
  exit 1
}
fi

echo "[SUCCESS] ✅ Build completed successfully"
echo "[FAIL] ❌ Build Failed"
