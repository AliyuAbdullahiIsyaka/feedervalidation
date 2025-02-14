import { useState, useEffect } from "react";


const fetchData = async (deviceUID, startDate, endDate, pageNumber, pageSize) => {
  const url = new URL("https://feedercompliancetestapi.azurewebsites.net/api/v1/Energy/validation-energy-data"); 
  url.searchParams.append("deviceUID", deviceUID);
  if (startDate) url.searchParams.append("startDate", startDate);
  if (endDate) url.searchParams.append("endDate", endDate);
  url.searchParams.append("pageSize", pageSize);
  url.searchParams.append("pageNumber", pageNumber);
  
  const response = await fetch(url);
  const result = await response.json();
  return result.data;
};

export default function PaginatedTable() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deviceUID, setDeviceUID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    if (deviceUID) {
      const loadData = async () => {
        console.log(currentPage)
        const result = await fetchData(deviceUID, startDate || null, endDate || null, currentPage, itemsPerPage);
        setData(result);
      };
      loadData();
    }
  }, [deviceUID, startDate, endDate, currentPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="container">
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Device UID"
          value={deviceUID}
          onChange={(e) => setDeviceUID(e.target.value)}
          className="input"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="input"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="input"
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {[
                "Device UID",
                "Timestamp",
                "Frequency",
                "Power Factor",
                "Current L1",
                "Current L2",
                "Current L3",
                "Voltage L1",
                "Voltage L2",
                "Voltage L3",
                "Power",
                "Reactive Power",
                "Apparent Power",
                "Energy Total",
                "Status",
              ].map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{item.deviceUID}</td>
                  <td>{new Date(item.eventTimeStamp).toISOString().replace("T", " ").substring(0, 19)}</td>
                  <td>{item.frequencyAvg}</td>
                  <td>{item.powerFactorAvg}</td>
                  <td>{item.currentLine1}</td>
                  <td>{item.currentLine2}</td>
                  <td>{item.currentLine3}</td>
                  <td>{item.voltageLine12}</td>
                  <td>{item.voltageLine23}</td>
                  <td>{item.voltageLine31}</td>
                  <td>{item.actualPowerInst}</td>
                  <td>{item.reactivePowerInst}</td>
                  <td>{item.apparentPowerInst}</td>
                  <td>{item.activeEnergyTotal}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="no-data">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="page-button"
        >
          Prev
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage+1)}
          //disabled={currentPage === totalPages}
          className="page-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}
