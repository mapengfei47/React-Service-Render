import React from 'react'
import Header from '../../components/Header'

const Home = () =>{
    return (<div>
        <Header />
        <h1>Welcome to React 同构</h1>
        <button onClick={() => alert('同构成功')}>Click Me</button>
    </div>)
}

export default Home