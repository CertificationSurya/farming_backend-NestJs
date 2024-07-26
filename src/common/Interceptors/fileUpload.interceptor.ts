import mongoose from 'mongoose';
import { randomBytes } from 'crypto';
import { extname } from 'path';
import { Readable } from 'stream';

export const BUCKET_NAME = 'ProfilePic';

export let gridFSBucket: mongoose.mongo.GridFSBucket;

export const initializeGridFS = () => {
  const mongoConnection = mongoose.connection;

  if (mongoConnection.readyState === 1) {
    gridFSBucket = new mongoose.mongo.GridFSBucket(mongoConnection.db, {
      bucketName: BUCKET_NAME,
    });
  } else {
    mongoConnection.once('open', () => {
      gridFSBucket = new mongoose.mongo.GridFSBucket(mongoConnection.db, {
        bucketName: BUCKET_NAME,
      });
    });
  }
};

export const uploadFile = async (
  file: Express.Multer.File,
): Promise<string> => {
  if (!gridFSBucket) {
    initializeGridFS();
  }

  return new Promise((resolve, reject) => {
    randomBytes(16, (err, buf) => {
      if (err) {
        console.log(err);
        return reject(err);
      }

      const filename = buf.toString('hex') + extname(file.originalname);

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      const uploadStream = gridFSBucket.openUploadStream(filename, {
        contentType: file.mimetype,
      });

      readableStream.pipe(uploadStream);

      uploadStream.on('error', reject);
      uploadStream.on('finish', () => {
        // console.log(uploadStream.id.toHexString())
        resolve(uploadStream.id.toHexString());
      });
    });
  });
};
