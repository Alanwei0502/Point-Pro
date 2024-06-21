import { ChangeEvent, FC, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Box, Chip, FormControl, FormLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { AppButton, BaseSwitch, TabletModal, UploadButton } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeCreateMealModal, getMeals, postMeal } from '~/store/slices';
import { theme } from '~/theme';
import { IMeal, ISpecialtyItem } from '~/types';
import { MEAL_IMAGE_FORMAT_REMINDER, MEAL_IMAGE_SIZE_LIMIT, MEAL_IMAGE_TYPES } from '~/utils';

interface ICreateMealModalProps {}

export const CreateMealModal: FC<ICreateMealModalProps> = () => {
  const dispatch = useAppDispatch();

  const meals = useAppSelector((state) => state.menuManagement.meals);
  const isOpen = useAppSelector((state) => state.menuManagement.createMealModal.isOpen);
  const categoryId = useAppSelector((state) => state.menuManagement.createMealModal.data);
  const specialties = useAppSelector((state) => state.menuManagement.specialties);
  const allSpecialtyItems = useMemo(() => specialties.flatMap((s) => s.specialtyItems), [specialties]);

  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [title, setTitle] = useState<IMeal['title']>('');
  const [price, setPrice] = useState<IMeal['price']>(0);
  const [image, setImage] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [description, setDescription] = useState<IMeal['description']>('');
  const [specialtyItems, setSpecialtyItems] = useState<ISpecialtyItem['id'][]>([]);
  const [isPopular, setIsPopular] = useState<IMeal['isPopular']>(false);
  const [publishedAt, setPublisedAt] = useState<IMeal['publishedAt']>(new Date().toISOString());

  const hasSameMealExist = meals.some((m) => m.title === title);
  const isIncompleteInfo = !title || !image;
  const isInvalid = !categoryId || isIncompleteInfo || hasSameMealExist || isCreateLoading;

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files as FileList;
    const imageFile = selectedFiles?.[0];
    if (imageFile.size > MEAL_IMAGE_SIZE_LIMIT || !MEAL_IMAGE_TYPES.includes(imageFile.type)) {
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
    setSpecialtyItems(typeof value === 'string' ? value.split(',') : value);
  };

  const handleChangeIsPopular = () => {
    setIsPopular((prevIsPopular) => !prevIsPopular);
  };

  const handleChangePublishedAt = () => {
    setPublisedAt((prevPublishedAt) => (prevPublishedAt ? null : new Date().toISOString()));
  };

  const handleCancel = () => {
    setTitle('');
    setImage(undefined);
    setPreviewImage(undefined);
    setPrice(0);
    setDescription('');
    setSpecialtyItems([]);
    setIsPopular(false);
    setPublisedAt(new Date().toISOString());
    dispatch(closeCreateMealModal());
  };

  const handleConfirmCreateMeal = () => {
    if (isInvalid) return;

    setIsCreateLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(
            postMeal({
              categoryId,
              title,
              image,
              price,
              description,
              isPopular,
              position: meals.length,
              publishedAt,
              specialtyItems,
            }),
          ).unwrap();
          await dispatch(getMeals());
        },
        {
          pending: '新增中...',
          success: '新增成功',
          error: '新增失敗',
        },
      )
      .finally(() => {
        handleCancel();
        setIsCreateLoading(false);
      });
  };

  return (
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: '新增餐點',
      }}
      cardContentProps={{
        sx: { height: 640, overflow: 'scroll' },
        children: (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl margin='dense' required fullWidth>
                <FormLabel>名稱</FormLabel>
                <TextField
                  autoFocus
                  size='small'
                  value={title}
                  error={hasSameMealExist}
                  helperText={hasSameMealExist && '已有相同的餐點'}
                  onChange={handleChangeTitle}
                />
              </FormControl>
              <FormControl margin='dense' required fullWidth>
                <FormLabel>價格</FormLabel>
                <TextField type='number' size='small' value={price.toString()} onChange={handleChangePrice} />
              </FormControl>
            </Box>
            <FormControl margin='dense' required fullWidth>
              <FormLabel>照片</FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                  <UploadButton
                    btn={{ sx: { width: 200 } }}
                    input={{ onChange: handleChangeImage, inputProps: { accept: MEAL_IMAGE_TYPES.join(',') } }}
                  />
                  <Typography variant='caption' color='error'>
                    {MEAL_IMAGE_FORMAT_REMINDER}
                  </Typography>
                </Box>
                <Box component='img' id='previewImage' sx={{ width: 130, height: 130, objectFit: 'cover' }} src={previewImage} />
              </Box>
            </FormControl>
            <FormControl margin='dense' fullWidth>
              <FormLabel>備註</FormLabel>
              <TextField size='small' multiline rows={4} value={description} onChange={handleChangeDescription} />
            </FormControl>
            <FormControl margin='dense' fullWidth>
              <FormLabel>客製化選項</FormLabel>
              <Select
                multiple
                size='small'
                value={specialtyItems}
                onChange={handleChangeSpecialtyItems}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const { title, price } = allSpecialtyItems.find((si) => si.id === value) as ISpecialtyItem;
                      return <Chip key={value} label={`${title}(${price}元)`} variant='filled' size='small' />;
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
                    {si.title}({si.price}元)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex' }}>
              <FormControl margin='dense' sx={{ width: '50%' }}>
                <FormLabel>是否為人氣商品？</FormLabel>
                <BaseSwitch checked={isPopular} onChange={handleChangeIsPopular} />
              </FormControl>
              <FormControl margin='dense' sx={{ width: '50%' }}>
                <FormLabel>是否上架？</FormLabel>
                <BaseSwitch checked={!!publishedAt} onChange={handleChangePublishedAt} />
              </FormControl>
            </Box>
          </>
        ),
      }}
      cardActionsProps={{
        children: (
          <>
            <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
              取消
            </AppButton>
            <AppButton fullWidth onClick={handleConfirmCreateMeal} disabled={isInvalid}>
              確定
            </AppButton>
          </>
        ),
      }}
    />
  );
};
