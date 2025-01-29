import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Task {
  title?: string;
  description?: string;
  time?: string;
  status?: string;
  priority?: string;
}

interface TaskSheetProps {
  task: Task;
  colorTheme: string;
}

export function TaskSheet({ task, colorTheme }: TaskSheetProps) {
  if (!task) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="link"
          className={`text-${colorTheme}-600 hover:text-${colorTheme}-700`}
        >
          View Details
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className={`text-${colorTheme}-700`}>
            {task.title || "Untitled Task"}
          </SheetTitle>
          <SheetDescription>
            {task.description || "No description available"}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              value={task.time || "No time set"}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Input
              id="status"
              value={task.status || "No status set"}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Input
              id="priority"
              value={task.priority || "No priority set"}
              className="col-span-3"
              readOnly
            />
          </div>
        </div>
        <SheetFooter>
          <Button
            type="submit"
            className={`bg-${colorTheme}-600 hover:bg-${colorTheme}-700 text-white`}
          >
            Mark as Complete
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
