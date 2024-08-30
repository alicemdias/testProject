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
    // Log the error details to the console for debugging purposes
    console.error("Failed to retrieve postcode suggestions:", error);
    // Return null for the result and a descriptive error message
    return [
      null,
      new Error(
        "Could not fetch postcode suggestions at this time. Please try again later."
      ),
    ];
  }
}
