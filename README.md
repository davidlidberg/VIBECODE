# Wpicks - Sports Bet Rating App

Wpicks is a mobile app that instantly rates sports bets with a bold W or L verdict, combining mathematical analysis with humor and sports culture.

## App Overview

### Core Concept
Users input any sports bet (via text or screenshot), and the app provides an instant verdict with three key ratings:
- **EV Rating**: Math-based expected value assessment (0-100 score)
- **Player History**: Recent performance trend (hot/cold/neutral)
- **Vibe/Aura**: Fun, bold personality assessment with emoji

### Key Features
- **Text or Screenshot Input**: Flexible bet submission
- **AI-Powered Analysis**: Uses OpenAI GPT-4o for intelligent bet evaluation
- **Shareable Verdict Cards**: Beautiful, social media-ready verdict cards
- **CPA Offer Integration**: "Unlock 3 Real +EV Picks" signup flow
- **Bold, Sports-Culture Design**: Dark theme with green/red verdict colors

## Tech Stack

- **Framework**: Expo SDK 53 with React Native 0.76.7
- **Navigation**: React Navigation (Native Stack)
- **State Management**: Zustand with AsyncStorage persistence
- **Styling**: NativeWind (TailwindCSS for React Native)
- **AI Integration**: OpenAI GPT-4o via prebuilt chat service
- **Icons**: Expo Vector Icons (Ionicons)
- **Sharing**: expo-sharing for social media sharing
- **Image Handling**: expo-image-picker for screenshot uploads

## Project Structure

```
/home/user/workspace/
├── src/
│   ├── screens/
│   │   ├── InputScreen.tsx       # Bet input with text/screenshot
│   │   ├── VerdictScreen.tsx     # Verdict display with share
│   │   └── SignupScreen.tsx      # CPA offer signup form
│   ├── navigation/
│   │   ├── AppNavigator.tsx      # Stack navigation setup
│   │   └── types.ts              # Navigation type definitions
│   ├── state/
│   │   └── appStore.ts           # Zustand store for verdicts
│   ├── utils/
│   │   ├── analyzeBet.ts         # AI bet analysis logic
│   │   └── cn.ts                 # Tailwind class merger
│   └── api/
│       ├── chat-service.ts       # Prebuilt AI integration
│       ├── openai.ts             # OpenAI client
│       └── ...                   # Other API utilities
├── App.tsx                       # Root component
└── README.md                     # This file
```

## User Flow

1. **Input Screen**: User enters bet text or uploads screenshot
2. **AI Analysis**: App analyzes bet using GPT-4o with custom sports betting prompt
3. **Verdict Screen**: Displays animated W/L card with three mini reasons
4. **Share**: User can share verdict card to social media
5. **CTA**: "Unlock 3 Real +EV Picks" button leads to signup
6. **Signup Screen**: Email/phone collection for CPA offer

## Design Philosophy

- **Bold & Controversial**: Confident verdicts that spark conversation
- **Sports Culture**: Uses language and emojis from betting/sports communities
- **Fast Interaction**: Quick analysis and instant results
- **Shareable**: Beautiful cards designed for social media
- **Dark Theme**: Black background with green (W) and red (L) accent colors

## State Management

The app uses Zustand with two concerns:
- **Persisted**: Verdict history (last 50 verdicts)
- **Ephemeral**: Current analysis state and loading flags

## AI Prompt Strategy

The bet analysis uses a custom prompt that instructs GPT-4o to:
- Be brutally honest and entertaining
- Provide structured JSON output
- Include math-based EV rating (0-100)
- Assess player/team recent performance
- Add bold, shareable personality assessment
- Use sports culture language and emojis

## Sharing Functionality

Verdict cards are captured as images using `react-native-view-shot` and shared via `expo-sharing`. The cards include:
- Large W or L verdict with gradient background
- Bet description
- Three mini reasons with icons
- Wpicks branding

## CPA Offer Integration

The signup screen collects:
- Email address
- Phone number
- Consent for SMS/email updates
- Legal disclaimer (21+, gambling awareness)

In production, this data would be sent to your CPA partner endpoint.

## Development Notes

- All AI functionality uses prebuilt services in `/src/api/`
- Image analysis supported via GPT-4o vision capabilities
- Type-safe navigation with TypeScript
- Environment variables accessed via `process.env.EXPO_PUBLIC_VIBECODE_*`
- Expo dev server runs automatically on port 8081

## Future Enhancements

- Verdict history screen
- Betting unit tracking
- Win/loss statistics
- Social features (friends, leaderboards)
- Push notifications for +EV picks
- More sports coverage
- Live odds integration
