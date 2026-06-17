'use client'
import { motion } from 'framer-motion'
import { Star, MapPin, BadgeCheck, Crown, Sparkles, MessageCircle, Trophy, Zap } from 'lucide-react'
import { useNav } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getTaskerTier } from '@/lib/constants'

export interface TaskerCardData {
  id: string
  fullName: string
  photoUrl: string
  bio: string
  country: string
  city: string
  languages: string
  skills: string
  whatsappNumber: string
  percentageShare: number
  isVerified: boolean
  isFeatured: boolean
  isPremium: boolean
  profileCompletion: number
  points: number
  level: number
  streak: number
  platforms?: { platformName: string; projectName: string; status: string }[]
  avgRating?: number
  ratingsCount?: number
}

export function TaskerCard({ tasker, index = 0 }: { tasker: TaskerCardData; index?: number }) {
  const { navigate } = useNav()
  const tier = getTaskerTier(tasker)
  const skills = tasker.skills?.split(',').filter(Boolean).slice(0, 3) || []
  const platforms = tasker.platforms?.slice(0, 3) || []
  const tierBorderClass = tasker.isPremium
    ? 'border-violet-400 shadow-violet-200/50'
    : tasker.isFeatured
    ? 'border-amber-300 shadow-amber-200/50'
    : tasker.isVerified
    ? 'border-emerald-300 shadow-emerald-200/50'
    : 'border-border'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -6 }}
      className={`group relative bg-card rounded-2xl border-2 ${tierBorderClass} p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden`}
      onClick={() => navigate({ name: 'tasker-detail', id: tasker.id })}
    >
      {/* Premium gradient background */}
      {tasker.isPremium && (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-transparent pointer-events-none opacity-50" />
      )}
      {tasker.isFeatured && !tasker.isPremium && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent pointer-events-none opacity-50" />
      )}

      {/* Tier badge - top right */}
      <div className="absolute top-3 right-3 z-10">
        <Badge
          className="text-[10px] font-semibold px-2 py-0.5"
          style={{ backgroundColor: tier.color, color: 'white' }}
        >
          {tier.icon} {tier.name}
        </Badge>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative">
            <Avatar className="h-14 w-14 border-2 border-white shadow-md">
              <AvatarImage src={tasker.photoUrl} alt={tasker.fullName} />
              <AvatarFallback>{tasker.fullName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            {tasker.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                <BadgeCheck className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate">{tasker.fullName}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{tasker.city ? `${tasker.city}, ` : ''}{tasker.country || '—'}</span>
            </div>
            {tasker.avgRating && tasker.avgRating > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold">{tasker.avgRating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({tasker.ratingsCount})</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2rem]">
          {tasker.bio || 'No bio provided yet.'}
        </p>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {skills.map(s => (
              <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0">{s.trim()}</Badge>
            ))}
          </div>
        )}

        {/* Platforms */}
        {platforms.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 text-[10px]">
            {platforms.map((p, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                {p.platformName}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3 pb-3 border-b">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-foreground">{tasker.percentageShare}%</span> share
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="h-3 w-3 text-amber-500" />
            Lvl {tasker.level}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-violet-500" />
            {tasker.points} pts
          </span>
          {tasker.streak > 0 && (
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-orange-500" />
              {tasker.streak}🔥
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1 h-8 text-xs bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
            onClick={(e) => {
              e.stopPropagation()
              if (tasker.whatsappNumber) {
                window.open(`https://wa.me/${tasker.whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank')
              }
            }}
            disabled={!tasker.whatsappNumber}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            WhatsApp
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              navigate({ name: 'tasker-detail', id: tasker.id })
            }}
          >
            View
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
