import React, { useEffect, useState } from "react"
import MaterialTable from 'material-table'
import axios from 'axios';

const Table = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabledata, setTabledata] = useState([]);

    useEffect(() => {
        const fetch_table_data = async () => {
            try {
                const res = await axios.get('/table');
                setTabledata(res.data);
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

    const columns = [
        {
            field: 'processor_id',
            title: 'Processor ID',
            type: 'numeric'
        },
        {
            field: 'name',
            title: 'Processor Name'
        },
        {
            field: 'status',
            title: 'Status'
        },
        {
            field: 'num_cores',
            title: 'Number of Cores',
            type: 'numeric'
        },
        {
            field: 'cache',
            title: 'Cache'
        },
        {
            field: 'base_frequency',
            title: 'Base Frequency'
        },
        {
            field: 'lithography',
            title: 'Lithography'
        },
        {
            field: 'instruction_set',
            title: 'Instruction Set'
        },
        {
            field: 'tdp',
            title: 'TDP'
        },
        {
            field: 'product_collection',
            title: 'Product Collection'
        },
        {
            field: 'vertical_segment',
            title: 'Vertical Segment'
        },
        {
            field: 'launch_date',
            title: 'Launch Date'
        }
    ]

    return(
        <div>
            <MaterialTable title="Intel Processors"
            options={{
                filtering: true,
                exportButton: true
            }}
            columns={columns}
            data={tabledata}
            />
        </div>
    )
}

export default Table;