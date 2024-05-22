import { FC, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import { AdminLayout, Base, FieldContainer, headerHeight } from "~/components";
import mainReducer, {
  initialState,
  defaultSetting,
  editField,
  convertToPayload,
  validateCheck,
  validator
} from "./reducers";
import { useAppDispatch, useAppSelector } from "~/hooks";
import { getMealById, postMeal, patchMealById, uploadImg, deleteMeal } from "~/store/slices";

export const AdminMealListDetail: FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const isCreate = params.meal_id === "create";
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.category.categories);
  const specialties = useAppSelector((state) => state.specialty.specialties);
  const [state, reducerDispatch] = useReducer(mainReducer, initialState);

  useEffect(() => {
    if (isCreate) {
      reducerDispatch(defaultSetting(null));
    } else {
      dispatchGetMealById();
    }
  }, []);

  const dispatchGetMealById = async () => {
    try {
      const { result } = await dispatch(getMealById(params.meal_id as string)).unwrap();
      reducerDispatch(defaultSetting(result));
    } catch (error) {
      navigate({ pathname: "/admin/meal/list" });
    }
  };

  const fieldList = [
    {
      id: "title",
      label: "名稱",
      type: "text"
    },
    {
      id: "coverUrl",
      label: "照片",
      type: "file"
    },
    {
      id: "description",
      label: "描述",
      type: "textarea"
    },
    {
      id: "price",
      label: "價格",
      type: "dollar"
    },
    {
      id: "publishedAt",
      label: "上架時間",
      type: "date"
    },
    {
      id: "isPopular",
      label: "熱門",
      type: "checkbox"
    },
    {
      id: "categories",
      label: "分類",
      type: "select",
      multiple: true,
      list: categories
    },
    {
      id: "specialties",
      label: "客製化",
      type: "select",
      multiple: true,
      list: specialties
    }
  ];

  const handleButtonClick = async (key: string) => {
    try {
      switch (key) {
        case "create":
          if (validateCheck(state)) {
            const payload = convertToPayload(state);
            if (payload.coverUrl) {
              payload.coverUrl = (await updateImage(payload.coverUrl)) || "";
            }

            await dispatch(postMeal(payload));
            navigate({ pathname: "/admin/meal/list" });
          } else {
            reducerDispatch(validator());
          }
          break;
        case "save":
          if (validateCheck(state)) {
            const payload = convertToPayload(state);
            if (payload.coverUrl && typeof payload.coverUrl !== "string") {
              payload.coverUrl = (await updateImage(payload.coverUrl)) || "";
            }
            await dispatch(patchMealById({ mealId: params.meal_id as string, payload }));
            navigate({ pathname: "/admin/meal/list" });
          } else {
            reducerDispatch(validator());
          }
          break;
        case "delete":
          await dispatch(deleteMeal(params.meal_id as string));
          navigate({ pathname: "/admin/meal/list" });
          break;
        case "cancel":
          navigate({ pathname: "/admin/meal/list" });
          break;
      }
    } catch (error) {
      console.log(`${key} meal failed`);
    }
  };

  const handleFieldChange = (props: { id: string; value: any }) => {
    reducerDispatch(editField(props));
  };
  const updateImage = async (file: string) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { result } = await dispatch(uploadImg(formData)).unwrap();
      return result;
    } catch (error) {
      console.log("upload file error : ", error);
      return "";
    }
  };
  return (
    <AdminLayout>
      <Base>
        <Stack sx={{ flexWrap: "wrap", maxHeight: `calc(100vh - ${headerHeight} - 47px)`, gap: 5 }}>
          {fieldList.map((config) => (
            <FieldContainer
              key={`meal-${config.id}`}
              width={200}
              value={state[config.id].value}
              onChange={handleFieldChange}
              error={state[config.id].invalid}
              {...config}
            />
          ))}
        </Stack>
        {/* button */}
        <Stack direction="row" justifyContent="end" spacing={4}>
          <Button variant="contained" onClick={() => handleButtonClick("cancel")}>
            取消
          </Button>
          {isCreate ? (
            <>
              <Button variant="contained" onClick={() => handleButtonClick("create")}>
                新增
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" onClick={() => handleButtonClick("delete")}>
                刪除
              </Button>
              <Button variant="contained" onClick={() => handleButtonClick("save")}>
                保存
              </Button>
            </>
          )}
        </Stack>
      </Base>
    </AdminLayout>
  );
};
