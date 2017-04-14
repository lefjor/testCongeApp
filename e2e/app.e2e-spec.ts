import { InfotelCongePage } from './app.po';

describe('infotel-conge App', () => {
  let page: InfotelCongePage;

  beforeEach(() => {
    page = new InfotelCongePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
