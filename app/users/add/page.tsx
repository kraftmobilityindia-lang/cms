"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithProperty,
  CreateUserWithPropertyData,
} from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  UserPlus,
  Loader2,
  Home,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateUserWithPropertyData>({
    mobile: "",
    name: "",
    email: "",
    address: "",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
    bedrooms: undefined,
    bathrooms: undefined,
    hasLivingArea: false,
    hasDiningArea: false,
    hasKitchen: false,
    hasUtility: false,
    hasGarden: false,
    hasPowderRoom: false,
    propertyType: "",
    area: undefined,
    floor: undefined,
    totalFloors: undefined,
  });

  const handleInputChange = (
    field: keyof CreateUserWithPropertyData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.mobile ||
      !formData.address ||
      !formData.fullAddress ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      toast.error("Please fill in all required fields", {
        description: "All fields marked with * are required",
      });
      return;
    }

    setIsLoading(true);

    try {
      await createUserWithProperty(formData);
      toast.success("User created successfully", {
        description: "Redirecting to users list...",
      });
      router.push("/users");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040d19] p-6 w-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white hover:bg-gray-800/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Add New User</h1>
            <p className="text-gray-400 mt-1">
              Create a new user with property details
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* User Information */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400" />
                User Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Basic user details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="mobile"
                    className="text-gray-300 flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Mobile Number *
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-gray-300 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-300 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Property Information */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Home className="h-5 w-5 text-green-400" />
                Property Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Property address and location details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-gray-300 flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Property Name/Address *
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Sunrise Apartments"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullAddress" className="text-gray-300">
                    Full Address *
                  </Label>
                  <Input
                    id="fullAddress"
                    type="text"
                    placeholder="123, Sector 45, Gurgaon"
                    value={formData.fullAddress}
                    onChange={(e) =>
                      handleInputChange("fullAddress", e.target.value)
                    }
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-300">
                    City *
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Gurgaon"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-gray-300">
                    State *
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="Haryana"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-gray-300">
                    Pincode *
                  </Label>
                  <Input
                    id="pincode"
                    type="text"
                    placeholder="122001"
                    value={formData.pincode}
                    onChange={(e) =>
                      handleInputChange("pincode", e.target.value)
                    }
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Property Details</CardTitle>
              <CardDescription className="text-gray-400">
                Optional property specifications and amenities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="propertyType" className="text-gray-300">
                    Property Type
                  </Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value: string) =>
                      handleInputChange("propertyType", value)
                    }
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms" className="text-gray-300">
                    Bedrooms
                  </Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="2"
                    value={formData.bedrooms || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "bedrooms",
                        e.target.value
                          ? Number.parseInt(e.target.value)
                          : undefined
                      )
                    }
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="text-gray-300">
                    Bathrooms
                  </Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="2"
                    value={formData.bathrooms || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "bathrooms",
                        e.target.value
                          ? Number.parseInt(e.target.value)
                          : undefined
                      )
                    }
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="area" className="text-gray-300">
                    Area (sq ft)
                  </Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="1200"
                    value={formData.area || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "area",
                        e.target.value
                          ? Number.parseInt(e.target.value)
                          : undefined
                      )
                    }
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor" className="text-gray-300">
                    Floor
                  </Label>
                  <Input
                    id="floor"
                    type="number"
                    placeholder="5"
                    value={formData.floor || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "floor",
                        e.target.value
                          ? Number.parseInt(e.target.value)
                          : undefined
                      )
                    }
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalFloors" className="text-gray-300">
                    Total Floors
                  </Label>
                  <Input
                    id="totalFloors"
                    type="number"
                    placeholder="10"
                    value={formData.totalFloors || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "totalFloors",
                        e.target.value
                          ? Number.parseInt(e.target.value)
                          : undefined
                      )
                    }
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <Label className="text-gray-300 text-base font-medium">
                  Amenities
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: "hasLivingArea", label: "Living Area" },
                    { key: "hasDiningArea", label: "Dining Area" },
                    { key: "hasKitchen", label: "Kitchen" },
                    { key: "hasUtility", label: "Utility Room" },
                    { key: "hasGarden", label: "Garden" },
                    { key: "hasPowderRoom", label: "Powder Room" },
                  ].map((amenity) => (
                    <div
                      key={amenity.key}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={amenity.key}
                        checked={
                          formData[
                            amenity.key as keyof CreateUserWithPropertyData
                          ] as boolean
                        }
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            amenity.key as keyof CreateUserWithPropertyData,
                            checked
                          )
                        }
                        className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label
                        htmlFor={amenity.key}
                        className="text-gray-300 text-sm"
                      >
                        {amenity.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
