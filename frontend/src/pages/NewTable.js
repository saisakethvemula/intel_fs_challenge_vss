import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import React, { useEffect, useState } from "react"
import axios from 'axios';

const NewTable = () => {


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetch_table_data = async () => {
            try {
                const res = await axios.get('/table');
                setData(res.data);
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
        fetch_table_data();
    }, []);


  const columns = useMemo(
    () => [
        {
            accessorKey: 'processor_id',
            header: 'Processor ID',
            type: 'numeric',
        },
        {
            accessorKey: 'name',
            header: 'Processor Name'
        },
        {
            accessorKey: 'status',
            header: 'Status'
        },
        {
            accessorKey: 'num_cores',
            header: 'Number of Cores',
            type: 'numeric'
        },
        {
            accessorKey: 'cache',
            header: 'Cache'
        },
        {
            accessorKey: 'base_frequency',
            header: 'Base Frequency'
        },
        {
            accessorKey: 'lithography',
            header: 'Lithography'
        },
        {
            accessorKey: 'instruction_set',
            header: 'Instruction Set'
        },
        {
            accessorKey: 'tdp',
            header: 'TDP'
        },
        {
            accessorKey: 'product_collection',
            header: 'Product Collection'
        },
        {
            accessorKey: 'vertical_segment',
            header: 'Vertical Segment'
        },
        {
            accessorKey: 'launch_date',
            header: 'Launch Date'
        }
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
  });

  return <MaterialReactTable table={table} />;
};

export default NewTable;
