# CollegeHub

A student companion platform that allows users to discover and share products, services, and resources for college life, such as hostels, food services, essentials, and more.

## Features

- User authentication with Firebase
- Product listing with detailed information
- Image uploading with Cloudinary
- MongoDB database integration
- Search and filter functionality
- Responsive design

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: Firebase
- Image Storage: Cloudinary

## Setup Instructions

1. Clone the repository:
```
git clone <repository-url>
cd collegehub
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
# Backend
PORT=3000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret

# Frontend
API_URL=http://localhost:3000
```

4. Start the development server:
```
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/user/:uid` - Get products by user ID
- `GET /api/products/search/:query` - Search products
- `POST /api/products` - Create a new product (requires authentication)
- `PUT /api/products/:id` - Update a product (requires authentication)
- `DELETE /api/products/:id` - Delete a product (requires authentication)

## Adding a Product

1. Log in to your account
2. Click on "Add Product" in the navigation bar
3. Fill out the product form with title, description, category, price, and an image
4. Click "Save Product" to submit

## Folder Structure

```
collegehub/
├── config/
│   └── cloudinary.js      # Cloudinary configuration
├── models/
│   └── Product.js         # MongoDB product model
├── routes/
│   └── productRoutes.js   # API routes for products
├── index.html             # Main HTML file
├── style.css              # Main CSS file
├── app.js                 # Core application functionality
├── auth.js                # Authentication functionality
├── products.js            # Product management functionality
├── firebase-config.js     # Firebase configuration
├── server.js              # Express server
└── package.json           # Project dependencies
```

## License

MIT 