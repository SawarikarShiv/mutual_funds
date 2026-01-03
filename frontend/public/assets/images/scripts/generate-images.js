# Create the image generation script
cat > scripts/generate-images.js << 'EOF'
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure directories exist
const imageDirs = [
  'public/assets/images/dashboard',
  'public/assets/images/funds',
  'public/assets/images/company',
  'public/assets/images/partners',
  'public/assets/images/users',
  'public/assets/images/misc'
];

imageDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Function to create gradient image
function createGradientImage(width, height, colors, filename) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  
  // Fill with gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add text if specified
  if (filename.includes('logo')) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('INFINITY', width/2, height/2);
    ctx.font = '20px Inter';
    ctx.fillText('Mutual Funds', width/2, height/2 + 40);
  }
  
  // Save image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Created: ${filename}`);
}

// Create all images
createGradientImage(1920, 600, ['#2563EB', '#7C3AED'], 'public/assets/images/dashboard/hero-bg.png');
createGradientImage(800, 400, ['#0F766E', '#10B981'], 'public/assets/images/dashboard/stats-bg.png');
createGradientImage(400, 300, ['#1E40AF', '#3B82F6'], 'public/assets/images/dashboard/chart-pattern.png');

// Fund category images
createGradientImage(300, 200, ['#DC2626', '#F87171'], 'public/assets/images/funds/equity.png');
createGradientImage(300, 200, ['#059669', '#10B981'], 'public/assets/images/funds/debt.png');
createGradientImage(300, 200, ['#7C3AED', '#A78BFA'], 'public/assets/images/funds/hybrid.png');
createGradientImage(300, 200, ['#F59E0B', '#FBBF24'], 'public/assets/images/funds/sectoral.png');
createGradientImage(300, 200, ['#1D4ED8', '#60A5FA'], 'public/assets/images/funds/international.png');

// Company images
createGradientImage(400, 150, ['#2563EB', '#3B82F6'], 'public/assets/images/company/logo-full.png');
createGradientImage(200, 200, ['#7C3AED', '#A78BFA'], 'public/assets/images/company/logo-icon.png');
createGradientImage(600, 600, ['rgba(37, 99, 235, 0.1)', 'rgba(124, 58, 237, 0.1)'], 'public/assets/images/company/watermark.png');

// User images
createGradientImage(200, 200, ['#6B7280', '#9CA3AF'], 'public/assets/images/users/default-avatar.png');
createGradientImage(800, 400, ['#1E40AF', '#3B82F6'], 'public/assets/images/users/profile-bg.jpg');

// Misc images
createGradientImage(400, 300, ['#6B7280', '#9CA3AF'], 'public/assets/images/misc/coming-soon.png');
createGradientImage(400, 300, ['#DC2626', '#EF4444'], 'public/assets/images/misc/error-404.png');
createGradientImage(200, 200, ['#10B981', '#34D399'], 'public/assets/images/misc/success-check.png');

console.log('All images generated successfully!');