import { ChangeEvent, FC, useMemo, useState } from 'react';
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
import { openDeleteCategoryConfirmModal, patchCategory } from '~/store/slices';

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

  const [isExpand, setIsExpanded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(category.title);

  const categories = useAppSelector((state) => state.menu.categories);
  const meals = useAppSelector((state) => state.menu.meals);
  const filterMeals = useMemo(() => meals.filter((m) => m.categoryId === category.id), [meals, category.id]);

  const isCategoryTitleExist = categories.some((c) => c.title === newTitle && c.id != category.id);
  const isNotChanged = category.title === newTitle;
  const isInvalid = !newTitle || isNotChanged || isCategoryTitleExist;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleOpenMealTable = () => {
    setIsExpanded((prevOpen) => !prevOpen);
  };

  const handleEditCategoryRow = () => {
    setIsEdit(true);
  };

  const handleOpenDeleteCategoryRowConfirmModal = () => {
    dispatch(openDeleteCategoryConfirmModal(category));
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleConfirmEdit = () => {
    if (isInvalid) return;

    dispatch(patchCategory({ id: category.id, title: newTitle }));
    setIsEdit(false);
  };

  const handleCancelEdit = () => {
    setNewTitle(category.title);
    setIsEdit(false);
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
                <IconButton size='small' onClick={handleOpenDeleteCategoryRowConfirmModal}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        </StyledTableCell>
      </StyledCategoryRow>
      <CollapseMealsTable isOpen={isExpand} meals={filterMeals} />
    </>
  );
};
