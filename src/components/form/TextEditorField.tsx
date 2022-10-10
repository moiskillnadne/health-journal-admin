import { useState } from 'react';
import { FormControl, FormHelperText } from '@mui/material';
import { useController, useFormContext } from 'react-hook-form';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw, ContentBlock } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { getBase64 } from '../../utils';
import './TextEditorField.css';

type ToolbarOption = 'inline' | 'list' | 'remove' | 'image' | 'link';

type Props = {
  name: string;
  label?: string;
  toolbarOptions: ToolbarOption[];
};

const ACCEPTED_INPUT_FORMATS = 'image/gif,image/jpeg,image/jpg,image/png,image/svg';

const TextEditorField = (props: Props) => {
  const { name, label, toolbarOptions } = props;

  const { control } = useFormContext();

  const {
    field: { onChange, onBlur, value = '' },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: null,
  });

  const blocksFromHTML = htmlToDraft((value as string) || '') as {
    contentBlocks: ContentBlock[];
    entityMap: any;
  };

  const initialState = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap,
  );

  const [editorState, changeEditorState] = useState(EditorState.createWithContent(initialState));

  const [uploadedImages, changeUploadedImages] = useState<
    {
      localSrc: string;
    }[]
  >([]);

  const uploadCallback = async (file: Blob) => {
    if (ACCEPTED_INPUT_FORMATS.includes(file.type)) {
      const base64File = await getBase64(file);
      const imageObject = {
        localSrc: base64File,
      };

      changeUploadedImages([...uploadedImages, imageObject]);

      return new Promise((resolve, reject) => {
        resolve({ data: { link: imageObject.localSrc } });
      });
    }
  };

  const onChangeEditor = (editorValue: EditorState) => {
    changeEditorState(editorValue);

    const htmlValue: string = draftToHtml(convertToRaw(editorValue.getCurrentContent()));
    onChange(htmlValue);
  };

  const isError = Boolean(error?.message);

  return (
    <FormControl style={{ width: '100%' }} error={isError}>
      {label && (
        <label htmlFor={name} style={{ color: error ? '#d32e30' : '#333333' }}>
          {label}
        </label>
      )}
      <div
        style={{
          border: `1px solid ${error ? '#d32e30' : 'gray'}`,
          borderRadius: '4px',
        }}>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onChangeEditor}
          onBlur={onBlur}
          style={{ width: '100%' }}
          toolbar={{
            options: toolbarOptions,
            inline: {
              options: ['bold', 'italic', 'underline'],
            },
            list: {
              options: ['unordered', 'ordered'],
            },
            link: {
              showOpenOptionOnHover: false,
              options: ['link'],
            },
            image: {
              urlEnabled: false,
              uploadEnabled: true,
              alignmentEnabled: false,
              uploadCallback: uploadCallback,
              previewImage: true,
              inputAccept: ACCEPTED_INPUT_FORMATS,
              alt: { present: false, mandatory: false },
              defaultSize: {
                height: 'auto',
                width: 'auto',
              },
            },
          }}
        />
      </div>
      {error && <FormHelperText error>{error?.message}</FormHelperText>}
    </FormControl>
  );
};

export default TextEditorField;
