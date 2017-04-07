import { UsersCrudAppClientPage } from './app.po';

describe('users-crud-app-client App', function() {
  let page: UsersCrudAppClientPage;

  beforeEach(() => {
    page = new UsersCrudAppClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
