// App.js

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import './App.css';
import Data from "./lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "./components/ui/button";
import { PlusIcon, DotsHorizontalIcon, ValueIcon,StopwatchIcon,CrossCircledIcon,QuestionMarkCircledIcon, CheckCircledIcon, ArrowDownIcon,ArrowUpIcon,ArrowRightIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import CreateTaskDialoge from "./Task-Components/create-task-dialouge";
import { endOfDay, format, formatDistanceStrict } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const columns = [
  {
    accessorKey: "Task Id",
    header: "Task Id"
  },
  {
    accessorKey: "Title",
    header: "Title"
  },
  {
    accessorKey: "Status",
    header: "Status"
  },
  {
    accessorKey: "Priority",
    header: "Priority"
  },
  {
    accessorKey: "Deadline",
    header: "Deadline"
  }
];

function App() {

  const [taskData, setTaskData] = useState(Data);

  useEffect(() => {
    fetch('https://task-manager-api-1-8sfc.onrender.com/', { method: 'GET' })
      .then(data => data.json())
      .then(json => {
        // const result = formatDistanceStrict(new Date(2016, 0, 1), new Date(2015, 0, 1), {
        //   unit: 'day'
        // })
        // console.log(new Date().getMonth());
        console.log(json.data.allTask);
        
        setTaskData(json.data.allTask);
      });

      
  }, []);

  return (
    <div className="outer-border">
      <div className="title">Welcome back!</div>
      <div className="subtitle">Here's a list of your tasks for this month!</div>
      <div className="add-task-button">
        <CreateTaskDialoge />
      </div>
      <div className="table-border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead  key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {taskData.map((data, index) => (
              // Apply the custom class to the TableRow component
              <TableRow key={index} className="custom-table-row">
                <TableCell className="h-4 ">{index + 1}</TableCell>
                <TableCell className='title-style'>{data.title}</TableCell>
                <TableCell>{StatusIconGetter(data.status)}</TableCell>
                <TableCell>{PriorityIconGetter(data.priority)}</TableCell>
                <TableCell>{data.deadline == null ? <div>No Deadline</div>: DeadlineGetter(data.deadline.toString())}</TableCell>
                <TableCell>
                  {DropDownItems(data._id)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default App;

function StatusIconGetter(status) {
  if (status == 'Todo') {
    return <div className="demo"><ValueIcon className="mr-3 size-5" />Todo</div>;
  } else if (status == "In Progress") {
    return <div className="demo"><StopwatchIcon className="mr-3 size-5" />In Progress</div>;
  } else if (status == 'Done') {
    return <div className="demo"><CheckCircledIcon className="mr-3 size-5" />Done</div>;
  } else if (status == 'Backlog') {
    return <div className="demo"><QuestionMarkCircledIcon className="mr-3 size-5" />Backlog</div>;
  }
  else if (status == 'Canceled') {
    return <div className="demo"><CrossCircledIcon className="mr-3 size-5" />Cancelled</div>;
  }
}

function PriorityIconGetter(priority){
  if(priority=='Low'){
    return <div className="demo"><ArrowDownIcon className="mr-3 size-5" />Low</div>
  }
  else if(priority=='Medium'){
    return <div className="demo"><ArrowRightIcon className="mr-3 size-5" />Medium</div>
  }
  
  else if(priority=='High'){
    return <div className="demo"><ArrowUpIcon className="mr-3 size-5" />High</div>
  }
  }

 function DeadlineGetter(deadline){
  const currentDay= new Date().getDate();
  const currentMonth=new Date().getMonth()+1;
  const currentYear=new Date().getFullYear();
  const deadlineDay= deadline.substr(8,2);
  const deadlineMonth=deadline.substr(5,2);
  const deadlineYear= deadline.substr(0,4);
  
  const result = formatDistanceStrict(new Date(deadlineYear, deadlineMonth, deadlineDay), new Date(currentYear, currentMonth, currentDay), {
      unit: 'day'
    })
    const days = Number(result.slice(0,2));
    if(days<=2){
      return <div className="demo"><div className="h-2 mt-2 mr-2 w-2 rounded bg-red-600"></div><div>{result} Left</div></div>
    }
    else if(days>2 && days<=4){
      return <div className="demo"><div className="h-2 mt-2 mr-2 w-2 rounded bg-orange-600"></div><div>{result} Left</div></div>
    }
    else{
      return <div className="demo"><div className="h-2 mt-2 mr-2 w-2 rounded bg-green-600"></div><div>{result} Left</div></div>
    }
 }
 //<div className="h-2 w-2 rounded bg-red-600"></div>
 function DropDownItems(id){
  return <DropdownMenu>
    <DropdownMenuTrigger>
    <Button variant="outline" size="icon"><DotsHorizontalIcon /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem onSelect={()=>DeleteTask(id)}>Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
 }


 //api functions
 async function DeleteTask(id){
  try{
    await fetch(`https://task-manager-api-1-8sfc.onrender.com/${id}`,{method:"DELETE"}).then((Response)=>{console.log(Response)})
  }catch(e){
    console.log("error");
    console.log(e);
  }
 }