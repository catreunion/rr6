// https://alchemymsg.netlify.app/
// goerli
import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Typography, TextField, Stack, Button } from "@mui/material"
import LoadingButton from "@mui/lab/LoadingButton"
import SearchIcon from "@mui/icons-material/Search"

import alchemylogo from "../asset/alchemylogo.svg"
import abi from "../asset/AlchemyMsg.json"

const Week01 = () => {
  const [hasMetamask, setHasMetamask] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [myAddr, setMyAddr] = useState("")
  const contractAddress = "0x5E8668153F30d57036416671E5E9E23F830d51cA"
  const contractABI = abi.abi
  const [msg, setMsg] = useState("")
  const [newMsg, setNewMsg] = useState("")
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
        getMessage()
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  const getMessage = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contractInstance = new ethers.Contract(contractAddress, contractABI, provider)
        setMsg(await contractInstance.getMsg())
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

  const updateMessage = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer)
        const tx = await contractInstance.updateMsg(newMsg)
        await tx.wait()
        getMessage()
        setLoading(false)
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <img src={alchemylogo} alt="logo"></img>
      <Button onClick={connectWallet} variant="contained">
        {hasMetamask ? (isConnected ? "Connected " + String(myAddr).substring(0, 6) + "..." + String(myAddr).substring(38) : "Connect MetaMask") : "Please install MetaMask"}
      </Button>
      <Typography variant="h6" gutterBottom>
        Current Message:
      </Typography>
      <Typography variant="h6" gutterBottom>
        {msg}
      </Typography>
      <TextField
        onChange={(e) => {
          setNewMsg(e.target.value)
        }}
        sx={{ width: 420 }}
        id="newMsg"
        label="leave your message"
      />
      <LoadingButton
        loading={loading}
        loadingPosition="start"
        startIcon={<SearchIcon />}
        onClick={() => {
          handleClick()
          updateMessage()
        }}
        size="medium"
        variant="contained"
      >
        Update Message
      </LoadingButton>
    </Stack>
  )
}

export default Week01
