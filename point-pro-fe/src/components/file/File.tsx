import { FC, useState, useRef, useEffect } from "react";
import { Button, Box } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { FileInput } from "~/components";

interface IFileProps {
  width: number;
  value?: any;
  handleChange: (file: File) => void;
}

export const File: FC<IFileProps> = ({ width, value, handleChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        setPreview(value);
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(value);
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
      }
    } else {
      setPreview(undefined);
    }
  }, [value]);

  const handleFileChange = () => {
    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        handleChange(file);
      };
    }
  };

  const handleUploadFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ width }}>
      <Button
        color="secondary"
        onClick={handleUploadFile}
        sx={{
          width,
          height: width,
          backgroundColor: (theme) => theme.palette.common.black_20,
          "&:hover": {
            backgroundColor: (theme) => theme.palette.common.black_40
          }
        }}
      >
        {preview ? (
          <Box component="img" src={preview} sx={{ width: "200px", height: "200px", objectFit: "contain" }} />
        ) : (
          <ImageIcon color="primary" sx={{ width: "100px", height: "100px" }} />
        )}
      </Button>
      <FileInput ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
    </Box>
  );
};
