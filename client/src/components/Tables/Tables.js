import React from 'react'
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';
import Paginations from '../pagination/Paginations';
import { BASE_URL } from '../../services/helper';
import { NavLink } from 'react-router-dom';
import { statuschangefunc } from "../../services/Apis"
import { ToastContainer, toast } from "react-toastify"
import "./table.css"

const Tables = ({ userdata, deleteUser, userGet, handlePrevious, handleNext, page, pageCount, setPage }) => {

  const handleChange = async (id, status) => {
    const response = await statuschangefunc(id, status);

    if (response.status === 200) {
      userGet();
      toast.success("Status Updated")
    } else {
      toast.error("error ")
    }
  }

  return (
    <>
      <div className="container">
        <Row>
          <div className="col mt-0">
            <Card className='shadow bright-black'>
              <Table className='align-items-center' responsive="sm">
                <thead className='text-white'>
                  <tr style={{ backgroundColor: "#2e2e2e"}}>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>&nbsp;&nbsp;&nbsp;Status</th>
                    <th>Profile</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className='text-white bright-black'>
                  {
                    userdata.length > 0 ? userdata.map((element, index) => {
                      return (
                        <>
                          <tr style={{ backgroundColor: 'rgb(91,91,91)'}}>
                            <td>{index + 1 + (page - 1)*4}</td> 
                            <td>{element.fname + ' ' + element.lname}</td>
                            <td>{element.email}</td>
                            <td>{element.gender === "Male" ? "M" : "F"}</td>
                            <td className='d-flex align-items-center'>
                              <Dropdown className='text-center'>
                                <Dropdown.Toggle className='dropdown_btn' id="dropdown-basic">
                                  <Badge bg={element.status === "Active" ? "success" : "danger"}>
                                    {element.status} <i class="fa-solid fa-angle-down"></i>
                                  </Badge>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item onClick={() => handleChange(element._id, "Active")}>Active</Dropdown.Item>
                                  <Dropdown.Item onClick={() => handleChange(element._id, "Inactive")}>Inactive</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                            <td className='img_parent'>
                              <img src={`${BASE_URL}/uploads/${element.profile}`} alt="img" />
                            </td>
                            <td>
                              <Dropdown>
                                <Dropdown.Toggle variant='light' className='action' id="dropdown-basic">
                                  <i class="fa-solid fa-ellipsis-vertical" style={{ color: "white" }}></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item >
                                    <NavLink to={`/userprofile/${element._id}`} className="text-decoration-none">
                                      <i class="fa-solid fa-eye" style={{ color: "black" }}></i> <span style={{ color: "black" }}>View</span>
                                    </NavLink>
                                  </Dropdown.Item>
                                  <Dropdown.Item >
                                    <NavLink to={`/edit/${element._id}`} className="text-decoration-none">
                                      <i class="fa-solid fa-pen-to-square" style={{ color: "black" }}></i> <span style={{ color: "black" }}>Edit</span>
                                    </NavLink>
                                  </Dropdown.Item>
                                  <Dropdown.Item >
                                    <div onClick={() => deleteUser(element._id)}>
                                      <i class="fa-solid fa-trash" style={{ color: "black" }}></i> <span>Delete</span>
                                    </div>
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        </>
                      )
                    }) : <div className='no_data text-center'>No Data Found</div>
                  }
                </tbody>
              </Table>
              <Paginations
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                page={page}
                pageCount={pageCount}
                setPage={setPage}
              />
            </Card>
          </div>
        </Row>
        <ToastContainer />
      </div>
    </>
  )
}

export default Tables