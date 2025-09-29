import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { CreateComplaintRequest, ApiResponse } from "@/types/api";

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body: CreateComplaintRequest = await request.json();
    const {
      title,
      description,
      category,
      issueImages = [],
      issueVideos = [],
    } = body;

    if (!description || !category) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Description and category are required",
        },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        category: category as any,
        issueImages,
        issueVideos,
        userId: user.userId,
        propertyId: user.propertyId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            mobile: true,
          },
        },
        property: true,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Complaint created successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    const url = new URL(request.url);
    const forSupervisor = url.searchParams.get("supervisor") === "true";

    let complaints;

    if (forSupervisor) {
      // Supervisor sees all complaints
      complaints = await prisma.complaint.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              mobile: true,
            },
          },
          property: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (user) {
      // User sees only their complaints
      complaints = await prisma.complaint.findMany({
        where: { userId: user.userId },
        include: {
          property: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Complaints retrieved successfully",
      data: complaints,
    });
  } catch (error) {
    console.error("Get complaints error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
