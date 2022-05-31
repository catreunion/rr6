import React from "react"
import { Routes, Route } from "react-router-dom"
import Layout from "./comp/Layout"
import Home from "./page/Home"
import NotFound from "./page/NotFound"

import Gallery from "./app/Gallery"
import HToken from "./app/HToken"
import Message from "./app/Message"
import PriceConsumerV3 from "./app/PriceConsumerV3"
import SvgWarrior from "./app/SvgWarrior"
import VRFv2Consumer from "./app/VRFv2Consumer"
import Week01 from "./app/Week01"
import Week04 from "./app/Week04"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />

        <Route path="gallery" element={<Gallery />} />
        <Route path="token" element={<HToken />} />
        <Route path="message" element={<Message />} />
        <Route path="pricefeed" element={<PriceConsumerV3 />} />
        <Route path="svgwarrior" element={<SvgWarrior />} />
        <Route path="rnum" element={<VRFv2Consumer />} />

        <Route path="week1" element={<Week01 />} />
        <Route path="week4" element={<Week04 />} />
      </Route>
    </Routes>
  )
}

export default App
