"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";

import { s3Client } from "../s3";

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

  await s3Client.send(command);

  const fileUrl = `https://${bucketName}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;

  return { key, fileUrl };
}
