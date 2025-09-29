import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { ApiResponse } from "@/types/api";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        _count: {
          select: {
            users: true,
            complaints: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Properties retrieved successfully",
      data: properties,
    });
  } catch (error) {
    console.error("Get properties error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
