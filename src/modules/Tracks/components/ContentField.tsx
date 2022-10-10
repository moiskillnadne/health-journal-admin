/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { useMemo, useState, useCallback, useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import AutocompleteInput from '@app/components/AutocompleteInput';
import { useInfiniteScroll } from '@app/hooks';
import { useFetchSearchGalleryOptionsQuery } from '../hooks';
import { TMedication } from '@app/types';

type Props = {
  type: 'video' | 'article' | 'recipe';
  name: string;
  label?: string;
  defaultValue?: unknown;
  placeholder?: string;
};

const ContentField = ({ name, label, defaultValue, placeholder, type }: Props) => {
  const [searchText, setSearchText] = useState('');

  const { data, isLoading, refetch } = useFetchSearchGalleryOptionsQuery({
    type,
    search: searchText,
  });

  const { control } = useFormContext();

  useEffect(() => {
    refetch();
  }, []);

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
      value={value || null}
      options={data || []}
      onChange={onChange}
      onBlur={onBlur}
      onSearch={setSearchText}
      isLoading={isLoading}
      placeholder={placeholder}
      error={error?.message}
    />
  );
};

export default ContentField;
