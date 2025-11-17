// 주소 저장
async function saveAddress(address) {
    return {
        success: true,
        message: '접속 로그가 저장되었습니다.'
    };
    // 사용량 한도로 인해 잠정 중단

    try {
        // 1. 유저 정보 조회
        const userInfo = await getUserInfo();

        // 2. Google Apps Script URL로 주소 정보 전송
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbyHnkw5Fw4_kAnDbBzo4qMx9M8G8FO5IsvsGnglFpjKXifCDOWQreC7iEphPs_aA3nn/exec';
        
        const formData = {
            user_name: userInfo.name || '',
            phone: userInfo.phone || '',
            deposit: userInfo.remainDeposit || 0,
            prize: userInfo.remainPrize || 0,
            address: address || ''
        };
        
        const fetchOptions = {
            method: "POST",
            mode: 'no-cors',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        };
        
        console.log('주소 저장 전송 시작:', formData);
        await fetch(scriptUrl, fetchOptions);
        console.log('주소 저장 전송 완료 (no-cors 모드에서는 응답 확인 불가)');

        return {
            success: true,
            message: '주소가 저장되었습니다.',
            userInfo: userInfo
        };
    } catch (error) {
        // 에러 로깅만 하고 메인 로직에는 영향 주지 않음
        console.error('주소 저장 실패:', error);
        // 주소 저장 실패는 치명적이지 않으므로 에러를 던지지 않음
        return {
            success: false,
            message: error.message || '주소 저장에 실패했습니다.'
        };
    }
}

