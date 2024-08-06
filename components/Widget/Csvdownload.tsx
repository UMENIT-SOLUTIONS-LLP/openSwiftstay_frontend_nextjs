const exportToCsv = ({
  headers,
  dataToExport,
  filename = "exported_data.csv",
}: any) => {
  const csvData = [
    headers.map((header: any) => header.label),
    ...dataToExport.map((item: any) => headers.map((header: any) => item[header.key])),
  ];
  const csvContent = csvData.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default exportToCsv;
