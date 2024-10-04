export async function getHomeQuizResponse(data: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analysis`, {
        method: "POST",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: data, 
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const user = await response.json();
      console.log(user);
      return user;
    } catch (error) {
      console.error("Error in fetching quiz response:", error);
      throw error;
    }
  }
  