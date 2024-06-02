// import { imgurClient } from './../../src/helpers/imgurClient.helper';

// export interface INewImage {
//   title: string;
//   imageId?: string;
//   imageDeleteHash: string;
// }

// const waitForAlbumImages = async (albumId: string) => {
//   let images: INewImage[] = [];
//   const maxAttempts = 30;
//   const delay = 5000;

//   for (let attempt = 0; attempt < maxAttempts; attempt++) {
//     const album = await imgurClient.getAlbum(albumId);
//     let imagesAreReady = true;
//     album.data.images.forEach((i) => {
//       if (!i.title && !i.id && !i.deletehash) {
//         imagesAreReady = false;
//       }
//     });

//     // 142 is the number of images in the album
//     if (imagesAreReady && album.data.images.length === 142) {
//       console.log(`All images are uploaded.`);
//       images = album.data.images.map((i) => ({
//         title: i.title as string,
//         imageId: i.id,
//         imageDeleteHash: i.deletehash as string,
//       }));
//       return images;
//     } else {
//       console.log(`Attempt ${attempt + 1}: ${images ? images.length : 0} images found. Retrying in ${delay / 1000} seconds...`);
//       await new Promise((resolve) => setTimeout(resolve, delay));
//     }
//   }

//   console.log('Timeout reached. Not all images are available.');
//   return images;
// };

// export const uploadImageToImgur = async () => {
//   // get all images from the main album
//   const album = await imgurClient.getAlbum(process.env.IMGUR_ALBUM_ID as string);
//   const albumImages = album.data.images;

//   // delete all images from the main album
//   console.log('deleting all images from the main album');
//   albumImages.forEach(async (image: any) => {
//     await imgurClient.deleteImage(image.deletehash);
//   });

//   // get all images from the backup album
//   const backupAlbum = await imgurClient.getAlbum(process.env.IMGUR_ALBUM_BACKUP_ID as string);
//   const backupAlbumImages = backupAlbum.data.images;

//   // upload all images from the backup album to the main album
//   console.log('uploading all images from the backup album to the main album');

//   const delay = 5000;
//   const numsInOnePatch = 10;
//   const patchCount = Math.ceil(backupAlbumImages.length / numsInOnePatch);
//   for (let i = 0; i < patchCount; i++) {
//     console.log('patch', i + 1, '/', patchCount);
//     for (let j = 0; j < numsInOnePatch; j++) {
//       try {
//         const image = backupAlbumImages[i * numsInOnePatch + j];
//         if (!image) break;
//         const res = await imgurClient.upload({
//           image: image.link,
//           type: 'url',
//           album: process.env.IMGUR_ALBUM_ID,
//           title: image.description as string,
//           description: image.description as string,
//         });
//         console.log(`uploaded image is ${res.success ? 'success' : 'failed'}`, res.data.id, res.data.title, res.data.description);
//       } catch (error) {
//         console.log('upload image error', error);
//       }
//     }
//     await new Promise((resolve) => setTimeout(resolve, delay));
//   }
//   // backupAlbumImages.forEach(async (image: any) => {
//   //   await imgurClient.upload({
//   //     image: image.link,
//   //     type: 'url',
//   //     album: process.env.IMGUR_ALBUM_ID,
//   //     title: image.description,
//   //     description: image.description,
//   //   });
//   // });

//   // const res = await imgurClient.upload({
//   //   image: backupAlbumImages[0].link,
//   //   type: 'url',
//   //   album: album.data.id,
//   //   description: backupAlbumImages[0].description ?? '',
//   // });
//   // console.log(res.data);
//   // return [];

//   return waitForAlbumImages(album.data.id);
// };
