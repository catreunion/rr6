// https://alchemyhht.netlify.app/
// goerli
import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Typography, TextField, Stack, Button } from "@mui/material"
import LoadingButton from "@mui/lab/LoadingButton"
import SendIcon from "@mui/icons-material/Send"

import alchemyLogo from "../asset/alchemyLogo.svg"
import abi from "../asset/HToken.json"
// import "../asset/Alchemy.css"

const HToken = () => {
  const [hasMetamask, setHasMetamask] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [myAddr, setMyAddr] = useState("")
  const [recipientAddr, setRecipientAddr] = useState("")
  const contractAddress = "0x892a25cBcbA3CFA34c6B4a49dAa908B0bf670676"
  const contractABI = abi.abi
  const [balance, setBalance] = useState("")
  const [loading, setLoading] = useState(false)
  // const [amount, setAmount] = useState(0)

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
        checkBalance()
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  const checkBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const [account] = await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contractInstance = new ethers.Contract(contractAddress, contractABI, provider)
        setBalance((await contractInstance.balanceOf(account)).toString())
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

  const sendETH = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer)
        const tx = await contractInstance.transfer(recipientAddr, 100)
        await tx.wait()
        checkBalance()
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
        Balance of my Hardhat Token : {balance}
      </Typography>

      <Typography sx={{ pb: 1 }} variant="h6"></Typography>

      <TextField onChange={(e) => setRecipientAddr(e.target.value)} sx={{ width: 420, pb: 3 }} id="recipientAddr" label="recipient wallet address" />

      <Stack direction="row" spacing={2}>
        <LoadingButton
          loading={loading}
          loadingPosition="end"
          endIcon={<SendIcon />}
          onClick={() => {
            handleClick()
            sendETH()
          }}
          size="medium"
          variant="contained"
        >
          Send Token
        </LoadingButton>
        <Button
          onClick={() => {
            checkBalance()
          }}
          size="medium"
          variant="contained"
        >
          Check Balance
        </Button>{" "}
      </Stack>
    </Stack>
  )
}

export default HToken
