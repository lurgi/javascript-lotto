import LottoNumber from './LottoNumber';

const DUPLICATE_MESSAGE = '당첨번호에 중복된 숫자가 존재합니다.';

export default class WinLottoNumber extends LottoNumber {
  #bonusNumber;

  constructor(numbers) {
    super(numbers);
  }

  #validateBonusNumber() {
    this.validateInRangeProtected(this.#bonusNumber);
    this.#validateDuplicate();
  }

  #validateDuplicate() {
    if (this.getLottoNumbers().includes(this.#bonusNumber)) {
      throw new Error(DUPLICATE_MESSAGE);
    }
  }

  setBonusNumber(bonusNumber) {
    this.#bonusNumber = bonusNumber;
    this.#validateBonusNumber();
  }

  getWinLottoNumbers() {
    return {
      winNumbers: this.getLottoNumbers(),
      bonusNumber: this.#bonusNumber,
    };
  }
}
