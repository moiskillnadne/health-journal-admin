export type FilterUsers = {
  page: string | number;
  take: string | number;
  order: {
    field: string;
    sort: string;
  };
};
