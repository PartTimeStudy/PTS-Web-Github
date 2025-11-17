// 현재 금액 조회 (보증금, 상금) (목데이터)
async function getCurrentAmount() {
    // 목데이터: 항상 성공 응답 반환
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                deposit: 100000, // 보증금 10만원
                prize: 50000     // 상금 5만원
            });
        }, 500);
    });
}

// 유저 정보 조회 (목데이터)
async function getUserInfo() {
    // 목데이터: 항상 성공 응답 반환
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: '홍길동',
                phone: '010-1234-5678'
            });
        }, 500);
    });
}


