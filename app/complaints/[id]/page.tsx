"use client";

import { type Complaint, getComplaintById } from "@/lib/api/admin";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PlayCircle,
  ImageIcon,
  Wrench,
  FileText,
  Package,
} from "lucide-react";
import { format } from "date-fns";

const MediaCarousel = ({
  images,
  videos,
  title,
}: {
  images: string[];
  videos: string[];
  title: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const allMedia = [...images, ...videos];

  if (allMedia.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <ImageIcon className="h-5 w-5" />
        {title}
      </h3>
      <div className="relative">
        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
          {allMedia[currentIndex]?.includes("video") ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <PlayCircle className="h-16 w-16 text-blue-400" />
              <span className="ml-2 text-white">Video Content</span>
            </div>
          ) : (
            <img
              src={allMedia[currentIndex] || "/placeholder.svg"}
              alt={`${title} ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {allMedia.length > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {allMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-blue-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatusTimeline = ({ complaint }: { complaint: Complaint }) => {
  const timelineSteps = [
    {
      status: "OPEN",
      label: "Complaint Filed",
      date: complaint.createdAt,
      icon: FileText,
      completed: true,
    },
    {
      status: "IN_PROGRESS",
      label: "Work Started",
      date: complaint.startedAt,
      icon: Wrench,
      completed: !!complaint.startedAt,
    },
    {
      status: "RESOLVED",
      label: "Issue Resolved",
      date: complaint.resolvedAt,
      icon: CheckCircle,
      completed: !!complaint.resolvedAt,
    },
    {
      status: "CLOSED",
      label: "Complaint Closed",
      date: complaint.closedAt,
      icon: XCircle,
      completed: !!complaint.closedAt,
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Progress Timeline
      </h3>
      <div className="space-y-4">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.status} className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed
                    ? "bg-green-500/20 text-green-400"
                    : complaint.status === step.status
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-gray-700 text-gray-500"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`font-medium ${
                      step.completed
                        ? "text-green-400"
                        : complaint.status === step.status
                        ? "text-blue-400"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.date && (
                    <span className="text-sm text-gray-400">
                      {format(new Date(step.date), "MMM dd, yyyy HH:mm")}
                    </span>
                  )}
                </div>
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`w-px h-6 ml-5 mt-2 ${
                      step.completed ? "bg-green-500/30" : "bg-gray-700"
                    }`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function ComplaintDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const complaintId = params.id as string;

  const [complaintData, setComplaintData] = useState<Complaint>();
  const [loading, setLoading] = useState(true);

  async function fetchComplaintDetails() {
    try {
      setLoading(true);
      const complaint = await getComplaintById(complaintId);
      setComplaintData(complaint);
    } catch (error) {
      console.error("Error fetching complaint details:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComplaintDetails();
  }, [complaintId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040d19] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!complaintData) {
    return (
      <div className="min-h-screen bg-[#040d19] flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Complaint Not Found
          </h2>
          <p className="text-gray-400 mb-4">
            The complaint you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "IN_PROGRESS":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "RESOLVED":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "CLOSED":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "HIGH":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "URGENT":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#040d19] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {complaintData.title || "Complaint Details"}
              </h1>
              <p className="text-gray-400">ID: {complaintData.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getPriorityColor(complaintData.priority)}>
              <AlertTriangle className="h-3 w-3 mr-1" />
              {complaintData.priority}
            </Badge>
            <Badge className={getStatusColor(complaintData.status)}>
              {complaintData.status.replace("_", " ")}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Overview */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Complaint Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    Description
                  </h3>
                  <p className="text-white leading-relaxed">
                    {complaintData.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">
                      Category
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-blue-400 border-blue-500/30"
                    >
                      {complaintData.category}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">
                      Created
                    </h3>
                    <p className="text-white text-sm">
                      {format(
                        new Date(complaintData.createdAt),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issue Media */}
            {(complaintData.issueImages.length > 0 ||
              complaintData.issueVideos.length > 0) && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <MediaCarousel
                    images={complaintData.issueImages}
                    videos={complaintData.issueVideos}
                    title="Issue Documentation"
                  />
                </CardContent>
              </Card>
            )}

            {/* Work Details */}
            {(complaintData.workDescription ||
              complaintData.materialsUsed ||
              complaintData.workNotes) && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Work Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {complaintData.workDescription && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">
                        Work Description
                      </h3>
                      <p className="text-white leading-relaxed">
                        {complaintData.workDescription}
                      </p>
                    </div>
                  )}
                  {complaintData.materialsUsed && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Materials Used
                      </h3>
                      <p className="text-white">
                        {complaintData.materialsUsed}
                      </p>
                    </div>
                  )}
                  {complaintData.workNotes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">
                        Work Notes
                      </h3>
                      <p className="text-white leading-relaxed">
                        {complaintData.workNotes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Before/After Media */}
            {(complaintData.beforeImages.length > 0 ||
              complaintData.afterImages.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(complaintData.beforeImages.length > 0 ||
                  complaintData.beforeVideos.length > 0) && (
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-6">
                      <MediaCarousel
                        images={complaintData.beforeImages}
                        videos={complaintData.beforeVideos}
                        title="Before Work"
                      />
                    </CardContent>
                  </Card>
                )}
                {(complaintData.afterImages.length > 0 ||
                  complaintData.afterVideos.length > 0) && (
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-6">
                      <MediaCarousel
                        images={complaintData.afterImages}
                        videos={complaintData.afterVideos}
                        title="After Work"
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <StatusTimeline complaint={complaintData} />
              </CardContent>
            </Card>

            {/* User & Property Info */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    Name
                  </h3>
                  <p className="text-white">
                    {complaintData.user.name || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    Mobile
                  </h3>
                  <p className="text-white">{complaintData.user.mobile}</p>
                </div>
                <Separator className="bg-gray-800" />
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Property
                  </h3>
                  {/* <p className="text-white font-medium">
                    {complaintData.property.}
                  </p> */}
                  <p className="text-gray-400 text-sm mt-1">
                    {complaintData.property.address}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Created</span>
                  <span className="text-white text-sm">
                    {format(new Date(complaintData.createdAt), "MMM dd")}
                  </span>
                </div>
                {complaintData.startedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Started</span>
                    <span className="text-white text-sm">
                      {format(new Date(complaintData.startedAt), "MMM dd")}
                    </span>
                  </div>
                )}
                {complaintData.resolvedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Resolved</span>
                    <span className="text-white text-sm">
                      {format(new Date(complaintData.resolvedAt), "MMM dd")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Last Updated</span>
                  <span className="text-white text-sm">
                    {format(new Date(complaintData.updatedAt), "MMM dd")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
