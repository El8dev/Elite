import tailwindAnimate from 'tailwindcss-animate';
import containerQuery from '@tailwindcss/container-queries';
import intersect from 'tailwindcss-intersect';

export default {
    darkMode: ['class'],
    content: [
        './index.html',
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
        './node_modules/streamdown/dist/**/*.js'
    ],
    safelist: ['border', 'border-border'],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '1.5rem',
                lg: '2rem',
                '2xl': '2.5rem'
            },
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                'inter': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                'outfit': ['Outfit', 'sans-serif'],
                'jetbrains': ['"JetBrains Mono"', 'monospace'],
                'cairo': ['Cairo', 'sans-serif'],
                'alexandria': ['Alexandria', 'sans-serif'],
                'ibm-arabic': ['"IBM Plex Arabic"', 'sans-serif'],
            },
            colors: {
                border: 'hsl(var(--border))',
                borderColor: {
                    border: 'hsl(var(--border))'
                },
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                education: {
                    blue: 'hsl(var(--education-blue))',
                    green: 'hsl(var(--education-green))'
                },
                success: 'hsl(var(--success))',
                warning: 'hsl(var(--warning))',
                info: 'hsl(var(--info))',
                // ── Neon Accent Palette ──────────────────────────────────
                neon: {
                    cyan:    'hsl(var(--neon-cyan))',
                    emerald: 'hsl(var(--neon-emerald))',
                    violet:  'hsl(var(--neon-violet))',
                    amber:   'hsl(var(--neon-amber))',
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    background: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                },
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            backgroundImage: {
                'gradient-primary': 'var(--gradient-primary)',
                'gradient-card': 'var(--gradient-card)',
                'gradient-background': 'var(--gradient-background)',
                'gradient-neon-cyan': 'linear-gradient(135deg, hsl(var(--neon-cyan)), hsl(var(--neon-violet)))',
            },
            boxShadow: {
                card: 'var(--shadow-card)',
                hover: 'var(--shadow-hover)',
                'neon-violet': '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.15)',
                'neon-cyan':   '0 0 20px rgba(34, 211, 238, 0.4), 0 0 40px rgba(34, 211, 238, 0.15)',
                'neon-emerald':'0 0 20px rgba(52, 211, 153, 0.4), 0 0 40px rgba(52, 211, 153, 0.15)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to:   { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to:   { height: '0' }
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to:   { opacity: '1', transform: 'translateY(0)' }
                },
                'slide-in': {
                    from: { opacity: '0', transform: 'translateX(-20px)' },
                    to:   { opacity: '1', transform: 'translateX(0)' }
                },
                // ── New Premium Keyframes ────────────────────────────────
                'neon-pulse': {
                    '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
                    '50%':      { opacity: '0.7', filter: 'brightness(1.3)' },
                },
                'shimmer-sweep': {
                    '0%':   { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition:  '200% center' },
                },
                'spin-slow': {
                    from: { transform: 'rotate(0deg)' },
                    to:   { transform: 'rotate(360deg)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px) scale(1)' },
                    '50%':      { transform: 'translateY(-24px) scale(1.04)' },
                },
                'float-delayed': {
                    '0%, 100%': { transform: 'translateY(0px) scale(1)' },
                    '50%':      { transform: 'translateY(18px) scale(0.97)' },
                },
                'scanline': {
                    '0%':   { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(200%)' },
                },
                'cursor-ripple': {
                    '0%':   { transform: 'translate(-50%, -50%) scale(0)', opacity: '0.6' },
                    '100%': { transform: 'translate(-50%, -50%) scale(3)', opacity: '0' },
                },
                'count-up-reveal': {
                    from: { opacity: '0', transform: 'translateY(12px)' },
                    to:   { opacity: '1', transform: 'translateY(0)' },
                },
                'gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%':      { backgroundPosition: '100% 50%' },
                },
            },
            animation: {
                'accordion-down':   'accordion-down 0.2s ease-out',
                'accordion-up':     'accordion-up 0.2s ease-out',
                'fade-in':          'fade-in 0.5s ease-out',
                'slide-in':         'slide-in 0.5s ease-out',
                'neon-pulse':       'neon-pulse 2s ease-in-out infinite',
                'shimmer-sweep':    'shimmer-sweep 2.5s linear infinite',
                'spin-slow':        'spin-slow 8s linear infinite',
                'float':            'float 7s ease-in-out infinite',
                'float-delayed':    'float-delayed 9s ease-in-out infinite',
                'scanline':         'scanline 3s linear infinite',
                'cursor-ripple':    'cursor-ripple 0.6s ease-out forwards',
                'count-up-reveal':  'count-up-reveal 0.5s ease-out forwards',
                'gradient-shift':   'gradient-shift 6s ease-in-out infinite',
            }
        }
    },
    plugins: [
        tailwindAnimate,
        containerQuery,
        intersect,
        function ({addUtilities}: any) {
            addUtilities(
                {
                    '.border-t-solid': {'border-top-style': 'solid'},
                    '.border-r-solid': {'border-right-style': 'solid'},
                    '.border-b-solid': {'border-bottom-style': 'solid'},
                    '.border-l-solid': {'border-left-style': 'solid'},
                    '.border-t-dashed': {'border-top-style': 'dashed'},
                    '.border-r-dashed': {'border-right-style': 'dashed'},
                    '.border-b-dashed': {'border-bottom-style': 'dashed'},
                    '.border-l-dashed': {'border-left-style': 'dashed'},
                    '.border-t-dotted': {'border-top-style': 'dotted'},
                    '.border-r-dotted': {'border-right-style': 'dotted'},
                    '.border-b-dotted': {'border-bottom-style': 'dotted'},
                    '.border-l-dotted': {'border-left-style': 'dotted'},
                    // GPU-composited utilities
                    '.will-change-transform': {'will-change': 'transform'},
                    '.will-change-opacity':   {'will-change': 'opacity'},
                    '.backface-hidden':       {'backface-visibility': 'hidden'},
                    '.gpu': {'transform': 'translateZ(0)', 'will-change': 'transform'},
                },
                ['responsive']
            );
        },
    ],
};
