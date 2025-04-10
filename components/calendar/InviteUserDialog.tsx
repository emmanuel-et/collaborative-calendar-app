import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarRole } from "@/models/Calendar"
import { useAuth } from '@/hooks/useAuth'
import { InviteNotificationInput } from '@/models/Notification'

interface InviteUserDialogProps {
  onSubmit: (inviteData: InviteNotificationInput) => void;
}

const InviteUserDialog: React.FC<InviteUserDialogProps> = ({ onSubmit }) => {
  const { user } = useAuth()
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState("")
  const [emailError, setEmailError] = React.useState("")

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const sendInvite = async () => {
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.")
      return
    }

    setEmailError("") 

    const inviteData: InviteNotificationInput = {
      email,
      role,
      calendarId: "88lh6MyCorhyhWjiEANQ1UDKu6X2", // TODO: change to ObjectId, as well as the interface
      senderId: user?.uid,
    }
    onSubmit(inviteData)
    setOpen(false) // Close the dialog only if there is no error
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>Invite User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Invite a new user to your calendar and select their role. Click "Send Invite" to send the invitation email.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              className="col-span-3"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {emailError && (
            <p className="text-red-500 text-sm col-span-4 text-right">{emailError}</p>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select onValueChange={setRole}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CalendarRole.EDITOR}>Editor</SelectItem>
                <SelectItem value={CalendarRole.VIEWER}>Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={sendInvite}
            disabled={!email || !role}
          >
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InviteUserDialog