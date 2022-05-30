// https://alchemymsg.netlify.app/
// Kovan
import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Typography, Stack, Button } from "@mui/material"
import LoadingButton from "@mui/lab/LoadingButton"
import SearchIcon from "@mui/icons-material/Search"

import alchemyLogo from "../asset/alchemyLogo.svg"
import abi from "../asset/PriceConsumerV3.json"

const Message = () => {
  const [hasMetamask, setHasMetamask] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [myAddr, setMyAddr] = useState("")
  const contractAddress = "0x649410729182A7faAceEf6eCda015592AdD22CAE"
  const contractABI = abi.abi
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true)
    }
  }, [])

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const [account] = await window.ethereum.request({ method: "eth_requestAccounts" })
        setMyAddr(account)
        setIsConnected(true)
        // updatePrice()
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  const updatePrice = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer)
        setPrice(await contractInstance.getLatestPrice())
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  const handleClick = () => {
    setLoading(true)
  }

  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <img src={alchemyLogo} alt="logo"></img>

      <Button onClick={connectWallet} variant="contained">
        {hasMetamask ? (isConnected ? "Connected " + String(myAddr).substring(0, 6) + "..." + String(myAddr).substring(38) : "Connect MetaMask") : "Please install MetaMask"}
      </Button>

      <Typography variant="h6" gutterBottom>
        Current Price of ETH / USD:
      </Typography>

      <Typography variant="h6" gutterBottom>
        {price}
      </Typography>

      <LoadingButton
        loading={loading}
        loadingPosition="start"
        startIcon={<SearchIcon />}
        onClick={() => {
          handleClick()
          updatePrice()
        }}
        size="medium"
        variant="contained"
      >
        Check Price
      </LoadingButton>
    </Stack>
  )
}

export default Message
