import { Button, ButtonTypeMap, Input, InputProps } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FC } from 'react';

interface IUploadButtonProps {
  btn?: ButtonTypeMap['props'];
  input: InputProps;
}

export const UploadButton: FC<IUploadButtonProps> = (props) => {
  const { btn, input } = props;
  const { children = '上傳', sx, ...rest } = btn ?? {};
  return (
    <Button component='label' role={undefined} variant='contained' startIcon={<CloudUploadIcon />} sx={{ fontSize: 14, ...sx }} {...rest}>
      {children}
      <Input
        type='file'
        sx={{
          clip: 'rect(0 0 0 0)',
          clipPath: 'inset(50%)',
          height: 1,
          overflow: 'hidden',
          position: 'absolute',
          bottom: 0,
          left: 0,
          whiteSpace: 'nowrap',
          width: 1,
        }}
        {...input}
      />
    </Button>
  );
};
