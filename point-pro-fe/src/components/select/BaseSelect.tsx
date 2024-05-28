import { FC, useState } from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface ISelectItem {
  id: string;
  title: string;
}

export interface IhandleChangeProps {
  id: string | undefined;
  value: any;
}

interface IBaseSelectProps {
  list: ISelectItem[] | undefined;
  includeAll?: boolean;
  onChange?: (props: IhandleChangeProps) => void;
  [key: string]: any;
}

export const BaseSelect: FC<IBaseSelectProps> = ({ list, onChange, includeAll = false, ...props }) => {
  const [select, setSelect] = useState('');

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const payload = { id: props.id, value: event.target.value };
    setSelect(event.target.value);
    onChange && onChange(payload);
  };

  return (
    <Select value={select} onChange={handleSelectChange} {...props}>
      {includeAll ? <MenuItem value='all'>全部</MenuItem> : null}
      {list?.map((item) => (
        <MenuItem key={`${item.id}`} value={item.id}>
          {item.title}
        </MenuItem>
      ))}
    </Select>
  );
};
