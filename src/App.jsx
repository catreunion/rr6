import React from "react"
// import { Routes, Route, Link, Outlet, useParams, useNavigate } from "react-router-dom"
import { Routes, Route } from "react-router-dom"
import Layout from "./comp/Layout"
import Home from "./page/Home"
import Week01 from "./page/Week01"
import Week04 from "./page/Week04"
import NotFound from "./page/NotFound"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />

        <Route path="week1" element={<Week01 />} />
        <Route path="week4" element={<Week04 />} />
      </Route>
    </Routes>
  )
}

export default App
