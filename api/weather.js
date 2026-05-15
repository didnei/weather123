export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { nx, ny, baseDate, baseTime } = req.query;

  if (!nx || !ny || !baseDate || !baseTime) {
    return res.status(400).json({
      error: 'Missing parameters: nx, ny, baseDate, baseTime',
    });
  }

  const apiKey = process.env.DATA_GO_KR_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'API key not configured',
    });
  }

  try {
    const url = 'https://api.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst/getVilageFcstList';
    
    const params = new URLSearchParams({
      serviceKey: apiKey,
      pageNo: 1,
      numOfRows: 100,
      dataType: 'JSON',
      base_date: baseDate,
      base_time: baseTime,
      nx: nx,
      ny: ny,
    });

    const response = await fetch(`${url}?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.response?.header?.resultMsg || 'API Error');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error.message);
    return res.status(500).json({
      error: 'Failed to fetch weather data',
      message: error.message,
    });
  }
}
