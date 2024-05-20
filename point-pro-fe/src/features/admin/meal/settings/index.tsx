import { FC, useEffect, useState, ChangeEvent, Fragment } from "react";
import { cloneDeep } from "lodash";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { AdminLayout, Base, TextInput } from "~/components";
import SpecialtyDetail from "./SpecialtyDetail";
import { ICategory, ISpecialty } from "~/types";
import { useAppDispatch, useAppSelector } from "~/hooks";
import { getSpecialties, getCategories, postCategory, deleteCategory } from "~/store/slices";

const initCategory = { id: "", title: "" };

export const AdminMealSettings: FC = () => {
  const categories: ICategory[] = useAppSelector((state) => state.category.categories);
  const specialties: ISpecialty[] = useAppSelector((state) => state.specialty.specialties);
  const [categoryList, setCategoryList] = useState<ICategory[] | undefined>();
  const [specialtyList, setSpecialtyList] = useState<ISpecialty[] | undefined>();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setCategoryList(categories);
  }, [categories]);

  useEffect(() => {
    setSpecialtyList(specialties);
  }, [specialties]);

  const handleAddCategory = () => {
    if (categoryList?.at(-1)?.id) {
      setCategoryList((val) => (val ? [...val, initCategory] : [initCategory]));
    }
  };

  const handleChangeCategory = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    if (categoryList) {
      let cloneCategoryList = cloneDeep(categoryList);
      cloneCategoryList[categoryList?.length - 1].title = event.target.value;
      setCategoryList(cloneCategoryList);
    }
  };

  const handleEditCategory = async (categoryId: string) => {
    try {
      if (categoryId) {
        // delete
        await dispatch(deleteCategory(categoryId));
      } else {
        // create
        let title = categoryList?.at(-1)?.title;
        if (title) {
          await dispatch(postCategory({ title }));
        } else {
          return;
        }
      }
      console.log(`${categoryId ? "delete" : "create"} category successfully`);
    } catch (error) {
      console.log(`${categoryId ? "delete" : "create"} category failed`, error);
    }
    await dispatch(getCategories());
  };

  const handleCreateSpecailty = () => {
    setSelectedSpecialty(undefined);
    setOpen(true);
  };

  const handleEditSpecialty = async (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
    setOpen(true);
  };

  const handleCloseDrawer = (update?: boolean) => {
    setOpen(false);
    setSelectedSpecialty(undefined);
    if (update) {
      dispatch(getSpecialties());
    }
  };

  return (
    <AdminLayout>
      <Base display="flex" justifyContent="space-between" sx={{ userSelect: "none" }}>
        <Stack width="50%" gap={3} p={2}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            分類
          </Typography>
          {categoryList?.map((category) => (
            <Fragment key={`category-input-${category.id ? category.id : "new"}`}>
              <TextInput
                value={category.title}
                placeholder="請輸入新增分類項目"
                disabled={Boolean(category.id)}
                onChange={handleChangeCategory}
                sx={{
                  "& .Mui-disabled": {
                    color: (theme) => theme.palette.primary.contrastText,
                    WebkitTextFillColor: "unset !important"
                  }
                }}
                endAdornment={
                  <IconButton onClick={() => handleEditCategory(category.id)}>
                    {category.id ? <CloseIcon /> : <AddIcon />}
                  </IconButton>
                }
              />
            </Fragment>
          ))}
          <Button variant="contained" onClick={handleAddCategory} startIcon={<AddIcon />}>
            新增
          </Button>
        </Stack>
        <Stack width="50%" gap={3} p={2}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            客製化
          </Typography>
          {specialtyList?.map((specialty) => (
            <TextInput
              key={`specialty-${specialty.id}`}
              value={specialty.title}
              disabled
              sx={{
                "& .Mui-disabled": {
                  color: (theme) => theme.palette.primary.contrastText,
                  WebkitTextFillColor: "unset !important"
                }
              }}
              endAdornment={
                <IconButton onClick={() => handleEditSpecialty(specialty.id)}>
                  <FormatAlignJustifyIcon />
                </IconButton>
              }
            />
          ))}
          <Button variant="contained" onClick={handleCreateSpecailty} startIcon={<AddIcon />}>
            新增
          </Button>
        </Stack>
        <SpecialtyDetail open={open} onClose={handleCloseDrawer} specialtyId={selectedSpecialty} />
      </Base>
    </AdminLayout>
  );
};
