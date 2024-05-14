import React from "react";
import "./MainContent.css";
import LineHeader from "../../../components/LineHeader/LineHeader";
import AddEditProjectModal from "../../../modals/AddEditProjectModal";
import data from "./../../../data/data.json";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import projectSlice from "../../../redux/projectSlice";
import { Link, useNavigate } from "react-router-dom";
import { fetchProjects } from "../../../redux/thunk";

function MainContent({ modalOpen, setModalOpen }) {
  const navigate = useNavigate();
  const [data, setData] = useState(useSelector((state) => state.projects))
  const [projectType, setProjectType] = useState("add")

  const dispatch = useDispatch();
  
  const projects = useSelector((state) => state.projects);
  // const project = projects.find((project) => project.isActive);
  const loading = useSelector(state => state.projects.loading);

  useEffect(() => {
    // Fetch projects when the component mounts
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    setData(projects)
    console.log(projects)
  },[projects])
  

  return (
    <div className="main-content transition-all ease-in-out dark:bg-[#2b2c37]">
      <div className="">
        <LineHeader location={"Dashboard"} setProjectModalOpen={setModalOpen} modalOpen={modalOpen}/>
        <div className="cards-box">
          <div className="card">
            <div className="card icon">
              <i className="bx bx-signal-5 progress-icon text-white"></i>
            </div>
            <div className="card-text">
              <h3>Tasks in Progress</h3>
              <h1>15</h1>
            </div>
            <div className="card-footer">
              <h1>Card footer</h1>
            </div>
          </div>
          <div className="card">
            <div className="card icon">
              <i className="bx bx-revision progress-icon text-white"></i>
            </div>
            <div className="card-text">
              <h3>Tasks in Review</h3>
              <h1>15</h1>
            </div>
            <div className="card-footer">
              <h1>Card footer</h1>
            </div>
          </div>{" "}
          <div className="card">
            <div className="card icon">
              <i className="bx bx-command progress-icon text-white"></i>
            </div>
            <div className="card-text">
              <h3>Tasks Done</h3>
              <h1>15</h1>
            </div>
            <div className="card-footer">
              <h1>Card footer</h1>
            </div>
          </div>{" "}
          <div className="card">
            <div className="card icon">
              <i className="bx bx-layer progress-icon text-white"></i>
            </div>
            <div className="card-text">
              <h3>Tasks Pending</h3>
              <h1>15</h1>
            </div>
            <div className="card-footer">
              <h1>Card footer</h1>
            </div>
          </div>
        </div>

        <div className="mt-10 text-gray-600 font-semibold text-xl">
          <h1>Projects</h1>
          <div className="flex flex-wrap">


            {data.projects.map((project, index) => {
              return (
                // <Link to={'/dashboard/tasks'}>
                <div className="card cursor-pointer" key={index} onClick={
                  ()=>{
                    dispatch(projectSlice.actions.setProjectActive({index}))
                    navigate('/dashboard/tasks')
                  }
                
                }>
                    <div className="card icon">
                      <i className="bx bx-layer progress-icon text-white"></i>
                    </div>
                    <div className="card-text">
                      <h3>{project.name}</h3>
                      <div className="card-text" >
                      {project.columns.map((col, index)=>{
                        return(
                                  <div className="dat" key={index}>
                                    <h3>{col.name} {col.tasks ? col.tasks.length : 0}</h3>
                                  </div>
                        )
                      })}
                      </div>
                      </div>
                </div>
              // </Link>
              )
            })}

            <div className="card flex justify-center items-center">
              <i className='bx bx-plus-circle text-7xl hover:text-red-500 cursor-pointer' onClick={()=>{
                setModalOpen(true)
              }} ></i>
            </div>
          </div>
        </div>
      
      </div>
      {modalOpen && <AddEditProjectModal type={projectType}  setModalOpen = {setModalOpen} />}
    </div>
  );
}

export default MainContent;
