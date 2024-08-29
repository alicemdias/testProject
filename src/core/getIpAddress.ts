//utility function to fetch the user's IP address
export async function getIpAddress(): Promise<[string | null, Error | null]> {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return [data.ip, null];
  } catch (error) {
    return [null, new Error("Unable to retrieve IP address")];
  }
}
