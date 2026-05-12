import * as path from 'path';
import { v4 as uuid4 } from 'uuid';

export const generateFileName = (file: Express.Multer.File) => {
  // Extract file name
  let name = file.originalname.split('.')[0];
  // Remove white spaces
  name.replace(/\s/g, '').trim();
  // Extract the extension
  let extension = path.extname(file.originalname);
  // Generate time stamp
  let timeStamp = new Date().getTime().toString().trim();
  // Return file uuid
  return `${name}-${timeStamp}-${uuid4()}`;
};
