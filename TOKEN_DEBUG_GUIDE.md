# 🔑 ZeptoMail Token Debug Guide

## **Issue: Invalid API Token**

The error `"Invalid API Token found"` means your ZeptoMail token is either:
1. **Wrong format**
2. **Expired**
3. **Incorrect value**

## **🔍 Check Your Token:**

### **1. Token Format Should Be:**
```
Zoho-enczapikey [your-actual-token]
```

### **2. Common Issues:**

**❌ Wrong format:**
```env
# Wrong - missing prefix
ZEPTO_ZOHO_TOKEN=your-actual-token-here

# Wrong - extra spaces
ZEPTO_ZOHO_TOKEN=Zoho-enczapikey  your-actual-token-here
```

**✅ Correct format:**
```env
ZEPTO_ZOHO_TOKEN=Zoho-enczapikey your-actual-token-here
```

## **🔧 How to Get the Correct Token:**

### **1. Go to ZeptoMail Dashboard:**
- Visit [https://www.zeptomail.com/](https://www.zeptomail.com/)
- Login to your account

### **2. Get API Token:**
- Go to **Settings** → **API Keys**
- Copy the **full token** (including the `Zoho-enczapikey` prefix)

### **3. Set in .env file:**
```env
ZEPTO_ZOHO_TOKEN=Zoho-enczapikey your-actual-token-here
```

## **📊 Debug Steps:**

1. **Check server logs** for token info:
   ```
   🔑 Token exists: true
   🔑 Token length: 25
   🔑 Token starts with: Zoho-encza...
   ```

2. **Verify token format:**
   - Should start with `Zoho-enczapikey`
   - Should be about 25+ characters long
   - No extra spaces or quotes

3. **Test with a simple request:**
   ```bash
   curl -X POST https://api.zeptomail.in/v1.1/email \
     -H "Authorization: Zoho-enczapikey YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"from":{"address":"test@example.com","name":"Test"},"to":[{"email_address":{"address":"test@example.com","name":"Test"}}],"subject":"Test","htmlbody":"Test"}'
   ```

## **🚀 Quick Fix:**

1. **Get fresh token** from ZeptoMail dashboard
2. **Update .env file** with correct format
3. **Restart server:**
   ```bash
   npm run dev:server
   ```
4. **Test email sending**

The token should work immediately once formatted correctly! 🔑
