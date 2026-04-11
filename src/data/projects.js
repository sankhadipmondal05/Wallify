// Cloudinary Assets Configuration
const CLOUD_NAME = 'dxvivmhgz';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;
const VERSION = 'v1775882762';

/**
 * High-Fidelity Cloud Asset Mapper
 * Applies dynamic optimization (f_auto, q_auto) to images to solve LCP issues.
 */
const getAssetUrl = (type, filename) => {
  const transformation = type === 'image' ? 'f_auto,q_auto,c_scale,w_600/' : '';
  return `${BASE_URL}/${type}/upload/${transformation}${VERSION}/${filename}`;
};

export const PROJECTS = [
  { 
    id: 1, 
    title: 'Attack on Titan', 
    song: 'Shinzou wo Sasageyao', 
    accent: '終', 
    extra: 'Dedicate your heart to the final battle.', 
    video: getAssetUrl('video', 'AOT.mp4'), 
    image: getAssetUrl('image', 'AOT.jpg') 
  },
  { 
    id: 2, 
    title: 'Blue Box', 
    song: 'High School Romance', 
    accent: '青', 
    extra: 'A high school romance beyond the court.', 
    video: getAssetUrl('video', 'BlueBox.mp4'), 
    image: getAssetUrl('image', 'BlueBox.jpg') 
  },
  { 
    id: 3, 
    title: 'Blue Lock', 
    song: 'The Egoist Path', 
    accent: '獄', 
    extra: 'Unleash the egoist within the grid.', 
    video: getAssetUrl('video', 'BlueLock.mp4'), 
    image: getAssetUrl('image', 'BlueLock.jpg') 
  },
  { 
    id: 4, 
    title: 'Demon Slayer', 
    song: 'Gurenge', 
    accent: '鬼', 
    extra: 'Master the breath of the sun.', 
    video: getAssetUrl('video', 'DemonSlayer.mp4'), 
    image: getAssetUrl('image', 'DemonSlayer.jpg') 
  },
  { 
    id: 5, 
    title: 'Dragon Ball Z', 
    song: 'Cha-La Head-Cha-La', 
    accent: '龍', 
    extra: 'Surpass the limits of a Super Saiyan.', 
    video: getAssetUrl('video', 'DragonBallZ.mp4'), 
    image: getAssetUrl('image', 'Dragon_Ball_Z.jpg') 
  },
  { 
    id: 6, 
    title: 'Jujutsu Kaisen', 
    song: 'Specialz', 
    accent: '呪', 
    extra: 'Domain expansion: Infinite Void.', 
    video: getAssetUrl('video', 'JJK.mp4'), 
    image: getAssetUrl('image', 'JUJUTSU_KAISEN_jmyx8g.jpg') 
  },
  { 
    id: 7, 
    title: 'Naruto', 
    song: 'Silhouette', 
    accent: '忍', 
    extra: 'Believe in your own ninja way.', 
    video: getAssetUrl('video', 'Naruto.mp4'), 
    image: getAssetUrl('image', 'Naruto.jpg') 
  },
  { 
    id: 8, 
    title: 'One Piece', 
    song: 'The Drums of Liberation', 
    accent: '海', 
    extra: 'Seek the freedom of the pirate king.', 
    video: getAssetUrl('video', 'OnePiece.mp4'), 
    image: getAssetUrl('image', 'OnePiece.jpg') 
  },
  { 
    id: 9, 
    title: 'Solo Leveling', 
    song: 'Dark Aria', 
    accent: '影', 
    extra: 'Arise from the shadows of the dungeon.', 
    video: getAssetUrl('video', 'SL-Main.mp4'), 
    image: getAssetUrl('image', 'SoloLeveling.jpg') 
  },
  { 
    id: 10, 
    title: 'Wistoria', 
    song: 'Wand & Sword', 
    accent: '杖', 
    extra: 'Where magic meets the edge of the blade.', 
    video: getAssetUrl('video', 'Wistoria.mp4'), 
    image: getAssetUrl('image', 'Wistoria.jpg') 
  }
];


