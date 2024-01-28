
import React from 'react';
import { useEffect, useState } from 'react';
import { ChangeEvent } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import ListItemIcon from '@mui/material/ListItemIcon'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Grid from '@mui/material/Grid';
import { useApiCall } from 'src/hooks/useApiCall';
import BYUAccordion from 'src/components/BYUAccordion';
import { Container, Stack, keyframes } from '@mui/material';


declare global {
    interface Window {
      initMap: () => void;
      google: any; // 'any' can be used if you don't have the types for the google maps API
    }
  }

  type LotData = {
    image: string,
    stats: {
        occupiedSpaces: number,
        totalSpaces: number
    }
  };

export default function Home() {

    const { apiCall } = useApiCall();


    const [testData, setTestData] = useState<LotData>();
    const [percentFilled, setPercentFilled] = useState<number>();

    useEffect(() => {
        apiCall('test_image_processing', 'GET', null, (data) => {
            console.log(data);
            setTestData(data);
            setPercentFilled(data.stats.occupiedSpaces / data.stats.totalSpaces);
        });
    }, []);

      const getStatusColor = (color: string): string => {
        switch(color) {
          case "green": return "#4CAF50";
          case "orange": return "#FF9800";
          case "red": return "#F44336";
          default: return "#757575";
        }
      };
    
    const [value, setValue] = useState<string>('home');
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);

      // Load the Google Maps script
      useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBpiX3cjpdpgE60G8cFY3qbZJb56WKiJZ0&callback=initMap`;
        script.async = true;
        script.defer = true;
        window.initMap = () => setMapLoaded(true); // Define a global function that the Google Maps script can call
        document.head.appendChild(script);
    }, []);

    // Initialize the map once the script is loaded
    useEffect(() => {
        if (mapLoaded) {
            // Assign the map instance to a variable
            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: 40.251806, lng: -111.649333 },
                zoom: 18,
            });
    
            const polygonCoords1 = [
                { lat: 40.2513, lng: -111.650 }, //bottom left
                { lat: 40.2522, lng: -111.650 }, // top left
                { lat: 40.2522, lng: -111.64975 }, //top right
                { lat: 40.2513, lng: -111.64975}  // bottom right
            ];
    
            const polygon1 = new window.google.maps.Polygon({
                paths: polygonCoords1,
                strokeColor: '#FF0000', 
                strokeOpacity: 0.8,
                strokeWeight: 2, 
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });
    
            // Now the map variable is in scope and can be used
            polygon1.setMap(map);

            const polygonCoords2 = [
                { lat: 40.25128, lng: -111.64879}, //bottom left
                { lat: 40.25215, lng: -111.64881 }, // top left
                { lat: 40.25215, lng: -111.6486 }, //top right
                { lat: 40.2513, lng: -111.6486}  // bottom right
            ];
    
            const polygon2 = new window.google.maps.Polygon({
                paths: polygonCoords2,
                strokeColor: '#FF9800',
                strokeOpacity: 0.8,
                strokeWeight: 2, 
                fillColor: '#FF9800',
                fillOpacity: 0.35
            });
    
            polygon2.setMap(map);
        }
    }, [mapLoaded]);
    

    const handleChange = (event: ChangeEvent<{}>, newValue: string) => {
        setValue(newValue);
    };

    const ripple = (
        keyframes`
        0% {
            transform: scale(.9);
            opacity: 1;
        }
        100% {
            transform: scale(1.1);
            opacity: 0.7;
        }`
    );

    return (
        <Box sx={{ pb: 5, bgcolor: '#202030' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Lot Saturation
                    </Typography>
                </Toolbar>
            </AppBar>

        <Container maxWidth="md" sx={{ mt: 2 }}>
              {/* Map container */}
              <Box sx={{ height: 400, width: '100%', borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                <div id="map" style={{ height: '100%', width: '100%' }} />
            </Box>

            {/* List of parking lots */}

                <List sx={{ width: '100%', bgcolor: '#202030' }}>
                    <ListItem sx={{ bgcolor: '#202030' }}>
                    <ListItemText
                        primary={
                        <Typography variant="h6" style={{ color: 'white' }}>
                            Top Available Lots
                        </Typography>
                        }
                    />
                    </ListItem>
                    <Divider component="li" />
                    
                    {(testData && percentFilled) &&
                    <Stack width={'100%'} spacing={2}>
                        <BYUAccordion
                            title={'Lot 1A'}
                            icon={
                                <Stack
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    sx={{
                                        pr: 1,
                                        pt: 0.9,
                                        animation: `${ripple} 0.85s infinite alternate ease-in-out`,
                                        zIndex: 999,
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: getStatusColor(testData.stats.totalSpaces - testData.stats.occupiedSpaces >= 0.9 ? "red" : testData.stats.totalSpaces - testData.stats.occupiedSpaces >= 0.75 ? "orange" : "green"),
                                            borderRadius: '50%',
                                            width: '10px',
                                            height: '10px',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    />
                                </Stack>
                            }
                            table_body={
                                <ListItem sx={{ bgcolor: 'black', color: 'white' }}>
                                    <ListItemIcon>
                                    <FiberManualRecordIcon style={{ color: getStatusColor(testData.stats.totalSpaces - testData.stats.occupiedSpaces >= 0.9 ? "red" : testData.stats.totalSpaces - testData.stats.occupiedSpaces >= 0.75 ? "orange" : "green") }} />
                                    </ListItemIcon>
                                    <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Typography variant="subtitle1">Lot 1A</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                                            Percent Filled: {testData.stats.occupiedSpaces / testData.stats.totalSpaces * 100}%
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="subtitle1">Spots Available: {testData.stats.totalSpaces - testData.stats.occupiedSpaces}</Typography>
                                    </Grid>
                                    </Grid>
                                </ListItem>
                            }
                        />
                    </Stack>}
                </List>

                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} startIcon={<AddIcon />}
                >
                Add complaint
                </Button>

                {/* Bottom Navigation */}
                <BottomNavigation value={value} onChange={handleChange} showLabels sx={{ position: 'fixed', left: 0, right: 0, bottom: 0 }}>
                    <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
                    {/* Add other navigation items if necessary */}
                </BottomNavigation>
            </Container>
        </Box>
    );
}

window.initMap = () => {};