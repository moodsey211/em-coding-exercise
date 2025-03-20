# Subscriptions

## Overview

This feature will allow user to pay for monthly or yearly subscription to access premium content.

## Considerations

### PCI Compliance

This document assumes that we will not be applying for PCI compliance. This means that we will not be storing credit card information nor are we allowed to accept inputs related to credit card. With this in mind, we should be using a third party service to process payments/subscriptions.

### Third Party Service

The following are possible third party services that we can use:

- Stripe Billing
- Zoho Billing

Further research is needed to determine which one is the best fit for our use case.

### Implementations

Implementations will vary based on the third party service that we will be using.

### Action Items

- [ ] Research third party services
- [ ] Determine our pricing model
- [ ] Determine actions to take for delinquent accounts
- [ ] Determine if we will have free trial
- [ ] Determine how we will handle grace periods
- [ ] Draft TOS
- [ ] Determine how to reach out to users who are nearing the end of their subscription
- [ ] Determine if we will allow refunds