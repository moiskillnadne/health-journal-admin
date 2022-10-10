export type TFile = {
  bucketKey: string;
  bucketName: string;
  contentType: 'image' | 'videos';
  fileName: string;
  format: string;
  id: string;
  isPosted: boolean;
  location: string;
  size: number;
};
