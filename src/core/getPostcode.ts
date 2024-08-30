//utility function to get postcode from API
export async function getPostcode(
  postcode: string
): Promise<[string[] | null, Error | null]> {
  try {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${postcode}/autocomplete`
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    return [data.result || [], null];
  } catch (error) {
    // eslint-disable-next-line
    console.error("Error fetching postcodes:", error);
    return [null, new Error("Unable to retrieve postcodes")];
  }
}
