import {test, expect, Page} from '@playwright/test';
import {SearchPage} from '../pages/serachPage';

let searchPage: SearchPage;

test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage();
    await expect(searchPage.page).toHaveURL(/booking/);
  });

test('TC01 Verify that flights are shown when the user searches for todays date', async () => {

    await searchPage.selectOneWayTrip();
    await searchPage.selectDeparture('DEL', 'Delhi International Airport');
    await searchPage.selectDestination('BOM', 'Chhatrapati Shivaji International Airport Mumbai');
    await searchPage.selectTravleDate(searchPage.getTodayDay(), searchPage.getTodayMonth());
    await searchPage.clickOnExploreButton();

  });

// test('TC02 Verify that flights are shown when the user searches for tomorrows date', async () => {

//   });

// test('TC03 Verify that a clear message is shown when no flights are available for the selected route and date', async () => {

//   });