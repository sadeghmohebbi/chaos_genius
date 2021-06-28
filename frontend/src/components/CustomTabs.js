import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { Badge } from '@themesberg/react-bootstrap';

function TabPanel(props) {
    const { children, value, index,title, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={title}
            aria-labelledby={title}
            {...other}
        >
            {value === index && (
                <Box component="span">
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index,title) {
    return {
        id: `${title}`,
        'aria-controls': `${title}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function SimpleTabs(props){
    const classes = useStyles();
    const [value, setValue] = React.useState((props?.tabState)?(props.tabState):(0));
    const [eventHtml, setEventHtml] = React.useState("");

    const handleChange = (event, newValue) => {
        setValue(newValue);
        // if(props?.plotChart){
        //     setTimeout(function(){ props.plotChart(newValue) }, 1000);   
        // }
        if(props?.handleDimensionChange){            
            // console.log(value)
            // console.log(newValue)
            props.handleDimensionChange(event,"tab",newValue)
        }
        
    };

    const handleTabView = (title) =>{
        return(
            <span className="tab-badge"><h4 className="title">by <Badge bg="primary" className="me-1" >{title}</Badge></h4></span>
        )
    }


    return (
        <div >
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    {props.tabs.map((tabData, index) =>
                        <Tab label={handleTabView(tabData.title)} {...a11yProps(index,tabData.title)} />
                    )}
                </Tabs>
            </AppBar>
            {props.tabs.map((tabData, index) =>
                <TabPanel value={value} index={index} title={tabData.title}>
                    {tabData.body}
                </TabPanel>
            )}
        </div>
    );
}