import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download } from "lucide-react"; // or any icon library


const ExportToExcel = ({ fileName = "calorie-data" }) => {
  const userData = useSelector((state) => state.backend.data);
  const dataToBeExported = userData?.DateWise;

  console.log("dataToBeExported is:", dataToBeExported);

  const handleDownload = () => {
    if (!dataToBeExported || dataToBeExported.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Format each food item as a separate row
    const formattedData = dataToBeExported.flatMap((entry) =>
      entry.fooditems.map((item) => ({
        Date: entry.date,
        "Food Item": item.name,
        Calories: item.calories,
      }))
    );

    console.log("formattedData is :",formattedData)

    // Generate worksheet & workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CalorieData");

    // Convert to blob and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${fileName}.xlsx`);
  };

  return (

<button
  className="bg-green-600 mt-4 text-white px-4 py-2 hover:bg-green-700 pointer flex items-center gap-2"
  onClick={handleDownload}
>
  <Download size={18} />
   (Excel)
</button>

  );
};

export default ExportToExcel;