import React from "react"
import { Box, Typography, Link } from "@mui/material"

const Footer = () => {
  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" align="center" gutterBottom>
        This demo is based on a tutorial by{" "}
        <Link href="https://twitter.com/vittostack" target={"_blank"}>
          Vitto Rivabella
        </Link>{" "}
        from Alchemy.
      </Typography>

      <Typography variant="subtitle1" align="center" color="text.secondary">
        Vitto's tutorial can be found in{" "}
        <Link href="https://docs.alchemy.com/alchemy/road-to-web3/weekly-learning-challenges/4.-how-to-create-an-nft-gallery-alchemy-nft-api" target={"_blank"}>
          Alchemy
        </Link>{" "}
        and{" "}
        <Link href="https://youtu.be/JzsTfOFjC1o" target={"_blank"}>
          YouTube
        </Link>
      </Typography>
    </Box>
  )
}

export default Footer
