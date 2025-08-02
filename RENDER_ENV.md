# 🔧 Render Environment Variables

## Backend Environment Variables

Copy these into your Render backend web service environment variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/wellness-platform?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-min-32-characters-long
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-name.onrender.com
```

## Frontend Environment Variables

Copy this into your Render frontend static site environment variables:

```
VITE_API_URL=https://your-backend-name.onrender.com/api
```

## 🔑 How to Generate Secure JWT Secret

Run this in your terminal to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use an online generator: https://generate-random.org/api-key-generator

## 📝 MongoDB Atlas Connection String Format

```
mongodb+srv://<username>:<password>@<cluster-name>.<random>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

Replace:
- `<username>`: Your MongoDB Atlas database user
- `<password>`: Your database user password
- `<cluster-name>`: Your cluster name
- `<random>`: Random characters assigned by Atlas
- `<database-name>`: `wellness-platform`

## ⚠️ Important Notes

1. **No quotes** around environment variable values in Render
2. **No spaces** around the `=` sign
3. **Case sensitive** - match exactly as shown
4. **FRONTEND_URL** should match your actual frontend domain
5. **VITE_API_URL** should match your actual backend domain

## 🔄 After Setting Environment Variables

1. Click "Deploy latest commit" to restart with new variables
2. Check logs for any connection errors
3. Test your application endpoints
