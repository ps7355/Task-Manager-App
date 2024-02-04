/* eslint-disable no-unused-vars */
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useRef } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function CreateTaskDialoge() {
    const inputRef = useRef(null);
    const [status, setstatus] = useState('');
    const [priority, setpriority] = useState('');

    async function HandleSubmit() {
        let inputData = inputRef.current.value;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // You might need additional headers here
            },
            body: JSON.stringify({
                title: inputData,
                status: status,
                priority: priority
            })
        };
    
        try {
            const response = await fetch('https://task-manager-api-cbx5.onrender.com/', options);
            const data = await response.json(); // Use await here to get the parsed JSON data
    
            console.log(JSON.stringify(data));
        } catch (e) {
            console.error(e.message);
        }
    }

    function HandleStatusChange(status) {
        setstatus(status);

    }function HandlePriorityChange(priority) {
        setpriority(priority);
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusIcon /> Create New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New task</DialogTitle>
                    <DialogDescription>
                        Add your task details here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input id="title" className="col-span-3" ref={inputRef} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <StatusSelector statusHandler={HandleStatusChange} selectedStatus={status} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priority" className="text-right">
                            Priority
                        </Label>
                       <PrioritySelector priorityHandler={HandlePriorityChange}/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deadline" className="text-right">
                            Deadline
                        </Label>
                        {/* Include your DeadlineSelector component here */}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose>
                        <Button onClick={HandleSubmit} type="submit">Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function StatusSelector(props) {
   
    return (
        <Select  onValueChange={props.statusHandler}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="select one" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="backlog">Backlog</SelectItem>
            </SelectContent>
        </Select>
    );
}
function PrioritySelector(props){
    return <Select onValueChange={props.priorityHandler}>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="select one"/>
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
        </SelectContent>
    </Select>
}

function DeadlineSelector(){
    const [date, setDate] = useState();

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>
    );
  }