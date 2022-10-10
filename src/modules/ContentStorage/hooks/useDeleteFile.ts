import { useConfirmDialog, useWarningDialog } from '@app/hooks';
import { useDeleteFileMutation } from '.';
import { TFile } from '../types';

type Props = {
  files: TFile[];
  callback: () => void;
};

export const useDeleteFile = ({ files, callback }: Props) => {
  const [deleteFile, { isLoading }] = useDeleteFileMutation();

  const openConfirmDialog = useConfirmDialog();
  const openWarningDialog = useWarningDialog();

  const onDeleteFile = (ids: string[]) => {
    const postedIds = ids.filter(id => files.find(file => file.id === id)?.isPosted);

    const postedNames = postedIds.map(id => files.find(file => file.id === id)?.fileName);

    if (postedIds.length) {
      openWarningDialog({
        title: `You cannot delete ${
          postedNames.length !== 1 ? 'these source files are' : 'the source file since they it is'
        }  used as content item(s):
         ${postedNames.join(', ')}.`,
      });
    } else {
      openConfirmDialog({
        title: `The ${ids.length} file${
          ids.length === 1 ? '' : 's'
        } will be deleted from the storage and the server?`,
        onConfirm: () => {
          deleteFile({ ids: Array.isArray(ids) ? ids : [ids as string] })
            .unwrap()
            .then(() => callback());
        },
      });
    }
  };

  return onDeleteFile;
};
export default useDeleteFile;
