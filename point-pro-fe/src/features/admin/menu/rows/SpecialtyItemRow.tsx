import { ChangeEvent, FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Box, IconButton, Typography } from '@mui/material';
import ReorderIcon from '@mui/icons-material/Reorder';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { StyledTableCell, StyledTableRow, TextInput } from '~/components';
import { ISpecialty, ISpecialtyItem, ISpecialtyWithSpecialtyItems } from '~/types';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { getSpecialties, openDeleteSpecialtyItemConfirmModal, patchSpecialtyItem } from '~/store/slices';

interface ISpecialtyItemRowProps {
  specialtyItem: ISpecialtyWithSpecialtyItems['specialtyItems'][0];
}
export const SpecialtyItemRow: FC<ISpecialtyItemRowProps> = (props) => {
  const { specialtyItem } = props;

  const dispatch = useAppDispatch();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: specialtyItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const specialties = useAppSelector((state) => state.menuSetting.specialties);
  const specialtyItems = specialties.find((s) => s.id === specialtyItem.specialtyId)?.specialtyItems ?? [];

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState<ISpecialty['title']>(specialtyItem.title);
  const [newPrice, setNewPrice] = useState<ISpecialtyItem['price']>(specialtyItem.price);

  const isNotChanged = newTitle === specialtyItem.title && newPrice === specialtyItem.price;
  const isSpecialtyItemExist = specialtyItems.some((si) => si.title === newTitle && si.id !== specialtyItem.id);
  const isIncompleteInfo = !newTitle || isNaN(newPrice);
  const isInvalid = isNotChanged || isSpecialtyItemExist || isIncompleteInfo || isUpdateLoading;

  useEffect(() => {
    setNewTitle(specialtyItem.title);
    setNewPrice(specialtyItem.price);
  }, [specialtyItem]);

  const handleEditSpecialtyItem = () => {
    setIsEdit(true);
  };

  const handleChangeSpecialtyItemTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleChangeSpecialtyItemPrice = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPrice(Number(e.target.value));
  };

  const handleOpenDeleteSpecialtyItemConfirmModal = () => {
    dispatch(openDeleteSpecialtyItemConfirmModal(specialtyItem));
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
    setNewTitle(specialtyItem.title);
    setNewPrice(specialtyItem.price);
  };

  const handleConfirmEdit = () => {
    if (isInvalid) return;

    setIsUpdateLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(
            patchSpecialtyItem({
              id: specialtyItem.id,
              title: newTitle,
              price: newPrice,
            }),
          ).unwrap();
          await dispatch(getSpecialties());
        },
        {
          pending: '更新中...',
          success: '更新成功',
          error: '更新失敗',
        },
      )
      .finally(() => {
        setIsEdit(false);
        setIsUpdateLoading(false);
      });
  };

  return (
    <StyledTableRow ref={setNodeRef} style={style}>
      <StyledTableCell></StyledTableCell>
      <StyledTableCell padding='checkbox' {...attributes} {...listeners}>
        <IconButton size='small'>
          <ReorderIcon />
        </IconButton>
      </StyledTableCell>
      <StyledTableCell sx={{ width: 180 }}>
        {isEdit ? (
          <>
            <TextInput autoFocus value={newTitle} onChange={handleChangeSpecialtyItemTitle} />
            {isSpecialtyItemExist && (
              <Typography variant='small' color='error'>
                已有相同的項目
              </Typography>
            )}
          </>
        ) : (
          newTitle
        )}
      </StyledTableCell>
      <StyledTableCell sx={{ width: 205 }}>
        {isEdit ? <TextInput type='number' value={newPrice.toString()} onChange={handleChangeSpecialtyItemPrice} /> : newPrice}
      </StyledTableCell>
      <StyledTableCell padding='checkbox'>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isEdit ? (
            <>
              <IconButton size='small' onClick={handleConfirmEdit} disabled={isInvalid}>
                <CheckIcon color={isInvalid ? 'disabled' : 'success'} />
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
              <IconButton size='small' onClick={handleOpenDeleteSpecialtyItemConfirmModal}>
                <PlaylistRemoveIcon />
              </IconButton>
            </>
          )}
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
};
