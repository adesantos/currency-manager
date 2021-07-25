import React,{useEffect, useState} from 'react';
import {Grid, Button, Switch, Dialog, TextField, FormControl, InputLabel, Select, MenuItem, FormLabel, FormControlLabel, RadioGroup, Radio} from '@material-ui/core';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import data from '../data.json';
//styles
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    marginBttm: {
        marginBottom: '3%'
    },
    displayText: {
        width: '50%', 
        marginBottom: '5%'
    },
    selectCountry: {
        border: 'none', 
        width: '100%'
    }
});

export const EditModal = ({item, displayFunction, openModal, closeModal, editCountry}) => {

    const classes = useStyles();
    
    const initialValues = {
        id: 0,
        country: "", 
        currency: "", 
        symbol: "",
        display: "",
        showSymbol: true , 
        position: 'before', 
        cents: true, 
        format: 'comma'
    };
    
    const [formValues, setFormValues] = useState(initialValues);
    const [symbol, setSymbol] = useState(true);
    const [cents, setCents] = useState(true);
    const [country, setCountry] = useState("");
    const [position, setPosition] = useState("before");
    const [format, setFormat] = useState("comma");
    const [display, setDisplay] = useState("");

    useEffect(() => {
        const cent = item.cents==="true"? true : false;
        const sym = item.symbol==="true"? true : false;
        setFormValues(item);
        setSymbol(!sym);
        setCents(!cent);
        setCountry(item.country + " - " + item.currency);
        setPosition(item.position);
        setFormat(item.format);
        setDisplay(item.display);
    }, [item]);

    useEffect(() => {
        var string = "1234.5";
        var symb = symbol? formValues.symbol : formValues.currency;

        var str = displayFunction(string, cents, format, position, symb);

        setDisplay(str);
    },[format, symbol, position, cents, formValues.symbol, formValues.currency, displayFunction]);

    var isValid = false;

    if(formValues.country!==undefined){
        isValid = formValues.country.length > 0 &&
        formValues.currency.length > 0 &&
        formValues.symbol.length > 0;
    }

    const handleChange = (e) => {
        var { name, value } = e.target;

        if(name==="showSymbol"){
            value = !symbol;
            setSymbol(!symbol);
        }
        if(name==="cents"){
            value = !cents;
            setCents(!cents);
        }
        if(name==="country"){
            const countryArray = value.split(" - ");
            setCountry(value);

            formValues.country = countryArray[0];
            formValues.currency = countryArray[1];
            formValues.symbol = countryArray[2];

        }else{
            setFormValues(prev => ({
            ...prev,
            [name]: value
            }));
        }
        if(name==="position"){
            setPosition(value);
        }
        if(name==="format"){
            setFormat(value);
        }
    }

    const handleClear = () =>{
        setCountry("");
        closeModal();
        setFormValues(initialValues);
      }

    const handleSubmit = () => {
        console.log(formValues);
        editCountry(formValues);
        handleClear();
    }

    return(
        <Dialog
            open={openModal}
            onClose={closeModal} 
            maxWidth='sm'
        >
            <MuiDialogContent dividers>
                <form>

                    <Grid container item lg={12}>
                        <Grid container item lg={12}>
                            <Grid item lg={12} style={{textAlign: "center"}}>
                                <TextField 
                                    value={display}
                                    className={classes.displayText}
                                    label="Display" 
                                    name="display"
                                    variant="outlined" 
                                    disabled
                                />
                            </Grid>
                            <Grid item lg={8}>
                                <FormControl variant="outlined" className={classes.selectCountry}>
                                    <InputLabel>Country - Currency - Symbol</InputLabel>
                                    <Select
                                        className={classes.marginBttm}
                                        name="country"
                                        value={country || ""}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        {data.map((row, i) => (
                                            <MenuItem key={i} value={row.country + " - " + row.currency}>{row.country + " - " + row.currency}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item lg={4} style={{textAlign: 'right'}}>
                                <FormLabel>Show Cents</FormLabel>
                                <Switch
                                    value={cents}
                                    checked={cents}
                                    onChange={handleChange}
                                    color="primary"
                                    name="cents"
                                    disabled={!isValid}
                                    className={classes.marginBttm}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item lg={8}>
                            <RadioGroup aria-label="Currency or Symbol" name="showSymbol" value={symbol} className={classes.marginBttm}>
                                <FormControlLabel disabled={!isValid} value={true} control={<Radio onChange={handleChange}  color="primary" style={{margin: 0}}/>} label="Show Symbol" />
                                <FormControlLabel disabled={!isValid} value={false} control={<Radio onChange={handleChange}  color="primary" style={{margin: 0}}/>} label="Show Currency Code" />
                            </RadioGroup>
                        </Grid>
                        
                        <Grid item lg={4}>
                            <RadioGroup aria-label="Format thousand delimiters" name="format" value={format} className={classes.marginBttm}>
                                <FormControlLabel disabled={!isValid} value="comma" control={<Radio onChange={handleChange}  color="primary"/>} label="Format #,###.##" />
                                <FormControlLabel disabled={!isValid} value="dot" control={<Radio onChange={handleChange}  color="primary"/>} label="Format #.###,##" />
                            </RadioGroup>
                        </Grid>
                        <Grid item lg={8}>
                            <RadioGroup aria-label="Currency shown after or before the price" name="position" value={position} className={classes.marginBttm}>
                                <FormControlLabel disabled={!isValid} value="before" control={<Radio onChange={handleChange}  color="primary"/>} label="Show currency BEFORE the price" />
                                <FormControlLabel disabled={!isValid} value="after" control={<Radio onChange={handleChange}  color="primary"/>} label="Show currency AFTER the price" />
                            </RadioGroup>
                        </Grid>
                        
                    </Grid>

                </form>
            </MuiDialogContent>

            <MuiDialogActions>
                <Button 
                    style={{padding: 10, margin: 10}}
                    variant="contained" 
                    disabled={!isValid}
                    onClick={handleSubmit}
                >
                    Save and Close
                </Button>
            </MuiDialogActions>

        </Dialog>
    );
}