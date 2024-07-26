import mongoose from 'mongoose';
import {
  gridFSBucket,
  initializeGridFS,
} from './fileUpload.interceptor.js';
import { Response } from 'express';

const fileDownload = async (photoId: string | mongoose.Types.ObjectId, res: Response) => {
  try {
    if (!gridFSBucket) {
      initializeGridFS();
    }
    
    const downloadStream = gridFSBucket.openDownloadStream(
      new mongoose.Types.ObjectId(photoId),
    );

    downloadStream.on('file', (file) => {
      res.set('Content-Type', file.contentType);
      res.set('Content-Disposition', 'attachment; filename=' + file.filename);
    });

    downloadStream.on('error', (err) => {
      console.error('Error downloading file:', err);
      return res.status(404).json({ msg: 'File not found' });
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error in download middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default fileDownload;
