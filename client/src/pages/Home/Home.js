import React, { useContext, useEffect, useState } from 'react'
import { FaAngleDown } from "react-icons/fa6";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Tables from '../../components/Tables/Tables';
import Spiner from "../../components/Spiner/Spiner"
import { useNavigate } from "react-router-dom"
import { addData , dltdata, updateData } from '../../components/context/ContextProvider';
import { usergetfunc,deletfunc,exporttocsvfunc } from "../../services/Apis";
import Alert from 'react-bootstrap/Alert';
import "./home.css"
import { toast } from 'react-toastify';

const Home = () => {

  const [userdata,setUserData] = useState([]);
  const [showspin,setShowSpin] = useState(true);
  const [search,setSearch] = useState("");
  const [gender,setGender] = useState("All");
  const [status,setStatus] = useState("All");
  const [sort,setSort] = useState("new");
  const [page,setPage] = useState(1);
  const [pageCount,setPageCount] = useState(0);

  const { useradd, setUseradd } = useContext(addData);
  
  const {update,setUpdate} = useContext(updateData);
  const {deletedata, setDLtdata} = useContext(dltdata);

  const navigate = useNavigate();

  const adduser = () => {
    navigate("/register")
  }

  // get user
  const userGet = async()=>{
    const response = await usergetfunc(search,gender,status,sort,page);
    if(response.status === 200){
      setUserData(response.data.usersdata);
      setPageCount(response.data.Pagination.pageCount)
    }else{
      console.log("error")
    }
  }

  // user delete
  const deleteUser = async(id)=>{
    const response = await deletfunc(id);
    if(response.status === 200){
      userGet();
      setDLtdata(response.data)
    }else{
      toast.error("error")
    }
  }

  // export user
  const exportuser = async()=>{
    const response = await exporttocsvfunc();
    if(response.status === 200){
      window.open(response.data.downloadUrl,"blank")
    }else{
      toast.error("error")
    }
  }

  // pagination
  // handle prev btn
  const handlePrevious = ()=>{
    setPage(()=>{
      if(page === 1) return page;
      return page - 1
    })
  }

  // handle next btn
  const handleNext = ()=>{
    setPage(()=>{
      if(page === pageCount) return page;
      return page + 1
    })
  }

  useEffect(()=>{
    userGet();
    setTimeout(()=>{
        setShowSpin(false)
    },1200)
  },[search,gender,status,sort,page])

  return (
    <>
    {
      useradd ?  <Alert variant="success" onClose={() => setUseradd("")} dismissible>{useradd.fname.toUpperCase()} Succesfully Added</Alert>:""
    }

    {
      update ? <Alert variant="primary" onClose={() => setUpdate("")} dismissible>{update.fname.toUpperCase()} Succesfully Update</Alert>:""
    }

    {
      deletedata ? <Alert variant="danger" onClose={() => setDLtdata("")} dismissible>{deletedata.fname.toUpperCase()} Succesfully Delete</Alert>:""
    }

      <div className="container">
        <div className="main_div">
          {/* search add btn */}
          <div className="search_add mt-4 d-flex justify-content-between">
            <div className="search col-lg-4">
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e)=>setSearch(e.target.value)}
                />
                <Button variant="success" className='search_btn'>Search</Button>
              </Form>
            </div>
            <div className="add_btn">
              <Button className='btn' onClick={adduser}>Add Employee</Button>
            </div>
          </div>
          {/* export,gender,status */}

          <div className="filter_div mt-5 d-flex justify-content-between flex-wrap">
            <div className="export_csv mrg">
              <Button className='btn' onClick={exportuser}>Export To CSV</Button>
            </div>
            <div className="filter_gender mrg">
              <div className="filter">
                <h3>Filter By Gender</h3>
                <div className="gender d-flex justify-content-between">
                  <Form.Check
                    type={"radio"}
                    label={`All`}
                    name="gender"
                    value={"All"}
                    onChange={(e)=>setGender(e.target.value)}
                    defaultChecked
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Male`}
                    name="gender"
                    value={"Male"}
                    onChange={(e)=>setGender(e.target.value)}
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Female`}
                    name="gender"
                    value={"Female"}
                    onChange={(e)=>setGender(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* sort by value */}
            <div className="d-flex mrg">
              <h3>Sort By Value</h3>
              <Dropdown className='text-center'>
                <Dropdown.Toggle className='dropdown_btn' id="dropdown-basic">
                  <FaAngleDown />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={()=>setSort("new")}>New</Dropdown.Item>
                  <Dropdown.Item onClick={()=>setSort("old")}>Old</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* filter by status */}
            <div className="filter_status mrg">
              <div className="status">
                <h3>Filter By Status</h3>
                <div className="status_radio d-flex justify-content-between flex-wrap custom-radio">
                  <Form.Check
                    type={"radio"}
                    label={`All`}
                    name="status"
                    value={"All"}
                    onChange={(e)=>setStatus(e.target.value)}
                    checked={status === 'All'}
                    className="custom-radio"
                    defaultChecked
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Active`}
                    name="status"
                    value={"Active"}
                    onChange={(e)=>setStatus(e.target.value)}
                    checked={status === 'Active'}
                    className="custom-radio"
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Inactive`}
                    name="status"
                    value={"Inactive"}
                    onChange={(e)=>setStatus(e.target.value)}
                    checked={status === 'Inactive'}
                    className="custom-radio"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          showspin ? <Spiner /> : <Tables
                                    userdata={userdata}
                                    deleteUser={deleteUser}
                                    userGet={userGet}
                                    handlePrevious={handlePrevious}
                                    handleNext={handleNext}
                                    page={page}
                                    pageCount={pageCount}
                                    setPage={setPage}
                                  />
        }

      </div>
    </>
  )
}

export default Home