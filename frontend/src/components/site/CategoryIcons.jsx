export function BrandingIcon() {
  return (
    <svg viewBox="0 0 96 96" className="cat-icon cat-icon--branding h-full w-full" aria-hidden="true" fill="none">
      <g className="cat-shadow" fill="#ffd100">
        <rect x="24" y="28" width="40" height="40" rx="8" transform="translate(6 7) rotate(45 44 48)" />
      </g>
      <g className="cat-body">
        <rect
          x="24"
          y="28"
          width="40"
          height="40"
          rx="8"
          transform="rotate(45 44 48)"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <circle className="cat-hole" cx="46" cy="34" r="3.6" fill="currentColor" transform="rotate(45 44 48)" />
      </g>
    </svg>
  )
}

export function EditorialIcon() {
  return (
    <svg viewBox="0 0 96 96" className="cat-icon cat-icon--editorial h-full w-full" aria-hidden="true" fill="none">
      <g className="cat-shadow" fill="#ffd100">
        <path d="M30 16h26l14 14v50H30V16z" transform="translate(5 6)" />
      </g>
      <g className="cat-body" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        <g className="cat-open">
          <path className="cat-page" d="M30 16h26l14 14v50H30V16z" />
          <path className="cat-fold" d="M56 16v14h14" />
        </g>
        <path className="cat-line cat-line-1" d="M39 47h18" />
        <path className="cat-line cat-line-2" d="M39 57h18" />
        <path className="cat-line cat-line-3" d="M39 67h12" />
      </g>
    </svg>
  )
}

export function InfografiaIcon() {
  return (
    <svg viewBox="0 0 96 96" className="cat-icon cat-icon--infografia h-full w-full" aria-hidden="true" fill="none">
      <g className="cat-body">
        <path className="cat-wedge" d="M38 50 38 30a20 20 0 0 1 20 20z" fill="#ffd100" />
        <circle cx="38" cy="50" r="20" stroke="currentColor" strokeWidth="4.5" />
        <path className="cat-line cat-line-1" d="M66 40h22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path className="cat-line cat-line-2" d="M66 50h22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path className="cat-line cat-line-3" d="M66 60h22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function AudiovisualIcon() {
  return (
    <svg viewBox="0 0 96 96" className="cat-icon cat-icon--audiovisual h-full w-full" aria-hidden="true" fill="none">
      <defs>
        <clipPath id="cat-clapper-clip">
          <rect x="20" y="20" width="56" height="18" rx="3" />
        </clipPath>
      </defs>
      <g className="cat-shadow" fill="#ffd100">
        <rect x="20" y="40" width="56" height="36" rx="4" transform="translate(4 6)" />
      </g>
      <g className="cat-body">
        <rect
          x="20"
          y="40"
          width="56"
          height="36"
          rx="4"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path
          className="cat-play"
          d="M41 50.5 57 58.5 41 66.5z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
          fill="none"
        />
        <g className="cat-bar">
          <rect
            x="20"
            y="20"
            width="56"
            height="18"
            rx="3"
            fill="#ffd100"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <g clipPath="url(#cat-clapper-clip)" stroke="currentColor" strokeWidth="6">
            <path d="M27 15 13 43" />
            <path d="M41 15 27 43" />
            <path d="M55 15 41 43" />
            <path d="M69 15 55 43" />
            <path d="M83 15 69 43" />
          </g>
        </g>
      </g>
    </svg>
  )
}

export function RedesIcon() {
  return (
    <svg viewBox="0 0 96 96" className="cat-icon cat-icon--redes h-full w-full" aria-hidden="true" fill="none">
      <g className="cat-shadow" fill="#ffd100">
        <rect x="30" y="12" width="36" height="70" rx="7" transform="translate(4 6)" />
      </g>
      <g className="cat-phone" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
        <rect x="30" y="12" width="36" height="70" rx="7" />
        <path d="M42 23h12" strokeWidth="3.5" />
      </g>
      <path
        className="cat-heart"
        fill="#ffd100"
        d="M48 58c-5.5-5-12-9.6-12-15.5 0-3.6 2.8-6.5 6.3-6.5 2.6 0 4.6 1.4 5.7 3.3 1.1-1.9 3.1-3.3 5.7-3.3 3.5 0 6.3 2.9 6.3 6.5 0 5.9-6.5 10.5-12 15.5z"
      />
    </svg>
  )
}
