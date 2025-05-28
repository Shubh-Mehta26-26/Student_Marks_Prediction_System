import jsPDF from "jspdf"
import "jspdf-autotable"

// Add type definition for jsPDF with autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export function generatePDF(prediction: any, username: string) {
  // Create a new PDF document
  const doc = new jsPDF()

  // Add header
  doc.setFillColor(124, 58, 237) // Purple color
  doc.rect(0, 0, 210, 30, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.text("Student Performance Report", 105, 15, { align: "center" })

  doc.setFontSize(12)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 25, { align: "center" })

  // Add student information
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.text("Student Information", 14, 40)

  doc.setFontSize(12)
  doc.text(`Student Name: ${username}`, 14, 50)
  doc.text(`Predicted CGPA: ${prediction.cgpa.toFixed(2)}`, 14, 60)

  // Add performance analysis
  doc.setFontSize(14)
  doc.text("Performance Analysis", 14, 75)

  doc.setFontSize(12)

  // Split message into multiple lines if needed
  const messageLines = doc.splitTextToSize(prediction.message, 180)
  doc.text(messageLines, 14, 85)

  let yPos = 85 + messageLines.length * 7

  // Add improvement tips
  if (prediction.tips && prediction.tips.length > 0) {
    doc.setFontSize(14)
    doc.text("Improvement Tips", 14, yPos + 10)

    doc.setFontSize(12)
    yPos += 20

    prediction.tips.forEach((tip: string, index: number) => {
      const tipLines = doc.splitTextToSize(`${index + 1}. ${tip}`, 180)
      doc.text(tipLines, 14, yPos)
      yPos += tipLines.length * 7
    })
  }

  // Add theory subject performance
  yPos += 10
  doc.setFontSize(14)
  doc.text("Theory Subject Performance", 14, yPos)

  const theoryTableData = prediction.data.subjects.map((subject: any) => [
    subject.name,
    `${subject.marks}/60`,
    `${Math.round((subject.marks / 60) * 100)}%`,
    subject.marks < 30 ? "Needs Improvement" : subject.marks < 45 ? "Average" : "Good",
  ])

  doc.autoTable({
    startY: yPos + 5,
    head: [["Subject", "Marks", "Percentage", "Status"]],
    body: theoryTableData,
    theme: "striped",
    headStyles: { fillColor: [124, 58, 237] },
    styles: { halign: "center" },
    columnStyles: {
      0: { halign: "left" },
    },
  })

  // Add practical subject performance
  yPos = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(14)
  doc.text("Practical Subject Performance", 14, yPos)

  const practicalTableData = prediction.data.practicalSubjects.map((subject: any) => [
    subject.name,
    `${subject.marks}/30`,
    `${Math.round((subject.marks / 30) * 100)}%`,
    subject.marks < 15 ? "Needs Improvement" : subject.marks < 22 ? "Average" : "Good",
  ])

  doc.autoTable({
    startY: yPos + 5,
    head: [["Subject", "Marks", "Percentage", "Status"]],
    body: practicalTableData,
    theme: "striped",
    headStyles: { fillColor: [124, 58, 237] },
    styles: { halign: "center" },
    columnStyles: {
      0: { halign: "left" },
    },
  })

  // Add footer
  const pageCount = doc.internal.getNumberOfPages()
  doc.setFontSize(10)
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setTextColor(100, 100, 100)
    doc.text("Student Marks Prediction System - Performance Report", 105, doc.internal.pageSize.height - 10, {
      align: "center",
    })
  }

  return doc
}
