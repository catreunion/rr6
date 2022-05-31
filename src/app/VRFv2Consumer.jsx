// goerli
import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Typography, TextField, Stack, Button } from "@mui/material"
import LoadingButton from "@mui/lab/LoadingButton"
import SendIcon from "@mui/icons-material/Send"

import alchemyLogo from "../asset/alchemyLogo.svg"
import abi from "../asset/VRFv2Consumer.json"

const HToken = () => {
  const [hasMetamask, setHasMetamask] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [myAddr, setMyAddr] = useState("")
  const [index, setIndex] = useState(0)
  const [random, setRandom] = useState(0)
  const contractAddress = "0xc874da88C16E867BF5D89C7d449CC24b61B0Ad74"
  const contractABI = abi.abi
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
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  const getNumber = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contractInstance = new ethers.Contract(contractAddress, contractABI, provider)
        setRandom((await contractInstance.s_randomWords(index)).toString())
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

  const requestNumbers = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer)
        const tx = await contractInstance.requestRandomWords()
        await tx.wait()
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

      <LoadingButton
        loading={loading}
        loadingPosition="end"
        endIcon={<SendIcon />}
        onClick={() => {
          handleClick()
          requestNumbers()
        }}
        size="medium"
        variant="contained"
      >
        draw
      </LoadingButton>

      <Stack sx={{ py: 3 }} direction="row" spacing={2}>
        <TextField onChange={(e) => setIndex(e.target.value)} sx={{ width: 150 }} id="index" label="give me an index" />
        <Button
          onClick={() => {
            getNumber()
          }}
          size="medium"
          variant="contained"
        >
          show
        </Button>{" "}
      </Stack>

      <Typography sx={{ pt: 2, pb: 1 }} variant="h6">
        {random}
      </Typography>
    </Stack>
  )
}

export default HToken
