import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const Dashboard = () => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Box sx={{ minWidth: 275, padding: 2 }}>
                <Card variant="outlined">
                    <React.Fragment>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                SPA with Routing
                            </Typography>
                            <Typography variant="body2">
                                I have used ReactJS to create this Single Page Application with two routes Graph and Table. To achieve this Routing I have used Routes and Route from react-router-dom library and defined these routes in App.js. I have created a NavBar component used throughtout the application commonly which helps navigate to the Graph, Table and this Dashboard component as well. The codebase is simple to navigate through. I have used Material React UI to build the functionality of the application. In these components I have used axios to call the APIs to fetch the relevant data, useEffect with async - await to fetch the data completely and then render the html in browser, useState to set the state variables. 
                            </Typography>
                        </CardContent>
                    </React.Fragment> 
                </Card>
            </Box>
            <Box sx={{ minWidth: 275, padding: 2 }}>
                <Card variant="outlined">
                    <React.Fragment>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Graph Visualization
                            </Typography>
                            <Typography variant="body2">
                                I have used useEffect to fetch the data from graph api using axios and implemented async - await to make this request asynchronous. Until the data is completely loaded a loading icon appears and once the data is completely fetched the visualizations are plotted on the page. I have built a stacked bar chart which depicts the distribution of processor counts based on the number of cores for each product collection. Different colors have been assigned to unique core counts and processors belong to a product collection have been aggregated based on the number of cores parameter. I have build a pie chart that showcases the distribution of different processor statuses. For every processor the status has been fetched and aggregated based on the status for every unique status. The counts have been used to populate the pie chart.
                            </Typography>
                        </CardContent>
                    </React.Fragment> 
                </Card>
            </Box>
            <Box sx={{ minWidth: 275, padding: 2 }}>
                <Card variant="outlined">
                    <React.Fragment>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                TableManagement
                            </Typography>
                            <Typography variant="body2">
                                To build the table I have used the Material React Table as my base. I have used useEffect to fetch some data of the processors which give an overview of a processor from backend using axios and async-await to make this asynchronous. I have achieved pagination to move between pages for viewing the data, filtering based the column type i.e., min-max for number, dropdown for categorical column such as status. I have also achieved search functionality on the table along with lazy loading to fetch the complete processors data from database only on request. I have also allowed to compare two processors in this table by creating one more component called CompareTable which allows to view all information about the processor. To compare two processors if we select two processors from the table an option is called "Compare Tables" is enabled which fetches the requested data in a lazy loading manner. There is also an info symbol on top which is enabled when you select atleast one processor to just fetch more information about the selected processors also in a lazy loading manner. There is also an option to show/hide columns which can be very helpful when wanting to filter out only required columns and there are options to toggle between the fullscreen and density of rows for a clear view.
                            </Typography>
                        </CardContent>
                    </React.Fragment> 
                </Card>
            </Box>
            <Box sx={{ minWidth: 275, padding: 2 }}>
                <Card variant="outlined">
                    <React.Fragment>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Additional Features
                            </Typography>
                            <Typography variant="body2">
                                I have allowed for users to export the data as CSV in table and when comparing as well. I have created options to export the whole data, export only selected processors, export processors filtered and sorted based on user's choices. On the backend I have used MongoDB as my database in which I have stored the json data in a collection. Specifically I have used Mongo Atlas because of its ease to use and maintenance. I have used Python and Flask for building APIs. I have created three APIS: 1. graph - fetches relevant data from database to populate the bar and pie chart, 2. table - fetches relevant data to populate the table and 3. processors - used for lazy loading to fetch data only on request. 
                            </Typography>
                        </CardContent>
                    </React.Fragment> 
                </Card>
            </Box>
            <Box sx={{ minWidth: 275, padding: 2 }}>
                <Card variant="outlined">
                    <React.Fragment>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Bonus Question
                            </Typography>
                            <Typography variant="body2">
                                I have also allowed users to edit data in the table and handled it to store the data in localStorage of the browser. When the useer clicks on the edit icon in table page, they are allowed to edit features except Processor ID and Name which will be saved in localStorage based on the processsor id, overwrites if already exists in the localStorage and fetches again when requested. This change will not be updated in database. As an extra feature I have implemented caching to store the fetched processor details in local storage and retrieve existing processor data from it. LocalStorage has been set to empty when we kill the frontend process and will be empty on the next run.
                            </Typography>
                        </CardContent>
                    </React.Fragment> 
                </Card>
            </Box>
        </div>
    );
}

export default Dashboard;