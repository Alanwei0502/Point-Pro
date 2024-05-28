import { FC, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ReorderIcon from '@mui/icons-material/Reorder';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { StyledTableCell, StyledTableRow, TextInput } from '~/components';
import { ISpecialtyItem } from '~/types';

interface ISpecialtyItemRowProps {
  specialtyItem: ISpecialtyItem & { specialtyId: string };
}
export const SpecialtyItemRow: FC<ISpecialtyItemRowProps> = (props) => {
  const { specialtyItem } = props;

  const [isEdit, setIsEdit] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: specialtyItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChangeSpecialtyItemTitle = () => {};

  const handleChangeSpecialtyItemPrice = () => {};

  const handleEditSpecialtyItem = () => {};

  const handleDeleteSpecialtyItem = () => {};

  const handleConfirmEdit = () => {};

  const handleCancelEdit = () => {};

  return (
    <StyledTableRow ref={setNodeRef} style={style}>
      <StyledTableCell></StyledTableCell>
      <StyledTableCell padding='checkbox' {...attributes} {...listeners}>
        <IconButton size='small'>
          <ReorderIcon />
        </IconButton>
      </StyledTableCell>
      <StyledTableCell sx={{ width: 180 }}>
        {isEdit ? <TextInput value={specialtyItem.title} onChange={handleChangeSpecialtyItemTitle} /> : specialtyItem.title}
      </StyledTableCell>
      <StyledTableCell sx={{ width: 205 }}>
        {isEdit ? <TextInput type='number' value={specialtyItem.price.toString()} onChange={handleChangeSpecialtyItemPrice} /> : specialtyItem.price}
      </StyledTableCell>
      <StyledTableCell padding='checkbox'>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isEdit ? (
            <>
              <IconButton size='small' onClick={handleConfirmEdit}>
                <CheckIcon color='success' />
              </IconButton>
              <IconButton size='small' onClick={handleCancelEdit}>
                <CloseIcon color='error' />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton size='small' onClick={handleEditSpecialtyItem}>
                <EditIcon />
              </IconButton>
              <IconButton size='small' onClick={handleDeleteSpecialtyItem}>
                <PlaylistRemoveIcon />
              </IconButton>
            </>
          )}
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
};
