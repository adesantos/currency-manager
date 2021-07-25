import React, {useState} from 'react';
import {AddModal} from './components/AddModal';
import {EditModal} from './components/EditModal';
import {ExportFile} from './components/ExportFile';

//core
import {Button, Select, InputLabel, Paper, Typography, FormControl, MenuItem, Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar} from '@material-ui/core';
//icons
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditIcon from '@material-ui/icons/Edit';
//styles
import { makeStyles } from '@material-ui/core/styles';

const data = [
  {
    id: 0, country: 'United States of America', currency: 'USD', symbol: '$', display: '$1,234.56', showSymbol: true , position: 'before', cents: true, format: 'comma'
  },
  {
    id: 1, country: 'Spain', currency: 'EUR', symbol: '€', display: '1,234€', showSymbol: true , position: 'after', cents: false, format: 'comma'
  }
];

const useStyles = makeStyles({
  toolbar: { 
    textAlign: 'right', display: 'flex', justifyContent: 'flex-end'
  },
  marginButton: {
    marginLeft: 15
  },
  sort: {
    padding: 0, height: 36, textAlign: 'center', width: 115
  },
  sortLabel: {
    lineHeight: 0
  },
  sortItem: {
      padding: '7px !important'
  },
  tableContainer: {
      display: 'table',
      width: '100%',
      tableLayout: 'fixed'
  },
  table:{
      display: 'table',
      width: '100%',
      tableLayout: 'fixed'
  },
  thead: {
    color: '#3f51b5',
    fontWeight: 600,
    textAlign: 'center'
  },
  theader: {
    backgroundColor: '#f1f3ff'
  },
  container: {
    marginTop: 50
  },
  title: {
    marginTop: 50
  },
  btn: {
    color: '#3f51b5',
    cursor: 'pointer'
  }
});

function App() {

  const classes = useStyles();
  const [countries, setCountries] = useState(data);
  const [sort, setSort] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [row, setRow] = useState({});

  const displayFunction = (string, cents, format, position, symb) => {
    var str = "";
    var num = "";
    if(cents){
      if(format==="comma"){
          num = parseFloat(string).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      }else{
          num = parseFloat(string).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      }
    }else{
        if(format==="comma"){
            num = parseInt(string).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
        }else{
            num = parseInt(string).toLocaleString('tr-TR', {minimumFractionDigits: 0, maximumFractionDigits: 0});
        }
    }
    if(position==="before"){
        str = symb + num;
    }else{ 
        str = num + symb;
    }
    return str.trim();
  }

  const display = (setting) => {
    const {cents, format, position, symbol, showSymbol, currency} = setting;
    var str = "";
    var string = "1234.5";
    var symb = showSymbol? symbol : currency;
    
    str = displayFunction(string, cents, format, position, symb);

    return str;
  }

  const handleAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseModal = () => {
    setOpenAddModal(false);
    setOpenEditModal(false);
  };

  const handleDelete = (item) => {
    var tempCountries = countries.filter(country => {
      return country.id !== item;
    });
    setCountries(tempCountries);
  }

  const handleEdit = (item) => {
    setRow(item);
    setOpenEditModal(true);
  }

  const handleEditCountry = (item) => {
    var tempCountries = countries;
    var index = tempCountries.findIndex((obj => obj.id === item.id));
    tempCountries[index] = item;
    setCountries(tempCountries);
  }

  const handleSort = (e) => {
    var sort = e.target.value;
    var sortedData = [];
    setSort(sort);
    if(sort==="country"){
      sortedData = countries.sort((a, b) => a.country > b.country ? 1 : -1);
    }else{
      sortedData = countries.sort((a, b) => a.currency > b.currency ? 1 : -1);
    }
    setCountries(sortedData);
  } 

  const handleNewCountry = (country) => {
    var tempCountries = countries;
    tempCountries.push(country);
    setCountries(tempCountries);
  }

  return (

    <Container maxWidth="md" className={classes.container}>
      <Grid>

      
        <Typography variant="h4" className={classes.title}>Currency Manager</Typography>
        <Toolbar className={classes.toolbar}>
          <Grid>
            <FormControl variant="outlined">
              <InputLabel className={classes.sortLabel}>Sort</InputLabel>
              <Select
                className={classes.sort}
                name="sort"
                value={sort}
                onChange={handleSort}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="country">Country</MenuItem>
                <MenuItem value="currency">Currency</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid className={classes.marginButton}>
            <Button 
              aria-label="Create Country Settings"
              onClick={handleAddModal}
              variant="outlined" 
              color="primary"
            > 
              <AddIcon/>  
            </Button>
          </Grid>

          <Grid className={classes.marginButton}>
            <ExportFile 
              data={countries}
            />
          </Grid>
        </Toolbar>

        <AddModal lastId={countries.length} displayFunction={displayFunction} openModal={openAddModal} closeModal={handleCloseModal} addCountry={handleNewCountry}/>

        <EditModal item={row} displayFunction={displayFunction} openModal={openEditModal} closeModal={handleCloseModal} editCountry={handleEditCountry}/>


        <TableContainer className={classes.tableContainer} component={Paper}>

            <Table aria-label="Countries Table" className={classes.table}>

                <TableHead className={classes.theader}>
                  <TableRow>
                    <TableCell width={40} className={classes.thead}>Country</TableCell>
                    <TableCell width={20} className={classes.thead}>Currency</TableCell>
                    <TableCell width={20} className={classes.thead}>Display</TableCell>
                    <TableCell width={10} className={classes.thead}></TableCell>
                    <TableCell width={10} className={classes.thead}></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {countries.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="center">{row.country}</TableCell>
                      <TableCell align="center">{row.currency}</TableCell>
                      <TableCell align="center">{display(row)}</TableCell>
                      <TableCell align="center"><EditIcon className={classes.btn} onClick={() => handleEdit(row)} /></TableCell>
                      <TableCell align="center"><DeleteOutlineOutlinedIcon className={classes.btn} onClick={() => handleDelete(row.id)}/></TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>

        </TableContainer>

      </Grid>
    </Container>

  );
}

export default App;
