# NEXPANDO Event Management - Design System

## 🎨 Tổng quan

Design system mới của NEXPANDO Event Management được thiết kế để tạo ra một giao diện chuyên nghiệp, hiện đại và nhất quán cho toàn bộ ứng dụng.

## 🚀 Tính năng chính

### ✨ Design System
- **Color Palette**: Bộ màu chuyên nghiệp với primary, secondary, accent, warning, danger
- **Typography**: Font Inter và Poppins với hierarchy rõ ràng
- **Spacing**: Hệ thống spacing nhất quán
- **Shadows**: Soft, medium, large shadows cho depth
- **Animations**: Smooth transitions và micro-interactions

### 🎯 Components
- **Buttons**: Primary, secondary, accent, danger, ghost variants
- **Cards**: Standard, hover effects, gradient backgrounds
- **Forms**: Input fields, labels, error states
- **Navigation**: Sidebar, nav links, active states
- **Alerts**: Success, warning, error notifications
- **Stats Cards**: Dashboard statistics với icons và trends

## 🛠️ Cài đặt và Sử dụng

### 1. Tailwind Configuration
```javascript
// tailwind.config.js đã được cập nhật với:
- Custom color palette
- Typography system
- Spacing scale
- Shadow system
- Animation keyframes
```

### 2. Global Styles
```css
// index.css đã được cập nhật với:
- Google Fonts import
- Base styles
- Component classes
- Utility classes
```

### 3. Component Classes

#### Buttons
```jsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-accent">Accent Button</button>
<button className="btn-danger">Danger Button</button>
<button className="btn-ghost">Ghost Button</button>
```

#### Cards
```jsx
<div className="card p-6">Standard Card</div>
<div className="card-hover p-6">Hover Effect Card</div>
```

#### Forms
```jsx
<label className="form-label">Label</label>
<input className="form-input" placeholder="Input" />
<p className="form-error">Error message</p>
```

#### Navigation
```jsx
<a className="nav-link">Navigation Link</a>
<a className="nav-link-active">Active Link</a>
```

## 🎨 Color System

### Primary Colors
- `primary-50` to `primary-950`: Blue color palette
- Main: `primary-600` (#3b82f6)

### Secondary Colors  
- `secondary-50` to `secondary-950`: Gray color palette
- Main: `secondary-600` (#64748b)

### Accent Colors
- `accent-50` to `accent-950`: Green color palette
- Main: `accent-600` (#22c55e)

### Warning Colors
- `warning-50` to `warning-950`: Yellow/Orange palette
- Main: `warning-600` (#d97706)

### Danger Colors
- `danger-50` to `danger-950`: Red color palette
- Main: `danger-600` (#dc2626)

## 📱 Responsive Design

Design system được tối ưu cho:
- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+
- **Large Desktop**: 1280px+

## 🎭 Animations

### Built-in Animations
```css
.animate-fade-in      /* Fade in effect */
.animate-slide-in     /* Slide in from left */
.animate-bounce-soft  /* Soft bounce */
.animate-pulse-soft   /* Soft pulse */
```

### Custom Animations
```css
.animate-slide-in-left
.animate-slide-in-right
.animate-slide-in-top
.animate-slide-in-bottom
```

## 🔧 Utilities

### Glass Effect
```jsx
<div className="glass">Glass morphism effect</div>
```

### Gradient Backgrounds
```jsx
<div className="gradient-primary">Primary gradient</div>
<div className="gradient-secondary">Secondary gradient</div>
<div className="gradient-accent">Accent gradient</div>
```

### Gradient Text
```jsx
<h1 className="gradient-text">Gradient text</h1>
```

## 📊 Demo Components

Xem demo đầy đủ tại: `/design-system`

### Available Demo Components:
- ButtonDemo
- CardDemo  
- StatsDemo
- FormDemo
- NavigationDemo
- AlertDemo

## 🎯 Best Practices

### 1. Consistency
- Sử dụng design tokens từ Tailwind config
- Tuân thủ spacing scale
- Sử dụng color palette nhất quán

### 2. Accessibility
- Đảm bảo contrast ratio phù hợp
- Sử dụng focus states
- Semantic HTML structure

### 3. Performance
- Sử dụng CSS classes thay vì inline styles
- Tối ưu animations
- Lazy load components khi cần

## 🔄 Migration Guide

### Từ design cũ sang mới:

1. **Colors**: Thay thế `gray-*` bằng `secondary-*`
2. **Buttons**: Sử dụng `btn-*` classes
3. **Cards**: Sử dụng `card` và `card-hover`
4. **Forms**: Sử dụng `form-*` classes
5. **Spacing**: Sử dụng spacing scale mới

### Ví dụ Migration:
```jsx
// Cũ
<div className="bg-gray-100 p-4 rounded-lg shadow">
  <button className="bg-blue-500 text-white px-4 py-2 rounded">
    Button
  </button>
</div>

// Mới
<div className="card p-4">
  <button className="btn-primary">
    Button
  </button>
</div>
```

## 🚀 Next Steps

1. **Component Library**: Mở rộng thêm components
2. **Dark Mode**: Thêm dark theme support
3. **Themes**: Tạo multiple color themes
4. **Documentation**: Tạo Storybook documentation
5. **Testing**: Thêm visual regression tests

## 📞 Support

Nếu có câu hỏi về design system, vui lòng:
1. Kiểm tra demo tại `/design-system`
2. Xem code examples trong components
3. Tham khảo Tailwind documentation
4. Liên hệ team development

---

**NEXPANDO Event Management** - Professional Design System v1.0
