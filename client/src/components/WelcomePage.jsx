import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';
import '../WelcomePage.css';

const WelcomePage = () => {
    return (
        <div className="welcome-page">
            <div className="background-image"></div>

            {/* Navbar for logo and breadcrumbs */}
            <nav className="navbar">
                <div className="logo">
                    <img src="/kiruna2.webp" alt="Logo" className="logo-img" />
                </div>
                <Breadcrumb className="breadcrumb-nav">
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/home" }}>
                        Explore the Move!
                        <div className="popup-message">Discover the journey of relocating Kiruna city.</div>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/about-us" }}>
                        About Us
                        <div className="popup-message">Learn about the mission behind the Kiruna city relocation.</div>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/faq" }}>
                        FAQ
                        <div className="popup-message">Find out all you need to know about the process.</div>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/contact" }}>
                        Contact Us
                        <div className="popup-message">Get in touch with us for any inquiries or assistance.</div>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/login" }}>
                        Login
                        <div className="popup-message">Access your account to manage your progress and data.</div>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </nav>

            {/* Welcome message */}
            <div className="welcome-message">
                <h1>Welcome to Kiruna eXplorer</h1>
                <p>Join us in mapping the transformation of Kiruna as we relocate this unique city.</p>
            </div>
        </div>
    );
}

export default WelcomePage;
