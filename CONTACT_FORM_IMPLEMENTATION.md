# Contact Form API Integration

## Overview
The contact form on the Home page has been integrated with the backend API to send contact messages.

## Files Modified

### 1. `src/config/api.ts`
Added contact endpoint:
```typescript
contact: '/contact', // POST { full_name, phone, email, subject, message }
```

### 2. `src/pages/Home/index.tsx`
Complete contact form integration with:
- State management for form fields
- Form submission handler
- Success/error message display
- Loading states
- Form reset after successful submission

## API Integration

### Endpoint
```
POST /api/contact
```

### Request Payload
```json
{
  "full_name": "Jean Dupont",
  "phone": "+221771234567",
  "email": "jean.dupont@example.com",
  "subject": "Demande d'information",
  "message": "Bonjour, je souhaite obtenir plus d'informations..."
}
```

### Success Response (200)
```json
{
  "success": true,
  "message": "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."
}
```

### Error Response (422)
```json
{
  "success": false,
  "message": "Données invalides",
  "errors": {
    "email": ["Le champ email doit être une adresse email valide."],
    "message": ["Le champ message est requis."]
  }
}
```

## Implementation Details

### State Management
```typescript
const [contactForm, setContactForm] = useState({
  full_name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
});
const [contactLoading, setContactLoading] = useState(false);
const [contactSuccess, setContactSuccess] = useState(false);
const [contactError, setContactError] = useState<string | null>(null);
```

### Form Handler
```typescript
const handleContactSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setContactLoading(true);
  setContactError(null);
  setContactSuccess(false);

  try {
    await apiClient.post(API.endpoints.contact, contactForm);
    setContactSuccess(true);
    // Reset form
    setContactForm({
      full_name: '',
      phone: '',
      email: '',
      subject: '',
      message: '',
    });
    // Clear success message after 5 seconds
    setTimeout(() => setContactSuccess(false), 5000);
  } catch (err: any) {
    setContactError(
      err?.message || 'Une erreur est survenue. Veuillez réessayer.'
    );
  } finally {
    setContactLoading(false);
  }
};
```

### Input Handler
```typescript
const handleContactInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setContactForm((prev) => ({ ...prev, [name]: value }));
  // Clear error when user starts typing
  if (contactError) setContactError(null);
};
```

## Features

### Form Fields
1. **Nom complet** (full_name) - Required text input
2. **Numéro de téléphone** (phone) - Required tel input
3. **Adresse mail** (email) - Required email input
4. **Sujet** (subject) - Required text input
5. **Message** (message) - Required textarea

### User Feedback
- **Success Message**: Green banner with checkmark icon
  - "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."
  - Auto-dismisses after 5 seconds
  
- **Error Message**: Red banner with X icon
  - Displays API error message or generic error
  - Dismisses when user starts typing

- **Loading State**: 
  - Button disabled during submission
  - Text changes to "Envoi en cours..."
  - Opacity reduced to 60%

### Form Behavior
- All fields are required
- Form resets after successful submission
- Error clears when user starts typing
- Success message auto-dismisses after 5 seconds
- Button disabled during submission

## Styling
- Consistent with existing Home page design
- Green (#05835e) theme for success states
- Red theme for error states
- Smooth animations for messages
- Responsive design for all screen sizes

## Testing Checklist

- [ ] Form submits successfully with valid data
- [ ] Success message displays after submission
- [ ] Form resets after successful submission
- [ ] Error message displays on API error
- [ ] Error message clears when typing
- [ ] Success message auto-dismisses after 5 seconds
- [ ] Loading state shows during submission
- [ ] Button disabled during submission
- [ ] All fields are required
- [ ] Email validation works
- [ ] Phone field accepts phone numbers
- [ ] Textarea allows multiline input
- [ ] Responsive design works on mobile/tablet
