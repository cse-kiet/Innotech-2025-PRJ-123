# AWS Lambda Setup Guide

This guide explains how to configure an AWS Lambda function with:

- Connection to an RDS database
- PyMySQL library via Lambda Layer
- API environment variables (see `env.md`)

---

## 1. Connecting AWS Lambda to RDS

### Step 1: Place Lambda in the Same VPC
1. Open **AWS Lambda Console** and select your function.
2. Go to **Configuration → VPC**.
3. Select the **VPC** where your RDS instance is running.
4. Choose the **Subnets** (private subnets recommended).
5. Attach the **Security Group** that allows outbound traffic to the RDS instance.
6. Save the configuration.

### Step 2: Configure RDS Security Group
1. Open **RDS Console → Databases → Your DB → Connectivity & security**.
2. Find the **VPC security groups** section.
3. Edit inbound rules:
   - Allow traffic from your Lambda’s security group on the database port (e.g., `3306` for MySQL).

> **Note:** For database credentials and API endpoints, refer to [`env.md`](env.md) for the complete environment variable setup.

---

## 2. Adding PyMySQL Layer to Lambda

Lambda does not include `pymysql` by default. To use it, create a **Lambda Layer**.

### Step 1: Create the PyMySQL Layer Package
Run these commands in **Linux**, **MacOS**, or **AWS CloudShell** (ensure Python version matches Lambda runtime, e.g., Python 3.9):

```bash
# Create a folder named python
mkdir python

# Install PyMySQL into that folder
pip install pymysql -t python/

# Zip the folder to create the layer package
zip -r pymysql-layer.zip python
```

### Step 2: Create the Lambda Layer in AWS Console
1. Open the **AWS Lambda Console**.
2. In the left sidebar, click **Layers**.
3. Click **Create layer**.
4. Enter a **name** for the layer (e.g., `pymysql-layer`).
5. Upload the `pymysql-layer.zip` file created in Step 1.
6. Select the compatible **runtime** (e.g., Python 3.9).
7. Click **Create**.

### Step 3: Add the Layer to Your Lambda Function
1. Open your Lambda function in the **AWS Lambda Console**.
2. Go to **Configuration → Layers**.
3. Click **Add a layer**.
4. Select **Custom layers**.
5. Choose the layer you created (`pymysql-layer`).
6. Select the **version** of the layer.
7. Click **Add**.

Now, your Lambda function can import and use `pymysql` in its code.

