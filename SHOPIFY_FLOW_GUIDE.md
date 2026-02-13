# Shopify Flow Guide: Return Notification Setup

Since the application is creating returns using the API (which simulates a merchant-created return), the default "New return request" email notification is often skipped by Shopify (as it expects these to only be triggered by customer-initiated requests via the Storefront API).

To ensure the Admin receives an email notification every time a return is created via the app, follow these steps to set up a **Shopify Flow** workflow.

## Prerequisites

1.  Ensure the **Shopify Flow** app is installed on your store.
    *   [Install Shopify Flow](https://apps.shopify.com/flow)

## Step-by-Step Guide

### 1. Create a New Workflow

1.  Open the **Shopify Flow** app in your Shopify Admin.
2.  Click **Create workflow**.
3.  Click **Select a trigger**.

### 2. Configure the Trigger

Since "Return created" is not visible in your list, please use **"Return approved"**.

1.  In the search bar, type `Return approved`.
2.  Select the **Return approved** trigger.
    *   **Reason:** The app creates returns via the API which are immediately set to "Open" status (effectively "Approved"). This trigger will catch these returns.

### 3. (Optional) Add Conditions

To filter for app-created returns specifically:
1.  Click the **Output** connector (+) next to the trigger.
2.  Select **Condition**.
3.  Check if `Return > Status` is `OPEN`.

### 4. Configure the Action (Send Email)

1.  Click the **Then** connector (+) (or the connector after your condition).
2.  Select **Action**.
3.  Select **Send internal email**.

#### Recommended Action Settings:

*   **To**: `bornovtechnologies@gmail.com`
*   **Subject**: `🔄 Return Request - Order {{return.order.name}}`
*   **Message**:
    Copy and paste this HTML template (matching your Vice Status email design):

    ```html
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #ffffff; width: 100%;">
      
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background-color: #000000; padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 2px;">RETURN REQUEST</h1>
        </div>
        
        <!-- Action Required Badge -->
        <div style="background-color: #f5f5f5; padding: 12px 20px; text-align: center; border-bottom: 1px solid #e5e5e5;">
          <span style="display: inline-block; background-color: #ff6b6b; color: #ffffff; padding: 6px 16px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: 1px;">ACTION REQUIRED</span>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px 20px;">
          
          <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 10px 0; color: #000000;">Return Created</h2>
          <p style="margin: 0 0 30px 0; color: #666666; font-size: 14px;">A new return has been requested for order {{return.order.name}}.</p>
          
          <!-- Customer Section -->
          <div style="background-color: #f9f9f9; padding: 20px; margin-bottom: 20px; border-radius: 6px;">
            <h3 style="font-size: 11px; font-weight: 600; letter-spacing: 1px; color: #999999; margin: 0 0 12px 0; text-transform: uppercase;">Customer Name</h3>
            <p style="margin: 0 0 15px 0; color: #000000; font-size: 14px;">{{return.order.customer.firstName}} {{return.order.customer.lastName}}</p>
            
            <h3 style="font-size: 11px; font-weight: 600; letter-spacing: 1px; color: #999999; margin: 0 0 12px 0; text-transform: uppercase;">Email Address</h3>
            <p style="margin: 0; color: #000000; font-size: 14px;">{{return.order.email}}</p>
          </div>
          
          <!-- Order Details Section -->
          <div style="background-color: #f9f9f9; padding: 20px; margin-bottom: 20px; border-radius: 6px;">
            <h3 style="font-size: 11px; font-weight: 600; letter-spacing: 1px; color: #999999; margin: 0 0 12px 0; text-transform: uppercase;">Order Details</h3>
            <p style="margin: 0 0 8px 0; color: #666666; font-size: 13px;">Order Number: <strong style="color: #000000;">{{return.order.name}}</strong></p>
            <p style="margin: 0 0 8px 0; color: #666666; font-size: 13px;">Order Date: <strong style="color: #000000;">{{return.order.createdAt}}</strong></p>
            <p style="margin: 0; color: #666666; font-size: 13px;">Return ID: <strong style="color: #000000;">{{return.id}}</strong></p>
          </div>
          
          <!-- Shipping Address Section -->
          <div style="background-color: #f9f9f9; padding: 20px; margin-bottom: 20px; border-radius: 6px;">
            <h3 style="font-size: 11px; font-weight: 600; letter-spacing: 1px; color: #999999; margin: 0 0 12px 0; text-transform: uppercase;">Shipping Address</h3>
            <p style="margin: 0; color: #000000; font-size: 14px; line-height: 1.6;">
              {{return.order.shippingAddress.address1}}<br>
              {% if return.order.shippingAddress.address2 %}{{return.order.shippingAddress.address2}}<br>{% endif %}
              {{return.order.shippingAddress.city}}, {{return.order.shippingAddress.provinceCode}} {{return.order.shippingAddress.zip}}<br>
              {{return.order.shippingAddress.country}}
            </p>
          </div>
          
          
          <!-- View Order Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://admin.shopify.com/store/vice-golf-development/orders/{{return.order.id}}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px; letter-spacing: 1px;">VIEW ORDER</a>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
          <p style="margin: 0 0 5px 0; color: #999999; font-size: 12px;">This is an automated notification from Vice Golf Development</p>
          <p style="margin: 0; color: #999999; font-size: 12px;">© 2026 Vice Golf. All rights reserved.</p>
        </div>
        
      </div>
      
    </div>
    ```

### 5. Activate the Workflow

1.  Click **Turn on workflow** in the top right corner.
2.  Name your workflow (e.g., "Admin Notification: Return Requests").

## Why is this necessary?

The current implementation uses the **Admin API (`returnCreate`)**. In Shopify's system:
*   **Admin API (`returnCreate`)** = "Merchant created a return on behalf of customer". -> *No auto-email*.
*   **Storefront API (`requestReturn`)** = "Customer requested a return". -> *Triggers "New return request" email*.

By using Shopify Flow, you bypass this distinction and ensure you get an email for *any* return creation event, giving you full control over the notification process.

## Email Preview

The email will include:
- ✅ Professional black header with "RETURN REQUEST"
- ✅ Red "ACTION REQUIRED" badge
- ✅ Customer name and email
- ✅ Order number, date, and return ID
- ✅ Complete shipping address
- ✅ Direct "VIEW ORDER" button linking to Shopify Admin
- ✅ Professional footer with branding

## Testing

1.  Create a test return through your application
2.  Check your email inbox for the notification
3.  Verify all details are correct and the "VIEW ORDER" button works

## Troubleshooting

**Email not received?**
- Check that the workflow is turned ON
- Verify the email address is correct
- Check spam/junk folder
- Review the workflow run history in Shopify Flow

**Missing data in email?**
- Some fields may be empty if not set on the order
- Use the "Add variable" button in Flow to verify available fields

**Liquid errors?**
- Ensure you copied the entire HTML template
- Check for any missing closing tags or braces
