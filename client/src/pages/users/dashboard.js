import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';

import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { AccountCircle, Send } from '@mui/icons-material';
import Update from './update';

import { backendUrl } from '../../data';
import axios from 'axios';

//nested data is ok, see accessorKeys in ColumnDef below
const data = [
  {
    name: 'Himasha Amandi',
    email: 'mandy@mandy.lk',
    phone: '07111111999',
    booksBorrowed: 6,
    registered:'03-08-2022'
  },
  {
    name: 'Homo Deus: A Brief History of Tomorrow ',
    author: 'Yuval Noah harari',
    isbn: '978-0062464316',
    copies: 6,
    registered:'03-08-2022'
  },
  {
    name: 'Homo Deus: A Brief History of Tomorrow ',
    author: 'Yuval Noah harari',
    isbn: '978-0062464316',
    copies: 6,
    registered:'03-08-2022'
  },
  {
    name: 'Homo Deus: A Brief History of Tomorrow ',
    author: 'Yuval Noah harari',
    isbn: '978-0062464316',
    copies: 6,
    registered:'03-08-2022'
  },
  {
    name: 'Homo Deus: A Brief History of Tomorrow ',
    author: 'Yuval Noah harari',
    isbn: '978-0062464316',
    copies: 6,
    registered:'03-08-2022'
  },
];



const Dashboard = () => {


  const [users, setUsers] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    console.log(backendUrl + 'user/getAll')
    axios.get(backendUrl + 'user/getAll')
      .then((response) => {
        // handle success
        console.log(response.data);
        setUsers(response.data.usersList);
        setIsTableLoading(false);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };



  const [openUpdate,setOpenUpdate] = useState(false);
  const [openDelete,setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Add selectedUser state



  const handleClickUpdate = (user) => {
    setSelectedUser(user);
    setOpenUpdate(true);
  }

  const handleClickDelete = () => {
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
  renderRowActionMenuItems={({ closeMenu, rowData }) => [
    
    <MenuItem
      key={0}
      onClick={() => {
        // View profile logic...
        handleClickUpdate(rowData);
        closeMenu()
      }}
      sx={{ m: 0 }}
    >
      <ListItemIcon>
        <AccountCircle />
      </ListItemIcon>
      Update
    </MenuItem>,
    <MenuItem
      key={1}
      onClick={() => {
        // Send email logic...
        handleClickDelete()
        closeMenu();
      }}
      sx={{ m: 0 }}
    >
      <ListItemIcon>
        <Send />
      </ListItemIcon>
      Delete
    </MenuItem>,
  ]}

  
  
  />

<Dialog open={openUpdate} onClose={handleClose}>
            <DialogContent>
                {/* <DialogContentText> */}
                  <Update user={selectedUser}/>
                  {/* </DialogContentText> */}
            </DialogContent>
        </Dialog>

      <Dialog open={openDelete} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">
          {" Delete This Item?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete This Item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Yes</Button>
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
        </DialogActions>
        </Dialog>
  </div>
  
  
  
  );
};

export default Dashboard;
