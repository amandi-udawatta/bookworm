import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  ListItemIcon,
  MenuItem,
  Typography,
  Tooltip,
  IconButton,
  Paper, // Add Paper component for dialog and container
} from '@mui/material';
import { AccountCircle, Send, Delete, Edit } from '@mui/icons-material';
import Update from './update';

import { backendUrl } from '../../data';
import axios from 'axios';
import { format } from 'date-fns';

import { makeStyles } from '@mui/styles';




//nested data is ok, see accessorKeys in ColumnDef below




const Table = ({trigger}) => {

  // const classes = useStyles();


  const [users, setUsers] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);

  useEffect(() => {
    getAllUsers();
  }, [trigger]);

  const getAllUsers = () => {
    console.log(backendUrl + 'user/getAll')
    axios.get(backendUrl + 'user/getAll')
      .then((response) => {
        // handle success
        console.log(response.data);
        var members = response.data.usersList.filter(user => !user.isAdmin);



        var members = members.map(member => {
          const formattedJoinDate = format(new Date(member.registered), 'yyyy-MM-dd');
          return {
            ...member,
            registered: formattedJoinDate,
          };
        });



        setUsers(members);
        setIsTableLoading(false);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };


  const deleteUser = (userId) => {
    axios.delete(`${backendUrl}user/delete/${userId}`)
      .then((response) => {
        handleClose();
        console.log(response.data);
        getAllUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const [openUpdate,setOpenUpdate] = useState(false);
  const [openDelete,setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Add selectedUser state
  const [selectedUserId, setSelectedUserId] = useState(null);



  const handleClickUpdate = (user) => {
    setSelectedUser(user);
    setOpenUpdate(true);
  }

  const handleClickDelete = (user) => {
    console.log(user['row']['original']['_id'])
    setSelectedUserId(user['row']['original']['_id'])
    setOpenDelete(true);
  }
  const handleClose = () => {
    setOpenUpdate(false);
    setOpenDelete(false);
  }

  
  //should be memoized or stable
  const columns = useMemo(
    () => [




      {
        accessorKey: 'name',
        header: 'Name',
        size: 150
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 150
      },
      {
        accessorKey: 'phone',
        header: 'Phone Number',
        size: 150
      },
      {
        accessorKey: 'registered',
        header: 'Registered Date',
        size: 150
      },
    ],
    [],
  );

  


  return (
    <div style={{ borderRadius: '10px', overflow: 'hidden' }}>    
    {/* <Paper className={classes.tableContainer}> */}
     <MaterialReactTable
  columns={columns}
  data={users}
  enableRowActions
  // tableOptions={{
  //   tableRowClass: classes.tableRow,
  //   tableHeaderClass: classes.tableHeader,
  // }}
  renderRowActions={(rowData) => (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <Tooltip arrow placement="left" title="Edit">
        <IconButton onClick={() => handleClickUpdate(rowData)} >
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip arrow placement="right" title="Delete">
        <IconButton color="error" onClick={() => handleClickDelete(rowData)} >
          <Delete />
        </IconButton>
      </Tooltip>
    </Box>
  )}
  
/>


<Dialog open={openUpdate} onClose={handleClose}>
            <DialogContent>
                {/* <DialogContentText> */}
                  <Update user={selectedUser} handleClose={handleClose} getAllUsers={getAllUsers}/>
                  {/* </DialogContentText> */}
            </DialogContent>
        </Dialog>

      <Dialog open={openDelete} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">
          {" Delete Member"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => deleteUser(selectedUserId)}>Yes</Button>
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
        </DialogActions>
        </Dialog>
        {/* </Paper> */}

  </div>
  
  
  
  );
};

export default Table;