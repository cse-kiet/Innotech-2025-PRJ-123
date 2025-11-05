# Setting Up Private Amazon RDS Free Tier and Deploying Database Schema

This guide explains how to create a private Amazon RDS MySQL instance using the security group named `backend` (shared with your EC2 instance) and deploy your database schema and sample data using two SQL files: `schema.sql` and `demodata.sql`.

## Step 1: Sign in to AWS Management Console
- Go to [AWS Console](https://aws.amazon.com/console)
- Sign in or create a new AWS account if you don’t have one.
- Ensure you are eligible for the **AWS Free Tier** (available for 12 months for new accounts).

## Step 2: Launch a Private Amazon RDS MySQL Instance
1. Navigate to the **RDS** service from the AWS Console.
2. Click **Create database**.
3. Select **Standard Create**.
4. Choose **MySQL** as the engine.
5. Under **Templates**, select **Free tier**.
6. Configure settings:
   - DB instance identifier: e.g., `mydb-instance`
   - Master username: e.g., `admin`
   - Master password: set a strong password and remember it.
7. Keep default settings for DB instance size and storage (within free tier limits).
8. In **Connectivity**:
   - Select the same VPC where your EC2 instance resides.
   - Set **Public access** to **No** (making the database private).
   - Under **Security group**, select the existing security group named `backend`, which your EC2 uses.
9. Click **Create database** and wait for the instance status to be **Available**.

## Step 3: Configure Security Group for Access
- Confirm that the `backend` security group allows inbound traffic on port **3306** (MySQL) from within the VPC or from resources assigned to the same security group.
- This configuration ensures only your EC2 instances or other allowed backend resources can connect to the RDS instance, securing it from public traffic.

## Step 4: Connect to Your Private RDS Instance
- Retrieve the endpoint URL from the RDS dashboard (under your DB instance details).
- Since the database is private, connect from your EC2 instance or from a machine within the same VPC (e.g., via SSH tunnel).
- Use a MySQL client on your EC2 or local machine with proper networking setup:


- Enter the master password when prompted.

## Step 5: Create Database (Optional)
You may create a dedicated database before importing schema:


## Step 6: Deploy Schema and Sample Data
- Upload your `schema.sql` and `demodata.sql` files to your EC2 instance or the machine where you run the MySQL client.
- Execute the following commands in order:


## Step 7: Verify Tables and Data
Connect and verify your tables and data:


---

## Additional Notes
- AWS Free Tier includes 750 hours/month, 20GB storage, and specific instance types eligibility.
- A private RDS instance with a shared `backend` security group improves security by limiting access to your VPC backend resources.
- Always secure your database credentials and minimize inbound permissions in your security groups.
- Consider automation with AWS CLI, CloudFormation, or Terraform for production setups.

---

Your private, secure RDS database on AWS free tier is now ready, linked with your EC2 backend, with schema and data deployed via `schema.sql` and `demodata.sql`. Your application can safely connect using the `backend` security group.

