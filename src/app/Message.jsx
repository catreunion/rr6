// goerli
import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Stack, Button, Typography, TextField } from "@mui/material"
import LoadingButton from "@mui/lab/LoadingButton"
import CreateIcon from "@mui/icons-material/Create"

import alchemyLogo from "../asset/alchemyLogo.svg"
import abi from "../asset/Message.json"

const Message = () => {
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
      <img src={alchemyLogo} alt="Alchemy logo"></img>

      <Button onClick={connectWallet} variant="contained">
        {hasMetamask ? (isConnected ? "Connected " + String(myAddr).substring(0, 6) + "..." + String(myAddr).substring(38) : "Connect MetaMask") : "Please install MetaMask"}
      </Button>

      <Typography sx={{ pt: 2, pb: 1 }} variant="h6">
        Current Message :
      </Typography>

      <Typography sx={{ pb: 1 }} variant="h6">
        {msg}
      </Typography>

      <TextField
        onChange={(e) => {
          setNewMsg(e.target.value)
        }}
        sx={{ width: 420, pb: 3 }}
        id="newMsg"
        label="leave your message"
      />

      <LoadingButton
        loading={loading}
        loadingPosition="start"
        startIcon={<CreateIcon />}
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

export default Message
