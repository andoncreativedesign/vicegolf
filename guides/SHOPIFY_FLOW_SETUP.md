# Shopify Flow Setup: Membership Request Notification

This guide documents the Shopify Flow workflow created to handle membership requests from the Account page.

## Workflow Overview
**Trigger**: Customer tags added
**Condition**: Tag equals `membership_requested`
**Action**: Send internal email to staff

---

## Step-by-Step Configuration

### 1. Create a New Workflow
1. Go to **Shopify Admin** > **Apps** > **Shopify Flow**.
2. Click **Create workflow**.
3. Click **Select a trigger**.

### 2. Configure the Trigger
1. Search for and select **Customer tags added**.
   - *Description: Start when a customer has tags added.*

### 3. Add the Condition
1. Click the **(+)** button next to the trigger and select **Condition**.
2. Click **Add criteria** (or "Select criteria").
3. In the search bar, type `tags` and select **`customer / tags`**.
   - *Note: Ensure you select the one described as "A list of tags associated with the customer" or "A comma separated list..."*
4. Set the operator to **Equal to** (since the list logic implies "contains this item").
5. In the **Value** field, type exactly: `membership_requested`
6. Press **Enter** to confirm the value.

### 4. Add the Action (Send Email)
1. Follow the **Then** (True) path from the condition.
2. Click the **(+)** button and select **Action**.
3. Search for **Send internal email** and select it.
4. Fill in the email details:
   - **To**: `[Enter Staff Email Addresses]` (comma-separated).
   - **Subject**: `New Membership Request: {{customer.firstName}} {{customer.lastName}}`
   - **Message**:
     ```text
     A new membership request has been submitted.

     Customer Details:
     Name: {{customer.firstName}} {{customer.lastName}}
     Email: {{customer.email}}

     Link to Customer Profile:
     https://admin.shopify.com/store/[YOUR_STORE_HANDLE]/customers/{{customer.id | remove: 'gid://shopify/Customer/'}}
     ```
   - *Tip: Replace `[YOUR_STORE_HANDLE]` with your actual store handle (e.g., `vice-golf-development`).*

### 5. Activate
1. Click **Turn on workflow** in the top right corner.
2. The workflow is now live.

## Testing
1. Go to the storefront Account page.
2. Click the **Request Membership** button.
3. Verify that:
   - The button text changes to "Requesting..." then "Requested".
   - The customer in Shopify Admin now has the tag `membership_requested`.
   - The staff email receives the notification.
