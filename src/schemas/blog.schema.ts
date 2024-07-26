import * as mongoose from 'mongoose';

export const BlogSchema = new mongoose.Schema({
    title: {
      type: String,
      require: true,
      maxLength: 150
    },
    body: {
      type: String,
      require: true,
      maxLength: 2000
    },
    createdBy: {
      type: String,
      require: true
    },
    userId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "User"
    }
  }, {timestamps: true});
  