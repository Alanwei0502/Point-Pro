import { ChangeEvent, FC, useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, FormControl, FormLabel, TextField } from '@mui/material';
import { BaseButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeCreateCategoryModal, postCategory } from '~/store/slices';
import { theme } from '~/theme';

interface ICreateCategoryModalProps {}

export const CreateCategoryModal: FC<ICreateCategoryModalProps> = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.menu.categories);
  const isOpen = useAppSelector((state) => state.menu.createCategoryModal.isOpen);

  const [title, setTitle] = useState('');

  const hasSameCategoryExist = Boolean(categories.find((c) => c.title === title));
  const isIncompleteInfo = !title;

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleConfirmCreateCategory = () => {
    if (isIncompleteInfo || hasSameCategoryExist) return;

    dispatch(
      postCategory({
        title,
        position: categories.length,
      }),
    ).then(() => {
      setTitle('');
    });
  };

  const handleCancel = () => {
    dispatch(closeCreateCategoryModal());
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='新增種類' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1.5rem 1.25rem', minWidth: '50cqw' }}>
          <FormControl margin='dense' required fullWidth>
            <FormLabel>種類名稱</FormLabel>
            <TextField
              autoFocus
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
          <BaseButton
            variant='contained'
            color='primary'
            fullWidth
            onClick={handleConfirmCreateCategory}
            disabled={isIncompleteInfo || hasSameCategoryExist}
          >
            確定
          </BaseButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};
