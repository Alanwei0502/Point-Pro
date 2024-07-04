import { ChangeEvent, FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { SelectChangeEvent } from '@mui/material/Select';
import ReorderIcon from '@mui/icons-material/Reorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { MySelect, StyledTableCell, TextInput } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { SpecialtyWithSpecialtyItems, SelectionType } from '~/types';
import { theme } from '~/theme';
import { CollapseSpecialtyItemsTable } from '../tables/CollapseSpecialtyItemsTable';
import { SELECTION_TYPE_TRANSLATE } from '~/constants';
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
  specialty: SpecialtyWithSpecialtyItems;
}
export const SpecialtyRow: FC<ISpecialtyRowProps> = (props) => {
  const { specialty } = props;

  const dispatch = useAppDispatch();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: specialty.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const specialties = useAppSelector((state) => state.menuManagement.specialties);

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isExpand, setIsExpanded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(specialty.title);
  const [newSelectionType, setNewSelectionType] = useState(specialty.selectionType);

  const isNotChanged = newTitle === specialty.title && newSelectionType === specialty.selectionType;
  const isSpecialtyExist = specialties.some((item) => item.title === newTitle && item.id !== specialty.id);
  const isIncompleteInfo = !newTitle || !newSelectionType;
  const isInvalid = isNotChanged || isSpecialtyExist || isIncompleteInfo || isUpdateLoading;

  useEffect(() => {
    setNewTitle(specialty.title);
    setNewSelectionType(specialty.selectionType);
  }, [specialty]);

  const handleOpenSpecialtyItems = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleChangeSelectionType = (e: SelectChangeEvent<unknown>) => {
    setNewSelectionType(e.target.value as SelectionType);
  };

  const handleEditSpecialtyRow = () => {
    setIsEdit(true);
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

    setIsUpdateLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(
            patchSpecialty({
              id: specialty.id,
              title: newTitle,
              selectionType: newSelectionType,
            }),
          ).unwrap();
          await dispatch(getSpecialties());
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
              {Object.entries(SELECTION_TYPE_TRANSLATE).map((item) => (
                <MenuItem key={item[0]} value={item[0]}>
                  {item[1]}
                </MenuItem>
              ))}
            </MySelect>
          ) : (
            SELECTION_TYPE_TRANSLATE[newSelectionType]
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
