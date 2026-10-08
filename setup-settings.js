const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://glvdbjkvkhuhssutkmpb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsdmRiamt2a2h1aHNzdXRrbXBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTM3OTQyNywiZXhwIjoyMTA2OTU1NDI3fQ.WNJm2vERvEkb3ZABudIa1SPs2QCMMg0ZHBBHgQor4oo'
);

async function setup() {
  // Insert default craftsmanship images
  const { data, error } = await supabase.from('site_settings').upsert({
    key: 'craftsmanship_images',
    value: ['/p5.jpg', '/p6.jpg', '/p7.jpg']
  }, { onConflict: 'key' }).select();
  console.log('Result:', data);
  console.log('Error:', error);
}
setup();
