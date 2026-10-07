import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, User, Mail, Sparkles, CheckCircle2, Landmark, Crown, Award } from 'lucide-react'
import { useGalleryStore } from '../../store/galleryStore'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  interest: z.enum(['patron', 'historian', 'curator', 'collector', 'student']),
  message: z.string().max(300, 'Keep it under 300 characters').optional(),
})

type FormValues = z.infer<typeof schema>

const interestOptions = [
  { value: 'patron', label: 'Museum Patron / Benefactor' },
  { value: 'historian', label: 'Art Historian / Scholar' },
  { value: 'curator', label: 'Curator / Conservator' },
  { value: 'collector', label: 'Fine Art Collector' },
  { value: 'student', label: 'Academy Student / Enthusiast' },
]

export function RegistrationPanel() {
  const { showRegistrationPanel, toggleRegistrationPanel, registrationSubmitted, setRegistrationSubmitted } = useGalleryStore()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { interest: 'patron' }
  })

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 1000))
    console.log('Museum Pass Registration:', data)
    setRegistrationSubmitted(true)
  }

  if (!showRegistrationPanel) return null

  return (
    <div className="flex flex-col h-full overflow-y-auto relative text-[#F5F0E8] p-6 select-text">
      {/* Close button */}
      <button
        onClick={toggleRegistrationPanel}
        className="absolute top-4 right-4 z-10 p-2 rounded-full glass-light hover:bg-[#C9A94F]/20 transition-colors cursor-pointer text-[#F5F0E8]/70 hover:text-[#C9A94F]"
        aria-label="Close panel"
      >
        <X size={16} />
      </button>

      {/* Header */}
      <div className="pb-6 border-b border-[#C9A94F]/20">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full border border-[#C9A94F]/40 flex items-center justify-center bg-[#C9A94F]/10">
            <Landmark size={16} className="text-[#C9A94F]" />
          </div>
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#C9A94F] font-semibold">
            Curatorial Society
          </span>
        </div>

        <h1
          className="font-display text-3xl leading-tight text-[#F5F0E8] mb-2 font-medium"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          European Museum Pass
        </h1>
        <p className="text-xs text-[#F5F0E8]/65 leading-relaxed">
          Request private curatorial access to our 5 historic wings, rare archival collections, and special vernissages.
        </p>
      </div>

      {/* Permanent Wings Overview */}
      <div className="py-5 border-b border-[#C9A94F]/15 space-y-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A94F] font-bold">
          🏛️ 5 Permanent Wings
        </p>
        <div className="grid grid-cols-1 gap-2 text-xs text-[#F5F0E8]/80">
          <div className="p-2.5 rounded-xl glass-light border border-white/5 flex items-center justify-between">
            <span>Grand Rotunda & Atrium</span>
            <span className="text-[10px] text-[#C9A94F]">Monumental Masters</span>
          </div>
          <div className="p-2.5 rounded-xl glass-light border border-white/5 flex items-center justify-between">
            <span>North Hall of Masters</span>
            <span className="text-[10px] text-[#C9A94F]">Rembrandt & Caravaggio</span>
          </div>
          <div className="p-2.5 rounded-xl glass-light border border-white/5 flex items-center justify-between">
            <span>East Portrait Wing</span>
            <span className="text-[10px] text-[#C9A94F]">Vermeer & Van Dyck</span>
          </div>
          <div className="p-2.5 rounded-xl glass-light border border-white/5 flex items-center justify-between">
            <span>West Landscapes & Seas</span>
            <span className="text-[10px] text-[#C9A94F]">Turner & Friedrich</span>
          </div>
          <div className="p-2.5 rounded-xl glass-light border border-white/5 flex items-center justify-between">
            <span>South Renaissance Salon</span>
            <span className="text-[10px] text-[#C9A94F]">Botticelli & Raphael</span>
          </div>
        </div>
      </div>

      {/* Registration Form / Success */}
      <div className="py-6 flex-1">
        {registrationSubmitted ? (
          <div className="p-6 rounded-2xl glass-panel border border-[#C9A94F]/40 text-center space-y-3 animate-in fade-in duration-400">
            <CheckCircle2 size={36} className="text-[#C9A94F] mx-auto" />
            <h3
              className="text-2xl font-display text-[#F5F0E8]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Curatorial Pass Granted
            </h3>
            <p className="text-xs text-[#F5F0E8]/70 leading-relaxed">
              Your honorary museum membership confirmation has been dispatched. Welcome to the European Museum of Fine Art.
            </p>
            <button
              onClick={() => setRegistrationSubmitted(false)}
              className="mt-3 text-xs text-[#C9A94F] hover:underline cursor-pointer font-medium"
            >
              Register Another Patron
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-[#F5F0E8]/70 mb-1.5 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                {...register('name')}
                placeholder="e.g. Lord Julian Thorne"
                className="w-full px-3.5 py-2.5 rounded-xl glass-light border border-white/10 text-xs text-[#F5F0E8] placeholder-white/25 focus:border-[#C9A94F] focus:outline-none transition-colors"
              />
              {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#F5F0E8]/70 mb-1.5 uppercase tracking-wider">
                Email Address *
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="julian.thorne@academy.edu"
                className="w-full px-3.5 py-2.5 rounded-xl glass-light border border-white/10 text-xs text-[#F5F0E8] placeholder-white/25 focus:border-[#C9A94F] focus:outline-none transition-colors"
              />
              {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#F5F0E8]/70 mb-1.5 uppercase tracking-wider">
                Affiliation / Interest
              </label>
              <select
                {...register('interest')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1713] border border-white/10 text-xs text-[#F5F0E8] focus:border-[#C9A94F] focus:outline-none transition-colors"
              >
                {interestOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#1C1713] text-[#F5F0E8]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-gold py-3 rounded-xl text-[#0D0A08] font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mt-4"
            >
              {isSubmitting ? 'Issuing Pass...' : 'Acquire Curatorial Pass'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
