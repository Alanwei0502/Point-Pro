import { FC, useState } from "react";
import { MenuItem, InputLabel, FormControl, Select, SelectChangeEvent } from "@mui/material";

interface SelectItemType {
  id: string;
  label: string;
}

interface ILabelSelectProps {
  label: string;
  list: Array<SelectItemType>;
  onChange: (props: string) => void;
}

export const LabelSelect: FC<ILabelSelectProps> = ({ label, list, onChange }) => {
  const [select, setSelect] = useState("");

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelect(event.target.value);
    onChange(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id={`select-label-${label}`}>{label}</InputLabel>
      <Select
        labelId={`select-label-${label}`}
        id={`select-${label}`}
        value={select}
        label={label}
        onChange={handleChange}
      >
        {list.map((item) => (
          <MenuItem key={`${item.id}`} value={item.id}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
