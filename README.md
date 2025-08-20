# BySkies - Your plans, guided by skies ☀️🌧️

> **A premium weather application with intelligent activity suggestions**

BySkies transforms weather data into actionable insights, helping you make perfect plans based on sky conditions. More than just a weather app – it's your personal meteorological planning assistant.

![BySkies App](https://via.placeholder.com/800x400/0891b2/ffffff?text=BySkies+-+Premium+Weather+App)

## ✨ Features

### 🌤️ **Smart Weather Intelligence**
- Real-time weather conditions with beautiful visualizations
- 5-day detailed forecasts with trend analysis
- Air quality monitoring with health recommendations
- Severe weather alerts and planning disruptions

### 🎯 **Intelligent Activity Suggestions**
- AI-powered recommendations based on weather conditions
- Confidence scoring for activity suitability  
- Time-based planning with optimal activity windows
- Personalized suggestions for outdoor activities

### 🎨 **Premium Design**
- Stunning glassmorphism UI with smooth animations
- Sky-themed design system with beautiful gradients
- Responsive design that works on all devices
- Dark/light mode support with system preference detection

### 🚀 **Modern Technology Stack**
- **Next.js 15** - Latest React framework with Turbopack
- **TypeScript** - Full type safety throughout
- **Zustand** - Lightweight state management
- **React Query** - Smart data fetching and caching
- **Framer Motion** - Delightful animations
- **Tailwind CSS** - Utility-first styling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn 1.22+
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bySkies
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example apps/web/.env.local
   # Edit apps/web/.env.local and add your OpenWeatherMap API key
   ```

4. **Start the development server**
   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🏗️ Project Architecture

This is a **Turborepo monorepo** with the following structure:

```
bySkies/
├── apps/
│   └── web/                 # Next.js application
│       ├── app/             # App router pages
│       ├── components/      # React components
│       ├── lib/             # Utilities and services
│       └── public/          # Static assets
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── types/               # TypeScript type definitions
│   ├── eslint-config/       # ESLint configurations
│   ├── typescript-config/   # TypeScript configurations
│   └── tailwind-config/     # Tailwind CSS config
└── turbo.json              # Turborepo configuration
```

### Key Features Implementation

- **State Management**: Zustand store with type-safe selectors
- **API Integration**: React Query for smart caching and background updates
- **Weather API**: Complete OpenWeatherMap API integration
- **Activity Engine**: Intelligent suggestion algorithm with confidence scoring
- **Location Services**: Geolocation API with search functionality
- **Error Handling**: Comprehensive error boundaries and loading states

## 🎨 Design System

BySkies features a custom design system inspired by sky and weather:

- **Colors**: Sky-inspired gradients (blue, indigo, purple, amber)
- **Glassmorphism**: Translucent components with backdrop blur
- **Animations**: Smooth transitions and micro-interactions
- **Typography**: Clean, readable fonts with perfect spacing
- **Icons**: Weather-specific icons with state indicators

## 🌐 API Integration

### Weather Data Sources
- **Current Weather**: Real-time conditions and measurements  
- **5-Day Forecast**: Detailed hourly and daily predictions
- **Air Quality**: AQI levels with health recommendations
- **Geocoding**: Location search and reverse geocoding

### Data Flow
1. User selects location (search or GPS)
2. Weather APIs called in parallel via React Query
3. Data processed through intelligent suggestion engine
4. UI updates with smooth animations and loading states

## 🧠 Activity Suggestion Engine

The intelligent activity engine analyzes multiple factors:

- **Weather Conditions**: Temperature, wind, precipitation, clouds
- **Air Quality**: AQI levels and pollutant concentrations  
- **Time Analysis**: Daylight hours and activity timing
- **Trend Detection**: Weather pattern changes and disruptions
- **Confidence Scoring**: Algorithm certainty for each recommendation

### Supported Activities
- 🏃‍♂️ Running & Jogging
- 🚴‍♂️ Cycling & Biking  
- 🍽️ Outdoor Dining
- 📸 Photography
- 🧺 Picnics
- 🥾 Hiking & Walking

## 📱 Development

### Available Scripts

```bash
# Development
yarn dev              # Start development server
yarn build            # Build for production
yarn start           # Start production server

# Code Quality
yarn lint            # Run ESLint
yarn check-types     # TypeScript type checking
yarn format          # Format code with Prettier

# Workspace Commands
yarn build           # Build all packages
yarn lint            # Lint all packages
yarn check-types     # Type check all packages
```

### Environment Variables

Create `.env.local` in the `apps/web` directory:

```bash
OPENWEATHER_API_KEY=your_api_key_here
NODE_ENV=development
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Other Platforms
BySkies works on any platform that supports Next.js:
- Netlify
- AWS Amplify  
- Railway
- Digital Ocean App Platform

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeatherMap** for comprehensive weather data
- **Turborepo** for excellent monorepo tooling
- **Vercel** for hosting and deployment
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for beautiful animations

---

**Built with ❤️ for better weather planning**

*BySkies - Your plans, guided by skies*