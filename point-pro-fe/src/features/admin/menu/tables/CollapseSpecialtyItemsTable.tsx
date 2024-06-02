import { FC } from 'react';
import { Box, Collapse, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { BaseButton, StyledTableCell, StyledTableRow } from '~/components';
import { ISpecialty, ISpecialtyItem, ISpecialtyWithSpecialtyItems, PatchSpecialtyItemOrderPayload } from '~/types';
import { SpecialtyItemRow } from '../rows/SpecialtyItemRow';
import { useAppDispatch } from '~/hooks';
import { getSpecialties, openCreateSpecialtyItemModal, patchSpecialtyItemOrder, setSpecialtyItems } from '~/store/slices';

interface ICollapseSpecialtyItemsTableProps {
  isOpen: boolean;
  specialty: ISpecialtyWithSpecialtyItems;
}

export const CollapseSpecialtyItemsTable: FC<ICollapseSpecialtyItemsTableProps> = (props) => {
  const dispatch = useAppDispatch();

  const { isOpen, specialty } = props;
  const { specialtyItems } = specialty;

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = specialtyItems.findIndex((si) => si.id === active.id);
      const newIndex = specialtyItems.findIndex((si) => si.id === over.id);
      const movedSpecialtyItems = arrayMove(specialtyItems, oldIndex, newIndex);
      const payload: PatchSpecialtyItemOrderPayload = [];
      const newSpecialtiesOrder = movedSpecialtyItems.map((si, idx) => {
        payload.push({ id: si.id, position: idx });
        return { ...si, position: idx };
      });

      dispatch(setSpecialtyItems(newSpecialtiesOrder));
      dispatch(patchSpecialtyItemOrder(payload))
        .unwrap()
        .then(() => {
          dispatch(getSpecialties());
        });
    }
  };

  const handleOpenCreateSpecialtyItemModal = () => {
    dispatch(openCreateSpecialtyItemModal(specialty));
  };

  return (
    <StyledTableRow>
      <StyledTableCell colSpan={5} sx={{ padding: 0 }}>
        <Collapse in={isOpen} timeout='auto' unmountOnExit>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={specialtyItems}>
              <Table stickyHeader size='small'>
                <TableHead>
                  <StyledTableRow>
                    {['', '排序', '名稱', '價格', '操作'].map((header) => (
                      <StyledTableCell key={header}>{header}</StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {specialtyItems.map((si) => (
                    <SpecialtyItemRow key={si.id} specialtyItem={si} />
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box>
                        <BaseButton variant='outlined' color='inherit' fullWidth startIcon={<AddIcon />} onClick={handleOpenCreateSpecialtyItemModal}>
                          新增選項
                        </BaseButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </SortableContext>
          </DndContext>
        </Collapse>
      </StyledTableCell>
    </StyledTableRow>
  );
};
