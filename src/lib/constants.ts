// Centralized platform data - based on the AI Taskers Platform brief

export const PLATFORMS = [
  { name: "Outlier AI", icon: "🧠", color: "#6366f1" },
  { name: "Handshake AI", icon: "🤝", color: "#0ea5e9" },
  { name: "RWS", icon: "🌐", color: "#10b981" },
  { name: "AfterQuery", icon: "🔍", color: "#f59e0b" },
  { name: "Micro1", icon: "⚙️", color: "#8b5cf6" },
  { name: "Mercor AI", icon: "💼", color: "#ec4899" },
  { name: "Amazon Turk", icon: "📦", color: "#f97316" },
  { name: "Alignerr", icon: "🎯", color: "#14b8a6" },
  { name: "Appen", icon: "📊", color: "#ef4444" },
  { name: "UHRS", icon: "🖥️", color: "#3b82f6" },
  { name: "Scale AI", icon: "⚖️", color: "#06b6d4" },
  { name: "DataAnnotation.tech", icon: "📝", color: "#84cc16" },
  { name: "OneForma", icon: "1️⃣", color: "#a855f7" },
  { name: "TELUS Digital", icon: "📞", color: "#6b7280" },
] as const;

export const PROJECTS_BY_PLATFORM: Record<string, string[]> = {
  "Outlier AI": ["Aether", "Bulba", "Bulba Extensions", "Flamingo", "Guitar", "Dolphin", "T-Rex", "Oneroi"],
  "Handshake AI": ["Hedgehog", "Ivy", "Cedar", "Marigold", "Lighthouse", "Breadcrumbs", "Artifacts", "Claw"],
  "RWS": ["Diamond"],
  "Alignerr": ["Orion", "Fireweed", "Spearmint", "LLM Voyager"],
  "OneForma": ["Karimata", "Tansy", "Cornelia", "Realtime Voices", "RealTalk", "MilkyWay", "Community Alignment Evaluation v2"],
  "DataAnnotation.tech": ["Oasis", "Crux", "Walnut", "Gold Verification"],
  "Appen": ["Crescent"],
  "TELUS Digital": ["Yukon"],
};

export const COUNTRIES = [
  "Kenya", "Nigeria", "India", "Philippines", "USA", "UK",
  "South Africa", "Ghana", "Egypt", "Pakistan", "Bangladesh",
  "Canada", "Australia", "Germany", "Brazil", "Mexico", "Remote",
];

export const SKILLS = [
  "Coding", "Math", "Biology", "Physics", "Chemistry",
  "Translation", "Linguistics", "Reasoning", "Writing", "Research",
  "Data Annotation", "RLHF", "Image Annotation", "Audio Transcription",
  "Fact-Checking", "Creative Writing", "Coding (Python)", "Coding (JavaScript)",
  "Statistics", "Philosophy", "History", "Geography", "Law", "Medicine",
];

export const TASKER_TIERS = {
  basic: {
    name: "Basic Tasker",
    color: "#6b7280",
    icon: "👤",
    description: "Free profile with WhatsApp contact and proof of work",
  },
  verified: {
    name: "Verified Tasker",
    color: "#10b981",
    icon: "✓",
    description: "Awarded a verification badge after admin review of evidence",
  },
  featured: {
    name: "Featured Tasker",
    color: "#f59e0b",
    icon: "⭐",
    description: "Paid listing for higher visibility in search results",
  },
  premium: {
    name: "Premium Tasker",
    color: "#a855f7",
    icon: "👑",
    description: "Full employer listings access plus all featured benefits",
  },
} as const;

export const PLANS = [
  // Featured plans
  { id: "featured_hour", name: "featured", duration: "hour", price: 2, currency: "USD", features: ["Featured listing for 1 hour", "Top of search results", "Homepage featured placement", "Highlighted card"] },
  { id: "featured_day", name: "featured", duration: "day", price: 3, currency: "USD", features: ["Featured listing for 24 hours", "Top of search results", "Homepage featured placement", "Highlighted card", "Analytics visibility"] },
  { id: "featured_week", name: "featured", duration: "week", price: 10, currency: "USD", features: ["Featured listing for 7 days", "Top of search results", "Homepage featured placement", "Highlighted card", "Analytics visibility", "Priority ranking"] },
  { id: "featured_month", name: "featured", duration: "month", price: 25, currency: "USD", features: ["Featured listing for 30 days", "Top of search results", "Homepage featured placement", "Highlighted card", "Analytics visibility", "Priority ranking", "Promoted profile"] },
  // Premium plan
  { id: "premium_month", name: "premium", duration: "month", price: 100, currency: "USD", features: ["All Featured tasker benefits", "Employer Listings Access", "Legit Employer Verification", "Vendor Access (BMS, tools)", "Resume/CV reviewers access", "AI Training Guides (Outlier, RWS, Alignerr)"] },
] as const;

export const ACHIEVEMENT_BADGES = {
  profile_complete: { title: "Profile Complete", description: "Completed 100% of profile", icon: "🎯", color: "#10b981" },
  verified: { title: "Verified Tasker", description: "Awarded verification badge", icon: "✓", color: "#0ea5e9" },
  top_rated: { title: "Top Rated", description: "Maintained 4.5+ average rating", icon: "🏆", color: "#f59e0b" },
  streak_7: { title: "7-Day Streak", description: "Updated profile 7 days in a row", icon: "🔥", color: "#ef4444" },
  streak_30: { title: "30-Day Streak", description: "Updated profile 30 days in a row", icon: "💎", color: "#a855f7" },
  early_adopter: { title: "Early Adopter", description: "Joined during launch period", icon: "🚀", color: "#06b6d4" },
  featured_pro: { title: "Featured Pro", description: "Subscribed to Featured plan", icon: "⭐", color: "#f59e0b" },
  premium_member: { title: "Premium Member", description: "Subscribed to Premium plan", icon: "👑", color: "#a855f7" },
  five_ratings: { title: "Five Reviews", description: "Received 5 employer reviews", icon: "💬", color: "#ec4899" },
  helpful: { title: "Helpful Community Member", description: "Active in the WhatsApp community", icon: "🤝", color: "#84cc16" },
} as const;

export const MOTIVATIONAL_QUOTES = [
  { quote: "The quality of your work determines the quality of your future.", author: "AI Taskers Daily" },
  { quote: "Every annotation shapes the intelligence of tomorrow.", author: "AI Taskers Daily" },
  { quote: "Verified taskers don't just find work — they create trust.", author: "AI Taskers Daily" },
  { quote: "Your attention to detail is the foundation of AI reliability.", author: "AI Taskers Daily" },
  { quote: "Today's RLHF work is tomorrow's breakthrough model.", author: "AI Taskers Daily" },
  { quote: "Be the tasker employers ask for by name.", author: "AI Taskers Daily" },
  { quote: "Discipline today, dividends tomorrow.", author: "AI Taskers Daily" },
  { quote: "Consistency beats intensity. Show up every day.", author: "AI Taskers Daily" },
];

export const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/your-invite-link";
export const SUPPORT_EMAIL = "support@aitaskers.com";

export function getPlatformIcon(name: string): string {
  return PLATFORMS.find(p => p.name === name)?.icon ?? "📝";
}

export function getPlatformColor(name: string): string {
  return PLATFORMS.find(p => p.name === name)?.color ?? "#6366f1";
}

export function getTaskerTier(tasker: { isVerified: boolean; isFeatured: boolean; isPremium: boolean }) {
  if (tasker.isPremium) return TASKER_TIERS.premium;
  if (tasker.isFeatured) return TASKER_TIERS.featured;
  if (tasker.isVerified) return TASKER_TIERS.verified;
  return TASKER_TIERS.basic;
}

export function computeProfileCompletion(tasker: {
  bio: string;
  photoUrl: string;
  country: string;
  city: string;
  whatsappNumber: string;
  languages: string;
  skills: string;
  percentageShare: number;
}): number {
  let score = 0;
  const fields = [
    { check: () => tasker.bio.trim().length > 20, weight: 15 },
    { check: () => !!tasker.photoUrl, weight: 10 },
    { check: () => !!tasker.country, weight: 10 },
    { check: () => !!tasker.city, weight: 5 },
    { check: () => !!tasker.whatsappNumber, weight: 15 },
    { check: () => !!tasker.languages, weight: 10 },
    { check: () => !!tasker.skills, weight: 10 },
    { check: () => tasker.percentageShare >= 20 && tasker.percentageShare <= 80, weight: 5 },
  ];
  for (const field of fields) {
    if (field.check()) score += field.weight;
  }
  // 20% from proofs + platforms (need to check separately)
  return Math.min(score, 80); // max 80 without proofs/platforms
}
