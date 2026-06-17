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
