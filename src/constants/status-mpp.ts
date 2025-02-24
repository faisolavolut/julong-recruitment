export const statusMpp = [
  { value: "DRAFTED", label: "Draft" },
  { value: "DRAFT", label: "Draft" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "IN PROGRESS", label: "In Progress" },
  { value: "NEED APPROVAL", label: "Need Approval" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "COMPLETED", label: "Completed" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "open", label: "Open" },
  { value: "close", label: "Close" },
  { value: "complete", label: "Complete" },
  { value: "not_open", label: "Not Open" },
  { value: "OFF_BUDGET", label: "Off Budget" },
  { value: "ON_BUDGET", label: "On Budget" },
  { value: "APPLIED", label: "Applied" },
  { value: "PENDING", label: "Pending" },
  { value: "ADMINISTRATIVE_SELECTION", label: "Administrative" },
  { value: "TEST", label: "Test" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "FGD", label: "FGD" },
  { value: "SURAT_PENGANTAR_MASUK", label: "Surat Pengantar Masuk" },
  { value: "SURAT_IZIN_ORANG_TUA", label: "Surat Izin Orang Tua" },
  { value: "FINAL_INTERVIEW", label: "Final Interview" },
  { value: "KARYAWAN_TETAP", label: "Karyawan Tetap" },
  { value: "OFFERING_LETTER", label: "Offering Letter" },
  { value: "CONTRACT_DOCUMENT", label: "Contract Document" },
  { value: "DOCUMENT_CHECKING", label: "Document Checking" },
  { value: "FINAL_RESULT", label: "Final Result" },
];
export const getStatusLabel = (value: string) => {
  const status = statusMpp.find(
    (item) => item.value.toLowerCase() === value.toLowerCase()
  );
  return status ? status.label : value;
};
