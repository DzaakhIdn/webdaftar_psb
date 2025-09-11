import { createClient } from "@supabase/supabase-js";

// Directly use environment variables
const supabaseUrl = "https://sirriyah.smaithsi.sch.id";
const supabaseServiceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTQ0OTk2MDAsImV4cCI6MTkxMjI2NjAwMH0.NcYoEtlPCu1MSIMPpKYjwkl8CBjhK6yxxylZMJrpFus";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testUsersConnection() {
  console.log("🔍 Testing users table connection...");

  try {
    // Test 1: Check if we can connect to Supabase
    console.log("📡 Testing Supabase connection...");
    const { data: healthCheck, error: healthError } = await supabase
      .from("users")
      .select("count", { count: "exact" })
      .limit(0);

    if (healthError) {
      console.error("❌ Health check failed:", healthError);
      return;
    }

    console.log("✅ Supabase connection successful");
    console.log("📊 Total users count:", healthCheck);

    // Test 2: Check table structure first
    console.log("🔍 Checking users table structure...");
    const { data: tableInfo, error: tableError } = await supabase
      .from("users")
      .select("*")
      .limit(1);

    if (tableError) {
      console.error("❌ Table structure check failed:", tableError);
    } else {
      console.log("✅ Table structure sample:", tableInfo);
      if (tableInfo && tableInfo.length > 0) {
        console.log("📋 Available columns:", Object.keys(tableInfo[0]));
      }
    }

    // Test 3: Try to fetch actual users data with correct columns
    console.log("👥 Fetching users data...");
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id_user, username, nama_lengkap, role, gender, created_at")
      .limit(5);

    if (usersError) {
      console.error("❌ Users fetch failed:", usersError);
      return;
    }

    console.log("✅ Users data fetched successfully");
    console.log("📋 Sample users:", users);

    // Test 4: Check no_penting table structure
    console.log("📞 Testing no_penting table structure...");
    const { data: noHpStructure, error: noHpStructureError } = await supabase
      .from("no_penting")
      .select("*")
      .limit(1);

    if (noHpStructureError) {
      console.error("❌ No HP structure check failed:", noHpStructureError);
    } else {
      console.log("✅ No HP structure sample:", noHpStructure);
      if (noHpStructure && noHpStructure.length > 0) {
        console.log(
          "📋 Available no_penting columns:",
          Object.keys(noHpStructure[0])
        );
      }
    }

    // Test 5: Fetch no_penting data with correct columns
    console.log("📞 Fetching no_penting data...");
    const { data: noHp, error: noHpError } = await supabase
      .from("no_penting")
      .select("*")
      .limit(5);

    if (noHpError) {
      console.error("❌ No HP fetch failed:", noHpError);
      return;
    }

    console.log("✅ No HP data fetched successfully");
    console.log("📋 Sample no HP:", noHp);

    // Test 5: Test the actual API logic with correct columns
    console.log("🔄 Testing API logic...");
    const [usersResult, noHpResult] = await Promise.all([
      supabase
        .from("users")
        .select(
          "id_user, username, nama_lengkap, role, gender, password_hash, created_at"
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("no_penting")
        .select("id, nama_nomor, nomor_hp, description, user_id, created_at")
        .order("created_at", { ascending: false }),
    ]);

    const usersData = usersResult.data || [];
    const noHpData = noHpResult.data || [];

    console.log("📊 API Results:");
    console.log("  - Users:", usersData.length, "records");
    console.log("  - No HP:", noHpData.length, "records");

    if (usersResult.error) {
      console.error("❌ Users query error:", usersResult.error);
    }

    if (noHpResult.error) {
      console.error("❌ No HP query error:", noHpResult.error);
    }

    // Test 6: Create enhanced users like in API
    const enhancedUsers = usersData.map((user: any) => {
      const userPhones = noHpData.filter(
        (phone: any) => phone.user_id === user.id_user
      );

      return {
        ...user,
        phone_numbers: userPhones,
        total_phones: userPhones.length,
      };
    });

    console.log("✅ Enhanced users created:", enhancedUsers.length);
    console.log("📋 Sample enhanced user:", enhancedUsers[0]);
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
}

// Run the test
testUsersConnection();
