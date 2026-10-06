import { expect, type Page, Locator } from "@playwright/test";

export class SearchPage {

  private oneWayRadio: Locator;
  private departureButton: Locator;
  private departureInput: Locator;
  private departureOption: Locator;
  private removeDepartureButton: Locator;
  private destinationButton: Locator;
  private destinationInput: Locator;
  private destinationOption: Locator;
  private datesButton: Locator;
  private previousMonth: Locator;
  private searchButton: Locator;
  private resultsHeading: Locator;
  private flightResultList: Locator;

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;

    this.oneWayRadio = page.getByRole("radio", {name: "One way"});

    this.departureButton = page.getByRole('button', { name: 'Leaving from' });
    this.departureInput = page.getByRole('combobox', {name: 'Departure airport or city'});
    this.departureOption = page.getByRole('option');
    this.removeDepartureButton = page.locator('//button[contains(@aria-label,"Remove")]');

    this.destinationButton = page.getByRole('button', { name: 'Going to' });
    this.destinationInput = page.getByRole('combobox', {name: 'Arrival airport or city'});
    this.destinationOption = page.getByRole('option');

    this.datesButton = page.getByRole('button', { name: 'Travel dates'});
    this.previousMonth = page.getByRole('button', { name: 'Previous month' });
    this.searchButton = page.getByRole('button', { name: 'Explore' });

    this.resultsHeading = page.getByRole('heading', {name: /We found/});
    this.flightResultList = page.locator('//ul[contains(@class,"List-module")]/li');
  }

  async navigateToSearchPage() {
    await this.page.goto('https://www.booking.com/flights/index.en-gb.html.');
    await this.page.waitForLoadState('networkidle');
  }

  async selectOneWayTrip(){
    await this.oneWayRadio.check();
  }

  async selectDeparture(departure: string, optionName: string){
    await this.departureButton.click();

    while(await this.removeDepartureButton.isVisible()){
      await this.removeDepartureButton.click();
      await this.departureButton.click();
    }
    await this.departureButton.click();
    await this.departureInput.pressSequentially(departure);
    await this.departureOption.filter({ hasText: optionName }).click();
  }

  async selectDestination(destination: string, optionName: string){
    await this.destinationButton.click();
    await this.destinationInput.pressSequentially(destination);
    await this.destinationOption.filter({ hasText: optionName }).click();
  }

  getTodayDay() {
    const today = new Date();
    return today.getDate();
  }

  getTodayMonth() {
    const today = new Date();
    return today.toLocaleString('en-US', { month: 'long' });
  }

  async moveToCurrentMonth(){
    while(await this.previousMonth.isVisible()){
      await this.previousMonth.click();
    }
  }

  async selectTravleDate(day: number, month: string){
    await this.datesButton.click();
    await this.moveToCurrentMonth();

    await this.page.locator(`//h3[contains(text(),"${month}")]/following-sibling::table//td//span[text()="${day}"]`).click();

  }

  async clickOnExploreButton(){
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async validateSearchResults(){
    await expect(this.resultsHeading).toBeVisible();
    const count = await this.flightResultList.count();
    expect(count).toBeGreaterThan(0);
  }

}