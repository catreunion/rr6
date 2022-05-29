import React from "react"
// import { Routes, Route, Link, Outlet, useParams, useNavigate } from "react-router-dom"
import { Routes, Route } from "react-router-dom"
import Layout from "./comp/Layout"
import Home from "./page/Home"
import NotFound from "./page/NotFound"

import Message from "./page/Message"
import HToken from "./page/HToken"
import SvgWarrior from "./page/SvgWarrior"
import Week01 from "./page/Week01"
import Week04 from "./page/Week04"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />

        <Route path="message" element={<Message />} />
        <Route path="token" element={<HToken />} />
        <Route path="week1" element={<Week01 />} />
        <Route path="svgwarrior" element={<SvgWarrior />} />
        <Route path="week4" element={<Week04 />} />
      </Route>
    </Routes>
  )
}

export default App
