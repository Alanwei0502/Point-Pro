import { ChangeEvent, FC, useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, FormControl, FormLabel, TextField } from '@mui/material';
import { BaseButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeCreateCategoryModal, getCategories, postCategory } from '~/store/slices';
import { theme } from '~/theme';
import { ICategory } from '~/types';

interface ICreateCategoryModalProps {}

export const CreateCategoryModal: FC<ICreateCategoryModalProps> = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.menu.categories);
  const isOpen = useAppSelector((state) => state.menu.createCategoryModal.isOpen);

  const [title, setTitle] = useState<ICategory['id']>('');

  const hasSameCategoryExist = categories.some((c) => c.title === title);
  const isIncompleteInfo = !title;
  const isInvalid = isIncompleteInfo || hasSameCategoryExist;

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleCancel = () => {
    setTitle('');
    dispatch(closeCreateCategoryModal());
  };

  const handleConfirmCreateCategory = () => {
    if (isInvalid) return;

    dispatch(
      postCategory({
        title,
        position: categories.length,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(getCategories());
        handleCancel();
      });
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='新增種類' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', width: '50cqw' }}>
          <FormControl margin='dense' required fullWidth>
            <FormLabel>種類名稱</FormLabel>
            <TextField
              autoFocus
              size='small'
              defaultValue={title}
              error={hasSameCategoryExist}
              helperText={hasSameCategoryExist && '已有相同的種類'}
              onChange={handleChangeTitle}
            />
          </FormControl>
        </CardContent>
        <CardActions>
          <BaseButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </BaseButton>
          <BaseButton variant='contained' color='primary' fullWidth onClick={handleConfirmCreateCategory} disabled={isInvalid}>
            確定
          </BaseButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};
