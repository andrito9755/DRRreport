import React, { useState } from 'react';
import './styles.css';
function TableDRR() {
  const [data, setData] = useState([]);
  const [newEntry, setNewEntry] = useState({
    action: '',
    id: '',
    startDate: '',
    endDate: '',
    datesExcluded: [],
    enterLeadCount: '',
    noOfDays: '',
    expectedDRR: '',
    lastUpdated: '',
  });
  
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  const API_BASE_URL = 'http://localhost:3001';

    // Function to calculate the number of days
    const calculateNoOfDays = () => {
      const startDate = new Date(newEntry.startDate);
      const endDate = new Date(newEntry.endDate);
      const excludedDates = newEntry.datesExcluded.map(dateString => {
        // Parse the date in "dd-mm-yyyy" format
        // console.log(dateString);
        const [day, month, year] = dateString.split('/');
        return new Date(year, month - 1, day); // Month is zero-based
      });
    
      // Calculate the total days
      const timeDifference = endDate - startDate;
      const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
    
      // Calculate the number of excluded days
      const excludedDays = excludedDates.filter(excludedDate => {
        // Ensure that the excludedDate is at midnight to make the comparison more precise
        const formattedExcludedDate = new Date(excludedDate);
        formattedExcludedDate.setHours(0, 0, 0, 0);
    
        // Ensure startDate and endDate are at midnight too
        const formattedStartDate = new Date(startDate);
        formattedStartDate.setHours(0, 0, 0, 0);
        const formattedEndDate = new Date(endDate);
        formattedEndDate.setHours(0, 0, 0, 0);
    
        return formattedExcludedDate >= formattedStartDate && formattedExcludedDate <= formattedEndDate;
      }).length;
    
      const noOfDays = totalDays - excludedDays;
    
      // console.log(`totalDays: ${totalDays}`);
      // console.log(`excludedDays: ${excludedDays}`);
      // console.log(`noOfDays: ${noOfDays}`);
    
      return noOfDays;
    };
    
  
    
    function formattedDate(date) {
      console.log("ho raha hai calll buddy")
      const [year,month,day] = date.split('/')
      // return new Date(year,month-1,day);
      return `${day}/${month}/${year}`;
    }

  function isValidDate(dateString) {
    const regex = /^\d{2}-\d{2}-\d{4}$/; // Assumes yyyy-mm-dd format
  
    if (!regex.test(dateString)) {
      // console.error('Invalid date format:', dateString);
      return false;
    }
  
    return true;
  }

  const [isEndDateValid,setIsEndDateValid] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if(name === 'startdate' || name === 'enddate') {
      // setIsEndDateValid(name === 'startdate' || isEndDateValid(value,newEntry.startDate));

      const newEndDate = value;
      const newStartDate = newEntry.startDate;

      const validity = newStartDate <= newEndDate;
      setNewEntry({...newEntry,[name]:value})
      setIsEndDateValid(validity);
    }
  
    else if (name === 'datesExcluded') {
      // Split the input string into an array using a comma
      const datesArray = value.split(',').map(date => date.trim());

    // Validate date formats within the array
      const validDates = datesArray.filter(date => isValidDate(date));
      setNewEntry({ ...newEntry, [name]: datesArray },);
    } else {
      setNewEntry({ ...newEntry, [name]: value });
    }
  };

  // isEndDateValid = (startDate, endDate) => {
  //   const startDateObj = new Date(startDate);
  //   const endDateObj = new Date(endDate);
  //   return startDateObj <= endDateObj; // Ensures that end date is not earlier than start date
  // };
  // Validity check


  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible); // Toggle form visibility
  };


  const addEntry = () => {
    if (newEntry.action && newEntry.id) {
      const endDate = new Date(newEntry.endDate);
      const month = endDate.toLocaleString('default', { month: 'long' });
      const year = endDate.getFullYear();
      const startDate = new Date(newEntry.startDate);
      const timeDifference = endDate - startDate;
      const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
      const monthYear = `${month}, ${year}`;


      if(endDate < startDate) {
        setIsEndDateValid(false);
        return;
      }else {
        setIsEndDateValid(true);
      }

      
      // const noOfDays = totalDays - excludedDays;
      const noOfDays = calculateNoOfDays();

      // Get the current date and time
      const currentDate = new Date();
      const lastUpdated = currentDate.toLocaleString();

      // Calculate Expected DRR
      const leadCount = parseFloat(newEntry.enterLeadCount);

      if ( isNaN(leadCount) || leadCount === 0 ) {
        setShowWarning(true); // Show the warning
        return; // Exit the function
      } else {
        setShowWarning(false); // Hide the warning
      }

      let expectedDRR = 0;
      if(noOfDays === 0) expectedDRR = 0 
      else expectedDRR = parseInt(leadCount / noOfDays);

      const updatedEntry = {
        ...newEntry,
        monthYear, // Calculated and set here
        noOfDays,
        lastUpdated,
        expectedDRR,
      };

      // Make an API call to save the data
      fetch(`${API_BASE_URL}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEntry),
      })
      .then((response) => {
        if (response.ok) {
          // Handle a successful response
          console.log('Data saved successfully.');
        } else {
          // Handle errors
          console.error('Data could not be saved.');
        }
      })
      .catch((error) => {
        console.error('Network error:', error);
      });

      setData([...data, updatedEntry]);

      setNewEntry({
        action: '',
        id: '',
        startDate: '',
        endDate: '',
        datesExcluded: [],
        enterLeadCount: '',
        expectedDRR: expectedDRR,
        lastUpdated: '',
      });
      toggleFormVisibility();
    }
  };
  
  return (
    <div>
      <button onClick={toggleFormVisibility} className="addEntryButton">Add Entry</button>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="table-cell">Action</th>
              <th className="table-cell">ID</th>
              <th className="table-cell">Start Date</th>
              <th className="table-cell">End Date</th>
              <th className="table-cell">Month, Year</th>
              <th className="table-cell">Dates Excluded</th>
              <th className="table-cell">Enter Lead Count</th>
              <th className="table-cell">No of Days</th>
              <th className="table-cell">Expected DRR</th>
              <th className="table-cell">Last Updated</th>
            </tr>
          </thead>
          
          <tbody>
          {isFormVisible && (
            
              <tr>
              <td> <input
                type="text"
                name="action"
                placeholder="Action"
                value={newEntry.action}
                onChange={handleInputChange}
                className='addEntryDiv'
              />
              </td>
              <td>
              <input
                type="text"
                name="id"
                placeholder="ID"
                value={newEntry.id}
                onChange={handleInputChange}
                className='addEntryDiv'
              /></td>
              <td>
              <input
                type="date"
                name="startDate"
                placeholder="Start Date"
                value={newEntry.startDate}
                onChange={handleInputChange}
                className='addEntryDiv'
              />
              </td>
              <td>
              <input
                type="date"
                name="endDate"
                placeholder="End Date"
                value={newEntry.endDate}
                onChange={handleInputChange}
                className={isEndDateValid ? 'addEntryDiv' : 'addEntryDiv error-input'}
              />
              </td>
              <td><input type="text" placeholder='Month, Year' className='addEntryDiv' readOnly/></td>
              <td>
              <input
                type="text"
                name="datesExcluded"
                placeholder="Dates Excluded (comma-seprated)"
                value={newEntry.datesExcluded.join(', ')}
                onChange={handleInputChange}
                className='addEntryDiv'
              />
              </td>
              <td>
              <input
                type="text"
                name="enterLeadCount"
                placeholder="Enter Lead Count"
                value={newEntry.enterLeadCount}
                onChange={handleInputChange}
                className='addEntryDiv'
                required
                
              />
              </td>
              <td>
                <input type="text" placeholder='No. of days'  className='addEntryDiv' readOnly/>
              </td>
              <td>
              <input
                type="text"
                name="expectedDRR"
                placeholder="Expected DRR"
                value={newEntry.expectedDRR}
                onChange={handleInputChange}
                className='addEntryDiv'
              />
              </td>
              <td>
              <input
                type="text"
                name="lastUpdated"
                placeholder="Last Updated"
                value={newEntry.lastUpdated}
                onChange={handleInputChange}
                readOnly
                className='addEntryDiv'
              /></td>
              <td>
              <button onClick={addEntry} className="submitButton">Submit</button> </td>
              </tr>     
      )}
            <tr>
            {showWarning && <td className="error-message">Lead Count should be greater than 0.</td>}

            </tr>
            <tr>
            {!isEndDateValid && <td className="error-message">End date must be after or equal to the start date</td>}
            </tr>
            {data.map((entry, index) => (
              <tr key={index}>
                <td className="table-cell">{entry.action}</td>
                <td className="table-cell">{entry.id}</td>
                <td className="table-cell">{entry.startDate}</td>
                <td className="table-cell">{entry.endDate}</td>
                <td className="table-cell">{entry.monthYear}</td>
                <td className="table-cell">
                  {entry.datesExcluded
                    .filter(excludedDate => {
                      const [month,day,year] = excludedDate.split('/');
                      const correctedDate = `${day}/${month}/${year}`;
                      const date = new Date(correctedDate);
                      const startDate = new Date(entry.startDate);
                      const endDate = new Date(entry.endDate);
                      // console.log(excludedDate);
                      console.log(date);
                      return date >= startDate && date <= endDate;
                    })
                    .join(', ')}
                </td>
                <td className="table-cell">{entry.enterLeadCount}</td>
                <td className="table-cell">{entry.noOfDays}</td>
                <td className="table-cell">{entry.expectedDRR}</td>
                <td className="table-cell">{entry.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default TableDRR;
