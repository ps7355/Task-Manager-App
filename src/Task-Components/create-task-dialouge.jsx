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
import { endOfDay, format,formatDistance} from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function CreateTaskDialoge(props) {
    const inputRef = useRef(null);
    const [status, setstatus] = useState('');
    const [priority, setpriority] = useState('');
    const [ deadline,setdeadline] = useState(Date);
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
                priority: priority,
                deadline:deadline
            })
        };
    
        try {
            
            const response = await fetch('https://task-manager-api-1-8sfc.onrender.com/', options);
            const data = await response.json(); 
            props.trigger();
        } catch (e) {
            console.error(e.message);
        }
    }

    function HandleStatusChange(status) {
        setstatus(status);

    }function HandlePriorityChange(priority) {
        setpriority(priority);
    }
    function HandleDeadlineChange(deadline) {
        console.log(deadline);
        setdeadline(deadline);
    }


    return (
        <Dialog >
            <DialogTrigger asChild>
            <Button>
                    <PlusIcon className="mr-2" /> Create New Task
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
                        <DeadlineSelector deadlineHandler={HandleDeadlineChange}/>
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
                <SelectItem value="Todo">Todo</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
                <SelectItem value="Backlog">Backlog</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
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
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
        </SelectContent>
    </Select>
}

function DeadlineSelector(props){
    const [date, setDate] = useState(Date);

    
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
          <Calendar mode="single"  selected={date} onSelect={(newDate) => {
            setDate(newDate);
            props.deadlineHandler(newDate); // Pass the selected date to the parent component
          }} initialFocus />
        </PopoverContent>
      </Popover>
    );
  }


  