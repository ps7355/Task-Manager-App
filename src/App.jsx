/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import './App.css'
import Data from "./lib/data";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import { Button } from "./components/ui/button";
import { PlusIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useState,useEffect } from "react";
import CreateTaskDialoge from "./Task-Components/create-task-dialouge";


const columns = [
  {
    accessorKey:"Task Id",
    header:"Task Id"
  },
  {
    accessorKey:"Title",
    header:"Title"
  },
  {
    accessorKey:"Status",
    header:"Status"
  },
  {
    accessorKey:"Priority",
    header:"Priority"
  },
  {
    accessorKey:"Deadline",
    header:"Deadline"
  }
]



function App() {
 
  const[taskData,setTaskData]=useState(Data);
  

  useEffect(()=>{
    fetch('https://task-manager-api-cbx5.onrender.com/' ,{ method: 'GET' })
    .then(data => data.json()) // Parsing the data into a JavaScript object
    .then(json => {
      console.log(json.data.allTask);
      setTaskData(json.data.allTask)})
  },[])
 
  return (
    <div className="outer-border">
      <div className="title">Welcome back!</div>
      <div className="subtitle">Here's a list of your tasks for this month!</div>
      <div className="add-task-button">
      <CreateTaskDialoge/>
      </div>
    <div className="table-border">
      <Table>
        <TableHeader>
          <TableRow>
          {columns.map(column => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            taskData.map((data,index)=>(
              <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className='title-style'>{data.title}</TableCell>
              <TableCell>{data.status}</TableCell>
              <TableCell>{data.priority}</TableCell>
              <TableCell>{'1'}</TableCell>
              <TableCell>{<Button variant="outline" size="icon"><DotsHorizontalIcon /></Button>}</TableCell>
              </TableRow>
            ))
          }
          </TableBody>
      </Table>
    </div>
    </div>
  )
}

export default App


