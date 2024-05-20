import { Box, InputBase, styled, IconButton } from "@mui/material";

export const SubscribeSectionStyledCard = styled(Box)`
  && {
    background-color: white;
    border-radius: 2.5rem;
    border: 0.375rem solid ${(props) => props.theme.palette.primary.main};
    box-shadow: 20px 20px 0px ${(props) => props.theme.palette.primary.main};
  }
`;

export const SubscribeSectionInputContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 50px;
  padding: 1rem 1rem 1rem 2.5rem;
  transition: outline 0.2s ease-in-out;
  background-color: ${(props) => props.theme.palette.background.paper};
  &:hover {
    outline: 2px solid ${(props) => props.theme.palette.primary.main};
  }
`;

export const SubscribeSectionInputBase = styled(InputBase)`
  && {
    font-size: 20px;
  }
`;

export const SubscribeSectionIconButton = styled(IconButton)`
  && {
    transition: all 0.3s ease-in-out;
    &:disabled {
      background-color: #00000014;
    }
    background-color: ${(props) => props.theme.palette.primary.main};
  }
`;
