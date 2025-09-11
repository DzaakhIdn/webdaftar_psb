import { NextRequest, NextResponse } from "next/server";
import { supabaseServer as supabase } from "@/utils/supabase/server";

// Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    
    console.log("🔄 Updating user:", userId, "with data:", body);

    const {
      username,
      nama_lengkap,
      role,
      gender,
      password_hash,
      phone_numbers = []
    } = body;

    // Update user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .update({
        username,
        nama_lengkap,
        role,
        gender,
        ...(password_hash && { password_hash })
      })
      .eq("id_user", userId)
      .select()
      .single();

    if (userError) {
      console.error("Error updating user:", userError);
      return NextResponse.json(
        { error: "Gagal mengupdate data user" },
        { status: 500 }
      );
    }

    // Handle phone numbers update
    if (phone_numbers && phone_numbers.length > 0) {
      // First, delete existing phone numbers for this user
      const { error: deleteError } = await supabase
        .from("no_penting")
        .delete()
        .eq("user_id", userId);

      if (deleteError) {
        console.error("Error deleting old phone numbers:", deleteError);
        // Continue anyway, don't fail the whole operation
      }

      // Insert new phone numbers
      const phoneInserts = phone_numbers.map((phone: any) => ({
        user_id: parseInt(userId),
        nama_nomor: phone.nama_nomor,
        nomor_hp: phone.nomor_hp,
        gender: phone.gender || gender,
        role: phone.role || role.split('_')[0], // Extract role without gender suffix
      }));

      const { error: insertError } = await supabase
        .from("no_penting")
        .insert(phoneInserts);

      if (insertError) {
        console.error("Error inserting new phone numbers:", insertError);
        return NextResponse.json(
          { error: "User berhasil diupdate, tapi gagal mengupdate nomor HP" },
          { status: 207 } // Partial success
        );
      }
    }

    // Fetch updated user with phone numbers
    const { data: updatedUser, error: fetchError } = await supabase
      .from("users")
      .select("id_user, username, nama_lengkap, role, gender, password_hash, created_at")
      .eq("id_user", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching updated user:", fetchError);
      return NextResponse.json(
        { error: "Update berhasil tapi gagal mengambil data terbaru" },
        { status: 207 }
      );
    }

    // Fetch updated phone numbers
    const { data: phoneNumbers } = await supabase
      .from("no_penting")
      .select("id_nomor, nama_nomor, nomor_hp, user_id, created_at, gender, role")
      .eq("user_id", userId);

    const enhancedUser = {
      ...updatedUser,
      id: updatedUser.id_user,
      phone_numbers: phoneNumbers || [],
      total_phones: phoneNumbers?.length || 0,
    };

    console.log("✅ User updated successfully:", enhancedUser);
    return NextResponse.json(enhancedUser);

  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengupdate user" },
      { status: 500 }
    );
  }
}

// Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id_user, username, nama_lengkap, role, gender, password_hash, created_at")
      .eq("id_user", userId)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Fetch phone numbers
    const { data: phoneNumbers } = await supabase
      .from("no_penting")
      .select("id_nomor, nama_nomor, nomor_hp, user_id, created_at, gender, role")
      .eq("user_id", userId);

    const enhancedUser = {
      ...userData,
      id: userData.id_user,
      phone_numbers: phoneNumbers || [],
      total_phones: phoneNumbers?.length || 0,
    };

    return NextResponse.json(enhancedUser);

  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data user" },
      { status: 500 }
    );
  }
}
