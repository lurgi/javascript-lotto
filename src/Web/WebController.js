import InputHandler from './View/InputHandler';
import RenderingHandler from './View/RenderingHandler';

import LottoMachine from '../Domain/LottoMachine';
import WinLottoNumber from '../Domain/WinLottoNumber';

export default class WebController {
  #lottoMachine;

  #winLottoNumber;

  async run() {
    RenderingHandler.renderHeader();
    RenderingHandler.renderLottoComponents();
    RenderingHandler.renderFooter();
    RenderingHandler.renderLottoResultModal();

    this.#setMoneyFormEvent();
    // this.#executeResult();
    // await this.#executeRetry();
  }

  #setMoneyFormEvent() {
    const moneyForm = document.getElementById('moneyForm');
    moneyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        const money = Number(e.target.money.value);
        this.#lottoMachine = new LottoMachine(money);
        this.#executeLottos();
      } catch (error) {
        alert(error.message);
      }
    });
  }

  #executeLottos() {
    const boughtLottos = this.#lottoMachine.getLottos();
    RenderingHandler.renderLottosList(boughtLottos);
    this.#setWinLottoNumbersEvent();
  }

  #setWinLottoNumbersEvent() {
    const moneyForm = document.getElementById('winLottoForm');
    moneyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        const winNumbers = Array.from(e.target.winNumber).map((element) => {
          this.#checkNumber(element.value);
          return Number(element.value);
        });
        this.#checkNumber(e.target.bonusNumber.value);
        const bonusNumber = Number(e.target.bonusNumber.value);
        this.#executeWinLottoNumber(winNumbers, bonusNumber);
        this.#executeResult();
      } catch (error) {
        alert(error.message);
      }
    });
  }

  #executeWinLottoNumber(winNumbers, bonusNumber) {
    this.#executeWinLottoNumbers(winNumbers);
    this.#executeBonusNumber(bonusNumber);
  }

  #executeWinLottoNumbers(winLottoNumbers) {
    this.#winLottoNumber = new WinLottoNumber(winLottoNumbers);
  }

  #executeBonusNumber(bonusNumber) {
    this.#winLottoNumber.setBonusNumber(bonusNumber);
  }

  #checkNumber(input) {
    if (!input && input !== '0') {
      throw new Error('입력값 없음');
    }
  }

  #executeResult() {
    const winNumbersObj = this.#winLottoNumber.getWinLottoNumbers();
    const winLottos = this.#lottoMachine.getWinLottos(winNumbersObj);
    const rateOfIncome = this.#lottoMachine.getRateOfIncome(winNumbersObj);

    RenderingHandler.renderLottoResultModal(winLottos, rateOfIncome);
  }

  // async #executeRetry() {
  //   try {
  //     const isRetry = await InputView.readIsRetryRun();
  //     await this.#initializeApp(isRetry);
  //   } catch (error) {
  //     OutputView.printError(error.message);
  //     await this.#executeRetry();
  //   }
  // }

  // async #initializeApp(isRetry) {
  //   if (!isRetry) return;
  //   this.#lottoMachine = undefined;
  //   this.#winLottoNumber = undefined;
  //   await this.run();
  // }
}
