import React from "react";
import { useDispatch, useSelector } from "react-redux";
import projectSlice from "./../redux/projectSlice";
import { setSubtaskCompleteAsync } from "../redux/thunk";
function Subtask({ index, taskIndex, colIndex }) {
  const dispatch = useDispatch();
  const project = useSelector((state) =>
    state.projects.projects.find((project) => project.isActive)
  );

  const columns = project.columns;
  const col = columns.find((column, index) => index === colIndex);

  const task = col.tasks.find((task, index) => index === taskIndex);
  const subtask = task.subtasks.find((subtask, i) => i === index);

  const checked = subtask.isCompleted;
  
  const onChange = () => {
    // dispatch(
    //   projectSlice.actions.setSubtaskCompleted({index, taskIndex, colIndex})
    // )
    dispatch(setSubtaskCompleteAsync({index, taskIndex, colIndex}))

  }


  return (
    <div
    className="w-full flex hover:bg-[#635fc740] dark:hover:bg-[#635fc740] rounded-md relative items-center justift-start dark:bg-[#20212c] p-3 gap-4 bg-[#f4f7fd]"
    >
         <input type="checkbox" className=" w-4 h-4 accent-[#635fc7] cursor-pointer"
         checked={checked}
         onChange={onChange}
          />
          <p
          className={checked ? 'line-through opacity-30' : ''}
          >
            {subtask.title}
          </p>
    </div>
  )
}

export default Subtask;
