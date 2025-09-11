import { createClient } from '@supabase/supabase-js';

// Directly use environment variables
const supabaseUrl = 'https://sirriyah.smaithsi.sch.id';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTQ0OTk2MDAsImV4cCI6MTkxMjI2NjAwMH0.NcYoEtlPCu1MSIMPpKYjwkl8CBjhK6yxxylZMJrpFus';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testUpdateUser() {
  console.log('🔍 Testing user update functionality...');
  
  try {
    // First, get a user to update
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("id_user, username, nama_lengkap, role, gender")
      .limit(1);

    if (fetchError || !users || users.length === 0) {
      console.error('❌ Failed to fetch test user:', fetchError);
      return;
    }

    const testUser = users[0];
    console.log('📋 Test user:', testUser);

    // Test update data
    const updateData = {
      username: testUser.username + '_updated',
      nama_lengkap: testUser.nama_lengkap + ' (Updated)',
      role: testUser.role,
      gender: testUser.gender,
      phone_numbers: [
        {
          nama_nomor: 'Test Admin',
          nomor_hp: '081234567999',
          gender: testUser.gender,
          role: testUser.role.split('_')[0],
        },
        {
          nama_nomor: 'Test Backup',
          nomor_hp: '081234567998',
          gender: testUser.gender,
          role: testUser.role.split('_')[0],
        }
      ]
    };

    console.log('🔄 Update data:', updateData);

    // Test the update API logic directly
    console.log('📡 Testing update logic...');

    // Update user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .update({
        username: updateData.username,
        nama_lengkap: updateData.nama_lengkap,
        role: updateData.role,
        gender: updateData.gender,
      })
      .eq("id_user", testUser.id_user)
      .select()
      .single();

    if (userError) {
      console.error('❌ Error updating user:', userError);
      return;
    }

    console.log('✅ User updated:', userData);

    // Delete existing phone numbers for this user
    const { error: deleteError } = await supabase
      .from("no_penting")
      .delete()
      .eq("user_id", testUser.id_user);

    if (deleteError) {
      console.error('⚠️ Error deleting old phone numbers:', deleteError);
    } else {
      console.log('✅ Old phone numbers deleted');
    }

    // Insert new phone numbers
    const phoneInserts = updateData.phone_numbers.map((phone: any) => ({
      user_id: testUser.id_user,
      nama_nomor: phone.nama_nomor,
      nomor_hp: phone.nomor_hp,
      gender: phone.gender,
      role: phone.role,
    }));

    const { data: insertedPhones, error: insertError } = await supabase
      .from("no_penting")
      .insert(phoneInserts)
      .select();

    if (insertError) {
      console.error('❌ Error inserting new phone numbers:', insertError);
      return;
    }

    console.log('✅ New phone numbers inserted:', insertedPhones);

    // Fetch updated user with phone numbers
    const { data: finalUser, error: finalError } = await supabase
      .from("users")
      .select("id_user, username, nama_lengkap, role, gender, password_hash, created_at")
      .eq("id_user", testUser.id_user)
      .single();

    if (finalError) {
      console.error('❌ Error fetching final user:', finalError);
      return;
    }

    // Fetch updated phone numbers
    const { data: finalPhones } = await supabase
      .from("no_penting")
      .select("id_nomor, nama_nomor, nomor_hp, user_id, created_at, gender, role")
      .eq("user_id", testUser.id_user);

    const enhancedUser = {
      ...finalUser,
      id: finalUser.id_user,
      phone_numbers: finalPhones || [],
      total_phones: finalPhones?.length || 0,
    };

    console.log('🎉 Final updated user:', enhancedUser);

    // Revert changes for cleanup
    console.log('🔄 Reverting changes for cleanup...');
    
    await supabase
      .from("users")
      .update({
        username: testUser.username,
        nama_lengkap: testUser.nama_lengkap,
      })
      .eq("id_user", testUser.id_user);

    await supabase
      .from("no_penting")
      .delete()
      .eq("user_id", testUser.id_user);

    console.log('✅ Cleanup completed');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testUpdateUser();
