"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User, UserRole, Department } from "@/lib/types";

interface AddUserDialogProps {
  onUserAdd: (user: Omit<User, 'id' | 'imageUrl'>) => void;
  departments: Department[];
}

export function AddUserDialog({ onUserAdd, departments }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [department, setDepartment] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const { toast } = useToast();

  const handleRoleChange = (value: UserRole | "") => {
    setRole(value);
    // Reset student-specific fields when role changes
    if (value !== 'Student') {
      setRollNumber("");
      setRegisterNumber("");
      setMobileNumber("");
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isFormValid = name && email && role;
    if (role === 'Student') {
      isFormValid = isFormValid && rollNumber && registerNumber && mobileNumber;
    } else {
      isFormValid = isFormValid && password;
    }

    if (role !== 'Admin' && !department) {
      isFormValid = false;
    }

    if (!isFormValid) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    const userPassword = role === 'Student' ? rollNumber : password;

    onUserAdd({
      name,
      email,
      password: userPassword,
      role: role as UserRole,
      department: role === 'Admin' ? 'Administration' : department,
      rollNumber: role === 'Student' ? rollNumber : undefined,
      registerNumber: role === 'Student' ? registerNumber : undefined,
      mobileNumber: role === 'Student' ? mobileNumber : undefined,
    });

    toast({
      title: "User Created",
      description: `Successfully created user: ${name}`,
    });

    // Reset form and close dialog
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
    setDepartment("");
    setRollNumber("");
    setRegisterNumber("");
    setMobileNumber("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><UserPlus className="mr-2 h-4 w-4" /> Add New User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new user account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={role} onValueChange={(value) => handleRoleChange(value as UserRole | "")}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="HOD">HOD</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Advisor">Advisor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === 'Student' ? (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rollNumber" className="text-right">Roll No.</Label>
                    <Input id="rollNumber" value={rollNumber} onChange={e => setRollNumber(e.target.value)} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="registerNumber" className="text-right">Reg. No.</Label>
                    <Input id="registerNumber" value={registerNumber} onChange={e => setRegisterNumber(e.target.value)} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mobileNumber" className="text-right">Mobile No.</Label>
                    <Input id="mobileNumber" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} className="col-span-3" required />
                </div>
              </>
            ) : (
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" required />
                </div>
            )}
            
            {role && role !== 'Admin' && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                        Department
                    </Label>
                    <Select value={department} onValueChange={setDepartment} required>
                        <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                        {departments.map((dep) => (
                            <SelectItem key={dep.id} value={dep.name}>{dep.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Create User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
