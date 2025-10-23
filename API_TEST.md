# 🔧 API Endpoint Test

## **Test Your API Endpoint:**

### **1. Check if API is accessible:**
```bash
curl -X POST https://w-access.xyz/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","code":"123456","subject":"Test"}'
```

### **2. Check CORS preflight:**
```bash
curl -X OPTIONS https://w-access.xyz/api/send-email \
  -H "Origin: https://www.w-access.xyz" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

## **🔍 Common Issues:**

### **Issue 1: Domain Mismatch**
- Your site: `https://www.w-access.xyz` (with www)
- API: `https://w-access.xyz/api/send-email` (without www)
- **Fix:** Use consistent domain (with or without www)

### **Issue 2: Vercel Function Not Deployed**
- Check if `/api/send-email.js` exists in your Vercel deployment
- Check Vercel function logs for errors

### **Issue 3: Environment Variables**
- Ensure `ZEPTO_ZOHO_TOKEN` is set in Vercel dashboard
- Check Vercel function logs for token errors

## **🚀 Quick Fix:**

Update your environment variable to use the correct domain:

```env
# In your .env file
VITE_API_URL=https://www.w-access.xyz/api/send-email
```

Or ensure both your site and API use the same domain (with or without www).
