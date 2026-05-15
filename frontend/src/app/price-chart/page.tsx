'use client';

import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';

// Mapping nama pasar ke ID
const PASAR_ID_MAP: Record<string, string> = {
  'Pasar Cisaat': '1',
  'Pasar Parungkuda': '2',
  'Pasar Cicurug': '3',
  'Pasar Cibadak': '4',
  'Pasar Sukaraja': '5',
  'Pasar Surade': '6',
  'Pasar Warungkiara': '7',
  'Pasar Palabuhanratu': '8',
};

// Mapping nama komoditas ke ID
const KOMODITAS_ID_MAP: Record<string, string> = {
  'Cabai Rawit Merah': '1',
  'Cabai Merah Besar': '2',
  'Bawang Merah': '3',
  'Beras Medium': '4',
  'Beras': '4',
};

interface PredictData {
  tanggal: string[];
  harga_pasar: Record<string, number>;
  prediksi: Record<string, number | string>;
}

export const fetchCache = 'force-no-store';

export default function PriceChart() {
  const router = useRouter();

  const [marketName, setMarketName] = useState('Pasar Tidak Diketahui');
  const [komoditasName, setKomoditasName] = useState('Komoditas Tidak Diketahui');
  const [isMobile, setIsMobile] = useState(false);
  const [predictData, setPredictData] = useState<PredictData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detect screen size for chart config
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Ambil data dari localStorage dan fetch prediksi
  useEffect(() => {
    const savedMarket = localStorage.getItem('selectedMarket');
    const savedKomoditas = localStorage.getItem('selectedKomoditasRight');

    if (savedMarket) setMarketName(savedMarket);
    if (savedKomoditas) setKomoditasName(savedKomoditas);

    // Tentukan pasar_id dan komoditas_id
    const pasarId = savedMarket ? (PASAR_ID_MAP[savedMarket] || '1') : '1';
    const komoditasId = savedKomoditas ? (KOMODITAS_ID_MAP[savedKomoditas] || '1') : '1';

    // Fetch prediksi dari API
    setIsLoading(true);
    fetch(`/api/predict?pasar_id=${pasarId}&komoditas_id=${komoditasId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.data) {
          setPredictData(data.data);
        } else {
          setError(data.message || 'Gagal mengambil data prediksi.');
        }
      })
      .catch(err => {
        console.error('Fetch predict error:', err);
        setError('Terjadi kesalahan jaringan.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Format tanggal ISO ke label Indonesia
  const formatDateLabel = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return isoDate;
    }
  };

  // Build chart data dari API response
  const { historicalData, predictedData, allPrices, descriptionText } = useMemo(() => {
    if (!predictData) {
      return { historicalData: [], predictedData: [], allPrices: [], descriptionText: '' };
    }

    const { tanggal, harga_pasar, prediksi } = predictData;

    // Historical data: harga pasar (h_min_3, h_min_2, h_min_1, h_min_0)
    // tanggal[0] = today, tanggal[1] = h-1, tanggal[2] = h-2, tanggal[3] = h-3
    const historicalEntries: { date: string; price: number }[] = [];

    // Urutkan dari terlama ke terbaru
    if (harga_pasar.harga_pasar_h_min_3 !== undefined && tanggal[3]) {
      historicalEntries.push({ date: formatDateLabel(tanggal[3]), price: harga_pasar.harga_pasar_h_min_3 });
    }
    if (harga_pasar.harga_pasar_h_min_2 !== undefined && tanggal[2]) {
      historicalEntries.push({ date: formatDateLabel(tanggal[2]), price: harga_pasar.harga_pasar_h_min_2 });
    }
    if (harga_pasar.harga_pasar_h_min_1 !== undefined && tanggal[1]) {
      historicalEntries.push({ date: formatDateLabel(tanggal[1]), price: harga_pasar.harga_pasar_h_min_1 });
    }
    if (harga_pasar.harga_pasar_h_min_0 !== undefined && tanggal[0]) {
      historicalEntries.push({ date: formatDateLabel(tanggal[0]), price: harga_pasar.harga_pasar_h_min_0 });
    }

    // Predicted data: prediksi hari 1, 2, 3 (mulai dari hari ini sebagai titik penghubung)
    const todayStr = prediksi.today ? formatDateLabel(prediksi.today as string) : (tanggal[0] ? formatDateLabel(tanggal[0]) : 'Hari Ini');
    const predictedEntries: { date: string; price: number }[] = [];

    // Titik penghubung: harga hari ini
    if (harga_pasar.harga_pasar_h_min_0 !== undefined) {
      predictedEntries.push({ date: todayStr, price: harga_pasar.harga_pasar_h_min_0 });
    }

    // Prediksi hari ke depan
    const today = prediksi.today ? new Date(prediksi.today as string) : new Date();
    if (prediksi.hari_1 !== undefined) {
      const d1 = new Date(today); d1.setDate(d1.getDate() + 1);
      predictedEntries.push({ date: formatDateLabel(d1.toISOString()), price: Math.round(prediksi.hari_1 as number) });
    }
    if (prediksi.hari_2 !== undefined) {
      const d2 = new Date(today); d2.setDate(d2.getDate() + 2);
      predictedEntries.push({ date: formatDateLabel(d2.toISOString()), price: Math.round(prediksi.hari_2 as number) });
    }
    if (prediksi.hari_3 !== undefined) {
      const d3 = new Date(today); d3.setDate(d3.getDate() + 3);
      predictedEntries.push({ date: formatDateLabel(d3.toISOString()), price: Math.round(prediksi.hari_3 as number) });
    }

    // All prices for Y-axis domain
    const allP = [
      ...historicalEntries.map(e => e.price),
      ...predictedEntries.map(e => e.price),
    ].filter(p => p > 0);

    // Build description
    const todayPrice = harga_pasar.harga_pasar_h_min_0;
    const pred1 = prediksi.hari_1 as number | undefined;
    let desc = '';
    if (todayPrice && pred1) {
      const change = ((pred1 - todayPrice) / todayPrice) * 100;
      if (change >= 0) {
        desc = `Diprediksi terjadi kenaikan harga sebesar ${Math.abs(change).toFixed(1)}% dalam 3 hari ke depan.`;
      } else {
        desc = `Diprediksi terjadi penurunan harga sebesar ${Math.abs(change).toFixed(1)}% dalam 3 hari ke depan.`;
      }
    }

    return { historicalData: historicalEntries, predictedData: predictedEntries, allPrices: allP, descriptionText: desc };
  }, [predictData]);

  // Y-axis domain
  const yDomain = useMemo(() => {
    if (allPrices.length === 0) return [0, 100000];
    const minP = Math.min(...allPrices);
    const maxP = Math.max(...allPrices);
    const padding = (maxP - minP) * 0.15 || 5000;
    return [Math.max(0, Math.floor((minP - padding) / 1000) * 1000), Math.ceil((maxP + padding) / 1000) * 1000];
  }, [allPrices]);

  const handleBreakdown = () => {
    localStorage.setItem('market', marketName);
    localStorage.setItem('komoditas', komoditasName);
    router.push('/breakdown');
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Back Button - Desktop only (top) */}
      <div className="hidden md:flex justify-start px-8 md:px-12 lg:px-20 -translate-y-6 xl:translate-y-4">
        <button
          onClick={() => router.back()}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 py-3 rounded-full shadow-md transition duration-300 flex items-center space-x-2 text-sm md:text-base"
        >
          <HiArrowLeft size={20} color="white" />
          <span>Back</span>
        </button>
      </div>

      <div className="w-[95%] sm:w-[92%] md:w-[90%] lg:w-[95%] xl:w-[95%] mx-auto px-2 sm:px-4 lg:px-12 xl:px-20 py-1 transition-all duration-300">
        {/* Market Selection Pill */}
        <div className="flex justify-center sm:justify-end mb-2">
          <div className="bg-white rounded-full px-4 sm:px-6 py-1.5 sm:py-2 shadow-md text-sm sm:text-base">
            <span className="text-gray-600">{marketName}</span>
            <span className="mx-1.5 sm:mx-2">|</span>
            <span className="text-gray-400">{komoditasName}</span>
          </div>
        </div>

        {/* Loading / Error / Chart */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px] sm:h-[350px]">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-10 w-10 text-[#456882]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-500">Memuat data prediksi...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px] sm:h-[350px]">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
              <p className="text-red-600 font-semibold mb-2">Gagal Memuat Data</p>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chart with vertical label */}
            <div className="mb-1">
              <div className="flex">
                {/* Vertical Label */}
                <div className="hidden sm:flex items-center justify-center w-10 md:w-15 relative z-0">
                  <span className="text-base md:text-xl lg:text-2xl font-bold whitespace-nowrap text-black transform -rotate-90">
                    Harga (Rp)
                  </span>
                </div>
                {/* Chart */}
                <div className="flex-1 relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-96 z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart margin={{ top: 10, right: 20, bottom: isMobile ? 60 : 10, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: isMobile ? 9 : 12, fill: '#6B7280' }}
                        type="category"
                        allowDuplicatedCategory={false}
                        interval={0}
                        padding={{ left: isMobile ? 20 : 100, right: 10 }}
                        angle={isMobile ? -35 : 0}
                        textAnchor={isMobile ? 'end' : 'middle'}
                      />
                      <YAxis
                        domain={yDomain}
                        tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}rb`}
                        tick={{ fontSize: isMobile ? 9 : 12, fill: '#6B7280' }}
                        width={isMobile ? 65 : 85}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const currentPrice = payload[0].value as number;
                            return (
                              <div className="p-2 rounded-lg shadow bg-white border border-gray-200 text-xs sm:text-sm">
                                <p className="text-gray-500">Rp{currentPrice.toLocaleString('id-ID')}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        data={historicalData}
                        type="linear"
                        dataKey="price"
                        stroke="black"
                        strokeWidth={2}
                        dot={{ fill: 'black', r: 4 }}
                        isAnimationActive={false}
                      />
                      <Line
                        data={predictedData}
                        type="linear"
                        dataKey="price"
                        stroke="red"
                        strokeWidth={2}
                        dot={{ fill: 'red', r: 4 }}
                        isAnimationActive={false}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mt-4 sm:mt-6 md:mt-8 gap-4 lg:gap-0">
              {/* Description */}
              <div className="w-full lg:flex-1">
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700">
                  {descriptionText || 'Data prediksi harga komoditas.'}
                </p>
              </div>

              {/* Breakdown Button */}
              <div className="w-full lg:flex-1 flex justify-center lg:border-r-2 lg:border-gray-500 lg:pr-4">
                <button
                  onClick={handleBreakdown}
                  className="bg-[#456882] w-full sm:w-[80%] lg:w-[80%] justify-center text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-[#243039] transition flex items-center space-x-2 text-sm sm:text-base"
                >
                  <span>Breakdown</span>
                  <HiArrowRight />
                </button>
              </div>

              {/* Legend */}
              <div className="w-full lg:flex-1 flex justify-center lg:justify-center">
                <div className="space-y-1.5 sm:space-y-2 text-left">
                  <div className="flex items-center space-x-3 sm:space-x-7 justify-start">
                    <div className="w-10 sm:w-18 h-0.5 bg-red-500 border-dashed border-t-2 border-red-500"></div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">Prediksi 3 Hari Kedepan</span>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-7 justify-start">
                    <div className="w-10 sm:w-18 h-0.5 bg-black"></div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">Harga komoditas sebelumnya</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Back Button - Mobile only (bottom) */}
        <div className="flex md:hidden mt-6 pb-4">
          <button
            onClick={() => router.back()}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2.5 rounded-full shadow-md transition duration-300 flex items-center space-x-2 text-sm"
          >
            <HiArrowLeft size={16} color="white" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </main>
  );
}
