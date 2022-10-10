import { Box } from '@mui/material';
import FoldersView from './components/FoldersView';

const Gallery = () => {
  const folders = [
    { title: 'Videos', to: 'videos' },
    { title: 'Articles', to: 'articles' },
    { title: 'Food is Medicine', to: 'food-is-medicine' },
  ];

  return <FoldersView folders={folders} />;
};
export default Gallery;
