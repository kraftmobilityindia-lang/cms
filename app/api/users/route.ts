import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CreateUserRequest, ApiResponse } from "@/types/api";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const body: CreateUserRequest = await request.json();
    const {
      mobile,
      name,
      email,
      // Property fields
      address,
      fullAddress,
      city,
      state,
      pincode,
      bedrooms = 0,
      bathrooms = 0,
      hasLivingArea = false,
      hasDiningArea = false,
      hasKitchen = true,
      hasUtility = false,
      hasGarden = false,
      hasPowderRoom = false,
      propertyType,
      area,
      floor,
      totalFloors,
    } = body;

    // Validate required fields
    if (!mobile || !address || !fullAddress || !city || !state || !pincode) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message:
            "Mobile number, address, full address, city, state, and pincode are required",
        },
        { status: 400 }
      );
    }

    // Validate mobile format (Indian format)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message:
            "Invalid mobile number format. Please enter a valid 10-digit number.",
        },
        { status: 400 }
      );
    }

    // Validate pincode format (Indian pincode)
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(pincode)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message:
            "Invalid pincode format. Please enter a valid 6-digit pincode.",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { mobile },
    });

    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User with this mobile number already exists",
        },
        { status: 409 }
      );
    }

    // Create both user and property in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // First create the property
      const property = await tx.property.create({
        data: {
          address,
          fullAddress,
          city,
          state,
          pincode,
          bedrooms,
          bathrooms,
          hasLivingArea,
          hasDiningArea,
          hasKitchen,
          hasUtility,
          hasGarden,
          hasPowderRoom,
          propertyType,
          area,
          floor,
          totalFloors,
        },
      });

      // Then create the user with the property ID
      const user = await tx.user.create({
        data: {
          mobile,
          name,
          email,
          propertyId: property.id,
        },
        include: {
          property: true,
        },
      });

      return user;
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User and property created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create user with property error:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "A user with this mobile number already exists",
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        include: {
          property: true,
          _count: {
            select: { complaints: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        totalUsers: totalCount,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
