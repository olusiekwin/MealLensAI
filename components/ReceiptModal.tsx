"use client"

import type React from "react"
import { Modal, View, Text, TouchableOpacity, ScrollView, Dimensions, Share, Alert } from "react-native"
import { X, Download, Share2, Check } from "lucide-react-native"
import Svg, { Rect } from "react-native-svg"

const { height } = Dimensions.get("window")

interface ReceiptData {
  transactionId: string
  amount: string
  method: string
  plan: string
  date: string
  serialNumber: string
  barcode: string
}

interface ReceiptModalProps {
  visible: boolean
  onClose: () => void
  receiptData: ReceiptData
  isDarkMode: boolean
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ visible, onClose, receiptData, isDarkMode }) => {
  const generateBarcode = (data: string) => {
    // Simple barcode representation using rectangles
    const bars = []
    for (let i = 0; i < 50; i++) {
      const width = Math.random() > 0.5 ? 2 : 4
      const height = 40
      bars.push(<Rect key={i} x={i * 6} y={0} width={width} height={height} fill="#000000" />)
    }
    return bars
  }

  const handleShare = async () => {
    try {
      const message = `
MealLensAI Payment Receipt

Transaction ID: ${receiptData.transactionId}
Amount: ${receiptData.amount}
Payment Method: ${receiptData.method}
Plan: ${receiptData.plan}
Date: ${new Date(receiptData.date).toLocaleDateString()}
Serial: ${receiptData.serialNumber}

Thank you for your subscription!
      `

      await Share.share({
        message: message.trim(),
        title: "Payment Receipt",
      })
    } catch (error) {
      console.error("Share error:", error)
      Alert.alert("Error", "Failed to share receipt")
    }
  }

  const handleDownload = () => {
    Alert.alert("Download", "Receipt download functionality would be implemented here")
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={receiptStyles.modalOverlay}>
        <View
          style={[
            receiptStyles.modalContainer,
            { height: height * 0.85 },
            isDarkMode && receiptStyles.modalContainerDark,
          ]}
        >
          <View style={[receiptStyles.header, isDarkMode && receiptStyles.headerDark]}>
            <View style={receiptStyles.headerContent}>
              <Text style={[receiptStyles.title, isDarkMode && receiptStyles.titleDark]}>Payment Receipt</Text>
              <Text style={[receiptStyles.subtitle, isDarkMode && receiptStyles.subtitleDark]}>
                Transaction completed successfully
              </Text>
            </View>
            <TouchableOpacity
              style={[receiptStyles.closeButton, isDarkMode && receiptStyles.closeButtonDark]}
              onPress={onClose}
            >
              <X size={20} color={isDarkMode ? "#FFFFFF" : "#202026"} />
            </TouchableOpacity>
          </View>

          <ScrollView style={receiptStyles.content} showsVerticalScrollIndicator={false}>
            {/* Success Icon */}
            <View style={receiptStyles.successContainer}>
              <View style={receiptStyles.successIcon}>
                <Check size={32} color="#FFFFFF" />
              </View>
              <Text style={[receiptStyles.successText, isDarkMode && receiptStyles.successTextDark]}>
                Payment Successful!
              </Text>
            </View>

            {/* Receipt Details */}
            <View style={[receiptStyles.receiptCard, isDarkMode && receiptStyles.receiptCardDark]}>
              <View style={receiptStyles.receiptHeader}>
                <Text style={[receiptStyles.companyName, isDarkMode && receiptStyles.companyNameDark]}>MealLensAI</Text>
                <Text style={[receiptStyles.receiptDate, isDarkMode && receiptStyles.receiptDateDark]}>
                  {new Date(receiptData.date).toLocaleDateString()}
                </Text>
              </View>

              <View style={receiptStyles.divider} />

              <View style={receiptStyles.detailsSection}>
                <View style={receiptStyles.detailRow}>
                  <Text style={[receiptStyles.detailLabel, isDarkMode && receiptStyles.detailLabelDark]}>
                    Transaction ID
                  </Text>
                  <Text style={[receiptStyles.detailValue, isDarkMode && receiptStyles.detailValueDark]}>
                    {receiptData.transactionId}
                  </Text>
                </View>

                <View style={receiptStyles.detailRow}>
                  <Text style={[receiptStyles.detailLabel, isDarkMode && receiptStyles.detailLabelDark]}>
                    Amount Paid
                  </Text>
                  <Text style={[receiptStyles.detailValue, receiptStyles.amountValue]}>{receiptData.amount}</Text>
                </View>

                <View style={receiptStyles.detailRow}>
                  <Text style={[receiptStyles.detailLabel, isDarkMode && receiptStyles.detailLabelDark]}>
                    Payment Method
                  </Text>
                  <Text style={[receiptStyles.detailValue, isDarkMode && receiptStyles.detailValueDark]}>
                    {receiptData.method}
                  </Text>
                </View>

                <View style={receiptStyles.detailRow}>
                  <Text style={[receiptStyles.detailLabel, isDarkMode && receiptStyles.detailLabelDark]}>
                    Subscription Plan
                  </Text>
                  <Text style={[receiptStyles.detailValue, isDarkMode && receiptStyles.detailValueDark]}>
                    {receiptData.plan}
                  </Text>
                </View>

                <View style={receiptStyles.detailRow}>
                  <Text style={[receiptStyles.detailLabel, isDarkMode && receiptStyles.detailLabelDark]}>
                    Serial Number
                  </Text>
                  <Text style={[receiptStyles.detailValue, isDarkMode && receiptStyles.detailValueDark]}>
                    {receiptData.serialNumber}
                  </Text>
                </View>
              </View>

              <View style={receiptStyles.divider} />

              {/* Barcode */}
              <View style={receiptStyles.barcodeSection}>
                <Text style={[receiptStyles.barcodeLabel, isDarkMode && receiptStyles.barcodeLabelDark]}>
                  Transaction Barcode
                </Text>
                <View style={receiptStyles.barcodeContainer}>
                  <Svg width={300} height={40}>
                    {generateBarcode(receiptData.barcode)}
                  </Svg>
                </View>
                <Text style={[receiptStyles.barcodeText, isDarkMode && receiptStyles.barcodeTextDark]}>
                  {receiptData.barcode}
                </Text>
              </View>

              <View style={receiptStyles.divider} />

              {/* Footer */}
              <View style={receiptStyles.receiptFooter}>
                <Text style={[receiptStyles.footerText, isDarkMode && receiptStyles.footerTextDark]}>
                  Thank you for choosing MealLensAI Premium!
                </Text>
                <Text style={[receiptStyles.footerSubtext, isDarkMode && receiptStyles.footerSubtextDark]}>
                  Your subscription is now active and ready to use.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={[receiptStyles.footer, isDarkMode && receiptStyles.footerDark]}>
            <TouchableOpacity style={[receiptStyles.actionButton, receiptStyles.shareButton]} onPress={handleShare}>
              <Share2 size={16} color="#FFFFFF" style={receiptStyles.buttonIcon} />
              <Text style={receiptStyles.actionButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[receiptStyles.actionButton, receiptStyles.downloadButton]}
              onPress={handleDownload}
            >
              <Download size={16} color="#FFFFFF" style={receiptStyles.buttonIcon} />
              <Text style={receiptStyles.actionButtonText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const receiptStyles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
  },
  modalContainerDark: {
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerDark: {
    borderBottomColor: "#333333",
  },
  headerContent: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#202026",
    marginBottom: 8,
  },
  titleDark: {
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  subtitleDark: {
    color: "#CCCCCC",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  closeButtonDark: {
    backgroundColor: "#333333",
    borderColor: "#444444",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#67C74F",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  successText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#202026",
  },
  successTextDark: {
    color: "#FFFFFF",
  },
  receiptCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  receiptCardDark: {
    backgroundColor: "#2A2A2A",
    borderColor: "#333333",
  },
  receiptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  companyName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF6A00",
  },
  companyNameDark: {
    color: "#FF6A00",
  },
  receiptDate: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  receiptDateDark: {
    color: "#CCCCCC",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 16,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    flex: 1,
  },
  detailLabelDark: {
    color: "#CCCCCC",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#202026",
    flex: 1,
    textAlign: "right",
  },
  detailValueDark: {
    color: "#FFFFFF",
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6A00",
  },
  barcodeSection: {
    alignItems: "center",
    marginVertical: 16,
  },
  barcodeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  barcodeLabelDark: {
    color: "#CCCCCC",
  },
  barcodeContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  barcodeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    letterSpacing: 2,
  },
  barcodeTextDark: {
    color: "#CCCCCC",
  },
  receiptFooter: {
    alignItems: "center",
    marginTop: 16,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#202026",
    marginBottom: 4,
    textAlign: "center",
  },
  footerTextDark: {
    color: "#FFFFFF",
  },
  footerSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  footerSubtextDark: {
    color: "#CCCCCC",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  footerDark: {
    borderTopColor: "#333333",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  shareButton: {
    backgroundColor: "#3498DB",
  },
  downloadButton: {
    backgroundColor: "#FF6A00",
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
}

export default ReceiptModal
