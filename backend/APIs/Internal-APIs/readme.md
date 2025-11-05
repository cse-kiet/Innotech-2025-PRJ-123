# AWS Lambda + API Gateway Integration Setup Guide

This comprehensive guide explains how to set up AWS Lambda functions integrated with API Gateway using OpenAPI definitions. This template can be used for any backend API service.

---

## Quick Start Guide

### Step 1: Deploy Lambda Functions

Navigate to each Lambda function directory and deploy:


Repeat for all Lambda functions in your service.

### Step 2: Configure API Gateway Using OpenAPI

You can either:
- **Option A:** Import provided OpenAPI definition (if available)
- **Option B:** Create API Gateway manually (guide below)

---

## Option A: Using OpenAPI Definition Files

### What the OpenAPI Snippet Contains

- API endpoint definitions (`/your-endpoint`)
- HTTP methods (GET, POST, etc.)
- CORS configuration (OPTIONS method)
- Response schemas
- Placeholder server URLs that don't need updating

### How to Use the OpenAPI Snippet

1. **Add Lambda Integration Details**

   Update your OpenAPI file with actual Lambda ARN


2. **Import to API Gateway**

- Go to [AWS API Gateway Console](https://console.aws.amazon.com/apigateway)
- Choose **Create API** → **Import from OpenAPI**
- Upload your updated OpenAPI file
- Review imported resources and methods

3. **Note:** The placeholder URL `https://<api-id>.execute-api.<region>.amazonaws.com/{basePath}` does **not** need updating before import. AWS assigns the actual URL automatically.

---

## Option B: Manual API Gateway Setup

### Step 1: Create REST API

1. Open [AWS API Gateway Console](https://console.aws.amazon.com/apigateway)
2. Click **Create API** → **REST API** → **Build**
3. Choose **Regional** endpoint type
4. Enter API name and description

### Step 2: Create Resources and Methods

1. **Create Resource:**
- Select root resource `/`
- Click **Actions** → **Create Resource**
- Enter resource name (e.g., `your-endpoint`)

2. **Create Method:**
- Select your resource
- Click **Actions** → **Create Method**
- Choose HTTP method (POST, GET, etc.)

### Step 3: Configure Lambda Integration

1. **Integration Type:** Lambda Function
2. **Use Lambda Proxy Integration:** Enabled
3. **Lambda Region:** Your region
4. **Lambda Function:** Select your function
5. **Save**

### Step 4: Enable CORS (if needed)

1. Select your resource
2. **Actions** → **Enable CORS**
3. Configure allowed origins, headers, and methods
4. **Save**

---

## Step 3: Set Lambda Permissions

Grant API Gateway permission to invoke your Lambda functions:

aws lambda add-permission
--function-name <Your-Lambda-Function-Name>
--statement-id apigateway-invoke-permissions
--action lambda:InvokeFunction
--principal apigateway.amazonaws.com
--source-arn "arn:aws:execute-api:<region>:<account-id>:<api-id>/*/POST/<your-endpoint>" 


Replace placeholders with your actual values.

---

## Step 4: Deploy API Gateway

1. **Create Stage:**
   - Select your API
   - **Actions** → **Deploy API**
   - **Deployment stage:** Create new stage (e.g., `dev`, `prod`)
   - **Stage name:** Enter stage name
   - **Deploy**

2. **Note the Invoke URL** displayed in the stage details.

---

## Step 5: Test Your APIs

### Using curl

curl -X POST https://<api-id>.execute-api.<region>.amazonaws.com/<stage>/<your-endpoint>
-H "Content-Type: application/json"
-d '{
"key": "value"
}'
---

## Important Notes

### Security Considerations

- Never commit AWS credentials to your repository
- Use IAM roles with minimal required permissions
- Enable CloudWatch logging for monitoring
- Consider API throttling and usage plans

### Best Practices

- Use environment variables for configuration
- Implement proper error handling in Lambda functions
- Set appropriate timeout values
- Monitor API Gateway and Lambda metrics

### Troubleshooting

- Check CloudWatch logs for Lambda execution errors
- Verify API Gateway integration configuration
- Ensure proper IAM permissions are set
- Test Lambda functions independently before API integration

---

## Resources

- [AWS API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [API Gateway Import from OpenAPI](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-import-api.html)
- [Lambda Permissions for API Gateway](https://docs.aws.amazon.com/lambda/latest/dg/with-on-demand-https.html)

---

This guide provides a complete framework for setting up AWS Lambda functions with API Gateway integration. Customize the specific details (function names, endpoints, etc.) according to your project requirements.
