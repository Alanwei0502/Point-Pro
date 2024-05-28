import { FC } from 'react';
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { Box, Collapse, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AddIcon from '@mui/icons-material/Add';

import { useAppDispatch } from '~/hooks';
import { ICategory, IMealWithCategoryAndSpecialtyItems } from '~/types';
import { BaseButton, StyledTableCell, StyledTableRow } from '~/components';
import { setMeals } from '~/store/slices';
import { MealRow } from '../rows/MealRow';

interface ICollapseMealsTableProps {
  isOpen: boolean;
  meals: IMealWithCategoryAndSpecialtyItems[];
}

export const CollapseMealsTable: FC<ICollapseMealsTableProps> = (props) => {
  const { isOpen, meals } = props;

  const dispatch = useAppDispatch();

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = meals.findIndex((m) => m.id === active.id);
      const newIndex = meals.findIndex((m) => m.id === over.id);
      const newFilterMealsOrder = arrayMove(meals, oldIndex, newIndex).map((m, idx) => ({
        ...m,
        position: idx,
      }));
      dispatch(setMeals(newFilterMealsOrder));
    }
  };

  return (
    <StyledTableRow>
      <StyledTableCell colSpan={4} sx={{ padding: 0 }}>
        <Collapse in={isOpen} timeout='auto' unmountOnExit>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={meals}>
              <Table stickyHeader size='small'>
                <TableHead>
                  <StyledTableRow>
                    {['排序', '名稱', '照片', '價錢(元)', '備註', '客製化選項', '人氣', '上架', '操作'].map((header) => (
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
                      <Box>
                        <BaseButton variant='outlined' color='inherit' fullWidth startIcon={<AddIcon />}>
                          新增餐點
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
