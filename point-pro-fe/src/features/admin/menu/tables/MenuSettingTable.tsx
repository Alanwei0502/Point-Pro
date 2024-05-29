import { FC } from 'react';
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '~/hooks';

import { BaseButton, StyledTableCell, StyledTableRow } from '~/components';
import { openCreateCategoryModal, patchCategoriesOrder, setCategories } from '~/store/slices';
import { CategoryRow } from '../rows/CategoryRow';
import { PatchCategoryOrderPayload } from '~/types';

interface IMenuSettingTableProps {}

export const MenuSettingTable: FC<IMenuSettingTableProps> = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.menu.categories);

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
      dispatch(patchCategoriesOrder(payload));
    }
  };

  const handleOpenCreateCategoryModal = () => {
    dispatch(openCreateCategoryModal());
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={categories} strategy={verticalListSortingStrategy}>
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
                <BaseButton variant='outlined' color='inherit' fullWidth onClick={handleOpenCreateCategoryModal} startIcon={<AddIcon />}>
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
