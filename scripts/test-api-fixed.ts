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

async function testFixedAPI() {
  console.log('🔍 Testing FIXED API logic...');
  
  try {
    // Test the corrected API logic
    const [usersResult, noHpResult] = await Promise.all([
      supabase
        .from("users")
        .select(
          "id_user, username, nama_lengkap, role, gender, password_hash, created_at"
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("no_penting")
        .select("id_nomor, nama_nomor, nomor_hp, user_id, created_at, gender, role")
        .order("created_at", { ascending: false }),
    ]);

    const usersData = usersResult.data || [];
    const noHpData = noHpResult.data || [];
    
    console.log('📊 Query Results:');
    console.log('  - Users:', usersData.length, 'records');
    console.log('  - No HP:', noHpData.length, 'records');
    
    if (usersResult.error) {
      console.error('❌ Users query error:', usersResult.error);
      return;
    }
    
    if (noHpResult.error) {
      console.error('❌ No HP query error:', noHpResult.error);
      return;
    }
    
    // Create enhanced users like in fixed API
    const enhancedUsers = usersData.map((user: any) => {
      const userPhones = noHpData.filter(
        (phone: any) => phone.user_id === user.id_user
      );

      return {
        ...user,
        id: user.id_user, // Add id field for frontend compatibility
        phone_numbers: userPhones,
        total_phones: userPhones.length,
      };
    });
    
    console.log('✅ Enhanced users created:', enhancedUsers.length);
    console.log('📋 Sample enhanced users:');
    
    enhancedUsers.slice(0, 3).forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.username} (${user.nama_lengkap})`);
      console.log(`     - Role: ${user.role}`);
      console.log(`     - Phone numbers: ${user.total_phones}`);
      if (user.phone_numbers.length > 0) {
        user.phone_numbers.forEach((phone: any) => {
          console.log(`       * ${phone.nama_nomor}: ${phone.nomor_hp}`);
        });
      }
      console.log('');
    });
    
    // Test matching logic
    console.log('🔍 Testing user-phone matching:');
    const usersWithPhones = enhancedUsers.filter(user => user.total_phones > 0);
    const usersWithoutPhones = enhancedUsers.filter(user => user.total_phones === 0);
    
    console.log(`  - Users with phones: ${usersWithPhones.length}`);
    console.log(`  - Users without phones: ${usersWithoutPhones.length}`);
    
    // Show phone number distribution
    console.log('📞 Phone number distribution:');
    noHpData.forEach((phone: any) => {
      const matchingUser = usersData.find(user => user.id_user === phone.user_id);
      if (matchingUser) {
        console.log(`  - ${phone.nama_nomor} (${phone.nomor_hp}) -> ${matchingUser.username}`);
      } else {
        console.log(`  - ${phone.nama_nomor} (${phone.nomor_hp}) -> NO MATCHING USER (user_id: ${phone.user_id})`);
      }
    });
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testFixedAPI();
