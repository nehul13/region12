import './App.css';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { GridToolbar } from '@mui/x-data-grid-pro';
import React from 'react';
import axios from 'axios';
import apiUrlMapping from '../src/resources/apiMapping.json';
import { useEffect } from 'react';

import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Dialog, DialogContent, DialogActions, DialogTitle} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';





const geRowsWithId = (rows) => {
  let id = 0
  let completeRowListArray = []
  for (let row of rows) {
    const rowsWithId = {
      id: id,
      ...row
    }
    id++
    completeRowListArray.push(rowsWithId)
  }
  return completeRowListArray
}
export default function App() {

  const employeeTable = 
  [
    {
      field: 'actions',
      type:'actions',
      width:100,
      getActions:(event) => [
        <GridActionsCellItem onClick={(e) => onclickofEditButton(event)} icon={<EditIcon/>} label="Edit"/>,
        <GridActionsCellItem onClick={(e) => deleteRecord(event.id)} icon={<ClearIcon/>} label="Delete"/>,
        <GridActionsCellItem onClick={(e) => onClickOfViewButton(event)} icon={<VisibilityIcon/>} label="View"/>,
      ],
    },
    {
      field: 'region_Id',
      headerName: 'region_Id',
      width : 240 
    },
    {
      field: 'region_Name',
      headerName: 'region_Name',
      width : 240
    },
    {
      field: 'city',
      headerName: 'city',
      width : 240
    },
    {
      field: 'country_Name',
      headerName: 'country_Name',
      width : 240
    }
  ]

  const [rows, setRows] = React.useState([])
  const [add, setAdd] = React.useState("")
  const [edit, setEdit] = React.useState("")
  const [editId, setEditId] = React.useState("")
  
  const handleClickOpen = () => {setOpen(true);};
  
const handleClickOpen2 = () => {setOpenView(true);};
  const handleClose2 = () => {setOpenView(false);};
  const [openview, setOpenView] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [region_Id, setregion_Id] 	= React.useState("");
  const [city, setcity] 	= React.useState("");
 const [region_Name, setregion_Name] 	= React.useState("");
 const [country_Name, setcountry_Name] 			= React.useState("");
 const handleClose3 = () => {setOpenEdit(false);};
 const handleClickOpen3 = () => {setOpenEdit(true);};
 const [openedit, setOpenEdit] = React.useState(false);
 const handleClose = () => {setOpen(false);};

  const getAllRecords=()=>
  {
    axios.get(apiUrlMapping.employeeData.getAll).then(response =>
	{
    setRows(geRowsWithId(response.data))
    });
  }

  const onClickofSaveRecord = () => 
  {
    setAdd("Save")
    setregion_Id()
    setregion_Name()
    setcity()
    setcountry_Name()
    handleClickOpen()
  }

  useEffect(() => {getAllRecords()}, []);

  const addAndClose = (type) =>
  {

    if (type === "Save") { addRecordAndClose(); }

  }
  const editRecordandclose = (type) => 
  {
    if (type === "Edit") {editRecordAndClose()}
  
    }
   
  

  const addRecordAndClose= () => 
  {
    if (region_Id !== undefined && region_Name !== undefined && city !== undefined && country_Name !== undefined )
	{
      let payload = 
	  {
        "region_Id": region_Id,
        "region_Name": region_Name,
        "country_Name": country_Name,
        "city": city
      }
      console.log("The Data to DB is " + payload)
      axios.post(apiUrlMapping.employeeData.post, payload).then(response => 
	  {
	  getAllRecords()
        handleClose()
        setregion_Id()
        setregion_Name()
        setcity()
        setcountry_Name()
         })
    }
  }

  const deleteRecord =(index) =>
  {
    let dataId = rows[index]._id
    
    axios.delete(apiUrlMapping.employeeData.delete + "/" + dataId).then(()=>{getAllRecords();});
  }
  const onclickofEditButton = (e) =>
  {
   setEdit("Edit")
   let editRecord = rows[e.id]
   setregion_Id(editRecord.region_Id)
   setregion_Name(editRecord.region_Name)
   setcity(editRecord.city)
   setcountry_Name(editRecord.country_Name)
   setEditId(editRecord._id)
   handleClickOpen3()
  }
 
  const editRecordAndClose = () => 
  {
    if (region_Id !== undefined && region_Name !== undefined && city !== undefined && country_Name !== undefined )
	{
      let payload = 
	  {
        "region_Id": region_Id,
        "region_Name": region_Name,
        "country_Name": country_Name,
        "city": city
      }
      axios.put(apiUrlMapping.employeeData.put + "/" + editId, payload).then(response => 
	  {
	  getAllRecords();
    handleClose3();
    })
  }  
}

const onClickOfViewButton = (e) =>
{
  let viewRecord = rows[e.id]
  setregion_Id(viewRecord.region_Id)
  setregion_Name(viewRecord.region_Name)
  setcity(viewRecord.city)
  setcountry_Name(viewRecord.country_Name)
  handleClickOpen2()
}
  
  return (
    <div className="App">
      <div className="text-alligned">
        <h1>Region Data</h1>
      </div>
      <div style={{ height: "50vh", width: "100%" }}>
      <DataGrid
          rows = {rows}
          columns = {employeeTable}
          components={{Toolbar: GridToolbar,}}
          componentsProps={{toolbar: { showQuickFilter: true }}}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
  </div>
  <div className="center" >
          <Button variant="contained" onClick={onClickofSaveRecord} >Add Record</Button>
  </div>

  <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Region Data</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="region_Id"  onChange={(e) => { setregion_Id(e.target.value) }}value={region_Id}label="region_Id"type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="region_Name" onChange={(e) => { setregion_Name(e.target.value) }}value={region_Name} label="region_Name" type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="city" onChange={(e) => { setcity(e.target.value) }} value={city} label="city" type="city" fullWidth/>
          <TextField autoFocus margin="dense" id="country_Name" onChange={(e) => { setcountry_Name(e.target.value) }} value={country_Name} label="country_Name" type="text" fullWidth/>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => { addAndClose(add) }}>Save</Button> 
        </DialogActions>
        </Dialog>
   <Dialog open={openedit} onClose={handleClose3}  >
        <DialogTitle>Edit Region Data</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" id="region_Id"  onChange={(e) => { setregion_Id(e.target.value) }}value={region_Id}label="region_Id"type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="region_Name" onChange={(e) => { setregion_Name(e.target.value) }}value={region_Name} label="region_Name" type="text" fullWidth/>
          <TextField autoFocus margin="dense" id="city" onChange={(e) => { setcity(e.target.value) }} value={city} label="city" type="city" fullWidth/>
          <TextField autoFocus margin="dense" id="country_Name" onChange={(e) => { setcountry_Name(e.target.value) }} value={country_Name} label="country_Name" type="text" fullWidth/>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose3}>Cancel</Button>
          <Button onClick={() => {editRecordandclose(edit) }}>Edit</Button> 
        </DialogActions>
  </Dialog>
  <Dialog open={openview} onClose={handleClose2}>
        <DialogTitle>View Region Data</DialogTitle>
        <DialogContent>
          <TextField disabled autoFocus margin="dense" id="region_Id" onChange={(e) => { setregion_Id(e.target.value) }} value={region_Id} label="region_Id" type="text" fullWidth />
          <TextField disabled autoFocus margin="dense" id="region_Name" onChange={(e) => { setregion_Name(e.target.value) }} value={region_Name} label="region_Name" type="text" fullWidth />
          <TextField disabled autoFocus margin="dense" id="city" onChange={(e) => { setcity(e.target.value) }} value={city} label="city" type="text" fullWidth />
           <TextField disabled autoFocus margin="dense" id="country_Name" onChange={(e) => { setcountry_Name(e.target.value) }} value={country_Name} label="country_Name" type="text" fullWidth />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2}>Cancel</Button>
        </DialogActions>
      </Dialog>

      
    </div>
  );
}
      
  
      
  
