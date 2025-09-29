# Banking API Documentation

## Available Endpoints

### 1. Create Payment

- **Endpoint**: `/api/banking/create-payment`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "orderId": "string",
    "amount": number,
    "paymentMethod": "CASH | CREDIT_CARD | QR_CODE"
  }
  ```

### 2. Confirm Payment

- **Endpoint**: `/api/banking/confirm-payment`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "paymentId": "string"
  }
  ```

### 3. Check Payment Status

- **Endpoint**: `/api/banking/check-status`
- **Method**: GET
- **Query Parameters**:
  - orderId (optional)
  - paymentId (optional)

### 4. Cancel Payment

- **Endpoint**: `/api/banking/cancel-payment`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "paymentId": "string",
    "reason": "string"
  }
  ```

## Payment Status Flow

1. Created -> Pending
2. Pending -> Completed/Cancelled
3. Completed (Final State)
4. Cancelled (Final State)

## Error Handling

All endpoints will return:

- 200: Success
- 400: Bad Request (Invalid input)
- 401: Unauthorized
- 500: Internal Server Error

## Security

- All endpoints require authentication
- Validate user permissions before processing
- Sanitize all inputs
- Use HTTPS only
