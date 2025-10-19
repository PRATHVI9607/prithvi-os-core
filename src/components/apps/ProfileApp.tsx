import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  skills: string;
  experience: string;
  education: string;
}

export const ProfileApp = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem("prathvios-profile");
    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          email: "",
          phone: "",
          address: "",
          bio: "",
          skills: "",
          experience: "",
          education: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("prathvios-profile", JSON.stringify(profile));
  }, [profile]);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile saved successfully");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Profile</h2>
        <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder="+1 234 567 890"
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                placeholder="City, Country"
              />
            </div>
          </div>

          <div>
            <Label>Bio</Label>
            <Textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          <div>
            <Label>Skills</Label>
            <Textarea
              value={profile.skills}
              onChange={(e) =>
                setProfile({ ...profile, skills: e.target.value })
              }
              placeholder="e.g., React, TypeScript, Node.js..."
              rows={2}
            />
          </div>

          <div>
            <Label>Experience</Label>
            <Textarea
              value={profile.experience}
              onChange={(e) =>
                setProfile({ ...profile, experience: e.target.value })
              }
              placeholder="Your work experience..."
              rows={4}
            />
          </div>

          <div>
            <Label>Education</Label>
            <Textarea
              value={profile.education}
              onChange={(e) =>
                setProfile({ ...profile, education: e.target.value })
              }
              placeholder="Your education background..."
              rows={3}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-primary-foreground">
                {profile.name.charAt(0) || "?"}
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {profile.name || "Your Name"}
                </h3>
                <p className="text-muted-foreground">
                  {profile.email || "your.email@example.com"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">
                  {profile.phone || "Not provided"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Address</Label>
                <p className="font-medium">
                  {profile.address || "Not provided"}
                </p>
              </div>
            </div>

            {profile.bio && (
              <div className="mb-6">
                <Label className="text-muted-foreground">Bio</Label>
                <p className="mt-2 whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            {profile.skills && (
              <div className="mb-6">
                <Label className="text-muted-foreground">Skills</Label>
                <p className="mt-2 whitespace-pre-wrap">{profile.skills}</p>
              </div>
            )}

            {profile.experience && (
              <div className="mb-6">
                <Label className="text-muted-foreground">Experience</Label>
                <p className="mt-2 whitespace-pre-wrap">{profile.experience}</p>
              </div>
            )}

            {profile.education && (
              <div>
                <Label className="text-muted-foreground">Education</Label>
                <p className="mt-2 whitespace-pre-wrap">{profile.education}</p>
              </div>
            )}

            {!profile.name && (
              <div className="text-center text-muted-foreground py-8">
                Click Edit to add your information
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
