export const paymentHistory = [
    {
        id: 1,
        packageName: "VIP 1 month",
        amount: 500000,
        currency: "VND",
        status: "SUCCESS",
        paymentDate: "2023-10-10T15:30:00Z",
        expiryDate: "2023-11-10T15:30:00Z",
        transactionId: "VNP13579246",
        paymentMethod: "VNPay",
    },
    {
        id: 2,
        packageName: "VIP 3 months",
        amount: 1350000,
        currency: "VND",
        status: "SUCCESS",
        paymentDate: "2023-07-05T10:15:00Z",
        expiryDate: "2023-10-05T10:15:00Z",
        transactionId: "VNP24680135",
        paymentMethod: "VNPay",
    },
    {
        id: 3,
        packageName: "VIP 6 months",
        amount: 2400000,
        currency: "VND",
        status: "FAILED",
        paymentDate: "2023-09-20T08:45:00Z",
        expiryDate: null,
        transactionId: "VNP98765432",
        paymentMethod: "VNPay",
        errorMessage: "Payment gateway timeout",
    },
    {
        id: 4,
        packageName: "VIP 1 month",
        amount: 500000,
        currency: "VND",
        status: "PENDING",
        paymentDate: "2023-10-15T14:20:00Z",
        expiryDate: null,
        transactionId: "VNP45678901",
        paymentMethod: "VNPay",
    },
];

export const getPaymentHistory = () => {
    return paymentHistory.sort(
        (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
    );
};

export const getActiveSubscription = () => {
    const now = new Date();
    const active = paymentHistory.find(
        (payment) =>
            payment.status === "SUCCESS" && new Date(payment.expiryDate) > now
    );
    return active || null;
};
