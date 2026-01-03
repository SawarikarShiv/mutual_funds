// scripts/create-partner-logos.js
const fs = require('fs');
const { createCanvas } = require('canvas');

const partners = [
  { name: 'amfi', color: '#FF6B35', text: 'AMFI', subtext: 'Certified' },
  { name: 'sebi', color: '#0047AB', text: 'SEBI', subtext: 'Registered' },
  { name: 'icici', color: '#F47721', text: 'ICICI', subtext: 'Prudential' },
  { name: 'hdfc', color: '#0047AB', text: 'HDFC', subtext: 'Mutual Fund' },
  { name: 'sbi', color: '#1F5C00', text: 'SBI', subtext: 'Funds' },
  { name: 'axis', color: '#FF0000', text: 'AXIS', subtext: 'Mutual Fund' },
  { name: 'kotak', color: '#00AEEF', text: 'KOTAK', subtext: 'Mahindra' }
];

partners.forEach(partner => {
  const canvas = createCanvas(200, 100);
  const ctx = canvas.getContext('2d');
  
  // White background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 200, 100);
  
  // Border
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, 180, 80);
  
  // Partner logo/name
  ctx.fillStyle = partner.color;
  ctx.font = 'bold 28px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(partner.text, 100, 40);
  
  ctx.fillStyle = '#6B7280';
  ctx.font = '14px Inter';
  ctx.fillText(partner.subtext, 100, 65);
  
  // Save
  fs.writeFileSync(
    `public/assets/images/partners/${partner.name}.png`,
    canvas.toBuffer('image/png')
  );
  console.log(`Created ${partner.name}.png`);
});