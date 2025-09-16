import Calendar from "./calendar"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"

function AddNewTask() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Add task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Task name</Label>
              <Input id="name" name="name" defaultValue="" placeholder="New task to do" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="details">Details</Label>
              <Textarea id="details" name="details" defaultValue="" placeholder="Details about what needs to be done" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="date">Date</Label>
              <Calendar showTime selectionMode="single" />
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-teal-400" type="submit">Save changes</Button>
            <DialogClose asChild>
              <Button variant="outlineDestructive">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default AddNewTask