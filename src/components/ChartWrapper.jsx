import { useDispatch, useSelector } from 'react-redux';
import { getSelectedFundData, getSelectedFundName, getSelectedFundCode } from '../features/selected/selectedSlice';
import csvDownload from 'json-to-csv-export';
import Box from '@mui/material/Box';
import Search from './Search';
import RollingReturnsWrapper from './RollingReturnWrapper';

const ChartWrapper = () => {
  const dispatch = useDispatch();
  const selectedFundData = useSelector(getSelectedFundData);
  const selectedFundName = useSelector(getSelectedFundName);
  const selectedFundCode = useSelector(getSelectedFundCode);


  return (
    <>
      <Box sx={{ flexGrow: 1, m: "10px" }}>
        <Search />
      </Box>
      {selectedFundName}
      <RollingReturnsWrapper selectedFundName={selectedFundName} navData={selectedFundData} />
    </>
  );
};

export default ChartWrapper;