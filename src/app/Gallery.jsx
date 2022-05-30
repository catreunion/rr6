import React, { useState } from "react"
import { NFTCard } from "../comp/NFTCard"
import Header from "../comp/Header"
import Footer from "../comp/Footer"

import { Paper, Stack, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Box, Grid } from "@mui/material"
import LoadingButton from "@mui/lab/LoadingButton"
import SearchIcon from "@mui/icons-material/Search"
import alchemyLogo from "../asset/alchemyLogo.svg"

const Gallery = () => {
  const [walletAddr, setWalletAddr] = useState("")
  const [collection, setCollection] = useState("")
  const [isCollection, setIsCollection] = useState(false)
  const [loading, setLoading] = useState(false)
  const [NFTs, setNFTs] = useState([])
  const { REACT_APP_ALCHEMY_MAINNET_KEY } = process.env

  const handleClick = () => {
    setLoading(true)
  }

  var requestOptions = {
    method: "GET"
  }

  const fetchPersonalNFTs = async () => {
    let collectedNFTs
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${REACT_APP_ALCHEMY_MAINNET_KEY}/getNFTs/`

    if (!collection.length) {
      console.log("searching NFTs owned by the wallet address")
      const fetchURL = `${baseURL}?owner=${walletAddr}`
      collectedNFTs = await fetch(fetchURL, requestOptions).then((data) => data.json())
    } else {
      console.log("searching NFTs in the collection owned by the wallet address")
      const fetchURL = `${baseURL}?owner=${walletAddr}&contractAddresses%5B%5D=${collection}`
      collectedNFTs = await fetch(fetchURL, requestOptions).then((data) => data.json())
    }

    if (collectedNFTs) {
      // console.log(collectedNFTs)
      setNFTs(collectedNFTs.ownedNfts)
    }

    setLoading(false)
  }

  const fetchCollection = async () => {
    if (collection.length) {
      console.log("searching the collection")
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${REACT_APP_ALCHEMY_MAINNET_KEY}/getNFTsForCollection/`
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`
      const collectedNFTs = await fetch(fetchURL, requestOptions).then((data) => data.json())

      if (collectedNFTs) {
        // console.log(collectedNFTs)
        setNFTs(collectedNFTs.nfts)
      }

      setLoading(false)
    } else {
      alert("A collection address is needed.")
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <Paper sx={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", maxWidth: 500, py: 2, mt: 2 }}>
        <a target="_blank" href="https://docs.alchemy.com/alchemy/road-to-web3/weekly-learning-challenges/4.-how-to-create-an-nft-gallery-alchemy-nft-api" rel="noopener noreferrer">
          <img src={alchemyLogo} alt="Alchemy"></img>
        </a>

        <Stack direction="column" spacing={2} alignItems="center">
          <TextField
            disabled={isCollection}
            onChange={(e) => {
              setWalletAddr(e.target.value)
            }}
            sx={{ minWidth: 300 }}
            id="walletAddr"
            label="paste a wallet address here"
          />
          <TextField
            onChange={(e) => {
              setCollection(e.target.value)
            }}
            sx={{ minWidth: 300 }}
            id="collection"
            label="paste a collection address here"
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <FormControl>
              {/* <FormLabel></FormLabel> */}
              <RadioGroup
                onChange={(e) => {
                  if (e.target.value === "collection") {
                    setIsCollection(true)
                  } else {
                    setIsCollection(false)
                  }
                }}
              >
                <FormControlLabel control={<Radio />} value="wallet" label="Search Wallet NFTs" />
                <FormControlLabel control={<Radio />} value="collection" label="Search Contract NFTs" />
              </RadioGroup>
            </FormControl>

            <LoadingButton
              loading={loading}
              loadingPosition="start"
              startIcon={<SearchIcon />}
              onClick={() => {
                handleClick()
                if (isCollection) {
                  fetchCollection()
                } else fetchPersonalNFTs()
              }}
              size="medium"
              variant="contained"
            >
              SEARCH
            </LoadingButton>
          </Stack>
        </Stack>
      </Paper>

      <Box sx={{ p: 2 }}>
        <Grid spacing={2} container>
          {NFTs.map((NFT) => (
            <NFTCard nft={NFT} key={NFT.media[0].gateway} />
          ))}
        </Grid>
      </Box>

      <Footer />
    </>
  )
}

export default Gallery
