/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import AutocompleteInput from '@app/components/AutocompleteInput';
import { useInfiniteScroll } from '@app/hooks';
import { useFetchMedicationsQuery } from '../hooks';
import { TMedication } from '@app/types';

type Props = {
  type?: 'video' | 'image';
  name: string;
  label?: string;
  defaultValue?: unknown;
  placeholder?: string;
};

const MedicationsField = ({ name, label, defaultValue, placeholder }: Props) => {
  const [searchText, setSearchText] = useState('a');

  const { isFetching, loadMore, data, refresh } = useInfiniteScroll(useFetchMedicationsQuery, {
    take: 50,
    name: searchText,
  });

  function search(text: string) {
    setSearchText(text);
    refresh();
  }

  const { control } = useFormContext();

  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  return (
    <AutocompleteInput
      label={label}
      name={name}
      multiple
      value={value}
      options={data}
      loadMore={loadMore}
      onChange={onChange}
      onBlur={onBlur}
      onSearch={search}
      isLoading={isFetching}
      placeholder={placeholder}
      error={error?.message}
    />
  );
};

export default MedicationsField;
