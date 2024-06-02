import { FC } from 'react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { BaseButton, StyledTableCell, StyledTableRow } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { SpecialtyRow } from '../rows/SpecialtyRow';
import { getSpecialties, openCreateSpecialtyModal, patchSpecialtyOrder, setSpecialties } from '~/store/slices';
import { PatchSpecialtyOrderPayload } from '~/types';

interface ISpecialtySettingTableProps {}

export const SpecialtySettingTable: FC<ISpecialtySettingTableProps> = () => {
  const dispatch = useAppDispatch();

  const speicalties = useAppSelector((state) => state.menu.specialties);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = speicalties.findIndex((s) => s.id === active.id);
      const newIndex = speicalties.findIndex((s) => s.id === over.id);
      const movedSpecialties = arrayMove(speicalties, oldIndex, newIndex);
      const payload: PatchSpecialtyOrderPayload = [];
      const newSpecialtiesOrder = movedSpecialties.map((s, idx) => {
        payload.push({ id: s.id, position: idx });
        return { ...s, position: idx };
      });
      dispatch(setSpecialties(newSpecialtiesOrder));
      dispatch(patchSpecialtyOrder(payload))
        .unwrap()
        .then(() => {
          dispatch(getSpecialties());
        });
    }
  };

  const handleOpenCreateSpecialtyModal = () => {
    dispatch(openCreateSpecialtyModal());
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={speicalties} strategy={verticalListSortingStrategy}>
        <Table stickyHeader size='small'>
          <TableHead>
            <StyledTableRow>
              {['展開', '排序', '種類', '選擇', '操作'].map((header) => (
                <StyledTableCell key={header}>{header}</StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {speicalties.map((s) => (
              <SpecialtyRow key={s.id} specialty={s} />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <BaseButton variant='outlined' color='inherit' fullWidth onClick={handleOpenCreateSpecialtyModal} startIcon={<AddIcon />}>
                  新增種類
                </BaseButton>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </SortableContext>
    </DndContext>
  );
};
