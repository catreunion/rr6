// https://alchemysvg.netlify.app/
// mumbai
import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
// import { Typography, TextField, Stack, Button } from "@mui/material"
// import LoadingButton from "@mui/lab/LoadingButton"
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

  // const handleClick = () => {
  //   setLoading(true)
  // }

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
    <div className="App">
      <div id="container">
        <img id="logo" src={alchemyLogo} alt=""></img>
        <button id="walletButton" onClick={connectWallet}>
          {hasMetamask ? (isConnected ? "Connected " + String(myAddr).substring(0, 6) + "..." + String(myAddr).substring(38) : "Connect MetaMask") : "Please install MetaMask"}
        </button>

        <h2 style={{ paddingTop: "18px" }}>Token ID :</h2>
        <div>
          <input type="number" placeholder="paste your Token ID here" onChange={(e) => setMyTokenID(e.target.value)} value={myTokenID} />
        </div>

        <button id="publish" onClick={mintNFT}>
          Mint
        </button>
        <button id="publish" onClick={trainWarrior}>
          Train
        </button>
      </div>
    </div>
  )
}

export default SvgWarrior
