import { FC, SyntheticEvent } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface IInputNumberInputProps {
  value: number;
  onMinus: () => void;
  onAdd: () => void;
}
export const NumberInput: FC<IInputNumberInputProps> = (props) => {
  const { value, onMinus, onAdd } = props;

  const handleStopPropagation = (e: SyntheticEvent<Element, Event>) => {
    e.stopPropagation();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid ',
        borderColor: 'common.black_40',
        borderRadius: '.5rem',
        bgcolor: 'common.white',
        userSelect: 'none',
      }}
      onClick={handleStopPropagation}
    >
      <Button
        sx={{
          '&.MuiButtonBase-root': {
            bgcolor: 'transparent',
            color: 'common.black',
            outline: 'none',
          },
        }}
        disableRipple
        onClick={() => onMinus()}
      >
        <RemoveIcon />
      </Button>
      <Typography variant='h6' fontWeight={900} sx={{ minWidth: '2rem', textAlign: 'center' }}>
        {value}
      </Typography>
      <Button
        sx={{
          '&.MuiButtonBase-root': {
            bgcolor: 'transparent',
            color: 'common.black',
            outline: 'none',
          },
        }}
        disableRipple
        onClick={() => onAdd()}
      >
        <AddIcon />
      </Button>
    </Box>
  );
};
