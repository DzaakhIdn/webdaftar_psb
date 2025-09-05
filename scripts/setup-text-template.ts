import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const templates = [
  {
    text_name: 'pending',
    template: `Halo {nama_siswa},

Terima kasih telah mendaftar di sekolah kami dengan nomor pendaftaran {no_daftar}.

Status pendaftaran Anda saat ini: {status}
Jalur pendaftaran: {jalur}

Mohon tunggu informasi selanjutnya dari kami.

Terima kasih.`
  },
  {
    text_name: 'diterima',
    template: `Selamat {nama_siswa}! 🎉

Kami dengan senang hati memberitahukan bahwa Anda telah DITERIMA di sekolah kami.

Detail pendaftaran:
- Nomor Pendaftaran: {no_daftar}
- Jalur: {jalur}
- Status: {status}

Password untuk login sistem: {password_hash}

Silakan simpan password ini dengan baik dan segera login ke sistem untuk melengkapi data Anda.

Selamat bergabung dengan keluarga besar sekolah kami!

Terima kasih.`
  },
  {
    text_name: 'ditolak',
    template: `Halo {nama_siswa},

Terima kasih atas minat Anda untuk bergabung dengan sekolah kami.

Setelah melalui proses seleksi yang ketat, kami mohon maaf harus memberitahukan bahwa pendaftaran Anda dengan nomor {no_daftar} belum dapat kami terima pada periode ini.

Detail pendaftaran:
- Nomor Pendaftaran: {no_daftar}
- Jalur: {jalur}
- Status: {status}

Jangan berkecil hati, Anda dapat mencoba mendaftar kembali pada periode pendaftaran berikutnya.

Terima kasih atas pengertiannya.`
  },
  {
    text_name: 'sedang tes',
    template: `Halo {nama_siswa},

Selamat! Anda telah lolos tahap administrasi dan akan mengikuti tahap selanjutnya.

Detail pendaftaran:
- Nomor Pendaftaran: {no_daftar}
- Jalur: {jalur}
- Status: {status}

Mohon persiapkan diri Anda dengan baik untuk tahap selanjutnya. Informasi lebih lanjut akan kami sampaikan segera.

Semoga sukses!

Terima kasih.`
  }
];

async function setupTextTemplates() {
  console.log('🚀 Setting up text templates...');

  try {
    // Check if table exists by trying to select from it
    const { data: existingData, error: selectError } = await supabase
      .from('text_template')
      .select('text_name')
      .limit(1);

    if (selectError) {
      console.error('❌ Table text_template does not exist or is not accessible:', selectError.message);
      console.log('📝 Please create the table first using the SQL script in database/create-text-template-table.sql');
      return;
    }

    console.log('✅ Table text_template exists');

    // Insert templates
    for (const template of templates) {
      console.log(`📝 Inserting template: ${template.text_name}`);
      
      const { data, error } = await supabase
        .from('text_template')
        .upsert(template, { 
          onConflict: 'text_name',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        console.error(`❌ Error inserting template ${template.text_name}:`, error);
      } else {
        console.log(`✅ Template ${template.text_name} inserted successfully`);
      }
    }

    // Verify data
    const { data: allTemplates, error: verifyError } = await supabase
      .from('text_template')
      .select('text_name, template')
      .order('text_name');

    if (verifyError) {
      console.error('❌ Error verifying templates:', verifyError);
    } else {
      console.log('\n📋 All templates in database:');
      allTemplates?.forEach(template => {
        console.log(`- ${template.text_name}: ${template.template.substring(0, 50)}...`);
      });
    }

    console.log('\n🎉 Text templates setup completed!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
setupTextTemplates();
