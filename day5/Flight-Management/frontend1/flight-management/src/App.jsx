import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateFlight from "./pages/CreateFlight";
import EditFlight from "./pages/EditFlight";
import ViewFlight from "./pages/ViewFlight";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateFlight />} />
        <Route path="/edit/:id" element={<EditFlight />} />
        <Route path="/view/:id" element={<ViewFlight />} />
      </Routes>
    </>
  );
};

export default App;
