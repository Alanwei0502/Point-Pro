import { ChangeEvent, FC, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { BaseButton, BaseSwitch, TabletModalLayout, UploadButton } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeCreateMealModal, getMeals, postMeal } from '~/store/slices';
import { theme } from '~/theme';
import { IMeal, ISpecialtyItem } from '~/types';

const imageType = ['image/jpeg', 'image/jpg', 'image/png'];

interface ICreateMealModalProps {}

export const CreateMealModal: FC<ICreateMealModalProps> = () => {
  const dispatch = useAppDispatch();

  const meals = useAppSelector((state) => state.menu.meals);
  const isOpen = useAppSelector((state) => state.menu.createMealModal.isOpen);
  const categoryId = useAppSelector((state) => state.menu.createMealModal.data);
  const specialties = useAppSelector((state) => state.menu.specialties);
  const allDpecialtyItems = useMemo(() => specialties.flatMap((s) => s.specialtyItems), [specialties]);

  const [title, setTitle] = useState<IMeal['title']>('');
  const [price, setPrice] = useState<IMeal['price']>(0);
  const [image, setImage] = useState<File>();
  const [isImageFormatError, setIsImageFormatError] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const [description, setDescription] = useState<IMeal['description']>('');
  const [specialtyItems, setSpecialtyItems] = useState<ISpecialtyItem['id'][]>([]);
  const [isPopular, setIsPopular] = useState<IMeal['isPopular']>(false);
  const [publishedAt, setPublisedAt] = useState<IMeal['publishedAt']>(new Date());

  const hasSameMealExist = meals.some((m) => m.title === title);
  const isIncompleteInfo = !title || !image;
  const isInvalid = !categoryId || isIncompleteInfo || hasSameMealExist;

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files as FileList;
    const imageFile = selectedFiles?.[0];
    if (imageFile.size > 2 * 1024 * 1024 || !imageType.includes(imageFile.type)) {
      setIsImageFormatError(true);
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
    setPublisedAt((prevPublishedAt) => (prevPublishedAt ? null : new Date()));
  };

  const handleCancel = () => {
    setTitle('');
    setImage(undefined);
    setPreviewImage(undefined);
    setPrice(0);
    setDescription('');
    setSpecialtyItems([]);
    setIsPopular(false);
    setPublisedAt(new Date());
    dispatch(closeCreateMealModal());
  };

  const handleConfirmCreateMeal = () => {
    if (isInvalid) return;

    dispatch(
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
    ).then(() => {
      dispatch(getMeals());
      handleCancel();
    });
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='新增餐點' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', width: '50cqw', height: 640, overflow: 'scroll' }}>
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
            <FormLabel>照片</FormLabel>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                <UploadButton btn={{ sx: { width: 200 } }} input={{ onChange: handleChangeImage, inputProps: { accept: imageType.join(',') } }} />
                <Typography variant='caption' color='error'>
                  圖片大小不得超過 2MB，格式為 .jpg、.jpeg 或 .png
                </Typography>
              </Box>
              <Box component='img' id='previewImage' sx={{ width: 130, height: 130, objectFit: 'cover' }} src={previewImage} />
            </Box>
          </FormControl>
          <FormControl margin='dense' required fullWidth>
            <FormLabel>價格</FormLabel>
            <TextField type='number' size='small' value={price.toString()} onChange={handleChangePrice} />
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
                    const { title, price } = allDpecialtyItems.find((si) => si.id === value) as ISpecialtyItem;
                    return <Chip key={value} label={`${title}(${price}元)`} />;
                  })}
                </Box>
              )}
            >
              {allDpecialtyItems.map((si) => (
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
        </CardContent>
        <CardActions>
          <BaseButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </BaseButton>
          <BaseButton variant='contained' color='primary' fullWidth onClick={handleConfirmCreateMeal} disabled={isInvalid}>
            確定
          </BaseButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};
