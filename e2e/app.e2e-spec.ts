import { MeanAppNg2Page } from './app.po';

describe('mean-app-ng2 App', function() {
  let page: MeanAppNg2Page;

  beforeEach(() => {
    page = new MeanAppNg2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
