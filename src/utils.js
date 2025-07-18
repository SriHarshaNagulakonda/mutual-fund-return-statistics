import { timeParse, bisector } from "d3";
import { enqueueSnackbar } from 'notistack';
import moment from 'moment';

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

  return [min.toFixed(2), max.toFixed(2), mean.toFixed(2), median.toFixed(2)];
};

export const findNavByDate = (data, targetDate) => {
  console.log(targetDate);
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

export const calculateRollingReturns = (
  navData,
  rollingPeriod = 3,
  totalRange = 10,
  startDate = null
) => {
  const today = moment();

  let startDateMoment;
  if (startDate) {
    startDateMoment = moment(startDate, 'DD-MM-YYYY');
    if (!startDateMoment.isValid()) {
      return {
        message: `Invalid start date: ${startDate}`,
        statusCode: 403,
        data: {}
      };
    }
  } else if (totalRange === -1) {
    const lastDate = navData[navData.length - 1]?.date;
    startDateMoment = moment(lastDate, 'DD-MM-YYYY');
  } else {
    startDateMoment = today.clone().subtract(totalRange * 12, 'months');
  }

  const durationYears = today.diff(startDateMoment, 'months') / 12;

  if (rollingPeriod > durationYears) {
    return {
      message: `Rolling period (${rollingPeriod}Y) exceeds available range (${durationYears.toFixed(2)}Y)`,
      statusCode: 403,
      data: {}
    };
  }

  const [startDateNav, startDateIndex] = findNavByDate(navData, startDateMoment.format('DD-MM-YYYY'));

  console.log(startDateIndex, startDateNav);

  if (!startDateNav) {
    return {
      message: `Scheme is started on ${navData[navData.length - 1]?.date}`,
      statusCode: 403,
      data: {}
    };
  }

  const rollingEndMoment = startDateMoment.clone().add(rollingPeriod * 12, 'months');
  const [rollingEndDateNav, rollingEndIndex] = findNavByDate(navData, rollingEndMoment.format('DD-MM-YYYY'));

  const rollingCAGRs = [];
  const startDates = [];

  let currStartIndex = startDateIndex;
  for (let endIndex = rollingEndIndex; endIndex >= 0 && currStartIndex >= 0; endIndex--) {
    const startNav = navData[currStartIndex]?.nav;
    const endNav = navData[endIndex]?.nav;
    const cagr = findCAGRByNAV(startNav, endNav, rollingPeriod);

    rollingCAGRs.push(cagr);
    startDates.push(navData[endIndex]?.date);
    currStartIndex--;
  }

  const [minCagr, maxCagr, meanCagr, medianCagr] = minMaxMeanMedian(rollingCAGRs);

  const percentageDistribution = {
    "<0%": 0, "0-8%": 0, "8-12%": 0, "12-15%": 0, "15-20%": 0, ">20%": 0
  };

  rollingCAGRs.forEach(cagr => {
    if (cagr < 0) percentageDistribution['<0%']++;
    else if (cagr <= 8) percentageDistribution['0-8%']++;
    else if (cagr <= 12) percentageDistribution['8-12%']++;
    else if (cagr <= 15) percentageDistribution['12-15%']++;
    else if (cagr <= 20) percentageDistribution['15-20%']++;
    else percentageDistribution['>20%']++;
  });

  const todayNav = navData[0]?.nav;

  return {
    [`${durationYears.toFixed(2)}Y CAGR`]: findCAGRByNAV(startDateNav, todayNav, durationYears),
    avgCAGR: meanCagr,
    minCAGR: minCagr,
    maxCAGR: maxCagr,
    medianCAGR: medianCagr,
    percentageDistribution,
    percentageDistributionPercent: Object.fromEntries(
      Object.entries(percentageDistribution).map(([key, val]) => [
        key,
        parseFloat((val * 100 / rollingCAGRs.length).toFixed(2))
      ])
    ),
    dates: startDates,
    cagrs: rollingCAGRs
  };
};
