export default function Astronauta({ className }) {
  return (
    <svg className={className} viewBox="0 0 320 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="visor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb963" />
          <stop offset="55%" stopColor="#cf731b" />
          <stop offset="100%" stopColor="#7a4310" />
        </linearGradient>
        <linearGradient id="traje" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d9d4cb" />
        </linearGradient>
      </defs>
      {/* cordón umbilical */}
      <path d="M58 330 C -10 300, 30 220, 86 246" stroke="#cf731b" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 12" />
      {/* mochila */}
      <rect x="86" y="118" width="64" height="120" rx="20" fill="#b8b2a7" />
      {/* pierna izq */}
      <path d="M150 250 Q 132 308 158 326 Q 176 338 186 322 L 178 296 Q 172 268 178 252 Z" fill="url(#traje)" />
      <rect x="148" y="314" width="48" height="26" rx="13" fill="#cf731b" />
      {/* pierna der */}
      <path d="M196 248 Q 222 286 252 292 Q 274 294 272 276 L 250 262 Q 226 248 222 234 Z" fill="url(#traje)" />
      <rect x="244" y="266" width="46" height="26" rx="13" transform="rotate(22 244 266)" fill="#cf731b" />
      {/* torso */}
      <path d="M122 142 Q 112 230 150 258 Q 196 280 226 240 Q 244 206 226 152 Q 210 120 168 118 Q 134 118 122 142 Z" fill="url(#traje)" />
      {/* panel pecho */}
      <rect x="158" y="172" width="46" height="34" rx="9" fill="#16130f" />
      <circle cx="171" cy="184" r="4.5" fill="#cf731b" />
      <circle cx="186" cy="184" r="4.5" fill="#ffd9ae" />
      <rect x="166" y="194" width="30" height="4" rx="2" fill="#6f675c" />
      {/* brazo izq saludando */}
      <path d="M128 156 Q 86 138 70 96 Q 64 76 82 72 Q 96 70 102 88 Q 112 122 142 132 Z" fill="url(#traje)" />
      <circle cx="80" cy="82" r="17" fill="#cf731b" />
      {/* brazo der */}
      <path d="M222 158 Q 262 174 284 158 Q 298 146 288 132 Q 278 122 264 132 Q 246 144 222 136 Z" fill="url(#traje)" />
      <circle cx="286" cy="142" r="16" fill="#cf731b" />
      {/* casco */}
      <circle cx="172" cy="84" r="56" fill="url(#traje)" />
      <circle cx="172" cy="84" r="56" stroke="#c4beb2" strokeWidth="3" />
      <path d="M132 84 a40 40 0 1 0 80 0 a40 40 0 1 0 -80 0" fill="url(#visor)" />
      <ellipse cx="156" cy="68" rx="13" ry="8" transform="rotate(-24 156 68)" fill="#ffffff" opacity=".55" />
      {/* cuello */}
      <rect x="146" y="128" width="52" height="14" rx="7" fill="#c4beb2" />
      {/* insignia RK */}
      <text x="118" y="160" fontFamily="Montserrat, sans-serif" fontSize="17" fontWeight="800" fill="#cf731b" transform="rotate(-8 118 160)">RK</text>
    </svg>
  )
}
