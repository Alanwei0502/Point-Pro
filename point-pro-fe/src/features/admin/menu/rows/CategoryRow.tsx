import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from '@emotion/styled';
import { Box, IconButton, TableRow, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ReorderIcon from '@mui/icons-material/Reorder';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { ICategory } from '~/types';
import { StyledTableCell, TextInput } from '~/components';
import { theme } from '~/theme';
import { CollapseMealsTable } from '../tables/CollapseMealsTable';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { getCategories, openDeleteCategoryConfirmModal, patchCategory } from '~/store/slices';

const StyledCategoryRow = styled(TableRow)(() => ({
  '&.MuiTableRow-root': {
    backgroundColor: theme.palette.common.black_40,
  },
  '& > .MuiTableCell-root': {
    fontSize: 20,
  },
}));

interface ICategoryRowProps {
  category: ICategory;
}

export const CategoryRow: FC<ICategoryRowProps> = (props) => {
  const { category } = props;

  const dispatch = useAppDispatch();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isExpand, setIsExpanded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState<ICategory['id']>(category.title);

  const categories = useAppSelector((state) => state.menuSetting.categories);
  const meals = useAppSelector((state) => state.menuSetting.meals);

  const filterMeals = useMemo(() => meals.filter((m) => m.categoryId === category.id), [meals, category.id]);

  const isCategoryTitleExist = categories.some((c) => c.title === newTitle && c.id != category.id);
  const isNotChanged = category.title === newTitle;
  const isInvalid = !newTitle || isNotChanged || isCategoryTitleExist || isUpdateLoading;

  useEffect(() => {
    setNewTitle(category.title);
  }, [category.title]);

  const handleOpenMealTable = () => {
    setIsExpanded((prevOpen) => !prevOpen);
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleEditCategoryRow = () => {
    setIsEdit(true);
  };

  const handleOpenDeleteCategoryConfirmModal = () => {
    dispatch(openDeleteCategoryConfirmModal(category));
  };

  const handleCancelEdit = () => {
    setNewTitle(category.title);
    setIsEdit(false);
  };

  const handleConfirmEdit = () => {
    if (isInvalid) return;

    setIsUpdateLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(patchCategory({ id: category.id, title: newTitle })).unwrap();
          await dispatch(getCategories());
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
    <>
      <StyledCategoryRow ref={setNodeRef} style={style}>
        <StyledTableCell padding='checkbox'>
          <IconButton size='small' onClick={handleOpenMealTable}>
            {isExpand ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell padding='checkbox' {...attributes} {...listeners}>
          <IconButton size='small'>
            <ReorderIcon />
          </IconButton>
        </StyledTableCell>
        <StyledTableCell>
          {isEdit ? (
            <>
              <TextInput autoFocus value={newTitle} onChange={handleChangeTitle} />
              {isCategoryTitleExist && (
                <Typography variant='small' color='error'>
                  已有相同的種類
                </Typography>
              )}
            </>
          ) : (
            newTitle
          )}
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
                <IconButton size='small' onClick={handleEditCategoryRow}>
                  <EditIcon />
                </IconButton>
                <IconButton size='small' onClick={handleOpenDeleteCategoryConfirmModal}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        </StyledTableCell>
      </StyledCategoryRow>
      <CollapseMealsTable isOpen={isExpand} meals={filterMeals} categoryId={category.id} />
    </>
  );
};
