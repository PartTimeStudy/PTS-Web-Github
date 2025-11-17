// 최종 정보 전송
async function submitFinalInfo(userInfo) {
    try {
        // Google Apps Script URL로 정보 전송
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbxsfy2VHYC8xpMRWGAgtJ1advuMhB6IiXHbh5dPuwmhnz6qHizHeWh_Z9xxz6fdqM8V/exec';
        
        const formData = {
            user_name: userInfo.name || '',
            phone: userInfo.phone || '',
            deposit: userInfo.deposit || 0,
            prize: userInfo.prize || 0,
            address: userInfo.address || ''
        };
        
        const fetchOptions = {
            method: "POST",
            mode: 'no-cors',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        };
        
        console.log('최종 정보 전송 시작:', formData);
        await fetch(scriptUrl, fetchOptions);
        console.log('최종 정보 전송 완료 (no-cors 모드에서는 응답 확인 불가)');

        return {
            success: true,
            message: '정보가 전송되었습니다.'
        };
    } catch (error) {
        // 에러 로깅
        console.error('최종 정보 전송 실패:', error);
        // 전송 실패 시 CS 문의 안내
        const csError = new Error('정보 전송에 실패했습니다. 고객센터로 문의해주세요: https://pf.kakao.com/_pXrfs/chat');
        csError.csUrl = 'https://pf.kakao.com/_pXrfs/chat';
        throw csError;
    }
}

