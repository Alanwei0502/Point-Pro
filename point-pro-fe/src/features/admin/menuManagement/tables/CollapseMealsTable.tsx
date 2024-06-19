import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Collapse, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from '~/hooks';
import { ICategory, MealWithCategoryAndSpecialtyItems, PatchMealSortingPayload } from '~/types';
import { AppButton, StyledTableCell, StyledTableRow } from '~/components';
import { getMeals, openCreateMealModal, patchMealOrder, setMeals } from '~/store/slices';
import { MealRow } from '../rows/MealRow';

interface ICollapseMealsTableProps {
  isOpen: boolean;
  meals: MealWithCategoryAndSpecialtyItems[];
  categoryId: ICategory['id'];
}

export const CollapseMealsTable: FC<ICollapseMealsTableProps> = (props) => {
  const { isOpen, meals, categoryId } = props;

  const dispatch = useAppDispatch();

  const [isSortingLoading, setIsSortingLoading] = useState(false);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = meals.findIndex((m) => m.id === active.id);
      const newIndex = meals.findIndex((m) => m.id === over.id);
      const movedMeals = arrayMove(meals, oldIndex, newIndex);
      const payload: PatchMealSortingPayload = [];
      const newFilterMealsOrder = movedMeals.map((m, idx) => {
        payload.push({ id: m.id, position: idx });
        return { ...m, position: idx };
      });

      dispatch(setMeals(newFilterMealsOrder));
      setIsSortingLoading(true);
      toast
        .promise(
          async () => {
            await dispatch(patchMealOrder(payload)).unwrap();
            await dispatch(getMeals());
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

  const handleOpenCreateMealModal = () => {
    dispatch(openCreateMealModal(categoryId));
  };

  return (
    <StyledTableRow>
      <StyledTableCell colSpan={4} sx={{ padding: 0 }}>
        <Collapse in={isOpen} timeout='auto' unmountOnExit>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={meals} strategy={verticalListSortingStrategy} disabled={isSortingLoading}>
              <Table stickyHeader size='small'>
                <TableHead>
                  <StyledTableRow>
                    {['排序', '名稱', '照片', '價格', '備註', '客製化選項', '人氣', '上架', '操作'].map((header) => (
                      <StyledTableCell key={header}>{header}</StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {meals.map((meal) => (
                    <MealRow key={meal.id} meal={meal} />
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={9}>
                      <AppButton variant='outlined' color='inherit' fullWidth startIcon={<AddIcon />} onClick={handleOpenCreateMealModal}>
                        新增餐點
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
