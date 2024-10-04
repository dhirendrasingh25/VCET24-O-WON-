export async function getHomeQuizResponse(data: string) {
    try {
      // Sending request to the backend
      console.log(JSON.stringify( JSON.parse(data) ));
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analysis`, {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: JSON.stringify(JSON.parse(data)),  // Ensuring proper JSON formatting
      });
  
      // Check if the response status is OK
      console.log(response);
      console.log(JSON.parse(await response.text()));
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      // Try to parse the response as JSON

      console.log(JSON.parse(await response.text()));
  
    } catch (error) {
      console.error("Error in fetching quiz response:", error);
      throw error;
    }
  }
  