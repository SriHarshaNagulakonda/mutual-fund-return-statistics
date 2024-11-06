import { Outlet } from 'react-router-dom';
import { ThemeProvider, Container, CssBaseline, Box, Typography, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useSelector } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { getTheme } from '../features/theme/themeSlice';
import { lightTheme, darkTheme } from '../theme';
import Header from './Header';

const Layout = () => {
  const theme = useSelector(getTheme);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} autoHideDuration={5000} preventDuplicate />
      <Container disableGutters maxWidth={"lg"} sx={{ border: 0, borderColor: "#c7c5c5", px: 0 }}>
        <CssBaseline />
        <Header />
        <Box sx={{ mt: "70px" }}>
          <Outlet />
          <Box sx={{ width: "100%", px: "15px", mt: "20px", alignItems: "center" }}>
            <Link href="#" target="_blank" rel="noopener" sx={{ display: "flex", alignItems: "center", my: "10px", width: "fit-content" }}>
              <Typography variant='h4' sx={{ fontFamily: "Exo" }}>What Are Rolling Returns in Mutual Funds?</Typography>
            </Link>
            <Typography variant="body1" paragraph>
              Rolling returns are a powerful tool for understanding the consistency and reliability 
              of a mutual fund’s performance over time. Unlike standard returns, which only show gains 
              or losses for a single period (like 1 year or 5 years), rolling returns calculate the 
              performance over multiple overlapping periods, such as a series of 1-year, 3-year, or 5-year intervals.
            </Typography>
            <Typography variant="body1" paragraph>
              For example, a 5-year rolling return calculates performance for each 5-year period within 
              a larger timeframe. This approach provides a more comprehensive view of the fund’s behavior 
              through different market conditions. Rolling returns help investors evaluate long-term consistency, 
              identify periods of high or low performance, and compare funds based on their reliability 
              across varying market cycles.
            </Typography>
            <Link href="https://github.com/anshuthopsee/india-mutual-fund" target="_blank" rel="noopener" sx={{ display: "flex", alignItems: "center", my: "10px", width: "fit-content" }}>
              <Typography variant='h4' sx={{ fontFamily: "Exo" }}>India Mutual Fund</Typography>
              <GitHubIcon sx={{ ml: "10px", fontSize: "30px", verticalAlign: "middle" }} />
            </Link>
            <Typography variant='body2' sx={{ color: "text.secondary", textAlign: "justify", pb: "20px" }}>
              A simple web app to view the historical NAV of Indian Mutual Funds. 
              You can search for a mutual fund by the name of the fund house or the type 
              of fund (equity/debt) and view the historical NAV for the fund of your 
              choice in a chart and also see the percentage change in the NAV 
              over time. A date range selector is available to select and zoom in on a 
              specific time period. The data is downsampled and so the closest available 
              dates to the ones chosen with the date range selector will be picked. You can 
              also download the full scale NAV data (not downsampled) as a CSV file. All the 
              Mutual Fund data, including the search results, are fetched from the 
                <Link href="https://www.mfapi.in/" target="_blank" rel="noopener"> MFAPI.in</Link> free API.
              The App is built with React, D3, and Material UI.
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
