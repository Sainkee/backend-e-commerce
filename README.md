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
4. Cart
Folder ID: be9a4d85-d443-4ade-83fe-96467e30e3e4
Created: 2024-07-24
Requests:
Add to Cart: POST https://santoshecomm.onrender.com/api/v1/cart/669bccec5218946e836456ce
Clear Cart: DELETE https://santoshecomm.onrender.com/api/v1/cart
Update Item in Cart: PUT https://santoshecomm.onrender.com/api/v1/cart/66a0e92516eb537f81e731be
5. Coupon
Folder ID: 89e139e5-77d3-4bd3-ae2d-29e52c4ddfe8
Created: 2024-07-24
6. Order
Folder ID: d03affc5-aebe-4902-ae7e-21e4dc7cad14
Created: 2024-07-25
7. Address
Folder ID: 7f969c68-555a-4ff3-80de-b0f84a3c40a4
Created: 2024-07-27
8. Brand
Folder ID: e19eed0a-036a-4318-8123-cd32a3d86844
Created: 2024-07-27
9. Payment
Folder ID: 3de20d9f-42e2-4803-bace-013f0b005b8a
Created: 2024-07-28
Usage
To use this collection, import it into your Thunder Client application. Each folder contains various requests that can be executed to interact with the e-commerce API endpoints. Make sure to set the appropriate headers, parameters, and request bodies as required by each endpoint.

Notes
Ensure the base URL (https://santoshecomm.onrender.com/api/v1) is correctly set in each request.
For requests requiring authorization, replace the placeholder token with a valid JWT.
Modify request parameters and bodies as per your testing needs.
This collection provides a comprehensive set of requests to test and interact with the various features of the e-commerce API, helping in efficient API development and testing.

Feel free to add more requests and folders as you expand the functionalities of your e-commerce platform.

