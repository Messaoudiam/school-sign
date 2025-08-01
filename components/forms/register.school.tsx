"use client";

// react
import { useState } from "react";

// next
import { useRouter } from "next/navigation";

// ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// zod
import { registerSchoolSchema } from "@/lib/schemas/register.school.schema";

export default function RegisterSchoolForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [directorFirstName, setDirectorFirstName] = useState("");
  const [directorLastName, setDirectorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({});

    const result = registerSchoolSchema.safeParse({
      name,
      directorFirstName,
      directorLastName,
      address,
      zipCode,
      city,
      phone,
      email,
      password,
      confirmPassword,
      website,
    });

    if (!result.success) {
      const newError: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        newError[issue.path[0] as keyof typeof newError] = issue.message;
      });
      setError(newError);

      return;
    }

    const data = result.data;

    try {
      setLoading(true);
      const response = await fetch("/api/register.school", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        alert("Registration successful!");
      } else {
        // More specific error handling based on response codes/messages
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      }

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        alert("Registration successful!");
      } else {
        // More specific error handling based on response codes/messages
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
      router.push("/school-login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-96 flex flex-col p-4">
      <Card>
        <CardHeader>
          <CardTitle>Register School</CardTitle>
          <CardDescription>Register a new school account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {error.name && <p className="text-red-500">{error.name}</p>}
            </div>
            <div>
              <Label htmlFor="directorFirstName">Director First Name</Label>
              <Input
                id="directorFirstName"
                value={directorFirstName}
                onChange={(e) => setDirectorFirstName(e.target.value)}
              />
              {error.directorFirstName && (
                <p className="text-red-500">{error.directorFirstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="directorLastName">Director Last Name</Label>
              <Input
                id="directorLastName"
                value={directorLastName}
                onChange={(e) => setDirectorLastName(e.target.value)}
              />
              {error.directorLastName && (
                <p className="text-red-500">{error.directorLastName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {error.address && <p className="text-red-500">{error.address}</p>}
            </div>
            <div>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
              {error.zipCode && <p className="text-red-500">{error.zipCode}</p>}
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {error.city && <p className="text-red-500">{error.city}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {error.phone && <p className="text-red-500">{error.phone}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error.email && <p className="text-red-500">{error.email}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error.password && (
                <p className="text-red-500">{error.password}</p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {error.confirmPassword && (
                <p className="text-red-500">{error.confirmPassword}</p>
              )}
              {password !== confirmPassword && (
                <p className="text-red-500">Passwords do not match</p>
              )}
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              {error.website && <p className="text-red-500">{error.website}</p>}
            </div>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
