import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled.header`
  background-color: #4361ee;
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
`;

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;
    gap: 20px;
    align-items: center;
    margin: 0;
    padding: 0;
  }
  
  li {
    font-weight: 500;
  }
  
  a {
    color: white;
    transition: color 0.3s ease;
    text-decoration: none;
    
    &:hover {
      color: #ffd60a;
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
`;

function Header() {
  const { currentUser } = useAuth();
  
  const getInitials = () => {
    if (!currentUser) return '';
    return `${currentUser.firstName?.charAt(0) || ''}${currentUser.lastName?.charAt(0) || ''}`;
  };
  
  return (
    <HeaderContainer>
      <HeaderContent className="container">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo>Smart<span>Quiz</span></Logo>
        </Link>
        <Nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/topics">Topics</Link></li>
            
            {currentUser ? (
              <>
                <li>
                  <ProfileButton to="/profile">
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
              </>
            ) : (
              <>
                <li>
                  <AuthButton to="/login">Log In</AuthButton>
                </li>
                <li>
                  <AuthButton to="/signup" primary>Sign Up</AuthButton>
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
