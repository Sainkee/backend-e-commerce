Thunder Client Collection: E-commerce API
Overview
This README provides details about the Thunder Client collection for the e-commerce API. This collection consists of various folders, each representing different functionalities of the e-commerce platform, including user management, product management, wishlist, cart, coupons, orders, address management, brands, and payments.

Client Name: Thunder Client
Collection Name: e comm
Collection ID: d552ac9b-15a1-49e9-a905-a4ec8c91eb04
Date Exported: 2024-07-28
Version: 1.2
Folders and Requests
The collection is organized into folders, each containing requests related to specific features of the e-commerce API.

1. User Management
Folder ID: 7ac82706-1afb-4140-8722-c28edf00802e
Created: 2024-07-20
Requests:
Register: POST https://santoshecomm.onrender.com/api/v1/users/register
Logout: POST https://santoshecomm.onrender.com/api/v1/users/logout
Refresh Access: POST https://santoshecomm.onrender.com/api/v1/users/refresh-access
Login: POST https://santoshecomm.onrender.com/api/v1/users/login
Password Reset: POST https://santoshecomm.onrender.com/api/v1/users/password-reset
Reset Password After Mail: POST https://santoshecomm.onrender.com/api/v1/users/reset-password
2. Product Management
Folder ID: d15bf368-3316-400d-9d7d-a4ebd6e6434f
Created: 2024-07-20
Requests:
List Products: GET https://santoshecomm.onrender.com/api/v1/product/?pagination=1&limit=10&sort=ASC&category=sample category&isActive=false
Delete Product: DELETE https://santoshecomm.onrender.com/api/v1/product/669bccec5218946e836456ce
Edit Products: PUT https://santoshecomm.onrender.com/api/v1/product/669bcc56eb68253aa8edee76
Create Product: POST https://santoshecomm.onrender.com/api/v1/product/createproduct
3. Wishlist
Folder ID: cb401e10-ee74-4c76-9c47-a8b85644db2c
Created: 2024-07-21
Requests:
Get Wishlist: GET https://santoshecomm.onrender.com/api/v1/wishlist
Add to Wishlist: POST https://santoshecomm.onrender.com/api/v1/wishlist/669bcc56eb68253aa8edee76
Remove from Wishlist: DELETE https://santoshecomm.onrender.com/api/v1/wishlist/669bcc56eb68253aa8edee76
4.Cart Endpoints:

Add to cart:
URL: https://santoshecomm.onrender.com/api/v1/cart/669bccec5218946e836456ce
Method: POST
Clear cart:
URL: https://santoshecomm.onrender.com/api/v1/cart
Method: DELETE
Update item in cart:
URL: https://santoshecomm.onrender.com/api/v1/cart/66a0e92516eb537f81e731be
Method: PUT
Body: { "quantity": 5 }
Get all cart items:
URL: https://santoshecomm.onrender.com/api/v1/cart
Method: GET
Remove item from cart:
URL: https://santoshecomm.onrender.com/api/v1/cart/66a0e92516eb537f81e731be
Method: DELETE
Coupon Endpoints:

Create coupon:
URL: https://santoshecomm.onrender.com/api/v1/coupon/createCoupon
Method: POST
Body:
json
Copy code
{
  "code": "WINTERDEAL",
  "discountType": "amount",
  "discountValue": 20,
  "expirationDate": "2025-12-25"
}
Get all coupons:
URL: https://santoshecomm.onrender.com/api/v1/coupon/
Method: GET
Delete coupon by ID:
URL: https://santoshecomm.onrender.com/api/v1/coupon/66a1f6096f1346a9f2411407
Method: DELETE
Update coupon by ID:
URL: https://santoshecomm.onrender.com/api/v1/coupon/66a1e1faa5b385e9643c64cb
Method: PUT
Body:
json

{
  "discountType": "percentage",
  "discountValue": 50,
  "expirationDate": "2025-12-25"
}
Order Endpoints:

Create order:
URL: https://santoshecomm.onrender.com/api/v1/order/
Method: POST
Body: { "couponCode": "WINTERDEAL" }
Get all orders:
URL: https://santoshecomm.onrender.com/api/v1/order/
Method: GET
Delete order:
URL: https://santoshecomm.onrender.com/api/v1/order/66a4776f8f6f97c26c6cd9e9
Method: DELETE
Get single order:
URL: https://santoshecomm.onrender.com/api/v1/order/66a3635e79047a67b03f322a
Method: GET
Update order:
URL: https://santoshecomm.onrender.com/api/v1/order/66a3635e79047a67b03f322a
Method: PUT
Body: { "status": "shipped" }

Usage
To use this collection, import it into your Thunder Client application. Each folder contains various requests that can be executed to interact with the e-commerce API endpoints. Make sure to set the appropriate headers, parameters, and request bodies as required by each endpoint.

Notes
Ensure the base URL (https://santoshecomm.onrender.com/api/v1) is correctly set in each request.
For requests requiring authorization, replace the placeholder token with a valid JWT.
Modify request parameters and bodies as per your testing needs.
This collection provides a comprehensive set of requests to test and interact with the various features of the e-commerce API, helping in efficient API development and testing.

Feel free to add more requests and folders as you expand the functionalities of your e-commerce platform.

