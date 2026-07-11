# Password Reset Implementation

## Overview
Complete password reset functionality has been implemented with a 3-step flow:
1. **Request Code** - User enters email
2. **Verify Code** - User enters 6-digit code from email
3. **Reset Password** - User creates new password

## Files Created/Modified

### New Files
- `src/pages/Auth/ForgotPassword.tsx` - Complete password reset page with multi-step form

### Modified Files
- `src/config/api.ts` - Added password reset endpoints
- `src/pages/Auth/Login.tsx` - Updated "Mot de passe oublié?" link
- `src/Routes.tsx` - Added `/forgot-password` route

## API Endpoints Added

```typescript
password: {
  forgot: '/password/forgot',           // POST { email }
  verifyCode: '/password/verify-code',  // POST { email, code }
  reset: '/password/reset',             // POST { email, code, password, password_confirmation }
}
```

## User Flow

### Step 1: Request Reset Code
- User clicks "Mot de passe oublié?" on login page
- Redirected to `/forgot-password`
- Enters email address
- Clicks "Envoyer le code"
- API: `POST /password/forgot` with `{ email }`
- Success: Moves to Step 2

### Step 2: Verify Code
- User receives 6-digit code via email
- Enters code in the form
- API: `POST /password/verify-code` with `{ email, code }`
- Success: Moves to Step 3
- Option to resend code (returns to Step 1)

### Step 3: Reset Password
- User enters new password
- User confirms new password
- Validation:
  - Passwords must match
  - Minimum 8 characters
- API: `POST /password/reset` with `{ email, code, password, password_confirmation }`
- Success: Shows success message

### Step 4: Success
- Success confirmation displayed
- "Se connecter" button redirects to login page

## Features

### Security
- 6-digit verification code
- Password confirmation required
- Minimum password length validation
- Password visibility toggle for both fields

### UX
- Multi-step form with clear progress
- Error handling with user-friendly messages
- Loading states on all buttons
- Responsive design matching login/register pages
- Consistent styling with app theme (#05835e)

### Design
- Matches existing login/register page design
- Left panel with branding (desktop)
- Mobile-friendly layout
- Smooth animations and transitions
- Font Awesome icons for password visibility

## Usage

### From Login Page
```tsx
// User clicks "Mot de passe oublié?"
<Link to="/forgot-password">Mot de passe oublié?</Link>
```

### Direct Access
Navigate to: `/forgot-password`

## Error Handling

The implementation handles:
- Invalid email format
- Email not found
- Invalid verification code
- Password mismatch
- Password too short
- Network errors
- API errors

All errors are displayed in a user-friendly format with appropriate messages in French.

## Testing Checklist

- [ ] Email submission works
- [ ] Code verification works
- [ ] Password reset works
- [ ] Error messages display correctly
- [ ] Loading states work
- [ ] Password visibility toggle works
- [ ] Form validation works
- [ ] Responsive design on mobile
- [ ] Navigation between steps works
- [ ] "Retour à la connexion" link works
- [ ] Success state redirects to login

## API Integration

The implementation uses the existing `apiClient` service which handles:
- Request/response formatting
- Error handling
- Token management (not needed for password reset)

Example API call:
```typescript
await apiClient.post(API.endpoints.password.forgot, { email });
```

## Styling

All styling uses:
- Tailwind CSS classes
- App primary color: `#05835e`
- Consistent with existing auth pages
- Responsive breakpoints: sm, md, lg
- Smooth transitions and hover effects
