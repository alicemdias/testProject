export async function getPostcode(
  postcode: string
): Promise<[string[] | null, Error | null]> {
  try {
    //The postcode input should support autocomplete using an api from https://postcodes.io/ to improve the user experience.
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${postcode}/autocomplete`
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    return [data.result || [], null];
  } catch (error) {
    console.error("Error fetching postcodes:", error);
    return [null, new Error("Unable to retrieve postcodes")];
  }
}
