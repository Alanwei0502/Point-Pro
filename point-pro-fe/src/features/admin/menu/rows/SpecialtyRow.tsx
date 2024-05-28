import React, { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Box, IconButton, MenuItem, SelectChangeEvent, TableRow } from '@mui/material';
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
import { useAppDispatch } from '~/hooks';
import { ISpecialtyWithSpecialtyItems, SelectionType } from '~/types';
import { theme } from '~/theme';
import { CollapseSpecialtyItemsTable } from '../tables/CollapseSpecialtyItemsTable';
import { selectionTypeObj } from '~/utils';
import { openDeleteSpecialtyConfirmModal, patchSpecialty } from '~/store/slices';

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

  const [isExpand, setIsExpanded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(specialty.title);
  const [newSelectionType, setNewSelectionType] = useState(specialty.selectionType);

  const isNotChanged = newTitle === specialty.title && newSelectionType === specialty.selectionType;
  const isIncompleteInfo = !newTitle || !newSelectionType;

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

  const handleOpenDeleteSpecialtyRowConfirmModal = () => {
    dispatch(openDeleteSpecialtyConfirmModal(specialty));
  };

  const handleConfirmEdit = () => {
    if (isNotChanged || isIncompleteInfo) return;

    dispatch(
      patchSpecialty({
        id: specialty.id,
        title: newTitle,
        selectionType: newSelectionType,
      }),
    );
    setIsEdit(false);
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
    setNewTitle(specialty.title);
    setNewSelectionType(specialty.selectionType);
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
        <StyledTableCell>{isEdit ? <TextInput autoFocus value={newTitle} onChange={handleChangeTitle} /> : newTitle}</StyledTableCell>
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
                <IconButton size='small' onClick={handleConfirmEdit} disabled={isNotChanged || isIncompleteInfo}>
                  <CheckIcon color={isNotChanged || isIncompleteInfo ? 'disabled' : 'success'} />
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
                <IconButton size='small' onClick={handleOpenDeleteSpecialtyRowConfirmModal}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        </StyledTableCell>
      </StyledSpecialtyRow>
      <CollapseSpecialtyItemsTable isOpen={isExpand} specialtyItems={specialty.specialtyItems} />
    </>
  );
};
