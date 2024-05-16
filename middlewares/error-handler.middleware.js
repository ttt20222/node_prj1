export default function (err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    let errorMessage;
    switch (err.message) {
      case '"name" is required':
        errorMessage = '상품명을 입력해 주세요.';
        break;
      case '"description" is required':
        errorMessage = '상품 설명을 입력해 주세요.';
        break;
      case '"manager" is required':
        errorMessage = '담당자를 입력해 주세요.';
        break;
      case '"password" is required':
        errorMessage = '비밀번호를 입력해 주세요.';
        break;
      case '"status" must be one of [FOR_SALE, SOLD_OUT]':
        errorMessage = '상품 상태는 [FOR_SALE,SOLD_OUT] 중 하나여야 합니다.';
        break;
      default:
        errorMessage = '잘못된 입력값입니다.';
    }
    return res.status(400).json({
      errorMessage,
    });
  }

  return res.status(500).json({
    errorMessage: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
  });
}
