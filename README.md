# EcoFriend Second hand marketplace

 the EcoFriend application built with Express, Sequelize, and PostgreSQL.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Refresh Tokens**: Secure token refresh mechanism
- **Email Verification**: Email verification system for new users
- **Password Reset**: Secure password reset via email
- **Rate Limiting**: Protection against brute force attacks
- **Profile Management**: Complete user profile management
- **Marketplace**: Buy/sell/donate eco-friendly items
- **Payment Processing**: Stripe integration for secure payments
- **Indian Payments**: Razorpay integration with UPI, netbanking, cards, wallets
- **GST Calculation**: Automatic GST calculation for Indian market
- **EMI Options**: Easy monthly installments for high-value items
- **Quick Donations**: Pre-set amounts (₹100, ₹500, ₹1000) for NGOs
- **Swap System**: Item-to-item exchange functionality
- **Rental System**: Item borrowing and rental management
- **NGO Integration**: Verified organizations for donations
- **Eco Impact Tracking**: Environmental impact measurement and scoring
- **Green Score System**: Gamified environmental impact scoring with bonuses
- **Analytics Dashboard**: Personal and community analytics with insights
- **Achievement System**: Badge-based achievement system with progress tracking
- **Transaction Management**: Complete transaction lifecycle
- **Database**: PostgreSQL with Sequelize ORM
- **File Uploads**: Multer for handling image uploads
- **Security**: CORS enabled, input validation, error handling
- **API Endpoints**: RESTful API for all marketplace features
- **Environment Configuration**: Environment-based configuration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **CORS**: cors
- **Environment**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or pnpm

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecofriend-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ecofriend_db
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRY=24h
   FRONTEND_URL=http://localhost:3000
   ```

4. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE ecofriend_db;
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user (with email verification)
- `POST /api/auth/login` - Login user (returns access + refresh tokens)
- `POST /api/auth/logout` - Logout user (invalidates refresh token)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/refresh` - Refresh access token using refresh token
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify-email/:token` - Verify email address
- `POST /api/auth/resend-verification` - Resend email verification

### Items (Marketplace)
- `GET /api/items` - Get all items (with advanced filters & pagination)
- `GET /api/items/search` - Search items by query
- `GET /api/items/featured` - Get featured items
- `GET /api/items/filters` - Get available filter options
- `POST /api/items` - Create new item (with image upload)
- `GET /api/items/:id` - Get specific item with seller info
- `GET /api/items/:id/similar` - Get similar items
- `PUT /api/items/:id` - Update item (with image upload)
- `DELETE /api/items/:id` - Soft delete item
- `PATCH /api/items/:id/restore` - Restore soft-deleted item
- `PATCH /api/items/:id/sold` - Mark item as sold
- `GET /api/items/stats` - Get item statistics
- `GET /api/items/my-items` - Get user's items

### Transactions & Payments
- `POST /api/transactions/initiate` - Initiate payment transaction
- `POST /api/transactions/payment` - Process Stripe payment
- `POST /api/transactions/webhook` - Stripe webhook handler
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get specific transaction
- `GET /api/transactions/user/:id` - Get user transaction history
- `PATCH /api/transactions/:id/status` - Update transaction status
- `PATCH /api/transactions/:id/cancel` - Cancel transaction
- `PATCH /api/transactions/:id/refund` - Process refund
- `GET /api/transactions/stats` - Get transaction statistics
- `GET /api/transactions/my-transactions` - Get user's transactions

### Swap & Borrow
- `POST /api/transactions/swap` - Initiate item swap
- `POST /api/transactions/swap/:id/confirm` - Confirm swap
- `POST /api/transactions/borrow` - Initiate item rental
- `POST /api/transactions/borrow/:id/confirm` - Confirm rental
- `POST /api/transactions/borrow/:id/return` - Return rented item

### Analytics & Insights
- `GET /api/analytics/user/:id` - Get user personal dashboard
- `GET /api/analytics/community` - Get community analytics
- `GET /api/analytics/user/:id/green-score-history` - Get Green Score history
- `GET /api/analytics/user/:id/achievements` - Get user achievements
- `GET /api/analytics/user/:id/eco-impact` - Get user eco impact analytics
- `GET /api/analytics/community/eco-impact` - Get community eco impact
- `GET /api/analytics/leaderboard/green-score` - Green Score leaderboard
- `GET /api/analytics/leaderboard/achievements` - Achievement leaderboard
- `POST /api/analytics/achievements/check` - Check for new achievements
- `GET /api/analytics/achievements/:id/progress` - Get achievement progress

### Indian Payments (Razorpay)
- `POST /api/indian-payments/initiate` - Initiate Indian payment
- `POST /api/indian-payments/process` - Process Razorpay payment
- `POST /api/indian-payments/webhook` - Razorpay webhook handler
- `GET /api/indian-payments/donations/quick-options/:ngoId` - Get quick donation amounts
- `GET /api/indian-payments/emi/quote` - Get EMI quote for high-value items
- `POST /api/indian-payments/gst/calculate` - Calculate GST for single item
- `POST /api/indian-payments/gst/calculate-multiple` - Calculate GST for multiple items
- `GET /api/indian-payments/gst/rates` - Get GST rates by category
- `GET /api/indian-payments/gst/breakdown` - Get detailed GST breakdown
- `POST /api/indian-payments/gst/validate` - Validate GST number
- `GET /api/indian-payments/gst/compliance` - Get GST compliance information
- `GET /api/indian-payments/gst/invoice/:transactionId` - Generate GST invoice
- `GET /api/indian-payments/methods` - Get available payment methods

### NGOs
- `GET /api/ngos` - Get all NGOs
- `POST /api/ngos` - Create new NGO
- `GET /api/ngos/:id` - Get specific NGO
- `PUT /api/ngos/:id` - Update NGO
- `DELETE /api/ngos/:id` - Delete NGO
- `PATCH /api/ngos/:id/verify` - Verify NGO
- `GET /api/ngos/:id/items` - Get NGO's items
- `POST /api/ngos/:id/review` - Add NGO review
- `GET /api/ngos/stats` - Get NGO statistics

### Eco Impacts
- `GET /api/eco-impacts` - Get all eco impacts
- `POST /api/eco-impacts` - Create new eco impact
- `GET /api/eco-impacts/:id` - Get specific eco impact
- `PUT /api/eco-impacts/:id` - Update eco impact
- `DELETE /api/eco-impacts/:id` - Delete eco impact
- `PATCH /api/eco-impacts/:id/verify` - Verify eco impact
- `GET /api/eco-impacts/stats` - Get user eco impact statistics
- `GET /api/eco-impacts/global-stats` - Get global eco impact statistics
- `GET /api/eco-impacts/category-stats` - Get eco impact by category
- `GET /api/eco-impacts/top-users` - Get top eco users
- `GET /api/eco-impacts/my-impact` - Get user's eco impact stats

### Health Check
- `GET /health` - Health check endpoint

## Project Structure

```
ecofriend-backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   └── ecoActionController.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/              # Database models
│   │   ├── index.js
│   │   ├── User.js
│   │   └── EcoAction.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── ecoActions.js
│   └── services/            # Business logic
│       ├── authService.js
│       └── ecoActionService.js
├── uploads/                 # File uploads directory
├── server.js               # Main server file
├── package.json
├── .env.example
└── README.md
```

## Green Score System

The Green Score system gamifies environmental impact with points and bonuses:

### Point Values
- **Listing**: +10 points (creating an item listing)
- **Sale**: +20 points (selling an item)
- **Donation**: +50 points (donating to NGO)
- **Purchase**: +5 points (buying an item)
- **Exchange**: +15 points (item swap)
- **Rental**: +8 points (renting an item)

### Bonus Multipliers
- **First-time actions**: 2x points
- **Activity streaks**: 1.5x points (7+ consecutive days)
- **Eco-friendly items**: 1.2x points
- **Verified users**: 1.1x points

### Achievement System
- **Badge categories**: Green Score, Transactions, Listings, Donations, Eco Impact, Social, Special
- **Rarity levels**: Common, Uncommon, Rare, Epic, Legendary
- **Progress tracking**: Real-time progress updates
- **Notification system**: Achievement notifications

## Indian Payment System

### Payment Methods
- **UPI**: Google Pay, PhonePe, Paytm, BharatPe, MobiKwik
- **Cards**: Visa, Mastercard, RuPay, American Express
- **Net Banking**: SBI, HDFC, ICICI, Axis, Kotak, PNB
- **Wallets**: Paytm, MobiKwik, FreeCharge, Jio Money

### GST Calculation
- **0% GST**: Books, newspapers, milk, fresh vegetables, donations
- **5% GST**: Medicines, food items, educational books, agricultural products
- **12% GST**: Clothing, footwear, home textiles, kitchen utensils, wooden furniture
- **18% GST**: Electronics, furniture, sports equipment, beauty products, home appliances
- **28% GST**: Automotive, luxury items, tobacco, alcohol, luxury cosmetics, jewelry

### EMI Options
- **Threshold**: ₹5,000+ for EMI availability
- **Options**: 3, 6, 9, 12 months
- **Interest**: 0% for 3-6 months, 2-3% for 9-12 months
- **Calculation**: Automatic monthly amount calculation

### Quick Donation Amounts
- **₹100**: Small contribution to make a difference
- **₹500**: Meaningful support for the cause
- **₹1,000**: Significant impact donation
- **₹2,000**: Major contribution for change
- **₹5,000**: Transformational donation

## Database Models

### User
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `greenScore` (Integer, 0-1000)
- `location` (String)
- `avatar` (String, Optional)
- `role` (Enum: user, admin, moderator, ngo)
- `isActive` (Boolean)
- `isVerified` (Boolean)
- `lastLogin` (Date)
- `phoneNumber` (String, Optional)
- `bio` (Text, Optional)
- `createdAt`, `updatedAt` (Timestamps)

### Item
- `id` (UUID, Primary Key)
- `sellerId` (UUID, Foreign Key to User)
- `title` (String)
- `description` (Text)
- `price` (Decimal)
- `condition` (Enum: new, like_new, good, fair, poor)
- `images` (Array of Strings)
- `transactionType` (Enum: sale, donation, exchange, rental)
- `ngoId` (UUID, Foreign Key to NGO, Optional)
- `ecoSavings` (JSON)
- `category` (Enum: electronics, clothing, furniture, etc.)
- `subcategory` (String)
- `brand` (String)
- `model` (String)
- `year` (Integer)
- `location` (String)
- `coordinates` (Geometry Point)
- `isActive` (Boolean)
- `isSold` (Boolean)
- `soldAt` (Date)
- `views` (Integer)
- `tags` (Array of Strings)
- `status` (Enum: draft, active, sold, archived, rejected)
- `createdAt`, `updatedAt` (Timestamps)

### Transaction
- `id` (UUID, Primary Key)
- `buyerId` (UUID, Foreign Key to User)
- `sellerId` (UUID, Foreign Key to User)
- `itemId` (UUID, Foreign Key to Item)
- `amount` (Decimal)
- `status` (Enum: pending, confirmed, paid, shipped, delivered, completed, cancelled, refunded, disputed)
- `paymentMethod` (Enum: card, bank_transfer, digital_wallet, cash, crypto)
- `paymentId` (String)
- `transactionFee` (Decimal)
- `platformFee` (Decimal)
- `ngoDonation` (Decimal)
- `ngoId` (UUID, Foreign Key to NGO, Optional)
- `shippingAddress` (JSON)
- `trackingNumber` (String)
- `estimatedDelivery` (Date)
- `actualDelivery` (Date)
- `notes` (Text)
- `disputeReason` (Text)
- `resolvedAt` (Date)
- `resolvedBy` (UUID, Foreign Key to User)
- `createdAt`, `updatedAt` (Timestamps)

### NGO
- `id` (UUID, Primary Key)
- `name` (String, Unique)
- `description` (Text)
- `mission` (Text)
- `images` (Array of Strings)
- `logo` (String)
- `website` (String)
- `email` (String)
- `phoneNumber` (String)
- `address` (JSON)
- `coordinates` (Geometry Point)
- `isVerified` (Boolean)
- `verificationDate` (Date)
- `verifiedBy` (UUID, Foreign Key to User)
- `bankDetails` (JSON)
- `taxId` (String, Unique)
- `registrationNumber` (String, Unique)
- `foundedYear` (Integer)
- `focusAreas` (Array of Strings)
- `socialMedia` (JSON)
- `isActive` (Boolean)
- `totalDonations` (Decimal)
- `totalItems` (Integer)
- `rating` (Decimal, 0-5)
- `reviewCount` (Integer)
- `createdAt`, `updatedAt` (Timestamps)

### EcoImpact
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key to User)
- `itemId` (UUID, Foreign Key to Item)
- `transactionId` (UUID, Foreign Key to Transaction, Optional)
- `co2Saved` (Decimal, kg)
- `waterSaved` (Decimal, liters)
- `wasteReduced` (Decimal, kg)
- `energySaved` (Decimal, kWh)
- `treesEquivalent` (Decimal)
- `impactScore` (Integer, 0-1000)
- `impactType` (Enum: purchase, sale, donation, exchange, rental, repair, reuse, recycle)
- `calculationMethod` (Enum: automatic, manual, verified)
- `verifiedBy` (UUID, Foreign Key to User)
- `verificationDate` (Date)
- `isVerified` (Boolean)
- `notes` (Text)
- `metadata` (JSON)
- `category` (Enum: electronics, clothing, furniture, etc.)
- `subcategory` (String)
- `brand` (String)
- `condition` (Enum: new, like_new, good, fair, poor)
- `age` (Integer, years)
- `weight` (Decimal, kg)
- `material` (String)
- `isActive` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

### Achievement
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (Text)
- `category` (Enum: green_score, transactions, listings, donations, eco_impact, social, special)
- `badgeIcon` (String, URL)
- `badgeColor` (String, Hex Color)
- `points` (Integer)
- `requirements` (JSON)
- `isActive` (Boolean)
- `isRare` (Boolean)
- `rarity` (Enum: common, uncommon, rare, epic, legendary)
- `sortOrder` (Integer)
- `createdAt`, `updatedAt` (Timestamps)

### UserAchievement
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `achievementId` (UUID, Foreign Key)
- `earnedAt` (Date)
- `progress` (Integer, 0-100)
- `isNotified` (Boolean)
- `metadata` (JSON)
- `createdAt`, `updatedAt` (Timestamps)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | ecofriend_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRY` | JWT expiry time | 24h |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## Development

### Running in Development Mode
```bash
npm run dev
```

### Database Sync
The database will automatically sync in development mode. For production, use migrations.

### File Uploads
Uploaded files are stored in the `uploads/` directory. The API supports image uploads with a 5MB limit.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Input validation
- File upload restrictions
- Error handling without sensitive data exposure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
