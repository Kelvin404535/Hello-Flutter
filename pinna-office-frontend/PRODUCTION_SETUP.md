# PINNA Office Supplies - Production Frontend

A modern, responsive, and feature-rich e-commerce frontend for office supplies built with React 19, TypeScript, Tailwind CSS v4, and Framer Motion.

## Technology Stack

- **React 19** - Latest React with React Compiler support
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and interactions
- **Swiper.js** - Touch slider
- **Axios** - HTTP client
- **React Hook Form** - Performant forms
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

## Features

✨ **Modern UI/UX**
- Professional corporate design
- Responsive mobile-first approach
- Smooth animations and transitions
- Dark mode ready

🛍️ **E-Commerce**
- Product browsing and filtering
- Product search
- Shopping cart management
- Checkout process
- Order tracking

👤 **User Management**
- User authentication (login/register)
- User profile management
- Address management
- Order history

📱 **Responsive Design**
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly components
- Optimized for all devices

⚡ **Performance**
- Code splitting
- Lazy loading
- Image optimization
- Minimal bundle size

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Base UI components (Button, Card, Input, etc.)
│   ├── common/         # Common components (Hero, etc.)
│   ├── layout/         # Layout components (Navbar, Footer)
│   ├── product/        # Product-related components
│   └── forms/          # Form components
├── pages/              # Page components
│   ├── Home/
│   ├── Products/
│   ├── Services/
│   ├── About/
│   ├── Contact/
│   ├── Login/
│   ├── Product/        # Cart, Checkout
│   └── Admin/
├── layouts/            # Layout wrappers
├── context/            # React Context (Auth, Cart)
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── config/             # Configuration
├── styles/             # Global styles
└── routes/             # Routing configuration
```

## Getting Started

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pinna-office-frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your API base URL
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint:
```bash
npm run lint
```

## Component Library

### UI Components

All base UI components are available in `src/components/ui/`:

- **Button** - Action button with multiple variants
- **Card** - Container component with sections
- **Input** - Text input with validation
- **Textarea** - Multi-line text input
- **Select** - Dropdown select
- **Badge** - Status badge
- **Container** - Responsive container
- **Section** - Page section wrapper
- **Spinner** - Loading indicator
- **Modal** - Modal dialog

### Usage Example

```typescript
import { Button, Card, CardBody, Input } from '@/components/ui';

export default function Example() {
  return (
    <Card>
      <CardBody>
        <Input label="Email" type="email" />
        <Button variant="primary" size="lg">
          Submit
        </Button>
      </CardBody>
    </Card>
  );
}
```

## Custom Hooks

- `useApi` - Data fetching hook
- `usePagination` - Pagination management
- `useLocalStorage` - Local storage management
- `useDebounce` - Debounce values
- `useIntersectionObserver` - Intersection observer

## Context Providers

### AuthContext
Manages user authentication state and provides auth methods.

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### CartContext
Manages shopping cart state and operations.

```typescript
const { items, total, addItem, removeItem } = useCart();
```

## API Integration

All API calls are handled through service modules in `src/services/`:

- `productService` - Product operations
- `categoryService` - Category operations
- `orderService` - Order operations
- `authService` - Authentication operations
- `serviceService` - Service operations

### API Configuration

API base URL is configured in `src/config/constants.ts` and uses the `VITE_API_BASE_URL` environment variable.

## Styling

The project uses Tailwind CSS v4 with a utility-first approach. Custom styles are kept minimal and only used when necessary.

### Tailwind Configuration

Configure Tailwind in `tailwind.config.ts` for custom colors, fonts, and breakpoints.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting with React Router
- Lazy loading components
- Image optimization
- Memoization of expensive components
- Debounced search and filtering

## Future Enhancements

- [ ] Advanced product filtering
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Live chat support
- [ ] Analytics integration
- [ ] PWA support
- [ ] Dark mode
- [ ] Multi-language support

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, contact: support@pinna.com
