# Router Function Documentation

This router function integrates multiple APIs within AWS Lambda.  
All API endpoints are configured as **environment variables** to ensure security and flexibility.

## Environment Variables Setup

You can set environment variables for your Lambda function in the AWS Management Console or via the AWS CLI.

### AWS Console
1. Go to **AWS Lambda Console**.
2. Select your function.
3. Navigate to **Configuration → Environment variables**.
4. Add the following key-value pairs:

| Constant Name       | Environment Variable Key | Example Value                 |
|---------------------|---------------------------|-------------------------------|
| `ANNOUNCEMENTS_API` | `ANNOUNCEMENTS_API`       | `<YOUR_ANNOUNCEMENT_API>`     |
| `HOSPITAL_API`      | `HOSPITAL_API`            | `<YOUR_HOSPITAL_API>`         |
| `LOGIN_API`         | `LOGIN_API`               | `<YOUR_LOGIN_API>`            |
| `POLICE_API`        | `POLICE_API`              | `<YOUR_POLICE_API>`           |
| `RISK_API`          | `RISK_API`                | `<YOUR_RISK_API>`             |

### AWS CLI
```bash
aws lambda update-function-configuration \
  --function-name your-function-name \
  --environment "Variables={ANNOUNCEMENTS_API=<YOUR_ANNOUNCEMENT_API>,HOSPITAL_API=<YOUR_HOSPITAL_API>,LOGIN_API=<YOUR_LOGIN_API>,POLICE_API=<YOUR_POLICE_API>,RISK_API=<YOUR_RISK_API>}"

