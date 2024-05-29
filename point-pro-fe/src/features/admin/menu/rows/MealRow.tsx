import { ChangeEvent, FC, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Chip, IconButton, MenuItem, Select } from '@mui/material';
import ReorderIcon from '@mui/icons-material/Reorder';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { BaseSwitch, StyledTableCell, StyledTableRow, TextInput, TextareaInput } from '~/components';
import { IMealWithCategoryAndSpecialtyItems, ISpecialtyItem } from '~/types';
import { useAppSelector } from '~/hooks';

interface IMealRowProps {
  meal: IMealWithCategoryAndSpecialtyItems;
}

export const MealRow: FC<IMealRowProps> = (props) => {
  const { meal } = props;

  const [updateMeal, setUpdateMeal] = useState(meal);
  const [isEdit, setIsEdit] = useState(false);

  const specialties = useAppSelector((state) => state.menu.specialties);
  const specialtyItems = specialties.flatMap((s) => s.specialtyItems);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: meal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUpdateMeal({
      ...updateMeal,
      title: e.target.value,
    });
  };

  const handleChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdateMeal({
      ...updateMeal,
      price: +e.target.value,
    });
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUpdateMeal({
      ...updateMeal,
      description: e.target.value,
    });
  };

  const handleChangeSpecialtyItems = () => {};

  const handleChangeIsPopluar = () => {
    setUpdateMeal((prev) => ({
      ...prev,
      isPopular: !prev.isPopular,
    }));
  };

  const handleChangeIsPublished = () => {
    setUpdateMeal((prev) => ({
      ...prev,
      publishedAt: prev.publishedAt ? null : new Date(),
    }));
  };

  const handleEditMeal = () => {
    setIsEdit(true);
  };

  const handleRemoveMealFromCategory = () => {
    // TODO
  };

  const handleConfirmEdit = () => {
    setIsEdit(false);
  };

  const handleCancelEdit = () => {
    setUpdateMeal(meal);
    setIsEdit(false);
  };

  return (
    <StyledTableRow ref={setNodeRef} style={style}>
      <StyledTableCell padding='checkbox' {...attributes} {...listeners}>
        <IconButton size='small'>
          <ReorderIcon />
        </IconButton>
      </StyledTableCell>
      <StyledTableCell>
        {isEdit ? <TextareaInput value={updateMeal.title} sx={{ width: 100 }} onChange={handleChangeTitle} /> : updateMeal.title}
      </StyledTableCell>
      <StyledTableCell>
        {/* TODO: update coverUrl */}
        <Box component='img' src={updateMeal.coverUrl.split('.jpeg')[0] + 's.jpeg'} alt={updateMeal.title} />
      </StyledTableCell>
      <StyledTableCell sx={{ whiteSpace: 'nowrap' }}>
        {isEdit ? <TextInput type='number' value={updateMeal.price.toString()} onChange={handleChangePrice} /> : updateMeal.price}
      </StyledTableCell>
      <StyledTableCell>
        {isEdit ? <TextareaInput value={updateMeal.description} sx={{ width: 100 }} onChange={handleChangeDescription} /> : updateMeal.description}
      </StyledTableCell>
      <StyledTableCell>
        <Box onClick={handleChangeSpecialtyItems}>
          {isEdit ? (
            <Select
              multiple
              value={updateMeal.specialtyItems.map((si) => si.id)}
              sx={{ maxWidth: 250 }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const si = specialtyItems.find((si) => si.id === value);
                    return <Chip key={value} label={si?.title} variant='outlined' size='small' />;
                  })}
                </Box>
              )}
            >
              {specialtyItems.map((si) => (
                <MenuItem key={si.id} value={si.id}>
                  {si.title}
                </MenuItem>
              ))}
            </Select>
          ) : (
            updateMeal.specialtyItems.map((si) => {
              return <Chip key={si.id} label={si.title} variant='outlined' size='small' />;
            })
          )}
        </Box>
      </StyledTableCell>
      <StyledTableCell>
        <BaseSwitch checked={updateMeal.isPopular} disabled={!isEdit} onChange={handleChangeIsPopluar} />
      </StyledTableCell>
      <StyledTableCell>
        <BaseSwitch checked={!!updateMeal.publishedAt} disabled={!isEdit} onChange={handleChangeIsPublished} />
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
              <IconButton size='small' onClick={handleEditMeal}>
                <EditIcon />
              </IconButton>
              <IconButton size='small' onClick={handleRemoveMealFromCategory}>
                <PlaylistRemoveIcon />
              </IconButton>
            </>
          )}
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
};
