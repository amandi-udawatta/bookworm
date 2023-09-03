import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';

import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, ListItemIcon, MenuItem, Typography, Tooltip, IconButton } from '@mui/material';
import { AccountCircle, Send, Delete, Edit } from '@mui/icons-material';
import Update from './update';

import { backendUrl } from '../../data';
import axios from 'axios';

const Dashboard = ({trigger}) => {

  const [authors, setAuthors] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);

  useEffect(() => {
    getAllAuthors();
  }, [trigger]);

  const getAllAuthors = () => {
    console.log(backendUrl + 'author/getAll')
    axios.get(backendUrl + 'author/getAll')
      .then((response) => {
        // handle success
        console.log(response.data);
        const members = response.data.authorsList.filter(author => !author.isAdmin);
        setAuthors(members);
        setIsTableLoading(false);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };


  const deleteAuthor = (authorId) => {
    axios.delete(`${backendUrl}author/delete/${authorId}`)
      .then((response) => {
        handleClose();
        console.log(response.data);
        getAllAuthors();
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const [openUpdate,setOpenUpdate] = useState(false);
  const [openDelete,setOpenDelete] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null); // Add selectedBook state
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);



  const handleClickUpdate = (author) => {
    setSelectedAuthor(author);
    setOpenUpdate(true);
  }

  const handleClickDelete = (author) => {
    console.log(author['row']['original']['_id'])
    setSelectedAuthorId(author['row']['original']['_id'])
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
        accessorKey: 'firstName',
        header: 'First Name',
        size: 150
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 150
      },
      {
        accessorKey: 'nationality',
        header: 'Natioanlity',
        size: 150
      },
      {
        accessorKey: 'dateOFBirth',
        header: 'Date of Birth',
        size: 150
      },
      {
        accessorKey: 'startDateOfPublishing',
        header: 'Start Date of Publishing',
        size: 150
      },
      {
        accessorKey: 'genres',
        header: 'Genre',
        size: 150
      },
      {
        accessorKey: 'noOfBooksWritten',
        header: 'Number of Books written',
        size: 150
      },
      
    ],
    [],
  );

  


  return (
  <div> <MaterialReactTable 
  columns={columns}
  data={authors}
  enableRowActions
  renderRowActions={( rowData) => (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <Tooltip arrow placement="left" title="Edit">
        <IconButton onClick={() => handleClickUpdate(rowData)}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip arrow placement="right" title="Delete">
        <IconButton color="error" onClick={() => handleClickDelete(rowData)}>
          <Delete />
        </IconButton>
      </Tooltip>
    </Box>
  )}
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
//   renderDetailPanel={({ row }) => (
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//       }}
//     >
//       <img
//         alt={row.original.title}
//         height={200}
//         src={`https://covers.openlibrary.org/b/isbn/${row.original.ISBN}-M.jpg`}
//         loading="lazy"
//         // style={{ borderRadius: '50%' }}
//       />
//       {console.log(row)}
//       <Box sx={{ textAlign: 'center' }}>
//         <Typography variant="h4">{row.original.title}</Typography>
//         <Typography variant="h5">
//           {row.original.author}
//         </Typography>
//       </Box>
//     </Box>
//   )}

  
  />

<Dialog open={openUpdate} onClose={handleClose}>
            <DialogContent>
                {/* <DialogContentText> */}
                  <Update book={selectedBook} handleClose={handleClose} getAllAuthors={getAllAuthors}/>
                  {/* </DialogContentText> */}
            </DialogContent>
        </Dialog>

      <Dialog open={openDelete} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">
          {" Delete This Author?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete This Author?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => deleteAuthor(selectedAuthorId)}>Yes</Button>
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
        </DialogActions>
        </Dialog>
  </div>
  
  
  
  );
};

export default Dashboard;


