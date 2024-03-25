import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { axisClasses } from '@mui/x-charts';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import axios from 'axios';

const chartSetting = {
    yAxis: [
        {
            label: 'Number of Processors',
        },
    ],
    height: 750,
    width: 1300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-20px, 0)',
      },
    },
    colors: ["#4a5168", "#daa520", "#367588", "#ff7f50", "#967bb6", "#98ff98", "#dc143c", "#ffdab9", "#708090", "#da70d6", "#40e0d0", "#800000", "#6495ed", "#fa8072", "#808000", "#008b8b", "#9932cc", "#f4a460", "#87ceeb", "#9370db", "#483d8b", "#f08080", "#66cdaa", "#e9967a"]
};

const Graph = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bardata, setBardata] = useState([]);
    const [piedata, setPiedata] = useState([]);
    const [xlabels, setXlabels] = useState([]);
    const [ylabels, setYlabels] = useState([]);

    // fetching data from graph api using useEffect for both bar and pie charts
    useEffect(() => {
        const fetch_graph_data = async () => {
            try {
                const res = await axios.get('/graph');
                setBardata(res.data["bardata"]);
                setPiedata(res.data["piedata"]);
                setXlabels(res.data["bardata"][0]);
                setYlabels(res.data["bardata"][1]);
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
    
        fetch_graph_data();
    }, []);
    
    // transforming the data to put in the chart components
    const transformed_bar_data = [];
    for (const key in ylabels) {
        const pData = ylabels[key];
        transformed_bar_data.push({ data: pData, label: key, id: key + 'Id', stack: 'total' });
    }

    const transformed_pie_data = [];
    var idd = 0
    for (const key in piedata) {
        transformed_pie_data.push({ id: idd, value: piedata[key], label: key });
        idd = idd+1;
    }



    return (
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
                <h2>Bar graph depicting the distribution of processor counts based on the number of cores across the product collection.</h2>
                <Box display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh">
                    <BarChart
                        series={transformed_bar_data}
                        xAxis={[{ data: bardata[0], scaleType: 'band' }]}
                        {...chartSetting}
                    />
                </Box>
                <h2>Pie chart illustrating the distribution of the status of various processors.</h2>
                <Box display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh">
                    <PieChart
                        series={[
                        {
                            data: transformed_pie_data,
                        },
                        ]}
                        width={800}
                        height={500}
                    />
                </Box>
                </>
            )}
        </>
    )
}

export default Graph;