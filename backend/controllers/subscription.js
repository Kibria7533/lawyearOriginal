const stripeUtil = require("../utitls/stripeUtil");
const { UserModel } = require("../db");

module.exports = {
    GetSubscription: async (req, res) => {
        try {
            const subscriptionId = req.user.stripe_subscription_id;
            let subscription = await stripeUtil.getSubscriptionById(subscriptionId)

            let returnSubscriptionObj = {
                expires_in: new Date(subscription.current_period_end * 1000).toLocaleDateString("en-US"),
                price: subscription.plan.amount / 100,
                interval: subscription.plan.interval,
                team_size: subscription.quantity,
                trial_end: subscription.trial_end,
                plan_name: stripeUtil.getPricePlanNameById(subscription.plan.id).name,
            }

            return res.status(200).json({
                subscription: returnSubscriptionObj,
                success: true,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json(error?.message || error);
        }
    },

    createPaymentMethod: async (req, res) => {
        try {

            let customerId = req.user.stripe_customer_id
            let expiry = req.body.expiry.split("/");

            let body = {
                type: "card",
                card: {
                    number: req.body.cardNumber,
                    exp_month: expiry[0],
                    exp_year: expiry[1],
                    cvc: req.body.cvv,
                }
            }

            let paymentMethod = await stripeUtil.addPaymentMethod(customerId, body)

            return res.status(200).json({
                paymentMethod: paymentMethod,
                success: true,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json(error?.message || error);
        }
    },

    removePaymentMethod: async (req, res) => {
        try {

            let customerId = req.user.stripe_customer_id
            let expiry = req.body.expiry.split("/");

            let body = {
                type: "card",
                card: {
                    number: req.body.cardNumber,
                    exp_month: expiry[0],
                    exp_year: expiry[1],
                    cvc: req.body.cvv,
                }
            }

            let paymentMethod = await stripeUtil.addPaymentMethod(customerId, body)

            return res.status(200).json({
                paymentMethod: paymentMethod,
                success: true,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json(error?.message || error);
        }
    },

    getAllPaymentMethods: async (req, res) => {
        try {
            let customerId = req.user.stripe_customer_id
            let response = await stripeUtil.listPaymentMethods(customerId, 'card')
            let paymentMethods = []

            response.data.map((paymentMethod) => {
                paymentMethods.push({
                    id: paymentMethod.id,
                    type: paymentMethod.card.brand,
                    endingNumber: paymentMethod.card.last4,
                    expiration: paymentMethod.card.exp_month + "/" + paymentMethod.card.exp_year,
                    status: "Active",
                    img: "/img/visa.svg",
                    blurred: false,
                    fix: false,
                })
            })

            return res.status(200).json({
                paymentMethods: paymentMethods,
                success: true,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json(error?.message || error);
        }
    },

    getAllInvoices: async (req, res) => {
        try {

            let customerId = req.user.stripe_customer_id

            let response = await stripeUtil.listInvoices(customerId)
            let invoices = []

            response.data.map((invoice) => {
                invoices.push({
                    id: invoice.id,
                    created_at: new Date(invoice.created * 1000).toLocaleDateString("en-US"),
                    amount: invoice.amount_paid,
                    plan: invoice.lines.data[0].description,
                    hosted_invoice_url: invoice.hosted_invoice_url,
                    status: invoice.status
                })
            })

            return res.status(200).json({
                invoices: invoices,
                success: true,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json(error?.message || error);
        }
    },

    detachPaymentMethod: async (req, res) => {
        try {

            let paymentMethodId = req.body.paymentMethodId
            let response = await stripeUtil.removePaymentMethod(paymentMethodId)

            return res.status(200).json({
                paymentMethod: response,
                success: true,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json(error?.message || error);
        }
    },

    createCheckoutSession: async (req, res) => {
        try {

            let customerId = req.user.stripe_customer_id
            let subscriptionPlan = req.body.subscriptionPlan
            let quantity = req.body.quantity

            let response = await stripeUtil.createSession(customerId, subscriptionPlan, quantity)
            let session = {
                id: response.id,
                url: response.url
            }

            return res.status(200).json({
                session: session,
                success: true,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json(error?.message || error);
        }
    },

    checkoutSessionCompletedWebHook: async (req, res) => {
        try {

            let sessionId = req.body.data.object.id
            let customerId = req.body.data.object.customer
            let session = await stripeUtil.getSession(sessionId)
            let subscriptionId = session.subscription

            let subscription = await stripeUtil.getSubscriptionById(subscriptionId)

            // Update user model
            let user = await UserModel.update(
                {
                    stripe_subscription_id : subscription.id
                },
                {
                    where: {
                        stripe_customer_id: customerId
                    },
                }
            )

            return res.status(200).json({
                session: res.body,
                success: true,
            });
        } catch (error) {
            console.log(error);
            res.status(400).json(error?.message || error);
        }
    }

};
