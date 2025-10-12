// // src/components/Navbar.tsx
// "use client";

// import { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   IconButton,
//   Menu,
//   MenuItem,
//   Avatar,
//   Divider,
//   CircularProgress, // Import CircularProgress for a better loading state
// } from "@mui/material";
// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";

// export default function Navbar() {
//   const { user, loading, logout } = useAuth();
//   const router = useRouter();
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);

//   const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     handleClose();
//     logout();
//   };
  
//   const handleProfile = () => {
//     handleClose();
//     router.push('/profile');
//   }

//   return (
//     <AppBar position="static">
//       <Toolbar>
//         <Typography variant="h6" sx={{ flexGrow: 1 }}>
//           <Link href={user ? "/home" : "/"} style={{ textDecoration: 'none', color: 'inherit' }}>
//             Mutual Fund Explorer
//           </Link>
//         </Typography>

//         {loading ? (
//           <CircularProgress color="inherit" size={24} />
//         ) : user ? (
//           // Authenticated User View
//           <Box sx={{ display: "flex", alignItems: 'center', gap: 2 }}>
//             <Button color="inherit" component={Link} href="/home">
//               Home
//             </Button>
//             <Button color="inherit" component={Link} href="/funds">
//               Funds
//             </Button>
//             <IconButton
//               onClick={handleMenu}
//               size="small"
//               sx={{ ml: 2 }}
//             >
//               <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
//                 {user.name?.charAt(0).toUpperCase()}
//               </Avatar>
//             </IconButton>
//             <Menu
//               anchorEl={anchorEl}
//               id="account-menu"
//               open={open}
//               onClose={handleClose}
//               onClick={handleClose}
//               transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//               anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//             >
//               <Box sx={{ px: 2, py: 1 }}>
//                 <Typography fontWeight="bold">{user.name}</Typography>
//                 <Typography variant="body2" color="text.secondary">{user.email}</Typography>
//               </Box>
//               <Divider />
//               <MenuItem onClick={handleProfile}>Profile</MenuItem>
//               <MenuItem onClick={() => router.push('/watchlist')}>Watchlist</MenuItem>
//               <Divider />
//               <MenuItem onClick={handleLogout}>Logout</MenuItem>
//             </Menu>
//           </Box>
//         ) : (
//           // Unauthenticated User View
//           <Box>
//             <Button color="inherit" component={Link} href="/login">
//               Sign In
//             </Button>
//           </Box>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// }


// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  CircularProgress, // Import CircularProgress
} from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };
  
  const handleProfile = () => {
    handleClose();
    router.push('/profile');
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link href={user ? "/home" : "/"} style={{ textDecoration: 'none', color: 'inherit' }}>
            Mutual Fund Explorer
          </Link>
        </Typography>

        {loading ? (
          <CircularProgress color="inherit" size={24} />
        ) : user ? (
          // Authenticated User View
          <Box sx={{ display: "flex", alignItems: 'center', gap: 2 }}>
            <Button color="inherit" component={Link} href="/home">
              Home
            </Button>
            <Button color="inherit" component={Link} href="/funds">
              Funds
            </Button>
            <IconButton
              onClick={handleMenu}
              size="small"
              sx={{ ml: 2 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography fontWeight="bold">{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={() => router.push('/watchlist')}>Watchlist</MenuItem>
              <MenuItem onClick={() => router.push('/virtual-portfolio')}>Virtual Portfolio</MenuItem> 
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          // Unauthenticated User View
          <Box>
            <Button color="inherit" component={Link} href="/login">
              Sign In
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}