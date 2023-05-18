import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

export default function NavigationRoutes({routes, defaultRoute}) {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(route=>
          <Route path={route.path} element={route.element} key={route.path}/>
        )}
        <Route path="/" element={<Navigate to={defaultRoute}/>} />
      </Routes>
    </BrowserRouter>
  )
}
