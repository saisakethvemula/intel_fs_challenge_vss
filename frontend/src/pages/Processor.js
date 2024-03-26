import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

function generate(element) {
    return [0, 1, 2].map((value) =>
      React.cloneElement(element, {
        key: value,
      }),
    );
}

const Processor = () => {
    const { rowIDs }= useParams();
    // console.log(rowIDs);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processors, setProcessors] = useState([]);

    useEffect(() => {
        const fetch_processor_data = async () => {
            try {
                // console.log(rowIDs)
                const res = await axios.get(`/processors/${rowIDs}`);
                setProcessors(res.data);
                setLoading(false);
                setError(null);
                console.log(res.data);
                if (res.data.error) {
                    console.log(res.data.error);
                }
            } catch (error) {
                setError(error);
                setLoading(false);
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            }
        };
        fetch_processor_data();
    }, []);

    const render_sections = (processor) => {
        const excludedKeys = ['name', 'processor_id'];
        return Object.keys(processor)
            .filter((key) => !excludedKeys.includes(key))
            .map((section, index) => (
            <div key={index}>
                <Typography variant="h6" component="h3">
                {section}
                </Typography>
                <ul>
                {Object.entries(processor[section]).map(([key, value]) => (
                    <li key={key}>{key}: {value}</li>
                ))}
                </ul>
            </div>
            // <div key={index}>
            //     <Grid container spacing={2}>
            //     <Grid item xs={12} md={6}>
            //     <Demo>
            //         <List>
            //         {generate(
            //             <ListItem>
            //             <ListItemText
            //                 primary="Single-line item"
            //             />
            //             </ListItem>,
            //         )}
            //         </List>
            //     </Demo>
            //     </Grid>
            //     </Grid>
            // </div>
            ));
    };

    return(
        <>
            {loading ? (
                <Box display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <div>Error: {error.message}</div>
            ) : (
                <>
                <CssBaseline />
                <Container>
                <Box sx={{ m: 2 }}>
                    {processors.map((processor, index) => (
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                {processor.name}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                Processor ID: {processor.processor_id}
                                </Typography>
                                {render_sections(processor)}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
                </Container>
                </>
            )}
        </>
    );
}

export default Processor;