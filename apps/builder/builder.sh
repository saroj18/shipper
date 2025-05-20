#!/bin/bash

export AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="ap-south-1"

export GIT_REPOSITORY__URL="$GIT_REPOSITORY__URL"

echo "🔧 Starting clone"
echo "Repo URL: $GIT_REPOSITORY__URL"
echo "Bucket: $S3_BUCKET_NAME"


git clone "$GIT_REPOSITORY__URL" /home/app/output || {
  echo "❌ Git clone failed please check the repository URL"
  exit 1
}

cd /home/app/output || {
  echo "❌ Failed to change directory to /home/app/output"
  exit 1
}


if [ ! -f "shipper.config.json" ]; then
  echo "❌ shipper.config.json not found"
  exit 1
fi

# Run the Node.js file (index.js)
if [ -f "/home/app/index.js" ]; then
  echo "🔧 Running Node.js file: index.js"
  node /home/app/index.js || {
    echo "❌ Failed to execute index.js"
    exit 1
  }
else
  echo "❌ index.js not found"
  exit 1
fi

if [ ! -f "/home/app/output/shipper.env" ]; then
  echo "❌ shipper.env not found"
  exit 1
fi

. /home/app/output/shipper.env || {
  echo "❌ Failed to source shipper.env"
  exit 1
}


# goes on client directory

cd /home/app/output/client || {
  echo "❌ Failed to change directory to client"
  exit 1
}

# Check if package.json exists
if [ ! -f "/home/app/output/client/package.json" ]; then
  echo "❌ package.json noot found"
  exit 1
fi

if [ ! -f "/home/app/output/client/package-lock.json" ]; then
  echo "❌ package-lock.json not found"
  exit 1
fi


# Install dependencies
if [ -n "$INSTALL_COMMAND" ]; then
  echo "🔧 Running install command: $INSTALL_COMMAND"
  eval "$INSTALL_COMMAND" || {
    echo "❌ Install command failed"
    exit 1
  }
elif [ -n "$CLIENT_INSTALL_COMMAND" ]; then
 echo "🔧 Running custom install command: $CLIENT_INSTALL_COMMAND"
  eval "$CLIENT_INSTALL_COMMAND" || {
    echo "❌ Client install command failed"
    exit 1
  }
else
  echo "🔧 Running npm ci as fallback"
  npm ci || {
    echo "❌ npm ci failed"
    exit 1
  }
fi


# Build the project
if [ -n "$BUILD_COMMAND" ]; then
  echo "🔧 Running build command: $BUILD_COMMAND"
  eval "$BUILD_COMMAND" || {
    echo "❌ build command failed"
    exit 1
  }
elif [ -n "$CLIENT_BUILD_COMMAND" ]; then
 echo "🔧 Running custom build command: $CLIENT_BUILD_COMMAND"
  eval "$CLIENT_BUILD_COMMAND" || {
    echo "❌ Client build command failed"
    exit 1
  }
else
  echo "🔧 Running npm run build as fallback"
  npm run build || {
    echo "❌ npm run build failed"
    exit 1
  }
fi

# Check if the build folder exists
if [ ! -d "$OUTPUT_DIRECTORY" ]; then
  echo "❌ Build failed: $OUTPUT_DIRECTORY folder not found"
elif [ ! -d "$CLIENT_OUTPUT_DIR" ]; then
  echo "❌ Build failed: $CLIENT_OUTPUT_DIR folder not found"
else
  echo "❌ Build failed: output directory not folder not found"
  exit 1
fi


if [ -d "$OUTPUT_DIRECTORY" ]; then
  aws s3 cp --recursive "$OUTPUT_DIRECTORY" s3://$S3_BUCKET_NAME/$USER_PROJECT_IDENTITY
elif [ -d "$CLIENT_OUTPUT_DIR" ]; then
  aws s3 cp --recursive "$CLIENT_OUTPUT_DIR" s3://$S3_BUCKET_NAME/$USER_PROJECT_IDENTITY
else
  echo "❌ Build failed: output directory not found"
  exit 1
fi


echo "✅ Build completed successfully"
echo "🔧 Uploading to S3 bucket: $S3_BUCKET_NAME"
