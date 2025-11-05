# Database Environment Variables

The database connection details are stored as environment variables in AWS Lambda.  
This avoids hardcoding sensitive information in the code.

## Environment Variables Setup

You can set the following **key–value pairs** in your Lambda configuration:

| Key           | Value               |
|---------------|---------------------|
| `DB_HOST`     | `<YOUR_DB_HOST>`    |
| `DB_NAME`     | `<YOUR_DB_NAME>`    |
| `DB_PASSWORD` | `<YOUR_DB_PASSWORD>`|
| `DB_USER`     | `<YOUR_DB_USER>`    |

## Adding Environment Variables

### AWS Console
1. Go to **AWS Lambda Console**.
2. Select your function.
3. Navigate to **Configuration → Environment variables**.
4. Add each of the key–value pairs above.

### AWS CLI
You can also configure them using the AWS CLI:

```bash
aws lambda update-function-configuration \
  --function-name your-function-name \
  --environment "Variables={DB_HOST=<YOUR_DB_HOST>,DB_NAME=<YOUR_DB_NAME>,DB_PASSWORD=<YOUR_DB_PASSWORD>,DB_USER=<YOUR_DB_USER>}"

