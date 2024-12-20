import { NextResponse } from "next/server";
import { get, ref as dbRef, update } from "firebase/database";
import { realtimeDb } from "@/app/(backend)/lib/firebase";

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Check if the body exists and contains the required fields
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body. Please provide valid JSON data." },
        { status: 400 }
      );
    }

    const { userId, email, password } = body;

    // Validate input fields
    if (!userId || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: userId, email, or password." },
        { status: 400 }
      );
    }

    // Reference to the user in Firebase Realtime Database
    const userRef = dbRef(realtimeDb, `users/${userId}`);
    const snapshot = await get(userRef);

    // Check if the user exists in the database
    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: "User not found in the database." },
        { status: 404 }
      );
    }

    const user = snapshot.val();

    // Check if the email is already confirmed
    if (user.isConfirmed) {
      return NextResponse.json(
        { error: "Email is already confirmed." },
        { status: 400 }
      );
    }

    // Update the user's record to mark the email as confirmed
    await update(userRef, { isConfirmed: true });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Email confirmed successfully!",
      redirect: "/",
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error confirming email:", error.message);
    return NextResponse.json(
      { error: "An error occurred while confirming the email." },
      { status: 500 }
    );
  }
}
