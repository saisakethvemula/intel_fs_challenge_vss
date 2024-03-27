import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Processor = () => {
    const { rowIDs }= useParams();
    // console.log(rowIDs);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processors, setProcessors] = useState([]);
    const navigate = useNavigate();

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
            <>
                <Card.Text as="h4">{section}:</Card.Text>
                {Object.entries(processor[section]).map(([key, value]) => (
                    <Card.Text sx={{fontsize: '14px'}} >{key}: {value}</Card.Text>
                ))}
            </>
        ));
    };

    const handleGoBack = () => {
        navigate(`/table`)
    };

    return(
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
                <Button onClick={() => handleGoBack()}>
                    <ArrowBackIcon />
                </Button>
            </div>
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
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                { processors.map((processor, index) => (
                    <div key={index} style={{ margin: '10px', padding: '10px 10px 10px 10px', border: '1px solid #ccc', borderRadius: '10px', overflow: 'hidden' }}>
                    <Card>
                        <Card.Header as="h4">{processor.name}</Card.Header>
                        <Card.Body>
                            <Card.Title as="h4">Processor ID: {processor.processor_id}</Card.Title>
                            {render_sections(processor)}
                        </Card.Body>
                    </Card>
                    </div>
                ))}
                </div>
            )}
        </div>
    );
}

export default Processor;