# Redirect Chain Tester

A web-based tool that tests and visualizes the complete redirect chain for any given URL, with the ability to simulate different device types (desktop, tablet, mobile) through custom headers.

## Features

-   🔍 **Complete Redirect Chain Visualization**: See every step in the redirect process
-   📱 **Device Simulation**: Test redirects as desktop, iPhone (iOS), Android phone, iPad (iOS), or Android tablet
-   ⚡ **Performance Metrics**: View response times for each redirect step
-   🔒 **SSL Certificate Detection**: Identify secure and insecure connections
-   📋 **One-Click Copy**: Copy any URL in the chain with a single click
-   🎨 **Clean, Modern UI**: Built with Tailwind CSS for a beautiful user experience
-   🚨 **Smart Warnings**: Detection for redirect loops and excessive redirects
-   📊 **Detailed Headers**: View response headers for each step (collapsible)

## Tech Stack

-   **Framework**: Next.js 14+ (App Router)
-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Icons**: Lucide React
-   **HTTP Client**: Native fetch API

## Getting Started

### Prerequisites

-   Node.js 18+ installed
-   npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd redirect_tester
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser (or check the terminal for the actual port if 3000 is already in use)

## Usage

1. Enter any URL in the input field (with or without protocol)
2. Select the device type you want to simulate:
    - Desktop (Windows/Mac/Linux)
    - iPhone (iOS)
    - Android Phone
    - iPad (iOS)
    - Android Tablet
3. Click the search button or press Enter
4. View the complete redirect chain with detailed information

## API Endpoint

### POST /api/test-redirect

Tests a URL and returns the complete redirect chain.

**Request Body:**

```typescript
{
  url: string;
  device: 'desktop' | 'mobile-ios' | 'mobile-android' | 'tablet-ios' | 'tablet-android';
  maxRedirects?: number; // Default: 10
  timeout?: number; // Default: 30000ms
}
```

**Response:**

```typescript
{
  success: boolean;
  data?: {
    chain: RedirectStep[];
    finalUrl: string;
    totalRedirects: number;
    totalTime: number;
    hasLoop: boolean;
    warnings: string[];
  };
  error?: string;
}
```

## Security Features

-   Rate limiting (10 requests per minute per IP)
-   SSRF protection (blocks internal/private IPs)
-   Input validation and sanitization
-   Content Security Policy headers
-   Maximum response size limits

## Building for Production

```bash
npm run build
npm start
```

## License

MIT
