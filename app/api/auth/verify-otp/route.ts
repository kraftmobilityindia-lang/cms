import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isOTPExpired } from "@/lib/otp";
import { generateToken } from "@/lib/auth";
import { VerifyOTPRequest, ApiResponse } from "@/types/api";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { mobile, otp }: VerifyOTPRequest = await request.json();

    if (!mobile || !otp) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Mobile number and OTP are required",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { mobile },
      include: { property: true },
    });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.otpCode || user.otpCode !== otp) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: 400 }
      );
    }

    if (!user.otpExpiry || isOTPExpired(user.otpExpiry)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "OTP has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Mark OTP as used and user as verified
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          otpCode: null,
          otpExpiry: null,
        },
      }),
      prisma.oTP.updateMany({
        where: {
          mobile,
          code: otp,
          isUsed: false,
        },
        data: { isUsed: true },
      }),
    ]);

    const token = generateToken({
      userId: user.id,
      mobile: user.mobile,
      propertyId: user.propertyId,
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "OTP verified successfully",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          property: user.property,
        },
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
