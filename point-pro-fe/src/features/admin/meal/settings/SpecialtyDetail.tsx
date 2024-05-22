import { useEffect, useState, useReducer } from "react";
import {
  FilterOptionsState,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Autocomplete,
  createFilterOptions
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import { FieldContainer, BaseDraw, TextInput } from "~/components";
import { useAppDispatch } from "~/hooks";
import {
  getSpecialtyById,
  getSpecialtyItems,
  postSpecialty,
  patchSpecialtyById,
  deleteSpecialty
} from "~/store/slices";
import { SpecialtyTypeList } from "~/utils";
import mainReducer, {
  initialState,
  defaultSetting,
  editField,
  addItem,
  deleteItem,
  editItem,
  validator,
  validateCheck,
  convertToPayload
} from "./reducers";
import { ISpecialtyItem } from "~/types";

interface filterOptionType extends ISpecialtyItem {
  inputValue?: string;
}
const filter = createFilterOptions<filterOptionType>();
interface SpecialtyDetailProps {
  specialtyId: string | undefined;
  open: boolean;
  onClose: (update?: boolean) => void;
}
const SpecialtyDetail = ({ specialtyId, open, onClose }: SpecialtyDetailProps) => {
  const isCreate = !specialtyId;

  const [specialtyItemOptions, setSpecialtyItemOptions] = useState<ISpecialtyItem[]>([]);

  const [state, reducerDispatch] = useReducer(mainReducer, initialState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (open) {
      dispatchGetSpecialtyItems();
      if (isCreate) {
        reducerDispatch(defaultSetting(null));
      } else {
        dispatchGetSpecialtyById();
      }
    } else {
      reducerDispatch(defaultSetting(null));
    }
  }, [open]);

  const dispatchGetSpecialtyItems = async () => {
    const { result } = await dispatch(getSpecialtyItems()).unwrap();
    if (!result) return; // TODO
    setSpecialtyItemOptions(result);
  };
  const dispatchGetSpecialtyById = async () => {
    try {
      const { result } = await dispatch(getSpecialtyById(specialtyId as string)).unwrap();
      reducerDispatch(defaultSetting(result));
    } catch (error) {
      console.log("dispatchGetSpecialtyById failed");
    }
  };

  const fieldList = [
    {
      id: "title",
      label: "名稱",
      type: "text"
    },
    {
      id: "type",
      label: "類型",
      type: "select",
      list: SpecialtyTypeList
    },
    {
      id: "items",
      label: "選項",
      type: "button",
      text: "新增選項",
      startIcon: <AddIcon />,
      onClick: () => reducerDispatch(addItem())
    }
  ];

  const handleFieldChange = (props: { id: string; value: any }) => {
    reducerDispatch(editField(props));
  };

  const handleSpecialtyItemChange = (props: { index: number; key: string; value: any }) => {
    reducerDispatch(editItem(props));
  };

  const filterOptions = (options: ISpecialtyItem[], params: FilterOptionsState<filterOptionType>) => {
    const filtered = filter(options, params);

    const { inputValue } = params;
    // Suggest the creation of a new value
    const isExisting = options.some((option) => inputValue === option.title);
    if (inputValue !== "" && !isExisting) {
      filtered.push({
        id: "",
        title: `新增 "${inputValue}"`,
        price: 0,
        inputValue
      });
    }
    return filtered;
  };

  const getOptionLabel = (option: string | filterOptionType) => {
    // Value selected with enter, right from the input
    if (typeof option === "string") {
      return option;
    }
    // Add "xxx" option created dynamically
    if (option.inputValue) {
      return option.inputValue;
    }
    // Regular option
    return option.title;
  };

  const handleButtonClick = async (key: string) => {
    try {
      switch (key) {
        case "create":
          if (validateCheck(state)) {
            const payload = convertToPayload(state);
            await dispatch(postSpecialty(payload));
            onClose(true);
          } else {
            reducerDispatch(validator());
          }
          break;
        case "save":
          if (validateCheck(state)) {
            const payload = convertToPayload(state);
            await dispatch(patchSpecialtyById(payload));
            onClose(true);
          } else {
            reducerDispatch(validator());
          }
          break;
        case "delete":
          await dispatch(deleteSpecialty(specialtyId as string));
          onClose(true);
          break;
        case "cancel":
          onClose();
          break;
      }
    } catch (error) {
      console.log(`${key} specialty failed`);
    }
  };

  const getButtonList = () => {
    return isCreate
      ? [{ label: "新增", onClick: () => handleButtonClick("create") }]
      : [
          { label: "刪除", onClick: () => handleButtonClick("delete") },
          { label: "保存", onClick: () => handleButtonClick("save") }
        ];
  };
  return (
    <BaseDraw
      title={isCreate ? "新增客製化選項" : "編輯客製化選項"}
      open={open}
      onClose={onClose}
      buttonList={getButtonList()}
    >
      <Stack sx={{ p: 3 }} gap={3}>
        {fieldList.map((field) => (
          <FieldContainer
            width={200}
            key={`specialty-input-${field.id}`}
            value={state[field.id].value}
            onChange={handleFieldChange}
            error={state[field.id].invalid}
            {...field}
          />
        ))}
        {state.items.value.map((item: ISpecialtyItem, index: number) => (
          <Stack
            key={`items-${item.id ? item.id : `new-${index}`}`}
            direction="row"
            gap={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Autocomplete
              value={item.title}
              onChange={(event, value) => handleSpecialtyItemChange({ index, key: "title", value })}
              filterOptions={filterOptions}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              options={specialtyItemOptions}
              getOptionLabel={getOptionLabel}
              renderOption={(props, option) => <li {...props}>{typeof option === "string" ? option : option.title}</li>}
              sx={{ width: "60%" }}
              freeSolo
              renderInput={(params) => <TextField placeholder="請輸入客製化選項" {...params} />}
            />
            <TextInput
              type="number"
              value={item.price}
              onChange={(event) =>
                handleSpecialtyItemChange({ index, key: "price", value: event.target.value.replace(/^0+(?!$)/, "") })
              }
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
            />
            <IconButton sx={{ width: "10%" }} onClick={() => reducerDispatch(deleteItem(index))}>
              <CancelIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </BaseDraw>
  );
};

export default SpecialtyDetail;
