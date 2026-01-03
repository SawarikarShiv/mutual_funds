# Create partner logos script
cat > scripts/generate-partners.js << 'EOF'
const fs = require('fs');
const { createCanvas } = require('canvas');

const partners = [
  { name: 'amfi', color: '#FF6B35', text: 'AMFI' },
  { name: 'sebi', color: '#0047AB', text: 'SEBI' },
  { name: 'icici', color: '#F47721', text: 'ICICI' },
  { name: 'hdfc', color: '#0047AB', text: 'HDFC' },
  { name: 'sbi', color: '#1F5C00', text: 'SBI' },
  { name: 'axis', color: '#FF0000', text: 'AXIS' },
  { name: 'kotak', color: '#00AEEF', text: 'KOTAK' }
];

partners.forEach(partner => {
  const canvas = createCanvas(200, 100);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 200, 100);
  
  // Border
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, 190, 90);
  
  // Partner logo
  ctx.fillStyle = partner.color;
  ctx.font = 'bold 24px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(partner.text, 100, 50);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/assets/images/partners/${partner.name}.png`, buffer);
  console.log(`Created partner logo: ${partner.name}.png`);
});
EOF