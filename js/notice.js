// 접속 로그 저장
async function saveAccessLog(){
    return {
        success: true,
        message: '접속 로그가 저장되었습니다.'
    };
    // 사용량 한도로 인해 잠정 중단

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

// 공지 이미지 7번 연속 터치로 계정 정보 삭제 및 로그인 화면 이동
function setupImageTapToLogout() {
    const noticeImage = document.getElementById('noticeImage');
    if (!noticeImage) return;

    let tapCount = 0;
    let tapTimer = null;
    let lastTapTime = 0;
    const TAP_TIMEOUT = 2000; // 2초 내에 7번 터치해야 함
    const REQUIRED_TAPS = 7;
    const CLICK_DELAY = 300; // 터치 후 클릭 이벤트 무시 시간 (ms)

    // 터치 이벤트 핸들러 (7번 터치로 계정 정보 삭제 및 로그인 화면 이동)
    function handleTap(e) {
        const currentTime = Date.now();
        
        // 터치 이벤트인 경우
        if (e.type === 'touchstart') {
            e.preventDefault();
            lastTapTime = currentTime;
        } else {
            // 클릭 이벤트인 경우, 최근 터치 이벤트가 있었다면 무시 (중복 방지)
            if (currentTime - lastTapTime < CLICK_DELAY) {
                return;
            }
        }
        
        // 타이머 리셋
        if (tapTimer) {
            clearTimeout(tapTimer);
        }

        tapCount++;

        // 7번 터치 완료
        if (tapCount >= REQUIRED_TAPS) {
            tapCount = 0;
            if (tapTimer) {
                clearTimeout(tapTimer);
                tapTimer = null;
            }

            // localStorage에서 계정 정보 삭제
            removeToken();
            
            // 팝업 없이 로그인 페이지로 리다이렉트
            window.location.href = 'login.html';
            return;
        }

        // 타이머 설정: 일정 시간 내에 다음 터치가 없으면 카운트 리셋
        tapTimer = setTimeout(() => {
            tapCount = 0;
            tapTimer = null;
        }, TAP_TIMEOUT);
    }

    // 터치 이벤트 리스너 추가 (모바일)
    noticeImage.addEventListener('touchstart', handleTap, { passive: false });
    
    // 클릭 이벤트도 지원 (데스크톱 테스트용)
    noticeImage.addEventListener('click', handleTap);
}

