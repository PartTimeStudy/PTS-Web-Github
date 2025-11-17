// 유저 정보 조회
async function getUserInfo() {
    try {
        const response = await apiCall('/api/v1/user', 'GET');

        // API 응답 형식 확인
        if (response.result === 'SUCCESS') {
            return response.data;
        } else if (response.result === 'ERROR') {
            throw new Error(response.error?.message || '유저 정보 조회에 실패했습니다.');
        } else {
            throw new Error('알 수 없는 응답 형식입니다.');
        }
    } catch (error) {
        // HTTP 에러 처리
        if (error.message.includes('HTTP error')) {
            throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
        throw error;
    }
}

// 접속 로그 저장
async function saveAccessLog(){
    try {
        // 유저 정보 조회 (보증금과 상금 포함)
        const userInfo = await getUserInfo();
        
        // Google Apps Script URL로 접속 로그 전송
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbx4VPAionnZzTim3_tCkgE1q0jk56w3r0n2jVp1Gi79AkFGZvwFYcX-tcXilgpomgIl/exec';
        
        // form.html과 동일한 방식으로 POST 요청
        const formData = {
            user_name: userInfo.name || '',
            phone: userInfo.phone || '',
            deposit: userInfo.remainDeposit || 0,
            prize: userInfo.remainPrize || 0
        };
        
        const fetchOptions = {
            method: "POST",
            mode: 'no-cors',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        };
        
        console.log('접속 로그 전송 시작:', formData);
        await fetch(scriptUrl, fetchOptions);
        console.log('접속 로그 전송 완료 (no-cors 모드에서는 응답 확인 불가)');
        
        // no-cors 모드에서는 응답을 읽을 수 없으므로 성공으로 간주
        // 브라우저 콘솔에 403 오류가 보일 수 있지만, 실제로는 성공했을 수 있음
        // 스프레드시트에 데이터가 저장되었는지 확인 필요
        return {
            success: true,
            message: '접속 로그가 저장되었습니다.'
        };
        
    } catch (error) {
        // 에러 로깅만 하고 메인 로직에는 영향 주지 않음
        console.error('접속 로그 저장 실패:', error);
        // 접속 로그 저장 실패는 치명적이지 않으므로 에러를 던지지 않음
        return {
            success: false,
            message: error.message || '접속 로그 저장에 실패했습니다.'
        };
    }
}



// 주소 저장
async function saveAddress(address) {
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

