import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Box, IconButton, MenuItem, SelectChangeEvent, TableRow, Typography } from '@mui/material';
import ReorderIcon from '@mui/icons-material/Reorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MySelect, StyledTableCell, TextInput } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { ISpecialtyWithSpecialtyItems, SelectionType } from '~/types';
import { theme } from '~/theme';
import { CollapseSpecialtyItemsTable } from '../tables/CollapseSpecialtyItemsTable';
import { selectionTypeObj } from '~/utils';
import { getSpecialties, openDeleteSpecialtyConfirmModal, patchSpecialty } from '~/store/slices';

const StyledSpecialtyRow = styled(TableRow)(() => ({
  '&.MuiTableRow-root': {
    backgroundColor: theme.palette.common.black_40,
  },
  '& > .MuiTableCell-root': {
    fontSize: 20,
  },
}));

interface ISpecialtyRowProps {
  specialty: ISpecialtyWithSpecialtyItems;
}
export const SpecialtyRow: FC<ISpecialtyRowProps> = (props) => {
  const { specialty } = props;

  const dispatch = useAppDispatch();

  const specialties = useAppSelector((state) => state.menuSetting.specialties);
  const [isExpand, setIsExpanded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(specialty.title);
  const [newSelectionType, setNewSelectionType] = useState(specialty.selectionType);

  const isNotChanged = newTitle === specialty.title && newSelectionType === specialty.selectionType;
  const isSpecialtyExist = specialties.some((item) => item.title === newTitle && item.id !== specialty.id);
  const isIncompleteInfo = !newTitle || !newSelectionType;
  const isInvalid = isNotChanged || isSpecialtyExist || isIncompleteInfo;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: specialty.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    setNewTitle(specialty.title);
    setNewSelectionType(specialty.selectionType);
  }, [specialty]);

  const handleOpenSpecialtyItems = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleEditSpecialtyRow = () => {
    setIsEdit(true);
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleChangeSelectionType = (e: SelectChangeEvent<unknown>) => {
    setNewSelectionType(e.target.value as SelectionType);
  };

  const handleOpenDeleteSpecialtyConfirmModal = () => {
    dispatch(openDeleteSpecialtyConfirmModal(specialty));
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
    setNewTitle(specialty.title);
    setNewSelectionType(specialty.selectionType);
  };

  const handleConfirmEdit = () => {
    if (isInvalid) return;

    dispatch(
      patchSpecialty({
        id: specialty.id,
        title: newTitle,
        selectionType: newSelectionType,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(getSpecialties());
        setIsEdit(false);
      });
  };

  return (
    <>
      <StyledSpecialtyRow ref={setNodeRef} style={style}>
        <StyledTableCell padding='checkbox'>
          <IconButton onClick={handleOpenSpecialtyItems}>{isExpand ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton>
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
              {isSpecialtyExist && (
                <Typography variant='small' color='error'>
                  已有相同的種類
                </Typography>
              )}
            </>
          ) : (
            newTitle
          )}
        </StyledTableCell>
        <StyledTableCell>
          {isEdit ? (
            <MySelect value={newSelectionType} onChange={handleChangeSelectionType}>
              {Object.entries(selectionTypeObj).map((item) => (
                <MenuItem key={item[0]} value={item[0]}>
                  {item[1]}
                </MenuItem>
              ))}
            </MySelect>
          ) : (
            selectionTypeObj[newSelectionType]
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
                <IconButton size='small' onClick={handleEditSpecialtyRow}>
                  <EditIcon />
                </IconButton>
                <IconButton size='small' onClick={handleOpenDeleteSpecialtyConfirmModal}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        </StyledTableCell>
      </StyledSpecialtyRow>
      <CollapseSpecialtyItemsTable isOpen={isExpand} specialty={specialty} />
    </>
  );
};
