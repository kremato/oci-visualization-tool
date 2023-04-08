import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Typography,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { SocketStatus } from "./SocketStatus";
import { ApiStatus } from "./ApiStatus";
import { useState } from "react";
import fetcher from "../../utils/fetcher";
import useSWR from "swr";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { profileActions } from "../../store/profileSlice";

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const currentProfile = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();
  let { data, error, isLoading } = useSWR<string[]>(
    `${import.meta.env.VITE_API}/profiles`,
    fetcher
  );
  if (error || isLoading || !data || data.length === 0) {
    return <div>NO PROFILE</div>;
  }

  if (currentProfile === undefined) {
    dispatch(profileActions.replaceProfile(data[0]));
  }

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OCI Visualization Tool
          </Typography>
          <Stack direction="row" spacing={2}>
            <ApiStatus />
            <SocketStatus />
          </Stack>
          <Button
            color="inherit"
            onClick={() =>
              (window.location.href =
                "https://github.com/kremato/oci-visualization-tool#usage")
            }
          >
            Help
          </Button>
          <Button
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleClick}
            color="inherit"
            startIcon={<AccountCircle />}
          >
            {currentProfile}
          </Button>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* <MenuItem onClick={handleClose}>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Avatar /> My account
            </MenuItem> */}
            {data.map((profile) => (
              <MenuItem onClick={handleClose}>
                <Avatar />
                {profile}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
