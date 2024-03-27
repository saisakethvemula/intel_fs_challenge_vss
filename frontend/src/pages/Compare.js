import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CompareTable = () => {
    const { rowIDs }= useParams();
    const navigate = useNavigate();
    // const [headers, setHeaders] = useState([]);
    const [processors, setProcessors] = useState([]);
	const [data, setData] = useState([]);

    useEffect(() => {
        const fetch_table_data = async () => {
            try {
                const res = await axios.get(`/processors/${rowIDs}`);
                // setHeaders(res.data["features"])
                setProcessors(res.data["processors"]);
				setData(res.data["broken_processors"])
                // setLoading(false);
                // setError(null);
                console.log(res.data);
                if (res.data.error) {
                    console.log(res.data.error);
                }
            } catch (error) {
                // setError(error);
                // setLoading(false);
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            }
        };
        fetch_table_data();
    }, [rowIDs]);

    const columns = useMemo(() => {
		const keys = Object.keys(processors); // Get the keys of the main data object

		const moveToFront = (arr, key) => {
			const index = arr.indexOf(key);
			if (index > -1) {
			  arr.splice(index, 1);
			  arr.unshift(key);
			}
		};

		moveToFront(keys, "Processor Name");
  		moveToFront(keys, "Processor ID");

		// Map over the keys and create columns for each section
		return keys.map(key => {
			const section = processors[key]; // Get the data for the current section
			const subKeys = Object.keys(section[0]); // Get the keys of the first item in the section
			
			// Map over the subKeys and create columns for each property
			const subColumns = subKeys.map(subKey => ({
			accessorKey: subKey,
			header: subKey,
			size: 100
			}));
			
			return {
			id: key,
			header: key,
			columns: subColumns
			};
		});
    }, [processors]);

    // const columns = []
    // const data = {}


    const table = useMaterialReactTable({
        columns,
        data,
        enableColumnActions: false,
        enableColumnFilters: false,
        enablePagination: false,
        enableSorting: false,
		renderTopToolbarCustomActions: ({ table }) => (
			<Box
				sx={{
				display: 'flex',
				gap: '16px',
				padding: '8px',
				flexWrap: 'wrap',
				}}
			>
				<Button onClick={() => handleGoBack()}>
                    <ArrowBackIcon />
                </Button>
			</Box>
		),
    });

	const handleGoBack = () => {
        navigate(`/table`)
    };

    return (
			<MaterialReactTable table={table} />
	);
}

export default CompareTable;
