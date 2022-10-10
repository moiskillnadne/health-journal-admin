import { useForm, UseFormProps } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { AnyObjectSchema } from 'yup';

type HookProps = {
  schema: AnyObjectSchema;
};

function useAppForm<TFieldValues>(props: UseFormProps<TFieldValues>, { schema }: HookProps) {
  return useForm({
    ...props,
    resolver: yupResolver(schema),
  });
}

export default useAppForm;
