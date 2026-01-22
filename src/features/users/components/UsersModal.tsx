import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Plus } from "lucide-react"
import GlobalModal from "@/components/layout/GlobalModal"
import GlobalSelect from "@/components/layout/GlobalSelect"

export default function UsersModal() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  
  const togglePassword = () => setShowPassword(!showPassword);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving data...");
    console.log("Selected role:", selectedRole);
  }
  
  const style = `w-full pr-4 py-2.5 text-primary border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`
  
  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Member", value: "member" },
  ];
  
  return (
    <GlobalModal
      icon={Plus}
      name="Add User"
      title="Add New User"
      description="Please fill in the details below to create a new user."
      className="bg-surface"
      onSubmit={handleSubmit}
    >
      <div className="space-y-5 py-5">
        <div className="space-y-3">
          <Label htmlFor="fullname">Full Name</Label>
          <Input type="text" id="fullname" name="fullname" placeholder="Full Name" className={style} />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" placeholder="you@example.com" autoComplete="email" className={style}/>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className={style}
            />
            
            <Button
              type="button"
              size="icon"
              onClick={togglePassword}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="role">Role</Label>
          <GlobalSelect
            options={roleOptions}
            placeholder="Select a role"
            value={selectedRole}
            onChange={setSelectedRole}
            contentClassName="z-[9999]"
            groupClassName="bg-surface"
          />
        </div>
      </div>
    </GlobalModal>
  )
}