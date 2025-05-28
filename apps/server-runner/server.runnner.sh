#!/bin/bash

# Variables
S3_BUCKET="your-s3-bucket-name"
S3_FILE="your-file-name.zip"
LOCAL_FILE="/tmp/$S3_FILE"
DEST_DIR="/tmp/unzipped_files"
RUN_SCRIPT="your_script_to_run.sh"

# Download file from S3
echo "Downloading $S3_FILE from S3 bucket $S3_BUCKET..."
aws s3 cp "s3://$S3_BUCKET_NAME/$S3_FILE" "$LOCAL_FILE"

if [ $? -ne 0 ]; then
    echo "Failed to download $S3_FILE from S3 bucket $S3_BUCKET_NAME."
    exit 1
fi

# Unzip the file
echo "Unzipping $LOCAL_FILE to $DEST_DIR..."
mkdir -p "$DEST_DIR"
unzip -o "$LOCAL_FILE" -d "$DEST_DIR"

if [ $? -ne 0 ]; then
    echo "Failed to unzip $LOCAL_FILE."
    exit 1
fi

source node 

cd "/home/app/$DEST_DIR" || {
    echo "Failed to change directory to $DEST_DIR."
    exit 1
}

node /home/app/index.js
# Run the script
echo "Running the script $RUN_SCRIPT..."
node "$MAIN_FILE" || {
    echo "Failed to run $MAIN_FILE."
    exit 1
}



echo "Server run successfully."