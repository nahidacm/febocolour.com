# Software Architecture & Product Design Prompt

You are a senior Software Architect, UI/UX Designer, SEO expert, Ecommerce expert, and Full Stack Engineer.

Design a modern ecommerce platform called **FeboColour**.

## Project Overview

FeboColour is an ecommerce store that sells hijabs for women of all ages, with a special focus on **baby girl hijabs**.

The business is currently small, but the software should be designed so it can grow into a complete ecommerce platform in the future.

The goal is to maximize:

- Speed
- SEO
- Conversion rate
- Mobile experience
- Simplicity
- Low server cost
- Maintainability

Do not over-engineer the first version.

---

# Business Background

Most visitors arrive from:

- Facebook
- Facebook Messenger
- WhatsApp

Therefore users are usually already interested in buying.

The checkout should require the fewest possible steps.

The website should feel trustworthy, fast and easy to use.

There will only be a small number of product categories.

---

# Design Requirements

Create a modern ecommerce UI.

Theme:

- Baby pink color palette
- Use the colors from `assets/febo-logo.png` as the design reference
- Clean
- Elegant
- Feminine
- Premium but affordable
- Soft rounded corners
- Lots of white space

Design principles:

- Mobile First
- Extremely lightweight
- Very fast loading
- High Core Web Vitals score
- Excellent accessibility
- Simple navigation
- Call-To-Action
- SEO friendly
- AI crawler friendly
- Google friendly

---

# Home Page

Design the homepage with sections in this order:

1. Sticky Header

- Logo
- Search
- Cart
- Menu
- Phone icon

2. Hero Banner

- Large promotional image
- Main CTA
- Secondary CTA

3. Categories Slider

4. Best Selling Products

5. New Arrivals

6. Featured Collection

7. Why Choose FeboColour

8. Our Official Hijab Partner

9. Customer Reviews Carousel

10. Instagram Gallery

11. Facebook Messenger button

12. WhatsApp floating button

13. Footer

---

# Header

Include:

- Logo
- Search
- Categories
- Cart
- Mini Cart
- Phone number
- Facebook
- Instagram
- YouTube

---

# Footer

Include:

- Quick Links
- Categories
- Contact Information
- Social Links
- Privacy Policy
- Terms
- Shipping Policy
- Return Policy
- Copyright

---

# Product Features

Each product supports:

- Multiple images
- Product videos
- Description
- Specifications
- Size chart
- Dynamic variants like
  - Color
  - Size
  - Age

- Stock quantity
- Stock status
- SKU
- Regular price
- Special price
- Sale badge
- Featured badge
- Best Seller badge

Future ready for:

- Digital downloads
- Gift cards
- Bundles
- Reviews
- Ratings

---

# Categories

Simple category system.

Support:

- Parent category
- Child category

Future support:

- Collections
- Seasonal campaigns

---

# Shopping Cart

Features:

- Mini Cart
- Cart page
- Quantity update
- Coupon (future)
- Shipping estimate
- Continue shopping
- Checkout button

---

# Checkout

Keep checkout extremely simple.

Support:

Guest Checkout

Customer Login

Required fields:

- Full Name
- Phone Number
- Full Address
- Shipping Method
- Payment Method

Optional:

- Notes

Do NOT ask for unnecessary information.

Optimize checkout for users coming from Facebook.

---

# Payment

Design abstraction so future gateways can be added.

Initially support:

- Cash on Delivery
- Mobile Banking
- Bank Transfer

Future:

- Stripe
- SSLCommerz
- bKash
- Nagad
- Rocket
- PayPal

---

# Shipping

Support:

- Inside City
- Outside City
- Pickup

Future:

- Steadfast Courier

---

# Customer Account

- Orders
- Addresses
- Wishlist (future)
- Profile

---

# Admin Panel

Dashboard

Manage:

- Products
- Categories
- Inventory
- Orders
- Customers
- Coupons (future)
- Reviews
- Homepage banners
- Shipping
- Payments
- Social links
- Settings

Dashboard widgets:

- Today's Orders
- Revenue
- Best Selling Products
- Low Stock
- Recent Orders

---

# SEO

Must support:

- Server-side rendering or static rendering where appropriate
- Sitemap
- Robots.txt
- Canonical URLs
- Meta title
- Meta description
- Open Graph
- Twitter Cards
- Structured Data (JSON-LD)
- Product Schema
- Breadcrumb Schema
- Organization Schema
- FAQ Schema
- Image optimization
- Lazy loading
- WebP/AVIF
- Responsive images

---

# Performance

Target:

- Lighthouse 95+
- PageSpeed 95+
- Largest Contentful Paint under 2 seconds
- Tiny JavaScript bundle
- Minimal dependencies
- Code splitting
- Image optimization
- CDN ready
- HTTP caching
- Edge caching
- Compression (Brotli/Gzip)

---

# Security

Include:

- CSRF protection
- XSS protection
- SQL injection protection
- Rate limiting
- Secure authentication
- Password hashing
- Audit logs

---

# Future Features

Architecture should allow future addition of:

- Wishlist
- Coupons
- Loyalty points
- Affiliate system
- Referrals
- Product reviews
- Blog
- Multi-language
- Multi-currency
- AI chatbot
- AI product recommendations
- Live inventory
- Analytics
- Notifications
- Mobile apps
- PWA
- Marketplace support

---

# Mobile Apps

Plan APIs suitable for:

- Android
- iOS

Future support:

- Flutter
- React Native

---

# Technology Stack

Next.js and related necessary things.

---

# Deliverables

Provide:

1. Overall system architecture

2. Folder structure

3. Database schema

4. API design

5. UI wireframes

6. User journey

7. Admin workflow

8. Component hierarchy

9. SEO strategy

10. Performance optimization strategy

11. Security strategy

12. Scalability roadmap

13. Future feature roadmap

14. Deployment architecture

15. Recommended technology stack with detailed justification.

Always recommend production-grade solutions while keeping the first version simple, fast, maintainable, and affordable.
