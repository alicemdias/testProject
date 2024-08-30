/**
 * Utility function to fetch the user's public IP address.
 *
 * This function makes an HTTP GET request to the `ipify` API to retrieve the user's IP address.
 * It returns a tuple where the first element is the IP address as a string (or null if there was an error),
 * and the second element is an Error object (or null if the request was successful).
 *
 * @returns {Promise<[string | null, Error | null]>} A promise that resolves to a tuple containing the IP address or null, and an Error or null.
 */
export async function getUserIpAddress(): Promise<
  [string | null, Error | null]
> {
  try {
    // Make a request to the ipify API to fetch the public IP address
    const response = await fetch("https://api.ipify.org?format=json");
    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Return the IP address from the API response
    return [data.ip, null];
  } catch (error) {
    return [
      null,
      new Error(
        "Could not obtain IP address. Check your internet connection and attempt again later"
      ),
    ];
  }
}
