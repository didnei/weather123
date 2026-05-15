export default async function handler(req, res) {
  const { nx, ny, baseDate, baseTime } = req.query;
  const apiKey = process.env.DATA_GO_KR_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    // 단기예보 조회 서비스 엔드포인트 수정
    const url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
    
    const queryParams = new URLSearchParams({
      serviceKey: apiKey, // 이미 인코딩된 키인 경우 주의 필요
      pageNo: '1',
      numOfRows: '100',
      dataType: 'JSON',
      base_date: baseDate,
      base_time: baseTime,
      nx: nx,
      ny: ny,
    });

    const response = await fetch(`${url}?${queryParams.toString()}`);
    const data = await response.json();

    if (data.response?.header?.resultCode !== '00') {
      throw new Error(data.response?.header?.resultMsg || '기상청 API 응답 오류');
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: '데이터 호출 실패', message: error.message });
  }
}
