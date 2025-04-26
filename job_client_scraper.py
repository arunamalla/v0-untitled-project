# Add this to the ClientScraper class in job_client_scraper.py

def _extract_stock_symbol(self, client_element) -> str:
    """Extract stock symbol from client element."""
    # Customize for your target site
    stock_element = client_element.select_one(".client-stock")
    return stock_element.text.strip() if stock_element else ""

# Then update the _parse_clients method to include stock_symbol in the client dictionary
client = {
    "name": name_element.text.strip(),
    "industry": industry_element.text.strip() if industry_element else "",
    "description": description_element.text.strip() if description_element else "",
    "address": self._extract_address(client_element),
    "website": self._extract_website(client_element),
    "careers_url": self._extract_careers_url(client_element),
    "logo_url": self._extract_logo_url(client_element),
    "stock_symbol": self._extract_stock_symbol(client_element),
    "categories": self._extract_categories(client_element),
    "source": self.name,
    "scraped_at": datetime.now().isoformat(),
}
