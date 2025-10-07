# 🌙 Dark Mode Guide - NEXPANDO Event Management

## ✨ Tính năng Dark Mode

Ứng dụng NEXPANDO Event Management giờ đây hỗ trợ đầy đủ tính năng chuyển đổi giao diện sáng/tối (Dark Mode) với trải nghiệm người dùng mượt mà và chuyên nghiệp.

## 🚀 Cách sử dụng

### 1. Theme Toggle Components

#### Simple Toggle
```jsx
import ThemeToggle from './components/common/ThemeToggle';

<ThemeToggle variant="simple" size="default" />
```

#### Dropdown Toggle
```jsx
<ThemeToggle variant="dropdown" size="default" />
```

### 2. Theme Context

```jsx
import { useTheme } from './contexts/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme, isDark, isLight } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {isDark ? 'light' : 'dark'} mode
      </button>
    </div>
  );
};
```

## 🎨 Theme Variants

### 1. Simple Toggle
- **Vị trí**: Góc trên bên phải trang đăng nhập
- **Chức năng**: Click để chuyển đổi theme
- **Animation**: Smooth transition với ripple effect

### 2. Dropdown Toggle
- **Vị trí**: Header của dashboard
- **Chức năng**: Hover để hiện menu với 3 options:
  - Light Mode
  - Dark Mode  
  - System (theo system preference)

### 3. Animated Toggle
- **Hiệu ứng**: Background gradient animation
- **Icons**: Sun/Moon với smooth transition
- **Ripple**: Click effect

## 🎯 Vị trí Theme Toggle

### 1. Login Page
- **Vị trí**: Góc trên bên phải
- **Variant**: Simple
- **Chức năng**: Quick toggle

### 2. Admin Dashboard
- **Vị trí**: Header, bên cạnh notification
- **Variant**: Simple
- **Chức năng**: Easy access

### 3. Member Dashboard
- **Vị trí**: Header, bên cạnh notification
- **Variant**: Simple
- **Chức năng**: Easy access

### 4. Design System Demo
- **Vị trí**: Góc trên bên phải
- **Variant**: Dropdown
- **Chức năng**: Full theme options

## 🌈 Color System

### Light Mode Colors
```css
/* Background */
--bg-primary: #f8fafc
--bg-secondary: #ffffff
--bg-card: #ffffff

/* Text */
--text-primary: #0f172a
--text-secondary: #475569
--text-muted: #94a3b8

/* Borders */
--border-primary: #f1f5f9
--border-secondary: #e2e8f0
```

### Dark Mode Colors
```css
/* Background */
--bg-primary: #0f172a
--bg-secondary: #1e293b
--bg-card: #1e293b

/* Text */
--text-primary: #f8fafc
--text-secondary: #cbd5e1
--text-muted: #64748b

/* Borders */
--border-primary: #334155
--border-secondary: #475569
```

## 🔧 Technical Implementation

### 1. Theme Context
```jsx
// contexts/ThemeContext.jsx
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
};
```

### 2. Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ... rest of config
};
```

### 3. CSS Classes
```css
/* Light mode (default) */
.card {
  background-color: white;
  color: #0f172a;
}

/* Dark mode */
.dark .card {
  background-color: #1e293b;
  color: #f8fafc;
}
```

## 📱 Responsive Design

### Mobile
- Theme toggle ở góc trên bên phải
- Touch-friendly size
- Smooth animations

### Tablet
- Optimal positioning
- Clear visual feedback
- Easy access

### Desktop
- Hover effects
- Dropdown menus
- Keyboard navigation

## 🎭 Animations & Transitions

### 1. Theme Switch Animation
```css
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.card {
  transition: all 0.3s ease;
}
```

### 2. Toggle Button Animation
```css
.theme-toggle {
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  transform: scale(1.05);
}
```

### 3. Background Blobs
```css
.blob {
  transition: all 0.3s ease;
}

.dark .blob {
  background-color: var(--dark-color);
}
```

## 🔄 Theme Persistence

### 1. LocalStorage
- Theme được lưu trong `localStorage`
- Persist across browser sessions
- Key: `'theme'`

### 2. System Preference
- Tự động detect system theme
- Fallback khi không có saved preference
- Respect user's OS settings

### 3. Default Behavior
- Light mode là default
- Smooth fallback
- No flash of wrong theme

## 🎨 Component Styling

### 1. Cards
```jsx
<div className="card dark:bg-secondary-800 dark:border-secondary-700">
  <h3 className="text-secondary-900 dark:text-secondary-100">
    Card Title
  </h3>
  <p className="text-secondary-600 dark:text-secondary-400">
    Card content
  </p>
</div>
```

### 2. Buttons
```jsx
<button className="btn-primary hover:bg-primary-700 dark:hover:bg-primary-600">
  Primary Button
</button>
```

### 3. Forms
```jsx
<input className="form-input dark:bg-secondary-700 dark:border-secondary-600 dark:text-secondary-100" />
```

## 🚀 Performance

### 1. CSS Optimization
- Minimal CSS overhead
- Efficient selectors
- Smooth transitions

### 2. JavaScript Performance
- Lightweight context
- Minimal re-renders
- Efficient state management

### 3. Bundle Size
- No additional dependencies
- Tree-shakeable
- Optimized build

## 🎯 Best Practices

### 1. Consistent Usage
- Sử dụng theme context consistently
- Avoid hardcoded colors
- Use semantic color names

### 2. Accessibility
- Proper contrast ratios
- Focus states
- Screen reader support

### 3. User Experience
- Smooth transitions
- Clear visual feedback
- Intuitive controls

## 🔍 Testing

### 1. Manual Testing
- Test all theme switches
- Verify persistence
- Check all components

### 2. Browser Testing
- Chrome, Firefox, Safari
- Mobile browsers
- Different screen sizes

### 3. Accessibility Testing
- Screen readers
- Keyboard navigation
- High contrast mode

## 🎉 Demo

### 1. Live Demo
- Truy cập `/design-system`
- Test theme toggle
- Explore all components

### 2. Login Page
- `/login` - Simple toggle
- Background animations
- Form styling

### 3. Dashboard
- `/admin` - Admin dashboard
- `/member` - Member dashboard
- Header toggles

## 📞 Support

### 1. Common Issues
- Theme not persisting: Check localStorage
- Flash of wrong theme: Check CSS loading
- Toggle not working: Check context provider

### 2. Customization
- Modify color palette
- Add new variants
- Custom animations

### 3. Integration
- Add to new components
- Extend functionality
- Custom themes

---

**NEXPANDO Event Management** - Dark Mode v1.0 🌙✨
