import {PhotoGallery, Album} from 'react-native-photo-gallery-api';

export class AlbumOper {
  static async getAlbums() {
    PhotoGallery.getAlbums().then(albums => {
      console.log(albums);
    });
  }

  static async getCourseAlbumCount() {
    const albums = await PhotoGallery.getAlbums({assetType: 'Photos'});
    let count = 0;
    albums.some(album => {
      if (album.title === 'CourseApp') {
        count = album.count;
        return true;
      }
    });
    return count;
  }

  static async getPhotoOfAlbum(album: string, idx: number, count: number) {
    const photos = await PhotoGallery.getPhotos({
      groupTypes: 'Album',
      groupName: album,
      first: count,
    });
    if (photos.edges.length) {
      const photo = await PhotoGallery.iosGetImageDataById(
        photos.edges[idx].node.image.uri,
        true,
      );
      // console.log('iterak', photo);
      return photo.node.image.filepath;
    }
    return null;
  }
}
