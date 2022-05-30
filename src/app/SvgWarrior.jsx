// https://alchemysvg.netlify.app/
// mumbai
import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Stack, Button, TextField } from "@mui/material"
import LoadingButton from "@mui/lab/LoadingButton"
import SendIcon from "@mui/icons-material/Send"

// import SearchIcon from "@mui/icons-material/Search"

import alchemyLogo from "../asset/alchemyLogo.svg"
import abi from "../asset/SvgWarrior.json"
// import "../asset/Alchemy.css"

const SvgWarrior = () => {
  const [hasMetamask, setHasMetamask] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [myAddr, setMyAddr] = useState("")
  const [myTokenID, setMyTokenID] = useState(0)
  const contractAddress = "0xD36738601a475c912273B52B429348b488b90989"
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

  const handleClick = () => {
    setLoading(true)
  }

  const mintNFT = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer)
        const tx = await contractInstance.mint()
        await tx.wait()
        // setLoading(false)
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  const trainWarrior = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer)
        const tx = await contractInstance.train(myTokenID)
        await tx.wait()
        // setLoading(false)
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  return (
    <Stack direction="column" spacing={3} alignItems="center">
      <img src={alchemyLogo} alt="Alchemy logo"></img>

      <Stack direction="row" spacing={2}>
        <LoadingButton
          loading={loading}
          loadingPosition="start"
          startIcon={<SendIcon />}
          onClick={() => {
            handleClick()
            mintNFT()
          }}
          size="medium"
          variant="contained"
        >
          Mint NFT
        </LoadingButton>

        <Button onClick={connectWallet} variant="contained">
          {hasMetamask ? (isConnected ? "Connected " + String(myAddr).substring(0, 6) + "..." + String(myAddr).substring(38) : "Connect MetaMask") : "Please install MetaMask"}
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <TextField onChange={(e) => setMyTokenID(e.target.value)} sx={{ width: 210 }} id="myTokenID" label="paste your Token ID here" />

        <LoadingButton
          loading={loading}
          loadingPosition="end"
          endIcon={<SendIcon />}
          onClick={() => {
            handleClick()
            trainWarrior()
          }}
          size="medium"
          variant="contained"
        >
          Train Warrior
        </LoadingButton>
      </Stack>
    </Stack>
  )
}

export default SvgWarrior
