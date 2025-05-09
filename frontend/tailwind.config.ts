import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		fontFamily: {
			calendas: ["Calendas Plus", "sans-serif"],
			overusedGrotesk: ["Overused Grotesk", "sans-serif"],
			cotham: ["Cotham Sans"],
			VT323: ["VT323"],
			azeretMono: ["Azeret Mono"],
			notoSansSymbols: ["Noto Sans Symbols"],
		  },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		  animation: {
			flip: "flip 6s infinite steps(2, end)",
			rotate: "rotate 3s linear infinite both",
			"accordion-down": "accordion-down 0.2s ease-out",
			"accordion-up": "accordion-up 0.2s ease-out",
			circling: "circling calc(var(--circling-duration)*1s) linear infinite",
			'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
        	'star-movement-top': 'star-movement-top linear infinite alternate',
			"background-gradient":
			  "background-gradient var(--background-gradient-speed, 15s) cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite",
		  },
		  keyframes: {
			'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        },
			flip: {
				to: {
				  transform: "rotate(360deg)",
				},
			  },
			  rotate: {
				to: {
				  transform: "rotate(90deg)",
				},
			  },
			"accordion-down": {
			  from: { height: "0" },
			  to: { height: "var(--radix-accordion-content-height)" },
			},
			"accordion-up": {
			  from: { height: "var(--radix-accordion-content-height)" },
			  to: { height: "0" },
			},
			circling: {
			  "0%": {
				transform:
				  "rotate(calc(var(--circling-offset) * 1deg)) translate(calc(var(--circling-radius) * 1px), 0) rotate(calc(var(--circling-offset) * -1deg))",
			  },
			  "100%": {
				transform:
				  "rotate(calc(360deg + (var(--circling-offset) * 1deg))) translate(calc(var(--circling-radius) * 1px), 0) rotate(calc(-360deg + (var(--circling-offset) * -1deg)))",
			  },
			},
			"background-gradient": {
			  "0%, 100%": {
				transform: "translate(0, 0)",
				animationDelay: "var(--background-gradient-delay, 0s)",
			  },
			  "20%": {
				transform:
				  "translate(calc(100% * var(--tx-1, 1)), calc(100% * var(--ty-1, 1)))",
			  },
			  "40%": {
				transform:
				  "translate(calc(100% * var(--tx-2, -1)), calc(100% * var(--ty-2, 1)))",
			  },
			  "60%": {
				transform:
				  "translate(calc(100% * var(--tx-3, 1)), calc(100% * var(--ty-3, -1)))",
			  },
			  "80%": {
				transform:
				  "translate(calc(100% * var(--tx-4, -1)), calc(100% * var(--ty-4, -1)))",
			  },
			},
		  },
  	}
	

  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
