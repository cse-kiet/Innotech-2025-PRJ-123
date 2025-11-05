# Setting Up Amazon Lex V2 Bot with Lambda Router Function

This guide explains how to set up an Amazon Lex V2 bot and configure a single Lambda router function to handle all intents.

---

## Step 1: Import or Create Your Lex V2 Bot

1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/lexv2/).
2. Select the desired AWS region (e.g., Asia Pacific - Sydney `ap-southeast-2`).
3. Either create a new bot from scratch or use the **Import bot** option to upload your exported bot ZIP file.
4. Include language locales (e.g., English and Hindi) as needed.
5. Build the bot after import or creation.

---

## Step 2: Configure Lambda Router Function at Bot Alias

1. In the Lex V2 console, navigate to your bot's **Aliases** tab.
2. Select or create an alias (e.g., `prod`, `test`).
3. For each language locale in the alias settings:
   - Find the **Lambda function ARN** input.
   - Enter your Lambda router function ARN.
4. Save the alias configuration.

---

## Step 3: Enable Code Hooks in Intents

- Ensure your intents have Lambda invocation enabled via code hooks:
  - This is usually set in the intent during design or reflected in your imported JSON.
  - Code hooks include **initialization, dialog, and fulfillment** Lambda invocation settings.

---

## Step 4: Build and Publish the Bot Alias

1. Build the bot alias to apply changes.
2. Test the bot in the console to verify Lambda invocation.
3. Publish the alias once testing is successful.

---

## Notes

- The Lambda router function will be invoked for all intents with code hooks enabled.
- You do **not need to configure Lambda ARN per intent** when using this method.
- Make sure your Lambda function permissions allow Lex to invoke it.

---

*For detailed information, refer to the [Amazon Lex V2 Lambda integration documentation](https://docs.aws.amazon.com/lexv2/latest/dg/lambda-attach.html).*

