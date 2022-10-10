import { object, string, array, boolean } from 'yup';

const SearchSchema = object({
  search: string(),
  type: string(),
  isPosted: boolean(),
});

export default SearchSchema;
