import React from 'react';
import '../styles/home.css';


const Home = () => {
    return(
        <>
            <section id="showcase" className="container">
                <div className="showcase-content">
                    <h1>JWT Auth demo project</h1>
                    <p>This is a simple project I made for myself to learn JWT authentication.</p>
                </div>
            </section>
        </>
    );
}

export default Home;