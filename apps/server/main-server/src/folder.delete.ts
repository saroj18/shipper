import { s3 } from './s3.config.js';
import { DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function deleteS3Folder(bucketName: string, folderPrefix: string) {
  let continuationToken: string | undefined = undefined;

  do {
    const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: folderPrefix,
      ContinuationToken: continuationToken,
    });

    const listResponse = await s3.send(listCommand);

    const contents = listResponse.Contents;
    if (!contents || contents.length === 0) {
      console.log('No objects found to delete.');
      break;
    }

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: contents.map((item) => ({ Key: item.Key! })),
        Quiet: true,
      },
    });

    const deleteResponse = await s3.send(deleteCommand);
    console.log('Deleted:', deleteResponse.Deleted?.length ?? 0, 'items');

    continuationToken = listResponse.IsTruncated ? listResponse.NextContinuationToken : undefined;
  } while (continuationToken);
}
