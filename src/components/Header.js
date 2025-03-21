import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: #4361ee;
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  
  span {
    color: #ffd60a;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Nav = styled.nav`
  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #4361ee;
    padding: 0;
    max-height: ${props => (props.isOpen ? '300px' : '0')};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out, box-shadow 0.3s ease;
    box-shadow: ${props => (props.isOpen ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none')};
    z-index: 999;
  }
  
  ul {
    display: flex;
    list-style: none;
    gap: 20px;
    align-items: center;
    margin: 0;
    padding: 0;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      padding: ${props => (props.isOpen ? '15px 0' : '0')};
      gap: 15px;
    }
  }
  
  li {
    font-weight: 500;
    
    @media (max-width: 768px) {
      width: 100%;
      text-align: center;
    }
  }
  
  a {
    color: white;
    transition: color 0.3s ease;
    text-decoration: none;
    
    &:hover {
      color: #ffd60a;
    }
    
    @media (max-width: 768px) {
      display: block;
      padding: 10px 0;
    }
  }
`;

const ProfileButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 80%;
    justify-content: center;
    margin: 0 auto;
  }
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ffd60a;
  color: #4361ee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthButton = styled(Link)`
  background-color: ${props => props.primary ? '#ffd60a' : 'transparent'};
  color: ${props => props.primary ? '#4361ee' : 'white'};
  border: ${props => props.primary ? 'none' : '1px solid white'};
  padding: 8px 15px;
  border-radius: 5px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background-color: ${props => props.primary ? '#e6c10a' : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.primary ? '#3a56d4' : '#ffd60a'};
  }
  
  @media (max-width: 768px) {
    display: block;
    width: 80%;
    margin: 0 auto;
    text-align: center;
  }
`;

function Header() {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll event to add a more distinct shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const getInitials = () => {
    if (!currentUser) return '';
    return `${currentUser.firstName?.charAt(0) || ''}${currentUser.lastName?.charAt(0) || ''}`;
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <HeaderContainer style={{ 
      boxShadow: scrolled || isMenuOpen 
        ? '0 4px 10px rgba(0, 0, 0, 0.2)' 
        : '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <HeaderContent className="container">
        <Link to="/" style={{ textDecoration: 'none' }} onClick={closeMenu}>
          <Logo>Smart<span>Quiz</span></Logo>
        </Link>
        
        <MobileMenuButton onClick={toggleMenu} aria-label="Toggle navigation menu">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
        
        <Nav isOpen={isMenuOpen}>
          <ul>
            <li>
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li>
              <Link to="/topics" onClick={closeMenu}>Topics</Link>
            </li>
            
            {currentUser ? (
              <li>
                <ProfileButton to="/profile" onClick={closeMenu}>
                  <Avatar>
                    {currentUser.profilePhoto ? (
                      <img src={currentUser.profilePhoto} alt="Profile" />
                    ) : (
                      getInitials()
                    )}
                  </Avatar>
                  <span>My Profile</span>
                </ProfileButton>
              </li>
            ) : (
              <>
                <li>
                  <AuthButton to="/login" onClick={closeMenu}>Log In</AuthButton>
                </li>
                <li>
                  <AuthButton to="/signup" primary onClick={closeMenu}>Sign Up</AuthButton>
                </li>
              </>
            )}
          </ul>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;