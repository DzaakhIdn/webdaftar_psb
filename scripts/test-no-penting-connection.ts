import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testNoPentingConnection() {
  try {
    console.log('🔧 Testing Supabase connection...');
    console.log('📍 URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('🔑 Key (first 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

    // Test 1: Check if we can connect to Supabase
    console.log('\n📡 Test 1: Basic connection test...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1);

    if (connectionError) {
      console.error('❌ Connection failed:', connectionError);
      return;
    }
    console.log('✅ Connection successful');

    // Test 2: Check if no_penting table exists
    console.log('\n📋 Test 2: Checking if no_penting table exists...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_name', 'no_penting')
      .eq('table_schema', 'public');

    if (tableError) {
      console.error('❌ Error checking table:', tableError);
      return;
    }

    if (!tableCheck || tableCheck.length === 0) {
      console.error('❌ Table no_penting does not exist');
      console.log('💡 Solution: Run database/create-no-penting-table.sql');
      return;
    }
    console.log('✅ Table no_penting exists');

    // Test 3: Check RLS status
    console.log('\n🔒 Test 3: Checking RLS status...');
    const { data: rlsCheck, error: rlsError } = await supabase
      .from('pg_tables')
      .select('tablename, rowsecurity')
      .eq('tablename', 'no_penting')
      .eq('schemaname', 'public');

    if (rlsError) {
      console.error('❌ Error checking RLS:', rlsError);
    } else {
      console.log('🔒 RLS status:', rlsCheck?.[0]?.rowsecurity ? 'ENABLED' : 'DISABLED');
    }

    // Test 4: Try to read data
    console.log('\n📊 Test 4: Attempting to read data...');
    const { data: readTest, error: readError } = await supabase
      .from('no_penting')
      .select('*')
      .limit(5);

    if (readError) {
      console.error('❌ Error reading data:', readError);
      console.error('❌ Error details:', {
        message: readError.message,
        code: readError.code,
        details: readError.details,
        hint: readError.hint
      });
      
      if (readError.code === '42501') {
        console.log('💡 Permission denied - RLS policies may be too restrictive');
        console.log('💡 Solution: Run database/fix-no-penting-permissions.sql');
      }
      return;
    }

    console.log('✅ Data read successful');
    console.log('📊 Data count:', readTest?.length || 0);
    console.log('📊 Sample data:', readTest?.slice(0, 2));

    // Test 5: Test the showAllData function
    console.log('\n🔧 Test 5: Testing showAllData function...');
    
    // Import the function dynamically
    const { showAllData } = await import('../src/models/show-all-data');
    
    const showAllResult = await showAllData('no_penting');
    console.log('✅ showAllData result:', showAllResult);
    console.log('📊 showAllData type:', typeof showAllResult);
    console.log('📊 showAllData is array:', Array.isArray(showAllResult));
    console.log('📊 showAllData length:', showAllResult?.length);

    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testNoPentingConnection();
