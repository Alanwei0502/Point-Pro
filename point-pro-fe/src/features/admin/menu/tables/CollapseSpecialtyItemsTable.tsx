import { FC } from 'react';
import { Box, Collapse, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { BaseButton, StyledTableCell, StyledTableRow } from '~/components';
import { ISpecialty, ISpecialtyItem } from '~/types';
import { SpecialtyItemRow } from '../rows/SpecialtyItemRow';

interface ICollapseSpecialtyItemsTableProps {
  isOpen: boolean;
  specialtyItems: (ISpecialtyItem & { specialtyId: ISpecialty['id'] })[];
}

export const CollapseSpecialtyItemsTable: FC<ICollapseSpecialtyItemsTableProps> = (props) => {
  const { isOpen, specialtyItems } = props;

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    // const { active, over } = event;
    // if (active && over && active.id !== over.id) {
    //   const oldIndex = categories.findIndex((c) => c.id === active.id);
    //   const newIndex = categories.findIndex((c) => c.id === over.id);
    //   const newCategoriesOrder = arrayMove(categories, oldIndex, newIndex).map((c, idx) => ({
    //     ...c,
    //     position: idx,
    //   }));
    //   dispatch(setCategories(newCategoriesOrder));
    //   dispatch(patchCategoriesOrder());
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
                        <BaseButton variant='outlined' color='inherit' fullWidth startIcon={<AddIcon />}>
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
