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

if [ "$CLIENT_PATH" == "client" ]; then

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
elif [ -n "$CLIENT_INSTALL_CMD" ]; then
 echo "🔧 Running custom install command: $CLIENT_INSTALL_CMD"
  eval "$CLIENT_INSTALL_CMD" || {
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
elif [ -n "$CLIENT_BUILD_CMD" ]; then
 echo "🔧 Running custom build command: $CLIENT_BUILD_CMD"
  eval "$CLIENT_BUILD_CMD" || {
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
  aws s3 cp --recursive "$OUTPUT_DIRECTORY" s3://$S3_CLIENT_UCKET_NAME/$USER_PROJECT_IDENTITY/client
elif [ -d "$CLIENT_OUTPUT_DIR" ]; then
  aws s3 cp --recursive "$CLIENT_OUTPUT_DIR" s3://$S3_CLIENT_BUCKET_NAME/$USER_PROJECT_IDENTITY/client
else
  echo "❌ Build failed: output directory not found"
  exit 1
fi
fi

# for server code

if [[ "$SERVER_PATH" == "server" ]]; then

# goes on server directory
cd /home/app/output/server || {
  echo "❌ Failed to change directory to server"
  exit 1
}

# Check if package.json exists
if [ ! -f "/home/app/output/server/package.json" ]; then
  echo "❌ package.json not found"
  exit 1
fi

# Check if package-lock.json exists
if [ ! -f "/home/app/output/server/package-lock.json" ]; then
  echo "❌ package-lock.json not found"
  exit 1
fi

node /home/app/image-builder.js "$SERVER_PATH" || {
  echo "❌ Failed to run image-builder.js"
  exit 1
}

# Install dependencies
if [ -n "$INSTALL_COMMAND" ]; then
  echo "🔧 Running install command: $INSTALL_COMMAND"
  eval "$INSTALL_COMMAND" || {
    echo "❌ Install command failed"
    exit 1
  }
elif [ -n "$SERVER_INSTALL_CMD" ]; then
 echo "🔧 Running custom install command: $SERVER_INSTALL_CMD"
  eval "$SERVER_INSTALL_CMD" || {
    echo "❌ Server install command failed"
    exit 1
  }
else
  echo "🔧 Running npm ci as fallback"
  npm ci || {
    echo "❌ npm ci failed"
    exit 1
  }
fi

# check it use typescript or not
if [ -f "/home/app/output/server/tsconfig.json" ]; then
 # Build the project
if [ -n "$BUILD_COMMAND" ]; then
  echo "🔧 Running build command: $BUILD_COMMAND"
  eval "$BUILD_COMMAND" || {
    echo "❌ build command failed"
    exit 1
  }
elif [ -n "$SERVER_BUILD_CMD" ]; then
 echo "🔧 Running custom build command: $SERVER_BUILD_CMD"
  eval "$SERVER_BUILD_CMD" || {
    echo "❌ Server build command failed"
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
elif [ ! -d "$SERVER_OUTPUT_DIR" ]; then
  echo "❌ Build failed: $SERVER_OUTPUT_DIR folder not found"
else
  echo "❌ Build failed: output directory not folder not found"
  exit 1
fi

if [ -d "$OUTPUT_DIRECTORY" ]; then
  echo "🔧 Creating zip file for $OUTPUT_DIRECTORY"
  zip -r output.zip "$OUTPUT_DIRECTORY" || {
    echo "❌ Failed to create zip file for $OUTPUT_DIRECTORY"
    exit 1
  }

  node /home/app/image-builder.js "$OUTPUT_DIRECTORY" || {
    echo "❌ Failed to run image-builder.js"
    exit 1
  }


  aws s3 cp output.zip s3://$S3_SERVER_BUCKET_NAME/$USER_PROJECT_IDENTITY/server.zip || {
    echo "❌ Failed to upload zip file to S3"
    exit 1
  }
  echo "✅ Zip file uploaded successfully"
elif [ -d "$SERVER_OUTPUT_DIR" ]; then
  echo "🔧 Creating zip file for $SERVER_OUTPUT_DIR"
  zip -r server_output.zip "$SERVER_OUTPUT_DIR" || {
    echo "❌ Failed to create zip file for $SERVER_OUTPUT_DIR"
    exit 1
  }
  aws s3 cp server_output.zip s3://$S3_SERVER_BUCKET_NAME/$USER_PROJECT_IDENTITY/server.zip || {
    echo "❌ Failed to upload zip file to S3"
    exit 1
  }
  echo "✅ Zip file uploaded successfully"
else
  echo "❌ Build failed: output directory not found"
  exit 1
fi
else
  # Upload the server code to S3
  
    echo "🔧 Creating zip file for server"
    zip -r server.zip ../server || {
      echo "❌ Failed to create zip file for server"
      exit 1
    }
    aws s3 cp server.zip s3://$S3_SERVER_BUCKET_NAME/$USER_PROJECT_IDENTITY/server.zip || {
      echo "❌ Failed to upload zip file to S3"
      exit 1
    }
    echo "✅ Zip file uploaded successfully"
  
fi
fi

echo "✅ Build completed successfully"
