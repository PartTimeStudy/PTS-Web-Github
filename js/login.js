// 인증번호 발송
async function sendVerificationCode(phone) {
    try {
        if (!phone || !phone.trim()) {
            throw new Error('전화번호를 입력해주세요.');
        }

        const response = await apiCall('/api/v1/auth/phone/verification', 'POST', {
            phone: phone.trim()
        });

        // API 응답 형식 확인
        if (response.result === 'SUCCESS') {
            return {
                success: true,
                message: response.data || '인증번호가 발송되었습니다.'
            };
        } else if (response.result === 'ERROR') {
            throw new Error(response.error?.message || '인증번호 발송에 실패했습니다.');
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

// 인증번호 확인 및 토큰 발급
async function verifyCode(phone, code) {
    try {
        if (!phone || !phone.trim()) {
            throw new Error('전화번호를 입력해주세요.');
        }

        if (!code || code.trim().length === 0) {
            throw new Error('인증번호를 입력해주세요.');
        }

        const response = await apiCall('/api/v1/auth/phone/verification', 'PUT', {
            phone: phone.trim(),
            secretNumber: code.trim()
        });

        // API 응답 형식 확인
        if (response.result === 'ERROR') {
            const errorCode = response.error?.code;
            const errorMessage = response.error?.message || '인증번호 확인에 실패했습니다.';

            // 특정 에러 코드에 따른 메시지 처리
            if (errorCode === 'PHONE_VERIFICATION_NOT_FOUND') {
                throw new Error('인증번호가 만료되었거나 존재하지 않습니다. 다시 발송해주세요.');
            } else if (errorCode === 'INVALID_SECRET_NUMBER') {
                throw new Error('인증번호가 일치하지 않습니다.');
            } else {
                throw new Error(errorMessage);
            }
        }
        else if (response.result !== 'SUCCESS') {
            throw new Error('알 수 없는 응답 형식입니다.');
        }

        const phoneToken = response.data?.phoneToken;
        
        if (!phoneToken) {
            throw new Error('토큰을 받지 못했습니다.');
        }

        const loginResponse = await apiCall('/api/v1/auth/login/phone', 'POST', {
            phoneToken: phoneToken
        });

        // phoneToken을 저장 (기존 토큰 저장 함수 사용)
        saveToken(loginResponse.data?.accessToken);

        return {
            success: true,
            token: loginResponse.data?.accessToken,
            message: '인증이 완료되었습니다.'
        };
    } catch (error) {
        // HTTP 에러 처리
        if (error.message.includes('HTTP error')) {
            throw new Error('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
        throw error;
    }
}

