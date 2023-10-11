import XLSX from "xlsx";

export const ExportExcelFile = () => {

const handleOnExport = () => {
    console.log("");
}


    return(
        <button
            type="button"
            className='compute-btn button'
             onClick={handleOnExport}>
                Export Result
                </button>
    )
}