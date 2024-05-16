import { FC } from "react";
import { styled, Box, Button, InputAdornment, Stack, Typography } from "@mui/material";
import { BaseCheckbox, BaseSelect, headerHeight, File, DateInput, TextareaInput, TextInput } from "~/components";

interface IRowProps {
  length?: Number;
  align?: string;
}

export const Row = styled(Box)((props: IRowProps) => ({
  display: "flex",
  position: "relative",
  alignItems: props.align || "center"
}));

export const Column = styled(Box)(() => ({
  display: "flex",
  position: "relative",
  flexDirection: "column"
}));

export const Base = styled(Box)(() => ({
  padding: "24px",
  minHeight: `calc(100vh - ${headerHeight})`
}));

interface IFieldContainerProps {
  width: number;
  label: string;
  type: string;
  [name: string]: any;
}

export const FieldContainer: FC<IFieldContainerProps> = ({ width = 500, label, type, list, ...props }) => {
  const sx = { width: `${width}px` };
  const Component = () => {
    switch (type) {
      case "text":
        return (
          <TextInput
            sx={sx}
            {...props}
            onChange={(event) => props.onChange({ id: props.id, value: event.target.value })}
          />
        );
      case "textarea":
        delete props.error;
        return (
          <TextareaInput
            sx={sx}
            {...props}
            onChange={(event) => props.onChange({ id: props.id, value: event.target.value })}
          />
        );
      case "dollar":
        return (
          <TextInput
            sx={sx}
            type="number"
            {...props}
            onChange={(event) => props.onChange({ id: props.id, value: event.target.value.replace(/^0+(?!$)/, "") })}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        );
      case "file":
        return <File width={width} handleChange={(value) => props.onChange({ id: props.id, value })} {...props} />;
      case "date":
        return <DateInput sx={sx} {...props} onChange={(value) => props.onChange({ id: props.id, value })} />;
      case "checkbox":
        delete props.error;
        return (
          <BaseCheckbox
            {...props}
            checked={props.value}
            onChange={(event) => props.onChange({ id: props.id, value: event.target.checked })}
          />
        );
      case "select":
        return <BaseSelect list={list} sx={sx} {...props} />;
      case "button":
        delete props.error;
        return (
          <Button variant="contained" sx={sx} {...props}>
            {props.text}
          </Button>
        );
      default:
        return <TextInput sx={sx} />;
    }
  };
  return (
    <Stack direction="row" spacing={8} alignItems="center" flexWrap="wrap" sx={{ userSelect: "none" }}>
      <Typography width={130} variant="h3">
        {label}
      </Typography>
      {Component()}
    </Stack>
  );
};
