import React, { useEffect, useState } from "react";
import Column from "./../../components/Column";
import { useSelector } from "react-redux";
import EmptyProject from "../../components/EmptyProject";
import AddEditProjectModal from "../../modals/AddEditProjectModal";

function TaskMain({ projectModalOpen, setProjectModalOpen }) {
  const project = useSelector((state) =>
    state.projects.projects.find((project) => project.isActive)
  );
  const columns = project.columns;
  // console.log(columns)

  return (
    <div className="bg-[#f4f7fd]  scrollbar-hide flex dark:bg-[#20212c]  overflow-x-scroll gap-6 rounded-[10px] mt-5 ">
      {/* column Section */}
      {columns.length > 0 ? (
        <>
          {columns.map((col, index) => {
            return <Column key={index} colIndex={index} />;
          })}
          <div
            onClick={() => {
              setProjectModalOpen(true);
            }}
            className=" h-screen dark:bg-[#2b2c3740] flex justify-center items-center font-bold text-2xl hover:text-[#635FC7] transition duration-300 cursor-pointer bg-[#E9EFFA] scrollbar-hide mb-2   mx-5  min-w-[280px] text-[#828FA3] mt-[90px] rounded-lg "
          >
            + New Column
          </div>
        </>
      ) : (
        <>
          <EmptyProject type={"edit"} />
        </>
      )}
      {
        projectModalOpen && (
          <AddEditProjectModal
          type='edit'
          setModalOpen={setProjectModalOpen}
          />
        )
      }
      
    </div>
  );
}

export default TaskMain;
