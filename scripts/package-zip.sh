#!/bin/bash
# Package the AI Taskers Platform into a downloadable zip
# Excludes build artifacts and dependencies, includes all source code

set -e

PROJECT_DIR="/home/z/my-project"
OUTPUT_ZIP="/home/z/my-project/download/ai-taskers-platform.zip"
STAGING_DIR="/tmp/ai-taskers-staging"

echo "📦 Packaging AI Taskers Platform..."

# Clean previous staging
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR/ai-taskers-platform"

# Files and directories to include
INCLUDE_PATTERNS=(
  "src/"
  "prisma/"
  "public/"
  "scripts/"
  "README.md"
  "DEPLOYMENT.md"
  "SYSTEM_WALKTHROUGH.md"
  "package.json"
  "bun.lock"
  "next.config.ts"
  "tsconfig.json"
  "tailwind.config.ts"
  "postcss.config.mjs"
  "eslint.config.mjs"
  "components.json"
  "Caddyfile"
  ".env.example"
  ".env"
  ".gitignore"
)

# Files/directories to exclude (within included paths)
EXCLUDE_PATTERNS=(
  "node_modules"
  ".next"
  ".git"
  "*.log"
  "dev.log"
  "server.log"
  "tool-results"
  ".zscripts"
  "agent-ctx"
  "db/*.db"
  "db/*.db-journal"
  "*-screenshot.png"
)

echo "  → Copying project files to staging..."
cd "$PROJECT_DIR"

# Copy each included item
for item in "${INCLUDE_PATTERNS[@]}"; do
  if [ -e "$item" ]; then
    cp -r "$item" "$STAGING_DIR/ai-taskers-platform/"
  fi
done

# Clean up excluded patterns from staging
cd "$STAGING_DIR/ai-taskers-platform"
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
  find . -name "$pattern" -type f -delete 2>/dev/null || true
  find . -name "$pattern" -type d -exec rm -rf {} + 2>/dev/null || true
done

# Remove any db folder (will be regenerated on first run)
rm -rf db/

# Create a startup script for easy onboarding
cat > start-dev.sh << 'EOF'
#!/bin/bash
# AI Taskers Platform - Quick Start Script
set -e

echo "🤖 AI Taskers Platform - Starting..."
echo ""

# Check for bun or npm
if command -v bun &> /dev/null; then
  PKG_MGR="bun"
elif command -v npm &> /dev/null; then
  PKG_MGR="npm"
else
  echo "❌ Neither bun nor npm found. Please install Node.js 18+ first."
  exit 1
fi

echo "📦 Installing dependencies..."
$PKG_MGR install

echo ""
echo "📋 Setting up environment..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  ✓ Created .env from .env.example"
  echo "  ⚠️  Edit .env to configure your environment"
fi

echo ""
echo "🗄️  Setting up database..."
$PKG_MGR run db:push
$PKG_MGR run db:generate

echo ""
echo "🌱 Seeding database with demo data..."
if [ "$PKG_MGR" = "bun" ]; then
  bun run scripts/seed.ts
else
  npx tsx scripts/seed.ts
fi

echo ""
echo "🚀 Starting development server..."
echo ""
echo "════════════════════════════════════════════════════════"
echo "  🎉 AI Taskers Platform is starting!"
echo ""
echo "  📍 URL: http://localhost:3000"
echo ""
echo "  🔐 Demo accounts:"
echo "     Admin:    admin@aitaskers.com / admin123"
echo "     Tasker:   alice.mwangi.0@example.com / tasker123"
echo "     Employer: techflow.ai@example.com / employer123"
echo "════════════════════════════════════════════════════════"
echo ""

$PKG_MGR run dev
EOF
chmod +x start-dev.sh

# Add a setup-info.txt with quick instructions
cat > QUICK_START.txt << 'EOF'
╔══════════════════════════════════════════════════════════════╗
║         AI TASKERS PLATFORM - QUICK START GUIDE             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  1. EASIEST: Run the start script                            ║
║     $ ./start-dev.sh                                         ║
║                                                              ║
║  2. MANUAL:                                                  ║
║     $ bun install     (or npm install)                       ║
║     $ cp .env.example .env                                   ║
║     $ bun run db:push                                        ║
║     $ bun run scripts/seed.ts                                ║
║     $ bun run dev                                            ║
║                                                              ║
║  3. OPEN: http://localhost:3000                              ║
║                                                              ║
║  4. DEMO LOGINS:                                             ║
║     Admin:    admin@aitaskers.com / admin123                 ║
║     Tasker:   alice.mwangi.0@example.com / tasker123         ║
║     Employer: techflow.ai@example.com / employer123          ║
║                                                              ║
║  5. DOCUMENTATION:                                           ║
║     - README.md           (everything)                       ║
║     - DEPLOYMENT.md       (production deploy guide)          ║
║     - SYSTEM_WALKTHROUGH.md (feature walkthrough)            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF

# Show what's in the staging directory
echo ""
echo "  → Staged files:"
find . -type f | head -30
echo "  ... and $(find . -type f | wc -l) total files"

# Create the zip
echo ""
echo "  → Creating zip archive..."
cd "$STAGING_DIR"
rm -f "$OUTPUT_ZIP"
zip -rq "$OUTPUT_ZIP" "ai-taskers-platform/"

# Show final size
ZIP_SIZE=$(du -h "$OUTPUT_ZIP" | cut -f1)
echo ""
echo "✅ Done!"
echo "  📦 Zip: $OUTPUT_ZIP"
echo "  📏 Size: $ZIP_SIZE"

# Clean up staging
rm -rf "$STAGING_DIR"
