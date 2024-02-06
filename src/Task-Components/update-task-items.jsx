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
import { PlusIcon,Pencil1Icon } from "@radix-ui/react-icons";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useRef,useEffect } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { endOfDay, format,formatDistance} from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function EditTaskDialoge(props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    console.log(props.data.deadline);
    
    const inputRef = useRef(null);
    const buttonRef = useRef(null);
    const [status, setstatus] = useState(props.data.status);
    const [priority, setpriority] = useState(props.data.priority);
    const [ deadline,setdeadline] = useState(props.data.deadline);
    async function HandleSubmit() {
        let inputData = inputRef.current.value;
        const options = {
            method: 'PATCH',
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
            
            const response = await fetch(`https://task-manager-api-1-8sfc.onrender.com/${props.data._id}`, options);
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
        setdeadline(deadline);
    }

   
     // it is a string value 

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Pencil1Icon/>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update task</DialogTitle>
                    <DialogDescription>
                        Update your task details here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input defaultValue={props.data.title} id="title" className="col-span-3"  ref={inputRef} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <StatusSelector val={props.data.status} statusHandler={HandleStatusChange} selectedStatus={status} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priority" className="text-right">
                            Priority
                        </Label>
                       <PrioritySelector val={props.data.priority} priorityHandler={HandlePriorityChange}/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deadline" className="text-right">
                            Deadline
                        </Label>
                        <DeadlineSelector val={props.data.deadline} deadlineHandler={HandleDeadlineChange}/>
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
        <Select defaultValue={props.val}  onValueChange={props.statusHandler}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="select one" />
            </SelectTrigger>
            <SelectContent >
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
    return <Select defaultValue={props.val} onValueChange={props.priorityHandler}>
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
    const [date, setDate] = useState(props.val);

    
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
          <Calendar mode="single"  selected={props.val} onSelect={(newDate) => {
            props.deadlineHandler(newDate);
            setDate(newDate);
          }} initialFocus />
        </PopoverContent>
      </Popover>
    );
  }


  