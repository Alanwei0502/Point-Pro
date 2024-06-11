import { FC, useState } from 'react';
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { AppButton, StyledTableCell, StyledTableRow } from '~/components';
import { getCategories, openCreateCategoryModal, patchCategoryOrder, setCategories } from '~/store/slices';
import { CategoryRow } from '../rows/CategoryRow';
import { PatchCategoryOrderPayload } from '~/types';

interface IMenuManagementTableProps {}

export const MenuManagementTable: FC<IMenuManagementTableProps> = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.menuManagement.categories);

  const [isSortingLoading, setIsSortingLoading] = useState(false);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      const movedCategories = arrayMove(categories, oldIndex, newIndex);
      const payload: PatchCategoryOrderPayload = [];
      const newCategoriesOrder = movedCategories.map((c, idx) => {
        payload.push({ id: c.id, position: idx });
        return { ...c, position: idx };
      });

      dispatch(setCategories(newCategoriesOrder));
      setIsSortingLoading(true);
      toast
        .promise(
          async () => {
            await dispatch(patchCategoryOrder(payload)).unwrap();
            await dispatch(getCategories());
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

  const handleOpenCreateCategoryModal = () => {
    dispatch(openCreateCategoryModal());
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={categories} strategy={verticalListSortingStrategy} disabled={isSortingLoading}>
        <Table stickyHeader size='small'>
          <TableHead>
            <StyledTableRow>
              {['展開', '排序', '種類', '操作'].map((header) => (
                <StyledTableCell key={header}>{header}</StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <CategoryRow key={category.id} category={category} />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                <AppButton variant='outlined' color='inherit' fullWidth onClick={handleOpenCreateCategoryModal} startIcon={<AddIcon />}>
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
