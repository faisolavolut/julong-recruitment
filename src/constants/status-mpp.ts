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
];
export const getStatusLabel = (value: string) => {
  const status = statusMpp.find(
    (item) => item.value.toLowerCase() === value.toLowerCase()
  );
  return status ? status.label : value;
};
