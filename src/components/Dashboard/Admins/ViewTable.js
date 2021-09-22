import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';

import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';


// regex for email validation
const validateEmail = (email) => {
  const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}


const ViewTable = () => {

  const [user, setUser] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  let columns = [
    { title: 'ID', field: 'id' },
    { title: 'First Name', field: 'fname' },
    { title: 'Last Name', field: 'lname' },
    { title: 'Email', field: 'email' },
    { title: 'Phone', field: 'phonbe' },
  ]

  // let data = [
  //   { name: 'manish', username: 'traptrick', email: 'themk85@gmail.com', phone: '9999999999', website: 'https://github.com/traptrick' }
  // ]  

  useEffect(() => {
    axios.get(`https://grovi-backend.herokuapp.com/api/v1/gigs/all/5.977553814423967,80.34890374890934?distance=60000&searchTag=rro`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        const users = res.data.data.gigs;
        setUser(users);
        console.log(users);
      })
  }, [])



  //function for updating the existing row details
  const handleRowUpdate = (newData, oldData, resolve) => {
    //validating the data inputs
    let errorList = []
    if (newData.name === "") {
      errorList.push("Try Again, You didn't enter the name field")
    }
    if (newData.username === "") {
      errorList.push("Try Again, You didn't enter the Username field")
    }
    if (newData.email === "" || validateEmail(newData.email) === false) {
      errorList.push("Oops!!! Please enter a valid email")
    }
    if (newData.phone === "") {
      errorList.push("Try Again, Phone number field can't be blank")
    }
    if (newData.website === "") {
      errorList.push("Try Again, Enter website url before submitting")
    }

    // if (errorList.length < 1) {
    //   axios.put(`https://jsonplaceholder.typicode.com/users/${newData.id}`, newData)
    //     .then(response => {
    //       const updateUser = [...user];
    //       const index = oldData.tableData.id;
    //       updateUser[index] = newData;
    //       setUser([...updateUser]);
    //       resolve()
    //       setIserror(false)
    //       setErrorMessages([])
    //     })
    //     .catch(error => {
    //       setErrorMessages(["Update failed! Server error"])
    //       setIserror(true)
    //       resolve()

    //     })
    // } else {
    //   setErrorMessages(errorList)
    //   setIserror(true)
    //   resolve()

    // }
  }


  //function for deleting a row
  const handleRowDelete = (oldData, resolve) => {
    axios.delete(`https://grovi-backend.herokuapp.com/api/v1/admins/edit/${oldData.id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        const dataDelete = [...user];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setUser([...dataDelete]);
        resolve()
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"])
        setIserror(true)
        resolve()
      })
  }


  //function for adding a new row to the table
  const handleRowAdd = (newData, resolve) => {
    //validating the data inputs
    let errorList = []
    if (newData.name === "") {
      errorList.push("Try Again, You didn't enter the name field")
    }
    if (newData.username === "") {
      errorList.push("Try Again, You didn't enter the Username field")
    }
    if (newData.email === "" || validateEmail(newData.email) === false) {
      errorList.push("Oops!!! Please enter a valid email")
    }
    if (newData.phone === "") {
      errorList.push("Try Again, Phone number field can't be blank")
    }
    if (newData.website === "") {
      errorList.push("Try Again, Enter website url before submitting")
    }

    if (errorList.length < 1) {
      axios.post(`https://grovi-backend.herokuapp.com/api/v1/admins/edit`, newData)
        .then(response => {
          let newUserdata = [...user];
          newUserdata.push(newData);
          setUser(newUserdata);
          resolve()
          setErrorMessages([])
          setIserror(false)
        })
        .catch(error => {
          setErrorMessages(["Cannot add data. Server error!"])
          setIserror(true)
          resolve()
        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }
  }


  return (
    <div className="app">
      
      <MaterialTable
        title="Admin Details"
        columns={columns}
        data={user}
        options={{
          headerStyle: { borderBottomColor: 'green', borderBottomWidth: '3px', fontFamily: 'verdana' },
          actionsColumnIndex: -1
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              handleRowUpdate(newData, oldData, resolve);

            }),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              handleRowAdd(newData, resolve)
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleRowDelete(oldData, resolve)
            }),
        }}
      />

      <div>
        {iserror &&
          <Alert severity="error">
            <AlertTitle>ERROR</AlertTitle>
            {errorMessages.map((msg, i) => {
              return <div key={i}>{msg}</div>
            })}
          </Alert>
        }
      </div>

    </div>
  );
}

export default ViewTable;