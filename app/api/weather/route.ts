export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || "Lucknow";

  const apiKey = process.env.ACCUWEATHER_TOKEN;

  try {
    // 1️⃣ Search city -> get locationKey
    const locationRes = await fetch(
      `https://dataservice.accuweather.com/locations/v1/cities/search?q=${city}&apikey=${apiKey}`
    );

    const locationData = await locationRes.json();
    const locationKey = locationData[0]?.Key;

    if (!locationKey) {
      return Response.json({ error: "City not found" });
    }

    // 2️⃣ Current weather
    const currentRes = await fetch(
      `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`
    );
    const current = await currentRes.json();

    // 3️⃣ Last 24 hours
    const historyRes = await fetch(
      `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}/historical/24?apikey=${apiKey}`
    );
    const history = await historyRes.json();

    // 4️⃣ 5-day forecast
    const forecastRes = await fetch(
      `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`
    );
    const forecast = await forecastRes.json();

    return Response.json({
      city: locationData[0].LocalizedName,
      current,
      history,
      forecast,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Weather fetch failed" },
      { status: 500 }
    );
  }
}