import { ChangeEvent, FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Chip, IconButton, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import ReorderIcon from '@mui/icons-material/Reorder';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { BaseSwitch, StyledTableCell, StyledTableRow, TextInput, TextareaInput, UploadButton } from '~/components';
import { ICategory, IMeal, IMealWithCategoryAndSpecialtyItems, ISpecialtyItem } from '~/types';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { getMeals, openDeleteMealConfirmModal, patchMeal } from '~/store/slices';
import { theme } from '~/theme';
import { MEAL_IMAGE_FORMAT_REMINDER, MEAL_IMAGE_SIZE_LIMIT, MEAL_IMAGE_TYPES, IMAGE_URL } from '~/utils';

interface IMealRowProps {
  meal: IMealWithCategoryAndSpecialtyItems;
}

export const MealRow: FC<IMealRowProps> = (props) => {
  const { meal } = props;

  const dispatch = useAppDispatch();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: meal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const categories = useAppSelector((state) => state.menuManagement.categories);
  const meals = useAppSelector((state) => state.menuManagement.meals);
  const specialties = useAppSelector((state) => state.menuManagement.specialties);
  const allSpecialtyItems = specialties.flatMap((s) => s.specialtyItems);

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newCategoryId, setNewCategoryId] = useState<ICategory['id']>(meal.categoryId);
  const [newTitle, setNewTitle] = useState<IMeal['title']>(meal.title);
  const [newPrice, setNewPrice] = useState<IMeal['price']>(meal.price);
  const [newImage, setNewImage] = useState<File>();
  const [newPreviewImage, setNewPreviewImage] = useState<string>(`${IMAGE_URL}${meal.imageId}m.jpg`);
  const [newDescription, setNewDescription] = useState<IMeal['description']>(meal.description);
  const [newSpecialtyItems, setNewSpecialtyItems] = useState<ISpecialtyItem[]>(meal.specialtyItems);
  const [newIsPopular, setNewIsPopular] = useState<IMeal['isPopular']>(meal.isPopular);
  const [newPublishedAt, setNewPublisedAt] = useState<IMeal['publishedAt']>(meal.publishedAt);

  const isIncompleteInfo = !newTitle;
  const hasSameMealNameExist = meals.some((m) => m.title === newTitle && m.id !== meal.id);
  const isInvalid = isIncompleteInfo || hasSameMealNameExist || isUpdateLoading;

  useEffect(() => {
    setNewCategoryId(meal.categoryId);
    setNewTitle(meal.title);
    setNewPrice(meal.price);
    setNewPreviewImage(`${IMAGE_URL}${meal.imageId}m.jpg`);
    setNewDescription(meal.description);
    setNewSpecialtyItems(meal.specialtyItems);
    setNewIsPopular(meal.isPopular);
    setNewPublisedAt(meal.publishedAt);
  }, [meal]);

  const handleChangeCategory = (e: SelectChangeEvent<ICategory['id']>) => {
    const selectedCategoryId = e.target.value;
    setNewCategoryId(selectedCategoryId);
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewTitle(e.target.value);
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    const imageFile = selectedFiles?.[0];
    if (imageFile && (imageFile.size > MEAL_IMAGE_SIZE_LIMIT || !MEAL_IMAGE_TYPES.includes(imageFile.type))) {
      return;
    }

    if (imageFile) {
      setNewImage(imageFile);
      setNewPreviewImage(URL.createObjectURL(imageFile));
    }
  };

  const handleChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value);

    if (!/[\d]/.test(`${newPrice}`)) return;

    setNewPrice((prevPrice) => (newPrice < 0 ? prevPrice : newPrice));
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewDescription(e.target.value);
  };

  const handleChangeSpecialtyItems = (e: SelectChangeEvent<ISpecialtyItem['id'][]>) => {
    const value = e.target.value;
    const selectedSpecialtyItemsId = typeof value === 'string' ? value.split(',') : value;
    setNewSpecialtyItems(allSpecialtyItems.filter((si) => selectedSpecialtyItemsId.includes(si.id)));
  };

  const handleChangeIsPopluar = () => {
    setNewIsPopular((prevIsPopular) => !prevIsPopular);
  };

  const handleChangeIsPublished = () => {
    setNewPublisedAt((prevPublishedAt) => (prevPublishedAt ? null : new Date()));
  };

  const handleEditMeal = () => {
    setIsEdit(true);
  };

  const handleOpenDeleteMealConfirmModal = () => {
    dispatch(openDeleteMealConfirmModal(meal));
  };

  const handleCancelEdit = () => {
    setNewCategoryId(meal.categoryId);
    setNewTitle(meal.title);
    setNewPrice(meal.price);
    setNewImage(undefined);
    setNewPreviewImage(`${IMAGE_URL}${meal.imageId}m.jpg`);
    setNewDescription(meal.description);
    setNewSpecialtyItems(meal.specialtyItems);
    setNewIsPopular(meal.isPopular);
    setNewPublisedAt(meal.publishedAt);
    setIsEdit(false);
  };

  const handleConfirmEdit = () => {
    if (isInvalid) return;

    setIsUpdateLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(
            patchMeal({
              categoryId: newCategoryId,
              id: meal.id,
              title: newTitle,
              image: newImage,
              imageId: meal.imageId,
              imageDeleteHash: meal.imageDeleteHash,
              price: newPrice,
              description: newDescription,
              isPopular: newIsPopular,
              publishedAt: newPublishedAt,
              specialtyItems: newSpecialtyItems.map((si) => si.id),
            }),
          ).unwrap();
          await dispatch(getMeals());
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
      <StyledTableCell padding='checkbox' {...attributes} {...listeners}>
        <IconButton size='small'>
          <ReorderIcon />
        </IconButton>
      </StyledTableCell>
      <StyledTableCell width={120}>
        {isEdit ? (
          <Box>
            <TextareaInput value={newTitle} sx={{ width: '100%' }} onChange={handleChangeTitle} />
            <Select size='small' value={newCategoryId} onChange={handleChangeCategory}>
              {categories.map((c) => (
                <MenuItem
                  key={c.id}
                  value={c.id}
                  sx={{ '&.Mui-selected': { bgcolor: theme.palette.primary.light, '&:hover': { bgcolor: theme.palette.primary.light } } }}
                >
                  {c.title}
                </MenuItem>
              ))}
            </Select>
          </Box>
        ) : (
          newTitle
        )}
      </StyledTableCell>
      <StyledTableCell width={100}>
        {isEdit ? (
          <Box width={'100%'}>
            <Box component='img' width={100} height={100} sx={{ objectFit: 'cover' }} src={newPreviewImage} alt={newTitle} />
            <UploadButton
              btn={{ sx: { width: '100%' } }}
              input={{ onChange: handleChangeImage, inputProps: { accept: MEAL_IMAGE_TYPES.join(',') } }}
            />
            <Typography variant='caption' color='error' fontSize={12}>
              {MEAL_IMAGE_FORMAT_REMINDER}
            </Typography>
          </Box>
        ) : (
          <Box component='img' width={100} height={100} sx={{ objectFit: 'cover' }} src={newPreviewImage} alt={newTitle} />
        )}
      </StyledTableCell>
      <StyledTableCell width={100}>
        {isEdit ? <TextInput type='number' size='small' value={newPrice.toString()} onChange={handleChangePrice} /> : newPrice}
      </StyledTableCell>
      <StyledTableCell width={200}>
        {isEdit ? <TextareaInput value={newDescription} sx={{ width: '100%' }} onChange={handleChangeDescription} /> : newDescription}
      </StyledTableCell>
      <StyledTableCell width={250}>
        <Box>
          {isEdit ? (
            <Select
              multiple
              size='small'
              value={newSpecialtyItems.map((si) => si.id)}
              onChange={handleChangeSpecialtyItems}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const si = newSpecialtyItems.find((si) => si.id === value);
                    return <Chip key={value} label={si?.title} variant='filled' size='small' />;
                  })}
                </Box>
              )}
            >
              {allSpecialtyItems.map((si) => (
                <MenuItem
                  key={si.id}
                  value={si.id}
                  sx={{ '&.Mui-selected': { bgcolor: theme.palette.primary.light, '&:hover': { bgcolor: theme.palette.primary.light } } }}
                >
                  {si.title}
                </MenuItem>
              ))}
            </Select>
          ) : (
            newSpecialtyItems.map((si) => {
              return <Chip key={si.id} label={si.title} variant='filled' size='small' />;
            })
          )}
        </Box>
      </StyledTableCell>
      <StyledTableCell padding='checkbox'>
        <BaseSwitch checked={newIsPopular} disabled={!isEdit} onChange={handleChangeIsPopluar} />
      </StyledTableCell>
      <StyledTableCell padding='checkbox'>
        <BaseSwitch checked={!!newPublishedAt} disabled={!isEdit} onChange={handleChangeIsPublished} />
      </StyledTableCell>
      <StyledTableCell padding='checkbox'>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isEdit ? (
            <>
              <IconButton size='small' onClick={handleConfirmEdit}>
                <CheckIcon color={isInvalid ? 'disabled' : 'success'} />
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
              <IconButton size='small' onClick={handleOpenDeleteMealConfirmModal}>
                <PlaylistRemoveIcon />
              </IconButton>
            </>
          )}
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
};
