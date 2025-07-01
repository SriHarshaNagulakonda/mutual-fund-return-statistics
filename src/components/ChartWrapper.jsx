import { useDispatch, useSelector } from 'react-redux';
import { getSelectedFundData, getSelectedFundName, getSelectedFundCode } from '../features/selected/selectedSlice';
import csvDownload from 'json-to-csv-export';
import Box from '@mui/material/Box';
import Search from './Search';
import RollingReturnsWrapper from './RollingReturnWrapper';

const ChartWrapper = () => {
  const dispatch = useDispatch();
  const selectedFundData = useSelector(getSelectedFundData);
  const selectedFundNames = useSelector(getSelectedFundName);
  // const selectedFundCode = useSelector(getSelectedFundCode);

<<<<<<< HEAD

  console.log(selectedFundNames);
=======
>>>>>>> table-realign

  return (
    <>
      <Box sx={{ flexGrow: 1, m: "10px" }}>
        <Search />
<<<<<<< HEAD
        {/* <Box sx={{ display: "flex", height: { xs: "calc(100dvh - 120px)", md: "calc(100dvh - 320px)" }, minHeight: 490, maxHeight: 640, backgroundColor: "background.contrast", borderRadius: "5px", color: "text.secondary", flexDirection: "column" }}>
          <Box sx={{ display: "flex", px: "8px", alignItems: "center", minHeight: "50px", borderBottom: 1, borderBottomColor: "border.secondary", justifyContent: "space-between" }}>
            <Typography variant="body1" component="div" sx={{ fontWeight: "bold", mx: "5px" }}>Historical NAV Chart</Typography>
            <Button aria-label="close" variant="outlined" size="small" endIcon={<DownloadIcon/>} 
              disabled={!selectedFundData.length > 0} onClick={handleDownload}>
              Download CSV
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexGrow: 1, minHeight: 430, justifyContent: "center", alignItems: "center" }}>
            <Chart />
          </Box>
        </Box> */}
      </Box>
      <RollingReturnsWrapper navData={selectedFundData} fundNames={selectedFundNames} />
=======
      </Box>
      {selectedFundName}
      <RollingReturnsWrapper selectedFundName={selectedFundName} navData={selectedFundData} />
>>>>>>> table-realign
    </>
  );
};

export default ChartWrapper;