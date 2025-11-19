// 최종 정보 전송
async function submitFinalInfo(userInfo) {
    // 상수 정의
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxsfy2VHYC8xpMRWGAgtJ1advuMhB6IiXHbh5dPuwmhnz6qHizHeWh_Z9xxz6fdqM8V/exec';
    
    // 데이터 추출
    const deposit = userInfo.deposit || 0;
    const prize = userInfo.prize || 0;
    
    const shouldSubmit = prize > 0 || deposit > 0;
    
    if (!shouldSubmit) {
        console.log('전송 조건 미충족: deposit=', deposit, 'prize=', prize, '- 전송하지 않습니다.');
        return {
            success: true,
            message: '정보가 전송되었습니다.'
        };
    }
    
    try {
        // 전송할 데이터 구성
        const formData = {
            user_name: userInfo.name || '',
            phone: userInfo.phone || '',
            deposit: deposit,
            prize: prize,
            address: userInfo.address || ''
        };
        
        // API 호출
        const fetchOptions = {
            method: "POST",
            mode: 'no-cors',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        };
        
        console.log('최종 정보 전송 시작:', formData);
        await fetch(SCRIPT_URL, fetchOptions);
        console.log('최종 정보 전송 완료 (no-cors 모드에서는 응답 확인 불가)');

        return {
            success: true,
            message: '정보가 전송되었습니다.'
        };
    } catch (error) {
        console.error('최종 정보 전송 실패:', error);
        const csError = new Error('정보 전송에 실패했습니다. 고객센터로 문의해주세요: https://pf.kakao.com/_pXrfs/chat');
        csError.csUrl = 'https://pf.kakao.com/_pXrfs/chat';
        throw csError;
    }
}

