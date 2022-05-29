// https://alchemyhht.netlify.app/
// goerli
import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
// import { Typography, TextField, Stack, Button } from "@mui/material"
// import LoadingButton from "@mui/lab/LoadingButton"
// import SearchIcon from "@mui/icons-material/Search"

import alchemyLogo from "../asset/alchemyLogo.svg"
import abi from "../asset/HToken.json"
import "../asset/HToken.css"

const HToken = () => {
  const [hasMetamask, setHasMetamask] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [myAddr, setMyAddr] = useState("")
  const [recipientAddr, setRecipientAddr] = useState("")
  const contractAddress = "0x892a25cBcbA3CFA34c6B4a49dAa908B0bf670676"
  const contractABI = abi.abi
  const [balance, setBalance] = useState("")
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

  // const handleClick = () => {
  //   setLoading(true)
  // }

  const sendETH = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer)
        const tx = await contractInstance.transfer(recipientAddr, 100)
        await tx.wait()
        checkBalance()
        // setLoading(false)
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please install MetaMask")
    }
  }

  return (
    <div className="App">
      <div id="container">
        <img id="logo" src={alchemyLogo} alt=""></img>
        <button id="walletButton" onClick={connectWallet}>
          {hasMetamask ? (isConnected ? "Connected " + String(myAddr).substring(0, 6) + "..." + String(myAddr).substring(38) : "Connect MetaMask") : "Please install MetaMask"}
        </button>

        <h2 style={{ paddingTop: "50px" }}>Balance of my Hardhat Token :</h2>
        <p>{balance}</p>

        <h2 style={{ paddingTop: "18px" }}>Recipient Wallet Address :</h2>
        <div>
          <input type="text" placeholder="Send 100 Hardhat Token" onChange={(e) => setRecipientAddr(e.target.value)} value={recipientAddr} />
        </div>

        <button id="publish" onClick={checkBalance}>
          Check Balance
        </button>
        <button id="publish" onClick={sendETH}>
          Send 100 Hardhat Token
        </button>
      </div>
    </div>
  )
}

export default HToken
