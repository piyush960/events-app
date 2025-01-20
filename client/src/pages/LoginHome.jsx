import React from "react";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { keyframes } from "@mui/system";
import { styled } from "@mui/system";
import { Google } from "@mui/icons-material";
import logo from '../assets/logo.png';
import { processAuth } from "../services/EventService";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`,
  padding: theme.spacing(3)
}));

const ContentWrapper = styled(Box)({
  animation: `${fadeIn} 1s ease-out`,
  textAlign: "center"
});

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
  fontSize: "4rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "2.5rem"
  }
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
  opacity: 0.9,
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.2rem"
  }
}));

const LogoBox = styled(Box)({
  marginBottom: "2rem",
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  overflow: "hidden"
});

const LoginButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontSize: "1.1rem",
  borderRadius: theme.shape.borderRadius * 2,
  color: theme.palette.primary,
  "&:hover": {
    transform: "scale(1.05)",
    transition: "all 0.3s ease-in-out"
  },
  fontWeight: 600
}));

const TextHeroSection = () => {
  const theme = useTheme();

  const handleAuth = async () => {
    const url = await processAuth();
    window.location.href = url;
  }

  return (
    <HeroContainer>
      <Container maxWidth="md">
        <ContentWrapper sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <LogoBox>
            <img
              src={logo}
              alt="Daily Dots Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </LogoBox>
          <Title variant="h1" aria-label="Daily Dots">
            Daily Dots
          </Title>
          <Subtitle variant="h5" aria-label="your personal event manager">
            Your Personal Event Manager
          </Subtitle>
          <LoginButton
            variant="contained"
            size="large"
            aria-label="Login button"
            startIcon={<Google />}
            color='secondary'
            onClick={handleAuth}
          >
            <Typography fontSize={'medium'} fontWeight={600} fontFamily={'Poppins'}>Login Using Google</Typography>
          </LoginButton>
        </ContentWrapper>
      </Container>
    </HeroContainer>
  );
};

export default TextHeroSection;