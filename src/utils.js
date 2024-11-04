import { timeParse, bisector } from "d3";
import { enqueueSnackbar } from 'notistack';

export const parseDate = timeParse("%d-%m-%Y");

export const showToast = (message, variant) => {
  enqueueSnackbar(message, { variant });
};

export const getColor = (data) => {
  if (data.length > 0) {
    if (data[0].nav < data[data.length - 1].nav) {
      return "#0fd183";
    } else {
      return "#f55361";
    }
  } else {
    return "blue";
  }
};

export const formatDate = (date) => {
  const d = date instanceof Date ? date : typeof date === "number" ? new Date(date) : parseDate(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

export const bisectDate = (data, x0) => {
  const dateBisector = bisector((d) => d.date).left;
  const index = dateBisector(data, x0, 1);
  const d0 = data[index - 1];
  const d1 = data[index];
  return d1 && (x0 - d0.date > d1.date - x0) ? d1 : d0;
};

export const minMaxMeanMedian = (arr) => {
  if (!arr.length) return [null, null, null, null];

  const sorted = [...arr].sort((a, b) => a - b);
  const n = arr.length;
  const min = sorted[0];
  const max = sorted[n - 1];
  const mean = arr.reduce((sum, value) => sum + value, 0) / n;
  const median = n % 2 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

  return [min, max, mean, median];
};

export const findNavByDate = (data, targetDate) => {
  const target = new Date(targetDate.split("-").reverse().join("-"));

  let left = 0, right = data.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midDate = new Date(data[mid].date.split("-").reverse().join("-"));

    if (midDate.getTime() === target.getTime()) {
      return [data[mid].nav, mid];
    } else if (midDate > target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return [data[right]?.nav, right];
};

export const findCAGRByNAV = (startNav, endNav, time) => {
  startNav = parseFloat(startNav);
  endNav = parseFloat(endNav);
  return parseFloat((((endNav / startNav) ** (1 / time) - 1) * 100).toFixed(2));
};
