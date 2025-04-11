# Freelance Web Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It is a freelance web application that includes user authentication, account creation, and other features.

---

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone https://github.com/ram9988-code/project-seat-booking
cd freelance
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## API Routes

### **Authentication**

1. **POST `/api/register`**

   - **Description**: Registers a new user.
   - **Request Body**:
     ```json
     {
       "name": "string",
       "username": "string",
       "email": "string",
       "password": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "activationToken": "string"
     }
     ```

2. **POST `/api/login`**

   - **Description**: Logs in a user and returns access and refresh tokens.
   - **Request Body**:
     ```json
     {
       "email": "string",
       "password": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "accessToken": "string",
       "refreshToken": "string"
     }
     ```

3. **POST `/api/logout`**

   - **Description**: Logs out the user by clearing session data.
   - **Response**:
     ```json
     {
       "success": true,
       "message": "Logged out successfully"
     }
     ```

4. **GET `/api/verify-email`**

   - **Description**: Verifies the user's email using an activation token.
   - **Query Parameters**:
     - `token`: The activation token.
   - **Response**:
     ```json
     {
       "success": true,
       "message": "Email verified successfully"
     }
     ```

5. **POST `/api/refresh-token`**

   - **Description**: Refreshes the access token using a valid refresh token.
   - **Request Body**:
     ```json
     {
       "refreshToken": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "accessToken": "string"
     }
     ```

6. **POST `/api/forgot-password`**

   - **Description**: Sends a password reset link to the user's email.
   - **Request Body**:
     ```json
     {
       "email": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "message": "Password reset link sent"
     }
     ```

7. **POST `/api/reset-password`**
   - **Description**: Resets the user's password using a reset token.
   - **Request Body**:
     ```json
     {
       "token": "string",
       "newPassword": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "message": "Password reset successfully"
     }
     ```

---

## Pages Overview

### **Home Page (`/`)**

- **Description**: The landing page of the application.
- **Features**: Displays an overview of the platform and its features.

### **Create Account Page (`/create-account`)**

- **Description**: A page where users can register for a new account.
- **Features**: Includes a form for entering name, username, email, and password.

### **Login Page (`/login`)**

- **Description**: A page for users to log in to their accounts.
- **Features**: Includes a form for entering email and password.

### **Email Verification Page (`/email-verification`)**

- **Description**: A page that verifies the user's email using the activation token.
- **Features**: Displays a success or error message based on the verification status.

### **Forgot Password Page (`/forgot-password`)**

- **Description**: A page where users can request a password reset link.
- **Features**: Includes a form for entering the user's email.

### **Reset Password Page (`/reset-password`)**

- **Description**: A page where users can reset their password using a reset token.
- **Features**: Includes a form for entering the new password.

---

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: Redis (for session management)
- **Authentication**: JSON Web Tokens (JWT)
- **Form Validation**: React Hook Form, Zod
- **Notifications**: Sonner (toast notifications)

---

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd freelance
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   ACCESS_TOKEN=<your-access-token-secret>
   REFRESH_TOKEN=<your-refresh-token-secret>
   ACCESS_TOKEN_EXPIRE=300
   REFRESH_TOKEN_EXPIRE=1200
   NODE_ENV=development
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
