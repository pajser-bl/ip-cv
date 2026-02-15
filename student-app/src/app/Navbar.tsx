import {useMemo, useState} from "react";
import {NavLink, useLocation} from "react-router-dom";
import {useKeycloak} from "@react-keycloak/web";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    IconButton,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    Divider,
    Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../assets/ipcv_logo.svg";


type NavItem = { label: string; to: string };

export default function Navbar() {
    const {keycloak} = useKeycloak();
    const location = useLocation();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

    const username = (keycloak.tokenParsed?.preferred_username as string | undefined) ?? (keycloak.tokenParsed?.email as string | undefined) ?? "Unknown";

    const navItems: NavItem[] = useMemo(
        () => [
            {label: "My Internships", to: "/my-internships"},
            {label: "Internships", to: "/internships"},
            {label: "Profile", to: "/profile"},
        ],
        []
    );

    const isActive = (to: string) =>
        location.pathname === to || location.pathname.startsWith(`${to}/`);

    const openUserMenu = (e: React.MouseEvent<HTMLElement>) =>
        setUserMenuAnchor(e.currentTarget);
    const closeUserMenu = () => setUserMenuAnchor(null);

    const logout = () => {
        closeUserMenu();
        keycloak.logout();
    };

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}
            >
                <Toolbar sx={{gap: 1.5}}>
                    {/* Mobile hamburger */}
                    <IconButton
                        edge="start"
                        onClick={() => setDrawerOpen(true)}
                        sx={{display: {xs: "inline-flex", md: "none"}}}
                        aria-label="open navigation"
                    >
                        <MenuIcon/>
                    </IconButton>

                    {/* Brand */}
                    <Box
                        component={NavLink}
                        to="/internships"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            textDecoration: "none",
                            color: "inherit",
                            transition: "opacity 0.2s ease",
                            "&:hover": {
                                opacity: 0.8,
                            },
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="Internship Portal"
                            sx={{
                                height: 34,
                                width: "auto",
                                display: "block",
                            }}
                        />

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                letterSpacing: 0.3,
                                display: { xs: "none", sm: "block" }, // hide text on very small screens
                            }}
                        >
                            Internship Portal
                        </Typography>
                    </Box>

                    {/* Desktop nav */}
                    <Box sx={{display: {xs: "none", md: "flex"}, gap: 1, ml: 1}}>
                        {navItems.map((item) => (
                            <Button
                                key={item.to}
                                component={NavLink}
                                to={item.to}
                                color="inherit"
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                    px: 1.5,
                                    ...(isActive(item.to)
                                        ? {bgcolor: "action.selected"}
                                        : {bgcolor: "transparent"}),
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{flex: 1}}/>

                    {/* User menu */}
                    <Tooltip title="Account">
                        <Button
                            color="inherit"
                            onClick={openUserMenu}
                            startIcon={<AccountCircleIcon/>}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                maxWidth: 240,
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {username}
                            </Box>
                        </Button>
                    </Tooltip>

                    <Menu
                        anchorEl={userMenuAnchor}
                        open={Boolean(userMenuAnchor)}
                        onClose={closeUserMenu}
                        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                        transformOrigin={{vertical: "top", horizontal: "right"}}
                    >
                        <MenuItem component={NavLink} to="/profile" onClick={closeUserMenu}>
                            Profile / CV
                        </MenuItem>
                        <Divider/>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Mobile drawer */}
            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{width: 280, pt: 1}}>
                    <List>
                        {navItems.map((item) => (
                            <ListItemButton
                                key={item.to}
                                component={NavLink}
                                to={item.to}
                                onClick={() => setDrawerOpen(false)}
                                selected={isActive(item.to)}
                            >
                                <ListItemText primary={item.label}/>
                            </ListItemButton>
                        ))}
                        <Divider sx={{my: 1}}/>
                        <ListItemButton
                            component={NavLink}
                            to="/profile"
                            onClick={() => setDrawerOpen(false)}
                            selected={isActive("/profile")}
                        >
                            <ListItemText primary="Profile / CV"/>
                        </ListItemButton>
                        <ListItemButton onClick={logout}>
                            <ListItemText primary="Logout"/>
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>
        </>
    );
}
