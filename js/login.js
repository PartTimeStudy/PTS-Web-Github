// 인증번호 발송 (목데이터)
async function sendVerificationCode(phone) {
    // 목데이터: 항상 성공 응답 반환
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: '인증번호가 발송되었습니다.'
            });
        }, 500);
    });
}

// 인증번호 확인 및 토큰 발급 (목데이터)
async function verifyCode(phone, code) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 인증번호가 1234인지 확인
            if (code === '1234') {
                const mockToken = 'mock_token_' + Date.now();
                const response = {
                    success: true,
                    token: mockToken,
                    message: '인증이 완료되었습니다.'
                };
                saveToken(mockToken);
                resolve(response);
            } else {
                reject(new Error('인증번호가 일치하지 않습니다. (목데이터: 1234)'));
            }
        }, 500);
    });
}

