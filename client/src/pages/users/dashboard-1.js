import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';

import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, ListItemIcon, MenuItem, Typography, Tooltip, IconButton } from '@mui/material';
import { AccountCircle, Send, Delete, Edit } from '@mui/icons-material';
import Update from './update';

import { backendUrl } from '../../data';
import axios from 'axios';
import { format } from 'date-fns';




import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  actionButtonStyles: {
    backgroundColor: '#ffffff', // Button background color
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16), 0px 2px 4px rgba(0, 0, 0, 0.23)', // Shadow
    borderRadius: '4px', // Rounded corners
    transition: 'transform 0.2s ease-in-out', // Add a subtle hover effect
    '&:hover': {
      transform: 'scale(1.05)', // Enlarge the button on hover
    },
  },
  menuItemStyles: {
    backgroundColor: '#ffffff', // Menu item background color
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16), 0px 2px 4px rgba(0, 0, 0, 0.23)', // Shadow
    borderRadius: '4px', // Rounded corners
    '&:hover': {
      backgroundColor: '#f0f0f0', // Change background color on hover
    },
  },
}));



//nested data is ok, see accessorKeys in ColumnDef below




const Dashboard = ({trigger}) => {

  const classes = useStyles();


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
        accessorKey: 'booksBorrowed',
        header: 'No.of Borrowed Books',
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
  <div> <MaterialReactTable
  columns={columns}
  data={users}
  enableRowActions
  renderRowActions={(rowData) => (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <Tooltip arrow placement="left" title="Edit">
        <IconButton onClick={() => handleClickUpdate(rowData)} className={classes.actionButtonStyles}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip arrow placement="right" title="Delete">
        <IconButton color="error" onClick={() => handleClickDelete(rowData)} className={classes.actionButtonStyles}>
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
          {" Delete This User?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete This User?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => deleteUser(selectedUserId)}>Yes</Button>
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
        </DialogActions>
        </Dialog>
  </div>
  
  
  
  );
};

export default Dashboard;