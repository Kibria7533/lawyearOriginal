const {stripeSecretKey} = require("../config");
const {
    stripeBusinessMonthlyPlanKey,
    stripeIndividualMonthlyPlanKey,
    stripeBusinessYearlyPlanKey,
    stripeIndividualYearlyPlanKey,
    stripeIndividualDailyPlanKey,
    stripeBusinessDailyPlanKey
} = require("../config");
const stripe = require('stripe')(stripeSecretKey);


module.exports = {

    createCustomer: async (name, email) => {
        const customer = await stripe.customers.create({
            email: email,
            name: name,
        });

        return customer;
    },

    createSubscription: async (customer, subscriptionPlan, trial_period_days) => {

        // Determine price plan
        let priceId = null
        if (subscriptionPlan == "individual_monthly") {
            priceId = stripeIndividualMonthlyPlanKey
        } else if (subscriptionPlan == "individual_yearly") {
            priceId = stripeIndividualYearlyPlanKey
        } else if (subscriptionPlan == "business_monthly") {
            priceId = stripeBusinessMonthlyPlanKey
        } else if (subscriptionPlan == "business_yearly") {
            priceId = stripeBusinessYearlyPlanKey
        } else if (subscriptionPlan == "individual_daily") {
            priceId = stripeIndividualDailyPlanKey
        } else if (subscriptionPlan == "business_daily") {
            priceId = stripeBusinessDailyPlanKey
        }

        // Create subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                {
                    price: priceId,
                },
            ],
            collection_method: 'send_invoice',
            days_until_due: 3,
            trial_period_days:trial_period_days
        });

        return subscription
    },

    addPaymentMethod: async (customerId, body) => {

        // Create a Payment Method
        const paymentMethod = await stripe.paymentMethods.create(body);

        // Attach the Payment Method to a customer
        return await stripe.paymentMethods.attach(
            paymentMethod.id,
            {customer: customerId}
        );
    },

    removePaymentMethod: async (paymentMethodId) => {

        const paymentMethod = await stripe.paymentMethods.detach(
            paymentMethodId
        );

        return paymentMethod
    },

    getBillingHistory: async (type, card, customer) => {
        const paymentIntents = await stripe.paymentIntents.list({
            limit: 100,
        });
        return paymentIntents
    },

    getSubscriptionById: async (subscriptionId) => {
        const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
        );
        console.log(subscription)
        return subscription
    },

    listPaymentMethods: async (customerId, type) => {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: type,
        });
        return paymentMethods
    },

    listInvoices: async (customerId) => {
        const invoices = await stripe.invoices.list({
            customer: customerId,
        });
        return invoices
    },

    createSession: async (customerId, subscriptionPlan, quantity) => {

        let priceId = null
        if (subscriptionPlan == "individual_monthly") {
            priceId = stripeIndividualMonthlyPlanKey
        } else if (subscriptionPlan == "individual_yearly") {
            priceId = stripeIndividualYearlyPlanKey
        } else if (subscriptionPlan == "business_monthly") {
            priceId = stripeBusinessMonthlyPlanKey
        } else if (subscriptionPlan == "business_yearly") {
            priceId = stripeBusinessYearlyPlanKey
        } else if (subscriptionPlan == "individual_daily") {
            priceId = stripeIndividualDailyPlanKey
        } else if (subscriptionPlan == "business_daily") {
            priceId = stripeBusinessDailyPlanKey
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            success_url: 'https://dossier-dev-app-hjmzd.ondigitalocean.app/subscription',
            cancel_url: 'https://dossier-dev-app-hjmzd.ondigitalocean.app/subscription',
            line_items: [
                {price: priceId, quantity: quantity},
            ],
            mode: 'subscription',
        });
        return session
    },

    getSession: async (sessionId) => {
        const session = await stripe.checkout.sessions.retrieve(
            sessionId
        );
        return session
    },

    getPaymentIntent: async (paymentIntentId) => {
        const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
        );
        return paymentIntent
    },

    getPricePlanNameById: (priceId) => {

        if (priceId == stripeIndividualMonthlyPlanKey) {
            return {name: "Individual Plan", Internal: "Monthly"}
        } else if (priceId == stripeIndividualYearlyPlanKey) {
            return {name: "Individual Plan", Internal: "Yearly"}
        } else if (priceId ==stripeBusinessMonthlyPlanKey) {
            return {name: "Business Plan", Internal: "Monthly"}
        } else if (priceId == stripeBusinessYearlyPlanKey) {
            return {name: "Business Plan", Internal: "Yearly"}
        } else if (priceId == stripeIndividualDailyPlanKey) {
            return {name: "Individual Plan", Internal: "Daily"}
        } else if (priceId == stripeBusinessDailyPlanKey) {
            return {name: "Business Plan", Internal: "Daily"}
        }

    }

}
