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

async function testUserDataStructure() {
  console.log('🔍 Testing user data structure for form...');
  
  try {
    // Simulate the API call that frontend makes
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

    // Create enhanced users like in API
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

    console.log('📊 Enhanced users sample:');
    enhancedUsers.slice(0, 3).forEach((user, index) => {
      console.log(`\n${index + 1}. User Data Structure:`);
      console.log('   - id:', user.id);
      console.log('   - id_user:', user.id_user);
      console.log('   - username:', user.username);
      console.log('   - nama_lengkap:', user.nama_lengkap);
      console.log('   - role:', user.role);
      console.log('   - gender:', user.gender);
      console.log('   - phone_numbers:', user.phone_numbers?.length || 0, 'items');
      
      if (user.phone_numbers && user.phone_numbers.length > 0) {
        console.log('   - phone_numbers details:');
        user.phone_numbers.forEach((phone: any, phoneIndex: number) => {
          console.log(`     ${phoneIndex + 1}. ${phone.nama_nomor}: ${phone.nomor_hp} (${phone.gender}/${phone.role})`);
        });
      }
      
      console.log('   - Form default values would be:');
      console.log('     {');
      console.log(`       username: "${user.username || ''}",`);
      console.log(`       nama_lengkap: "${user.nama_lengkap || ''}",`);
      console.log(`       role: "${user.role || ''}",`);
      console.log(`       gender: "${user.gender || 'ikhwan'}",`);
      console.log(`       password_hash: "",`);
      console.log(`       phone_numbers: [`);
      if (user.phone_numbers && user.phone_numbers.length > 0) {
        user.phone_numbers.forEach((phone: any, phoneIndex: number) => {
          console.log(`         {`);
          console.log(`           nama_nomor: "${phone.nama_nomor || ''}",`);
          console.log(`           nomor_hp: "${phone.nomor_hp || ''}",`);
          console.log(`           gender: "${phone.gender || user.gender}",`);
          console.log(`           role: "${phone.role || user.role?.split('_')[0]}"`);
          console.log(`         }${phoneIndex < user.phone_numbers.length - 1 ? ',' : ''}`);
        });
      }
      console.log('       ]');
      console.log('     }');
    });

    // Test specific role values
    console.log('\n🔍 Role values analysis:');
    const uniqueRoles = [...new Set(enhancedUsers.map(user => user.role))];
    console.log('Available roles in database:', uniqueRoles);
    
    const roleOptions = [
      { value: "admin_ikhwan", label: "Admin Ikhwan" },
      { value: "admin_akhwat", label: "Admin Akhwat" },
      { value: "bendahara_ikhwan", label: "Bendahara Ikhwan" },
      { value: "bendahara_akhwat", label: "Bendahara Akhwat" },
      { value: "panitia_ikhwan", label: "Panitia Ikhwan" },
      { value: "panitia_akhwat", label: "Panitia Akhwat" },
    ];
    
    console.log('Form role options:', roleOptions.map(r => r.value));
    
    console.log('\n✅ Role matching check:');
    uniqueRoles.forEach(role => {
      const hasMatch = roleOptions.some(option => option.value === role);
      console.log(`  - "${role}": ${hasMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
    });

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testUserDataStructure();
