class PaymentService {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL || "https://api.meallensai.com"

  static async initiateMpesaPayment(paymentData: {
    amount: number
    phone: string
    email: string
    plan: string
  }) {
    try {
      const response = await fetch(`${this.baseURL}/payments/mpesa/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          phone: paymentData.phone,
          email: paymentData.email,
          plan: paymentData.plan,
          currency: "KES",
          callback_url: `${this.baseURL}/payments/mpesa/callback`,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to Paystack payment page or handle M-Pesa prompt
        return {
          success: true,
          transactionId: result.data.reference,
          paymentUrl: result.data.authorization_url,
        }
      } else {
        return {
          success: false,
          message: result.message || "Payment initiation failed",
        }
      }
    } catch (error) {
      console.error("M-Pesa payment error:", error)
      return {
        success: false,
        message: "Network error. Please try again.",
      }
    }
  }

  static async initiateBankTransfer(paymentData: {
    amount: number
    email: string
    plan: string
  }) {
    try {
      const response = await fetch(`${this.baseURL}/payments/bank/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          email: paymentData.email,
          plan: paymentData.plan,
          currency: "USD",
          payment_method: "bank_transfer",
        }),
      })

      const result = await response.json()

      if (result.success) {
        return {
          success: true,
          transactionId: result.data.reference,
          bankDetails: result.data.bank_details,
        }
      } else {
        return {
          success: false,
          message: result.message || "Bank transfer initiation failed",
        }
      }
    } catch (error) {
      console.error("Bank transfer error:", error)
      return {
        success: false,
        message: "Network error. Please try again.",
      }
    }
  }

  static async initiateGooglePay(paymentData: {
    amount: number
    email: string
    plan: string
  }) {
    try {
      const response = await fetch(`${this.baseURL}/payments/googlepay/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          email: paymentData.email,
          plan: paymentData.plan,
          currency: "USD",
          payment_method: "google_pay",
        }),
      })

      const result = await response.json()

      if (result.success) {
        return {
          success: true,
          transactionId: result.data.reference,
          paymentUrl: result.data.authorization_url,
        }
      } else {
        return {
          success: false,
          message: result.message || "Google Pay initiation failed",
        }
      }
    } catch (error) {
      console.error("Google Pay error:", error)
      return {
        success: false,
        message: "Network error. Please try again.",
      }
    }
  }

  static async initiateCreditCard(paymentData: {
    amount: number
    email: string
    plan: string
  }) {
    try {
      const response = await fetch(`${this.baseURL}/payments/card/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          email: paymentData.email,
          plan: paymentData.plan,
          currency: "USD",
          payment_method: "card",
        }),
      })

      const result = await response.json()

      if (result.success) {
        return {
          success: true,
          transactionId: result.data.reference,
          paymentUrl: result.data.authorization_url,
        }
      } else {
        return {
          success: false,
          message: result.message || "Credit card payment initiation failed",
        }
      }
    } catch (error) {
      console.error("Credit card payment error:", error)
      return {
        success: false,
        message: "Network error. Please try again.",
      }
    }
  }

  static async verifyPayment(transactionId: string) {
    try {
      const response = await fetch(`${this.baseURL}/payments/verify/${transactionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Payment verification error:", error)
      return {
        success: false,
        message: "Verification failed",
      }
    }
  }

  private static getAuthToken(): string {
    // Get auth token from storage or context
    return localStorage.getItem("authToken") || ""
  }
}

export default PaymentService
