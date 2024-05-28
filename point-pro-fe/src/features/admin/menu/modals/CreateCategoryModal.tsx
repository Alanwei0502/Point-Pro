import { ChangeEvent, FC, useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, FormControl, FormLabel, TextField } from '@mui/material';
import { BaseButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeCreateCategoryModal, postCategory, setCreateCategoryModalData } from '~/store/slices';
import { theme } from '~/theme';

interface ICreateCategoryModalProps {}

export const CreateCategoryModal: FC<ICreateCategoryModalProps> = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.menu.categories);
  const { isOpen, data } = useAppSelector((state) => state.menu.createCategoryModal);

  const [isTitleError, setIsTitleError] = useState(false);

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setIsTitleError(false);
    dispatch(
      setCreateCategoryModalData({
        title: e.target.value,
        position: categories.length,
      }),
    );
  };

  const handleConfirmCreateCategory = () => {
    if (!data || categories.find((c) => c.title === data.title)) {
      setIsTitleError(true);
      return;
    }

    dispatch(postCategory(data));
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
            <FormLabel>標題</FormLabel>
            <TextField
              autoFocus
              defaultValue={data?.title}
              error={isTitleError}
              helperText={isTitleError && '已有相同的種類'}
              onChange={handleChangeTitle}
            />
          </FormControl>
        </CardContent>
        <CardActions>
          <BaseButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </BaseButton>
          <BaseButton variant='contained' color='primary' fullWidth onClick={handleConfirmCreateCategory} disabled={!data?.title}>
            確定
          </BaseButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};
