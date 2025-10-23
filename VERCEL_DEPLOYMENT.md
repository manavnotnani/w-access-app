# 🚀 Vercel Deployment Guide - No Server Required!

## **How Vercel Works:**

**No separate server needed!** Vercel automatically converts your `/api/send-email.js` file into a serverless function.

## **🔧 Deployment Steps:**

### **1. Deploy to Vercel:**

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? w-chain-gate (or your choice)
# - Directory? ./
# - Override settings? No
```

**Option B: Using GitHub Integration**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Deploy automatically

### **2. Set Environment Variables in Vercel:**

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add the variable:**
   - **Name:** `ZEPTO_ZOHO_TOKEN`
   - **Value:** `Zoho-enczapikey your-actual-token-here`
   - **Environment:** Production, Preview, Development (all)

### **3. Update Frontend Environment:**

Update your `.env` file for production:
```env
# For production
VITE_API_URL=https://your-project.vercel.app/api/send-email

# For local development
# VITE_API_URL=http://localhost:3001/api/send-email
```

## **🎯 How It Works:**

### **Local Development:**
```
Frontend (localhost:8080) → Local Server (localhost:3001) → ZeptoMail API
```

### **Production (Vercel):**
```
Frontend (vercel.app) → Serverless Function (/api/send-email) → ZeptoMail API
```

## **✅ Benefits of Vercel Serverless:**

- 🚀 **No server management** - Vercel handles everything
- 🚀 **Auto-scaling** - Handles traffic spikes automatically
- 🚀 **Global edge network** - Fast worldwide
- 🚀 **Cost-effective** - Pay per use
- 🚀 **Zero maintenance** - No server to maintain

## **📊 File Structure:**

```
your-project/
├── api/
│   └── send-email.js          # Serverless function
├── src/
│   └── lib/
│       └── email.ts           # Frontend email service
├── vercel.json                # Vercel configuration
└── package.json
```

## **🔧 Environment Variables:**

**Local Development:**
```env
VITE_API_URL=http://localhost:3001/api/send-email
ZEPTO_ZOHO_TOKEN=Zoho-enczapikey your-token
```

**Production (Vercel):**
```env
VITE_API_URL=https://your-project.vercel.app/api/send-email
# ZEPTO_ZOHO_TOKEN is set in Vercel dashboard
```

## **🚀 Deployment Commands:**

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls
```

## **📧 Testing After Deployment:**

1. **Deploy to Vercel**
2. **Set environment variables**
3. **Update VITE_API_URL** to your Vercel domain
4. **Test email sending** - should work exactly like local!

Your email functionality will work seamlessly in production with zero server management! 🎉
