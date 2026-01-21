# Shopify Flow Setup: Production Store Migration

This guide provides step-by-step instructions to replicate the Membership Request Notification workflow from your development store to your **production Shopify store**.

## Important Notes
- ⚠️ Shopify Flow workflows **cannot be exported/imported** between stores
- You must manually recreate the workflow in production
- This guide provides exact configuration values to ensure consistency

---

## Prerequisites
- Access to your **production Shopify Admin**
- Shopify Flow app installed (it's free for Shopify Plus stores)
- Staff email addresses for notifications

---

## Step-by-Step Setup for Production

### 1. Access Shopify Flow in Production
1. Log into your **production Shopify Admin**
2. Go to **Apps** > **Shopify Flow**
3. Click **Create workflow**

### 2. Configure the Trigger
1. Click **Select a trigger**
2. Search for: `Customer tags added`
3. Select **Customer tags added**
   - Description: "Start when a customer has tags added"
4. The trigger block should now show "Customer tags added"

### 3. Add the Condition
1. Click the **(+)** button below the trigger
2. Select **Condition**
3. Click **Add criteria** (or "Select criteria")
4. In the search field, type: `tags`
5. Select **`customer / tags`**
   - Look for: "A list of tags associated with the customer"
6. Set the operator to: **Equal to**
7. In the **Value** field, type exactly: `membership_requested`
8. Press **Enter** to confirm

### 4. Add the Email Action
1. Follow the **Then** (True) path from the condition
2. Click the **(+)** button
3. Select **Action**
4. Search for: `Send internal email`
5. Select **Send internal email**

### 5. Configure the Email Details

#### **To:** (Recipients)
```
your-staff-email@example.com, another-staff@example.com
```
*Replace with your actual production staff email addresses (comma-separated)*

#### **Subject:**
```
New Membership Request: {{customer.firstName}} {{customer.lastName}}
```

#### **Message:**
```
A new membership request has been submitted.

Customer Details:
Name: {{customer.firstName}} {{customer.lastName}}
Email: {{customer.email}}

Link to Customer Profile:
https://admin.shopify.com/store/YOUR_PRODUCTION_STORE_HANDLE/customers/{{customer.id | remove: 'gid://shopify/Customer/'}}
```

**Important:** Replace `YOUR_PRODUCTION_STORE_HANDLE` with your actual production store handle.

To find your store handle:
- Look at your Shopify Admin URL
- It will be: `https://admin.shopify.com/store/[YOUR_STORE_HANDLE]/...`
- Example: If your URL is `https://admin.shopify.com/store/vice-golf/...`, use `vice-golf`

### 6. Name and Activate the Workflow
1. At the top of the page, click on "Untitled workflow"
2. Rename it to: `Membership Request Notification`
3. Click **Turn on workflow** (top right corner)
4. Confirm activation

---

## Verification Checklist

Before going live, verify:
- [ ] Trigger is set to "Customer tags added"
- [ ] Condition checks if tags equal `membership_requested`
- [ ] Email recipients are correct production staff emails
- [ ] Store handle in the customer profile link is correct
- [ ] Workflow is **turned ON** (green toggle)

---

## Testing in Production

### Option 1: Test with a Test Customer
1. In Shopify Admin, create a test customer
2. Manually add the tag `membership_requested` to the customer
3. Check if the notification email is received

### Option 2: Test from Storefront (Recommended)
1. Create a test customer account on your production storefront
2. Log in to the account page
3. Click **Request Membership** button
4. Verify:
   - Button shows "Requesting..." then "Requested"
   - Customer in Admin has the `membership_requested` tag
   - Staff receives the notification email

---

## Troubleshooting

### Workflow not triggering?
- Check that the workflow is **turned ON**
- Verify the tag name is exactly `membership_requested` (case-sensitive)
- Check Shopify Flow logs: Go to the workflow > Click "View logs"

### Email not received?
- Verify email addresses are correct
- Check spam/junk folders
- Ensure Shopify Flow has permission to send emails

### Wrong customer link?
- Double-check your store handle in the email template
- Test the link format by manually constructing it with a known customer ID

---

## Differences from Development

Document any differences between your development and production setup:

| Setting | Development | Production |
|---------|-------------|------------|
| Staff Emails | dev-team@example.com | production-team@example.com |
| Store Handle | vice-golf-development | vice-golf |
| Workflow Name | Membership Request Notification | Membership Request Notification |

---

## Maintenance Notes

- **Adding/Removing Staff**: Update the "To" field in the email action
- **Changing Email Template**: Edit the workflow > Click on the email action > Update message
- **Viewing Activity**: Go to Shopify Flow > Select workflow > View logs

---

## Related Files
- Development setup guide: `SHOPIFY_FLOW_SETUP.md`
- Account page component: `app/routes/($locale).account.tsx`
