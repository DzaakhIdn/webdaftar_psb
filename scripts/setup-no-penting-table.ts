import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const sampleData = [
  { nama_nomor: 'Admin Sekolah', nomor_hp: '08123456789' },
  { nama_nomor: 'Kepala Sekolah', nomor_hp: '08234567890' },
  { nama_nomor: 'Bagian Keuangan', nomor_hp: '08345678901' },
  { nama_nomor: 'Customer Service', nomor_hp: '08456789012' },
  { nama_nomor: 'Emergency Contact', nomor_hp: '08567890123' },
];

async function setupNoPentingTable() {
  try {
    console.log('🚀 Setting up no_penting table...');

    // Check if table exists
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'no_penting')
      .eq('table_schema', 'public');

    if (tableError) {
      console.error('❌ Error checking table existence:', tableError);
      return;
    }

    if (tables && tables.length > 0) {
      console.log('✅ Table no_penting already exists');
    } else {
      console.log('⚠️ Table no_penting does not exist');
      console.log('📝 Please run the SQL script manually in Supabase SQL Editor:');
      console.log('   database/create-no-penting-table.sql');
      return;
    }

    // Check if data exists
    const { data: existingData, error: dataError } = await supabase
      .from('no_penting')
      .select('*')
      .limit(1);

    if (dataError) {
      console.error('❌ Error checking existing data:', dataError);
      return;
    }

    if (existingData && existingData.length > 0) {
      console.log('✅ Data already exists in no_penting table');
      
      // Show existing data
      const { data: allData } = await supabase
        .from('no_penting')
        .select('nama_nomor, nomor_hp')
        .order('created_at', { ascending: false });

      console.log('\n📋 Current data in no_penting table:');
      allData?.forEach((item, index) => {
        console.log(`${index + 1}. ${item.nama_nomor}: ${item.nomor_hp}`);
      });
    } else {
      console.log('📝 Inserting sample data...');
      
      // Insert sample data
      for (const item of sampleData) {
        console.log(`   Adding: ${item.nama_nomor} - ${item.nomor_hp}`);
        
        const { error } = await supabase
          .from('no_penting')
          .insert(item);

        if (error) {
          console.error(`❌ Error inserting ${item.nama_nomor}:`, error);
        } else {
          console.log(`✅ Added: ${item.nama_nomor}`);
        }
      }
    }

    // Verify final data
    const { data: finalData, error: finalError } = await supabase
      .from('no_penting')
      .select('nama_nomor, nomor_hp, created_at')
      .order('created_at', { ascending: false });

    if (finalError) {
      console.error('❌ Error verifying data:', finalError);
    } else {
      console.log('\n📋 Final data in no_penting table:');
      finalData?.forEach((item, index) => {
        console.log(`${index + 1}. ${item.nama_nomor}: ${item.nomor_hp}`);
      });
      console.log(`\n✅ Total records: ${finalData?.length || 0}`);
    }

    console.log('\n🎉 Setup completed!');
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupNoPentingTable();
