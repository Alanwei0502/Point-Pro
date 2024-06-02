import { ChangeEvent, FC, useState } from 'react';
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
import { MEAL_IMAGE_FORMAT_REMINDER, MEAL_IMAGE_SIZE_LIMIT, MEAL_IMAGE_TYPES, MEAL_IMAGE_URL } from '~/utils';

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

  const categories = useAppSelector((state) => state.menuSetting.categories);
  const meals = useAppSelector((state) => state.menuSetting.meals);
  const specialties = useAppSelector((state) => state.menuSetting.specialties);
  const allSpecialtyItems = specialties.flatMap((s) => s.specialtyItems);

  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState<ICategory['id']>(meal.categoryId);
  const [title, setTitle] = useState<IMeal['title']>(meal.title);
  const [price, setPrice] = useState<IMeal['price']>(meal.price);
  const [image, setImage] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>(`${MEAL_IMAGE_URL}${meal.imageId}m.jpg`);
  const [description, setDescription] = useState<IMeal['description']>(meal.description);
  const [specialtyItems, setSpecialtyItems] = useState<ISpecialtyItem[]>(meal.specialtyItems);
  const [isPopular, setIsPopular] = useState<IMeal['isPopular']>(meal.isPopular);
  const [publishedAt, setPublisedAt] = useState<IMeal['publishedAt']>(meal.publishedAt);

  const isIncompleteInfo = !title;
  const hasSameMealNameExist = meals.some((m) => m.title === title && m.id !== meal.id);

  const isInvalid = isIncompleteInfo || hasSameMealNameExist;

  const handleChangeCategory = (e: SelectChangeEvent<ICategory['id']>) => {
    const selectedCategoryId = e.target.value;
    setCategoryId(selectedCategoryId);
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    const imageFile = selectedFiles?.[0];
    if (imageFile && (imageFile.size > MEAL_IMAGE_SIZE_LIMIT || !MEAL_IMAGE_TYPES.includes(imageFile.type))) {
      return;
    }

    if (imageFile) {
      setImage(imageFile);
      setPreviewImage(URL.createObjectURL(imageFile));
    }
  };

  const handleChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value);

    if (!/[\d]/.test(`${newPrice}`)) return;

    setPrice((prevPrice) => (newPrice < 0 ? prevPrice : newPrice));
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleChangeSpecialtyItems = (e: SelectChangeEvent<ISpecialtyItem['id'][]>) => {
    const value = e.target.value;
    const selectedSpecialtyItemsId = typeof value === 'string' ? value.split(',') : value;
    setSpecialtyItems(allSpecialtyItems.filter((si) => selectedSpecialtyItemsId.includes(si.id)));
  };

  const handleChangeIsPopluar = () => {
    setIsPopular((prevIsPopular) => !prevIsPopular);
  };

  const handleChangeIsPublished = () => {
    setPublisedAt((prevPublishedAt) => (prevPublishedAt ? null : new Date()));
  };

  const handleEditMeal = () => {
    setIsEdit(true);
  };

  const handleOpenDeleteMealConfirmModal = () => {
    dispatch(openDeleteMealConfirmModal(meal));
  };

  const handleCancelEdit = () => {
    setCategoryId(meal.categoryId);
    setTitle(meal.title);
    setPrice(meal.price);
    setImage(undefined);
    setPreviewImage(`${MEAL_IMAGE_URL}${meal.imageId}m.jpg`);
    setDescription(meal.description);
    setSpecialtyItems(meal.specialtyItems);
    setIsPopular(meal.isPopular);
    setPublisedAt(meal.publishedAt);
    setIsEdit(false);
  };

  const handleConfirmEdit = () => {
    if (isInvalid) return;

    dispatch(
      patchMeal({
        categoryId,
        id: meal.id,
        title,
        image,
        imageId: meal.imageId,
        imageDeleteHash: meal.imageDeleteHash,
        price,
        description,
        isPopular,
        publishedAt,
        specialtyItems: specialtyItems.map((si) => si.id),
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(getMeals());
        setIsEdit(false);
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
            <TextareaInput value={title} sx={{ width: '100%' }} onChange={handleChangeTitle} />
            <Select size='small' value={categoryId} onChange={handleChangeCategory}>
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
          title
        )}
      </StyledTableCell>
      <StyledTableCell width={100}>
        {isEdit ? (
          <Box width={'100%'}>
            <Box component='img' width={100} height={100} sx={{ objectFit: 'cover' }} src={previewImage} alt={title} />
            <UploadButton
              btn={{ sx: { width: '100%' } }}
              input={{ onChange: handleChangeImage, inputProps: { accept: MEAL_IMAGE_TYPES.join(',') } }}
            />
            <Typography variant='caption' color='error' fontSize={12}>
              {MEAL_IMAGE_FORMAT_REMINDER}
            </Typography>
          </Box>
        ) : (
          <Box component='img' width={100} height={100} sx={{ objectFit: 'cover' }} src={previewImage} alt={title} />
        )}
      </StyledTableCell>
      <StyledTableCell width={100}>
        {isEdit ? <TextInput type='number' size='small' value={price.toString()} onChange={handleChangePrice} /> : price}
      </StyledTableCell>
      <StyledTableCell width={200}>
        {isEdit ? <TextareaInput value={description} sx={{ width: '100%' }} onChange={handleChangeDescription} /> : description}
      </StyledTableCell>
      <StyledTableCell width={250}>
        <Box>
          {isEdit ? (
            <Select
              multiple
              size='small'
              value={specialtyItems.map((si) => si.id)}
              onChange={handleChangeSpecialtyItems}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const si = specialtyItems.find((si) => si.id === value);
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
            specialtyItems.map((si) => {
              return <Chip key={si.id} label={si.title} variant='filled' size='small' />;
            })
          )}
        </Box>
      </StyledTableCell>
      <StyledTableCell padding='checkbox'>
        <BaseSwitch checked={isPopular} disabled={!isEdit} onChange={handleChangeIsPopluar} />
      </StyledTableCell>
      <StyledTableCell padding='checkbox'>
        <BaseSwitch checked={!!publishedAt} disabled={!isEdit} onChange={handleChangeIsPublished} />
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
