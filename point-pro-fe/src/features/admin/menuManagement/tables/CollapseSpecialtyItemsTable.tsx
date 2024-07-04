import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import Collapse from '@mui/material/Collapse';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import AddIcon from '@mui/icons-material/Add';
import { DndContext, type DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AppButton, StyledTableCell, StyledTableRow } from '~/components';
import { SpecialtyWithSpecialtyItems, PatchSpecialtyItemOrderPayload } from '~/types';
import { SpecialtyItemRow } from '../rows/SpecialtyItemRow';
import { useAppDispatch } from '~/hooks';
import { menuManagementSliceActions } from '~/store/slices/admin/menuManagement.slice';

const { getSpecialties, openCreateSpecialtyItemModal, patchSpecialtyItemOrder, setSpecialtyItems } = menuManagementSliceActions;

interface ICollapseSpecialtyItemsTableProps {
  isOpen: boolean;
  specialty: SpecialtyWithSpecialtyItems;
}

export const CollapseSpecialtyItemsTable: FC<ICollapseSpecialtyItemsTableProps> = (props) => {
  const dispatch = useAppDispatch();

  const { isOpen, specialty } = props;
  const { specialtyItems } = specialty;

  const [isSortingLoading, setIsSortingLoading] = useState(false);

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
      setIsSortingLoading(true);
      toast
        .promise(
          async () => {
            await dispatch(patchSpecialtyItemOrder(payload)).unwrap();
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

  const handleOpenCreateSpecialtyItemModal = () => {
    dispatch(openCreateSpecialtyItemModal(specialty));
  };

  return (
    <StyledTableRow>
      <StyledTableCell colSpan={5} sx={{ padding: 0 }}>
        <Collapse in={isOpen} timeout='auto' unmountOnExit>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={specialtyItems} strategy={verticalListSortingStrategy} disabled={isSortingLoading}>
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
                      <AppButton variant='outlined' color='inherit' fullWidth startIcon={<AddIcon />} onClick={handleOpenCreateSpecialtyItemModal}>
                        新增選項
                      </AppButton>
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
