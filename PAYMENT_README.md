# Global Climate Solution - Payment System

## 🚀 **Payment System Overview**

Complete Midtrans payment integration for Pro Plan subscriptions.

### ✅ **Features:**
- Frontend-only payment processing
- Multiple payment methods (Credit Card, Bank Transfer, E-Wallet)
- Pro Plan with 3-month minimum policy
- Automatic discount tiers (5%, 10%, 15%)
- Account deactivation after 3 free logins
- Email notifications via EmailJS
- Subscription management

### 🔧 **Configuration:**

1. **Environment Setup:**
   ```bash
   cp config.env .env
   # Edit .env with your actual Midtrans credentials
   ```

2. **Midtrans Credentials:**
   - Merchant ID: `G849736062` 
   - Client Key: `Mid-client-__InAmV74L6ujMcF`
   - Server Key: Replace in .env file

3. **Database:**
   - Supabase integration for user management
   - Subscription tracking and validation
   - Session management

### 🎯 **Usage:**

```javascript
// Initialize payment
PaymentSystem.processPayment({
  duration: 3,
  customerName: 'John Doe',
  customerEmail: 'john@example.com'
});

// Check subscription status
const status = PaymentSystem.checkSubscription();
```

### 🛡️ **Security:**
- No sensitive credentials in public code
- Environment-based configuration
- GitHub-safe implementation
