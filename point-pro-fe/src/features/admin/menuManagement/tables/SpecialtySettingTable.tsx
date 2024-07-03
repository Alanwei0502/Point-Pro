import { FC, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AddIcon from '@mui/icons-material/Add';
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AppButton, StyledTableCell, StyledTableRow } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { SpecialtyRow } from '../rows/SpecialtyRow';
import { getSpecialties, openCreateSpecialtyModal, patchSpecialtyOrder, setSpecialties } from '~/store/slices';
import { PatchSpecialtyOrderPayload } from '~/types';
import { toast } from 'react-toastify';

interface ISpecialtySettingTableProps {}

export const SpecialtySettingTable: FC<ISpecialtySettingTableProps> = () => {
  const dispatch = useAppDispatch();

  const speicalties = useAppSelector((state) => state.menuManagement.specialties);

  const [isSortingLoading, setIsSortingLoading] = useState(false);

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
      setIsSortingLoading(true);
      toast
        .promise(
          async () => {
            await dispatch(patchSpecialtyOrder(payload)).unwrap();
            await dispatch(getSpecialties());
          },
          {
            pending: '更新排序中...',
            success: '更新成功',
            error: '更新失敗',
          },
        )
        .finally(() => {
          setIsSortingLoading(false);
        });
    }
  };

  const handleOpenCreateSpecialtyModal = () => {
    dispatch(openCreateSpecialtyModal());
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={speicalties} strategy={verticalListSortingStrategy} disabled={isSortingLoading}>
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
                <AppButton variant='outlined' color='inherit' fullWidth onClick={handleOpenCreateSpecialtyModal} startIcon={<AddIcon />}>
                  新增種類
                </AppButton>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </SortableContext>
    </DndContext>
  );
};
