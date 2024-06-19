import { FC } from 'react';
import { RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { BaseRadio } from '~/components';

interface IRadioItem {
  id: string;
  label: string;
  value: string | number;
  disabled: boolean;
}

interface IGroupRadioProps {
  title: string;
  list: IRadioItem[];
  isRow: boolean | undefined;
}

export const GroupRadio: FC<IGroupRadioProps> = ({ title, list, isRow }) => {
  return (
    <FormControl>
      <FormLabel id={`${title}-radio-buttons-group-title`}>{title}</FormLabel>
      <RadioGroup row={isRow} aria-labelledby={`${title}-radio-buttons-group-title`} name={`${title}-radio-buttons-group`}>
        {list.map((item: IRadioItem) => (
          <FormControlLabel key={`${title}-${item.id}`} value={item.value} control={<BaseRadio />} label={item.label} disabled={item.disabled} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
