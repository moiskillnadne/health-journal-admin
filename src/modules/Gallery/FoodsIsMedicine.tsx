import { Box } from '@mui/material';
import FoldersView from './components/FoldersView';

const FoodsIsMedicine = () => {
  const folders = [
    { title: 'All Things Food', to: 'all-things-food' },
    { title: 'Recipes', to: 'recipes' },
  ];

  return <FoldersView folders={folders} />;
};
export default FoodsIsMedicine;
