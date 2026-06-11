

export const validateSSLPayment = async (valId: string) => {
    const isProduction = process.env.NODE_ENV === 'production';

    const baseURL = isProduction
        ? 'https://securepay.sslcommerz.com'
        : 'https://sandbox.sslcommerz.com';

    const url = `${baseURL}/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${process.env.STORE_ID}&store_passwd=${process.env.STORE_PASSWORD}&v=1&format=json`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Validation API error: ${response.status}`);
        }

        const data = await response.json();

        console.log(`Payment Validation ${isProduction ? 'Production' : 'Sandbox'}:`, {
            valId,
            status: data.status,
            tran_id: data.tran_id,
            amount: data.amount
        });

        return data;
    } catch (error) {
        console.error("Validation Error:", error);
        throw error;
    }
};