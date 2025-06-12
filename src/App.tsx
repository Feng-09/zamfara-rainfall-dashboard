import { useEffect, useRef, useState } from 'react'
import './App.css'
import CSVUploader from "./components/CSVUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import BarChart from "@/components/barChart";
import LineChart from "@/components/lineChart";

type RainfallDataType = string[][];

function App() {
  const [rainfallData, setRainfallData] = useState<RainfallDataType>([]);
  const [lgas, setLgas] = useState<string[]>([]);
  const [selectedLga, setSelectedLga] = useState<string>("All");
  const [filteredData, setFilteredData] = useState<RainfallDataType>([]);
  const [year, setYear] = useState<number>(1);
  const [droughtLGAs, setDroughtLGAs] = useState<string[]>([]);
  const [floodLGAs, setFloodLGAs] = useState<string[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rainfallData.length > 0) {
      const lgaColumn = rainfallData.slice(1).map(row => row[0]);
      const dataLgas = Array.from(new Set(lgaColumn));
      setLgas(["All", ...dataLgas]);

      analyzeLGAs(rainfallData.slice(1))
    }
  }, [rainfallData])

  useEffect(() => {
    if (selectedLga === 'All') {
      setFilteredData(rainfallData.slice(1))
    } else {
      setFilteredData(rainfallData.slice(1).filter(row => row[0] === selectedLga))
    }
  }, [selectedLga, rainfallData]);

  const formatData = (data: RainfallDataType, year: number) => {
    const allMonths = rainfallData[0] && rainfallData[0].slice(1);
    const start = year === 1 ? 0 : (year - 1) * 12;
    const months = allMonths && allMonths.slice(start, start + 12);

    let yearlyRainfallData: number[] = [];

    if (selectedLga === "All") {
      // Total monthly rainfall across all LGAs
      const lgaDataOnly = rainfallData.slice(1); // skip header

      yearlyRainfallData = new Array(12).fill(0); // one per month in year

      lgaDataOnly.forEach((lgaRow) => {
        const monthlyValues = lgaRow.slice(1).map(Number); // remove LGA name
        const yearSlice = monthlyValues.slice(start, start + 12);

        yearSlice.forEach((val, idx) => {
          yearlyRainfallData[idx] += isNaN(val) ? 0 : val;
        });
      });
    } else {
      // Regular single LGA rainfall
      const rawFilteredData = data[0] && data[0].slice(1);
      const yearlyRainfallDataString = rawFilteredData && rawFilteredData.slice(start, start + 12);
      yearlyRainfallData = yearlyRainfallDataString && yearlyRainfallDataString.map(Number);
    }

    return {
      labels: months,
      datasets: [
        {
          data: yearlyRainfallData,
        },
      ],
    };
  };


  const analyzeLGAs = (
    data: RainfallDataType,
  ) => {
    const drought: string[] = [];
    const flood: string[] = [];

    data.forEach((row) => {
      const lgaName = row[0];
      const monthlyRainfall = row.slice(1).map((val) => parseFloat(val) || 0);

      const yearlyTotals: number[] = [];
      for (let i = 0; i < monthlyRainfall.length; i += 12) {
        const yearSlice = monthlyRainfall.slice(i, i + 12);
        const total = yearSlice.reduce((sum, val) => sum + val, 0);
        yearlyTotals.push(total);
      }

      const averageAnnual = yearlyTotals.reduce((a, b) => a + b, 0) / yearlyTotals.length;

      if (averageAnnual < 770) {
        drought.push(lgaName);
      } else if (averageAnnual > 950) {
        flood.push(lgaName);
      }
    });

    setDroughtLGAs(drought);
    setFloodLGAs(flood);
  }

  const print = () => {
    if (printRef.current) {
      window.print();
    }
  }

  return (
    <>
    <main className="flex flex-col gap-8">
      <h1 className="font-montserrat text-2xl">Zamfara Rainfall Dashboard</h1>
      <h2 className="font-montserrat text-lg">Hydrology (TCE 415) Group 4</h2>

      <CSVUploader onDataParsed={setRainfallData} />

      <Select onValueChange={(value) => setSelectedLga(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="LGA" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Zamfara State</SelectLabel>
            {lgas && lgas.map((lga, id) => (
              <SelectItem value={lga} key={id}>{lga}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Tabs defaultValue="drought" ref={printRef} className='print-area'>
        <TabsList className='print:hidden'>
          <TabsTrigger value="drought">Drought/Flood</TabsTrigger>
          <TabsTrigger value="profile">Rainfall Profile</TabsTrigger>
        </TabsList>

        <Select onValueChange={(value) => setYear(Number(value))}>
          <SelectTrigger className="w-[80px] print:hidden">
            <SelectValue placeholder="Year" className='print:hidden' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Year</SelectLabel>
              {rainfallData[0] && Array.from({ length: (Math.ceil(rainfallData[0].slice(1).length / 12)) }).map((_, id) => (
                <SelectItem value={(id + 1).toString()} key={id}>Year {(id + 1).toString()}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {!rainfallData[0] ? (
          <p className='font-montserrat text-center'>You have not uploaded Rainfall data</p>
        ) : null}

        <p className='font-montserrat hidden print:block'>{selectedLga} LGA Monthly Rainfall Distribution</p>

        <TabsContent value="drought" className='flex flex-col items-center gap-4'>
          {rainfallData[0] && (<BarChart data={formatData(filteredData, year)} />)}
          {rainfallData[0] && (
            <div className="flex max-sm:justify-between gap-1 sm:gap-4 mt-4">
              <div className="flex items-center sm:gap-2">
                <span className="w-4 h-4 opacity-60 bg-green-400 rounded-sm border border-green-600" />
                <span className='font-montserrat text-xs sm:text-sm font-light'>Normal Rainfall</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="w-4 h-4 opacity-60 bg-red-400 rounded-sm border border-red-500" />
                <span className='font-montserrat text-xs sm:text-sm font-light'>Low Rainfall</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="w-4 h-4 opacity-60 bg-blue-400 rounded-sm border border-blue-500" />
                <span className='font-montserrat text-xs sm:text-sm font-light'>High Rainfall</span>
              </div>
            </div>
          )}
          {rainfallData[0] && (
            <div className='flex flex-col self-start gap-6'>
              <div className='flex flex-col items-start gap-1'>
                <p className='font-montserrat mb-1'>Drought Prone LGAs</p>
                {droughtLGAs.length > 0 ? droughtLGAs.map((item, id) => (
                  <div className='flex gap-2 items-center' key={id}>
                    <div className='bg-red-400 opacity-60 rounded-full h-2 w-2'></div>
                    <p className='font-montserrat text-sm'>{item}</p>
                  </div>
                )) : (
                  <p className='font-montserrat text-sm text-start'>There are no drought prone LGAs in the data provided</p>
                )}
              </div>
              <div className='flex flex-col items-start gap-1'>
                <p className='font-montserrat mb-1'>Flood Prone LGAs</p>
                {floodLGAs.length > 0 ? floodLGAs.map((item, id) => (
                  <div className='flex gap-2 items-center' key={id}>
                    <div className='bg-blue-400 opacity-60 rounded-full h-2 w-2'></div>
                    <p className='font-montserrat text-sm'>{item}</p>
                  </div>
                )) : (
                  <p className='font-montserrat text-sm text-start'>There are no flood prone LGAs in the data provided</p>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile">
          {rainfallData[0] && (<LineChart data={formatData(filteredData, year)} />)}
        </TabsContent>
      </Tabs>

      {rainfallData[0] && (
        <div className='font-montserrat px-4 py-2 border border-slate-700 rounded-lg self-center' onClick={print}>Print Chart</div>
      )}
    </main>
    </>
  )
}

export default App
