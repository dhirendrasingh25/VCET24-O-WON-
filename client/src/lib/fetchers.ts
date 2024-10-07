export async function getHomeQuizResponse(data: string) {
    try {
        // Sending request to the backend
        console.log(JSON.stringify(JSON.parse(data)));
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/analysis`,
            {
                method: "POST",
                // headers: {
                //   "Content-Type": "application/json",
                // },
                body: JSON.stringify(JSON.parse(data)), // Ensuring proper JSON formatting
            },
        );

        // Check if the response status is OK
        console.log(response.json);
        const datas = await response.json;
        console.log(datas);
        console.log(JSON.stringify(datas));
        //   console.log(JSON.parse(await response.text()));
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        console.log(JSON.parse(await response.text()));
    } catch (error) {
        console.error("Error in fetching quiz response:", error);
        throw error;
    }
}

export async function finMarket() {
    try {
        // Sending request to the backend
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/news`,
            {
                method: "GET",
            },
        );

        // Check if the response status is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the response as JSON once
        const data = await response.json();
        console.log("Original data:", data);

        // Limit the data to the first 6 objects
        const limitedData = data.slice(0, 6);
        console.log("Limited data:", limitedData);

        return limitedData;
    } catch (error) {
        console.error("Error fetching market news:", error);
        throw error;
    }
}
