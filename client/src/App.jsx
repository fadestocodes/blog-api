import React from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import { useState } from 'react'
import './App.css'

const Home = () => <h1>Home Page</h1>;
const About = () => <h1>About Page</h1>;

function App (){
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element ={<Home/>} />
        <Route path="/about" element ={<About/>} />
      </Routes>
    </div>
  );
};

export default App;