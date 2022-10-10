import { Routes, Route, Navigate } from 'react-router-dom';
import AddArticle from './AddArticle';
import AddRecipe from './AddRecipe';
import AddVideo from './AddVideo';
import Articles from './Articles';
import Layout from './components/Layout';
import FoodsIsMedicine from './FoodsIsMedicine';
import Gallery from './Gallery';
import Recipes from './Recipes';
import SearchResults from './SearchResults';
import Videos from './Videos';

export default function () {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Gallery />} />
        <Route path="videos" element={<Videos typeVideo="regular" />} />
        <Route path="articles" element={<Articles />} />
        <Route path="food-is-medicine" element={<FoodsIsMedicine />} />
        <Route path="food-is-medicine/recipes" element={<Recipes />} />
        <Route path="food-is-medicine/all-things-food" element={<Videos typeVideo="food" />} />
        <Route path="search-results" element={<SearchResults />} />
      </Route>

      <Route path="videos/add-video" element={<AddVideo typeVideo="regular" />} />
      <Route path="articles/add-article" element={<AddArticle />} />
      <Route path="food-is-medicine/recipes/add-recipe" element={<AddRecipe />} />
      <Route
        path="food-is-medicine/all-things-food/add-food-video"
        element={<AddVideo typeVideo="food" />}
      />
      <Route path="food-is-medicine/recipes/edit-recipe" element={<AddRecipe />} />
      <Route path="videos/edit-video" element={<AddVideo typeVideo="regular" />} />
      <Route path="articles/edit-article" element={<AddArticle />} />
      <Route
        path="food-is-medicine/all-things-food/edit-food-video"
        element={<AddVideo typeVideo="food" />}
      />
    </Routes>
  );
}
