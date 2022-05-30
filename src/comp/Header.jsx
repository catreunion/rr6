import React from "react"
import { AppBar, Typography, Box } from "@mui/material"
import SchoolIcon from "@mui/icons-material/School"

const Header = () => {
  return (
    <AppBar position="relative">
      <Typography variant="h6" color="inherit" noWrap>
        <Box sx={{ height: 50, display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          NFT Gallery
          <SchoolIcon />
        </Box>
      </Typography>
    </AppBar>
  )
}

export default Header
