import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useState } from "react"
// import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv'; 
// import Table from './Table';

//Lazy loading has been implemented by fetching additional data from database only when requested

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const CompareTable = ({ processorIDs }) => {
	//getting processorIDs
	// console.log(processorIDs);
    const [processors, setProcessors] = useState([]);
	const [data, setData] = useState([]);

	//calling the processors api with the ids as parameter which queries the mongodb to send relevant data
    useEffect(() => {
        const fetch_table_data = async () => {
            try {
				//using local storage to cache the data of fetched processors to reduce network load
				// localStorage.removeItem("processors_all");
				// localStorage.removeItem("processors_headers");
				// localStorage.removeItem("pids");
				let stored_processors = localStorage.getItem('processors_all') ? JSON.parse(localStorage.getItem('processors_all')) : [];
				let stored_headers = localStorage.getItem('processors_headers') ? JSON.parse(localStorage.getItem('processors_headers')) : {};
				let stored_pids = localStorage.getItem('pids') ? JSON.parse(localStorage.getItem('pids')) : [];
				const new_pids = processorIDs.filter(pid => !stored_pids.includes(pid));
				const filter_processors = stored_processors.filter(processor => processorIDs.includes(parseInt(processor["Processor ID"])));
				const res = await axios.get(`/processors/${new_pids}`);
				// console.log(res.data);
				const final_data = [...res.data["broken_processors"], ...filter_processors];
				setProcessors(Object.assign({}, stored_headers, res.data["processors"]));
				setData(final_data);
				localStorage.setItem("processors_all", JSON.stringify([...res.data["broken_processors"], ...stored_processors]));
				localStorage.setItem("processors_headers", JSON.stringify(Object.assign({}, stored_headers, res.data["processors"])));
				localStorage.setItem("pids", JSON.stringify([...stored_pids, ...new_pids]));
				// setLoading(false);
                // setError(null);
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
    }, [processorIDs]);

	//dynamically setting the column headers and the column names from the processor data we got
    const columns = useMemo(() => {
		const features = Object.keys(processors);

		const move_to_starting = (features_arr, key) => {
			const index = features_arr.indexOf(key);
			if (index > -1) {
				features_arr.splice(index, 1);
				features_arr.unshift(key);
			}
		};

		move_to_starting(features, "Processor Name");
		move_to_starting(features, "Processor ID");

		return features.map(key => {
			const section = processors[key]; 
			const subKeys = Object.keys(section[0]); 
			
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

	//functionality to export as CSV
    const handleExportRows = (rows) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

	//setting up the component's table parameter with all essential features
    const table = useMaterialReactTable({
        columns,
        data,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
		renderTopToolbarCustomActions: ({ table }) => (
			<Box
				sx={{
				display: 'flex',
				gap: '16px',
				padding: '8px',
				flexWrap: 'wrap',
				}}
			>
				{/* <Button onClick={() => handleGoBack()}>
                    <ArrowBackIcon />
                </Button> */}
				<Button
				//export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
				onClick={handleExportData}
				startIcon={<FileDownloadIcon />}
				>
					Export All Data
				</Button>
				<Button
				disabled={table.getPrePaginationRowModel().rows.length === 0}
				//export all rows, including from the next page, (still respects filtering and sorting)
				onClick={() =>
					handleExportRows(table.getPrePaginationRowModel().rows)
				}
				startIcon={<FileDownloadIcon />}
				>
					Export All Rows
				</Button>
				<Button
				disabled={table.getRowModel().rows.length === 0}
				//export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
				onClick={() => handleExportRows(table.getRowModel().rows)}
				startIcon={<FileDownloadIcon />}
				>
					Export Page Rows
				</Button>
				<Button
				disabled={
					!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
				}
				//only export selected rows
				onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
				startIcon={<FileDownloadIcon />}
				>
					Export Selected Rows
				</Button>
			</Box>
		),
    });

	//go back to table
	// const handleGoBack = () => {
    //     navigate(`/table`)
    // };

    return (
			<MaterialReactTable table={table} />
	);
}

export default CompareTable;
