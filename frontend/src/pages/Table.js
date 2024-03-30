import { useMemo } from 'react';
import {
    type MRT_TableOptions,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useState } from "react"
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import InfoIcon from '@mui/icons-material/Info';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import CompareTable from './CompareTable'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import EditIcon from '@mui/icons-material/Edit';

//Table component with Pagination, filtering, search, lazy loading and allowing users to select two rows to compare

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const Table = () => {
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // const navigate = useNavigate();
    const [comparetable, setCompareTable] = useState(false);
    const [data, setData] = useState([]);
    const [processorIDs, setProcessorIDs] = useState([]);

    //getting the table data by calling the table api which queries the mongodb to send relevant data
    useEffect(() => {
        const fetch_table_data = async () => {
            try {
                const res = await axios.get('/table');
                setData(res.data);
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
    }, []);

    //setting up column names and adjusting sizes, types and filtering options
    const columns = useMemo(
    () => [
        {
            accessorKey: 'Processor ID',
            header: 'Processor ID',
            type: 'numeric',
            enableEditing: false,
            size: 40
        },
        {
            accessorKey: 'Processor Name',
            header: 'Processor Name',
            enableEditing: false,
            size: 200
        },
        {
            accessorKey: 'Status',
            header: 'Status',
            size: 40,
            filterVariant: 'select',
            filterSelectOptions: ["Announced", "Discontinued", "Launched"],
            editVariant: 'select',
            editSelectOptions: ["Announced", "Discontinued", "Launched"]
        },
        {
            accessorKey: 'Number of Cores',
            header: 'Number of Cores',
            type: 'numeric',
            size: 60,
            filterVariant: 'range',
            filterFn: 'between',
        },
        {
            accessorKey: 'Cache',
            header: 'Cache',
            size: 40
        },
        {
            accessorKey: 'Base Frequency',
            header: 'Base Frequency',
            size: 40
        },
        {
            accessorKey: 'Lithography',
            header: 'Lithography',
            size: 40
        },
        {
            accessorKey: 'Instruction Set',
            header: 'Instruction Set',
            size: 40
        },
        {
            accessorKey: 'TDP',
            header: 'TDP',
            size: 40
        },
        {
            accessorKey: 'Product Collection',
            header: 'Product Collection'
        },
        {
            accessorKey: 'Vertical Segment',
            header: 'Vertical Segment',
            size: 40,
            filterVariant: 'select',
            filterSelectOptions: ["Server", "Desktop", "Mobile"],
            editVariant: 'select',
            editSelectOptions: ["Server", "Desktop", "Mobile"]
        },
        {
            accessorKey: 'Launch Date',
            header: 'Launch Date',
            size: 40
        }
    ],
    [],
    );

    async function updateProcessor(values) {
        // localStorage.removeItem("processors");
        let stored_processors = localStorage.getItem('processors') ? JSON.parse(localStorage.getItem('processors')) : [];
        console.log("Before", stored_processors)
        for (const processor in stored_processors){
            if (processor["Processor ID"] === values["Processor ID"]){
                delete stored_processors[processor];
                break;
            }
        }
        stored_processors.push(values);
        localStorage.setItem('processors', JSON.stringify(stored_processors));
        console.log("After", JSON.parse(localStorage.getItem('processors')))
    }

    const handleSaveProcessor: MRT_TableOptions<User>['onEditingRowSave'] = async ({
        values,
        table,
    }) => {
        await updateProcessor(values);
        table.setEditingRow(null); //exit editing mode
    };

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

    //opening compare table
    const handleMoreDetails = (rows) => {
        setProcessorIDs(rows.map((row) => row.original["Processor ID"]));
        // console.log(rowData)
        // navigate(`/processor/${rowIDs}`)
        setCompareTable(true);
    };

    //closing compare table
    const handleGoBack = (rows) => {
        // setProcessorIDs(rows.map((row) => row.original["Processor ID"]));
        // console.log(rowData)
        // navigate(`/processor/${rowIDs}`)
        setCompareTable(false);
    };

    //setting up the component's table parameter with all essential features
    const table = useMaterialReactTable({
        columns,
        data,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        enableEditing: true,
        getRowId: (row) => row["Processor ID"],
        onEditingRowSave: handleSaveProcessor,
        renderTopToolbarCustomActions: ({ table }) => (
        <Box
            sx={{
            display: 'flex',
            gap: '16px',
            padding: '8px',
            flexWrap: 'wrap',
            }}
        >
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
            <Button
            disabled={
                !(table.getSelectedRowModel().rows.length === 2)
            }
            //only export selected rows
            onClick={() => handleMoreDetails(table.getSelectedRowModel().rows)}
            // startIcon={<FileDownloadIcon />}
            >
            Compare Processors
            </Button>
            <Button
            disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() => handleMoreDetails(table.getSelectedRowModel().rows)}
            // startIcon={<FileDownloadIcon />}
            >
                <InfoIcon/>
            </Button>
        </Box>
        ),
    });

    return (
        <>
            {
                comparetable ? (
                    <>
                        <div style={{ textAlign: 'left' }}>
                            <Button onClick={() => handleGoBack()}>
                                <ArrowBackIcon />
                            </Button>
                        </div>
                        <CompareTable processorIDs={processorIDs} />
                    </>
                ) : 
                <MaterialReactTable table={table} />
            }
        </>
    );
};

export default Table;
