import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField } from '@mui/material';
import axios from 'axios';

import { backendUrl } from '../../data';


const validationSchema = yup.object({
  firstName: yup.string('Enter first name').required('First name is required'),
  lastName: yup.string('Enter last name').required('Last name is required'),
  nationality: yup.string('Enter nationality').required('Nationality is required'),
  dateOfBirth: yup.string('Enter date of birth').required('Date of Birth is required'),
  startPublishingDate: yup.date('Enter date published'),
  genres: yup.array().of(yup.string()),
  noOfBooksWritten: yup.number('Enter number').required('No. of books are required')
  
});

// const apiUrl = backendUrl + 'book/add'

const addAuthorApi = async (authorData) => {
  try {
    const response = await axios.post(`${backendUrl}author/add`, authorData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const Add = ({handleClose, updateTrigger}) => {
  const [author, setAuthor] = useState({
    firstName: '',
    lastName: '',
    nationality: '',
    dateOfBirth: '',
    startPublishingDate: '',
    genres: false,
    noOfBooksWritten: '',
  });

  const formik = useFormik({
    initialValues: author,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await addAuthorApi(values);
        alert('Author added successfully');

        handleClose()
        updateTrigger()
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert('Author already exists');
        } else {
          console.log(error);
          alert('Something went wrong, please try again');
        }
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        id="firstName"
        name="firstName"
        label="First Name"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
        helperText={formik.touched.firstName && formik.errors.firstName}
      />

      <TextField
        fullWidth
        id="lastName"
        name="lastName"
        label="Last Name"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
        helperText={formik.touched.lastName && formik.errors.lastName}
      />

      <TextField
        fullWidth
        id="nationality"
        name="nationality"
        label="Nationality"
        value={formik.values.nationality}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.nationality && Boolean(formik.errors.nationality)}
        helperText={formik.touched.nationality && formik.errors.nationality}
      />

      <TextField
        fullWidth
        id="dateOfBirth"
        name="dateOfBirth"
        label="Date of Birth"
        type="date"
        value={formik.values.dateOfBirth}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
        helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
        InputLabelProps={{ shrink: true }} 
      />

      <TextField
        fullWidth
        id="startPublishingDate"
        name="startPublishingDate"
        label="Start Publishing Date"
        type="date"
        value={formik.values.startPublishingDate}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.startPublishingDate && Boolean(formik.errors.startPublishingDate)}
        helperText={formik.touched.startPublishingDate && formik.errors.startPublishingDate}
        InputLabelProps={{ shrink: true }} 
      />

       <TextField
        fullWidth
        id="genres"
        name="genres"
        label="Genre 1"
        value={formik.values.genres[0] || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.genres && Boolean(formik.errors.genres)}
        helperText={formik.touched.genres && formik.errors.genres}
      />

       <TextField
        fullWidth
        id="genres"
        name="genres"
        label="Genre 2"
        value={formik.values.genres[1] || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.genres && Boolean(formik.errors.genres)}
        helperText={formik.touched.genres && formik.errors.genres}
      />

       <TextField
        fullWidth
        id="genres"
        name="genres"
        label="Genre 3"
        value={formik.values.genres[2] || ''}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.genres && Boolean(formik.errors.genres)}
        helperText={formik.touched.genres && formik.errors.genres}
      />


      <TextField
        fullWidth
        id="noOfBooksWritten"
        name="noOfBooksWritten"
        label="Number of Books written"
        type="number"
        value={formik.values.noOfBooksWritten}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.noOfBooksWritten && Boolean(formik.errors.noOfBooksWritten)}
        helperText={formik.touched.noOfBooksWritten && formik.errors.noOfBooksWritten}
      />


        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Add;