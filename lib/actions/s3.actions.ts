"use server";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3ServiceException,
  waitUntilObjectNotExists,
} from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";

import { s3Client } from "../s3";

// References: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html

export async function uploadFileToS3(base64: string, fileName: string) {
  const { userId: clerkUserID, orgId: clerkOrgId } = await auth();

  /*
   * Since server actions only allow serializable data,
   * in the client component we convert the file to
   * base64 and read it here
   */
  const buffer = Buffer.from(base64, "base64");
  const bucketName = process.env.S3_BUCKET;
  const key = `${clerkOrgId}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
  });

  try {
    await s3Client.send(command);

    return {
      key,
      fileUrl: `https://${bucketName}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`,
    };
  } catch (error) {
    if (error instanceof S3ServiceException) {
      const isTooLarge = error.name === "EntityTooLarge";

      console.error(
        `[S3 Upload Error] Bucket: ${bucketName} | Type: ${error.name}`,
        isTooLarge
          ? "File exceeds 5GB limit. Use Multipart Upload."
          : error.message,
      );
    }

    throw error;
  }
}

export async function deleteFileFromS3(objectKey: string) {
  const bucketName = process.env.S3_BUCKET;

  try {
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: bucketName, Key: objectKey }),
    );

    await waitUntilObjectNotExists(
      { client: s3Client, maxWaitTime: 60 },
      { Bucket: bucketName, Key: objectKey },
    );
  } catch (error) {
    if (error instanceof S3ServiceException) {
      console.error(
        `[S3 Delete Error] Bucket: ${bucketName} | Key: ${objectKey} | Type: ${error.name}`,
        error.message,
      );
    }
    throw error;
  }
}
