import { useEffect, useState } from "react";
import styles from "./App.module.css";

const API_KEY = "b11d10a0ab194260bf691895d2ea1070";
const URL_API = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`;

function App() {
  const [currencies, setCurrencies] = useState([]);

  const getPercentageValue = (numStr, percentage) => {
    const num = parseFloat(numStr);
    return (num * percentage) / 100;
  };

  const getPurchaserate = (exchangeRate, percentage) => {
    return parseFloat(exchangeRate) + percentage;
  };

  const getSellRate = (exchangeRate, percentage) => {
    return parseFloat(exchangeRate) - percentage;
  };

  const formatApiData = (apiResult) => {
    const allowedCurrencies = ["CAD", "EUR", "IDR", "JPY", "CHF", "GBP"];
  
    const result = {
      curr: {
        title: "Currency",
        value: [],
      },
      purchaseRate: {
        title: "We Buy",
        value: [],
      },
      exchangeRate: {
        title: "Exchange Rate",
        value: [],
      },
      sellRate: {
        title: "We Sell",
        value: [],
      },
    };
  
  
    allowedCurrencies.forEach((key) => {
      if (apiResult.rates[key]) {
        result.curr.value.push(key);
        result.exchangeRate.value.push(apiResult.rates[key]);
  
        const percentage = getPercentageValue(apiResult.rates[key], 5);
        const purchaseRate = getPurchaserate(apiResult.rates[key], percentage);
        const sellRate = getSellRate(apiResult.rates[key], percentage);
  
        result.purchaseRate.value.push(purchaseRate);
        result.sellRate.value.push(sellRate);
      }
    });
  
    // Simpan hasil ke dalam state currencies
    setCurrencies(result);
  };
  
  

  const fetchCurrencyData = async () => {
    try {
      const res = await fetch(URL_API); // Mengirim permintaan ke API

      if (!res.ok) {
        const respJson = await res.json();
        throw respJson; // Melemparkan error jika respon tidak berhasil
      }

      const result = await res.json(); // Mengubah hasil respon menjadi objek JSON
      formatApiData(result); // Memformat data API menggunakan `formatApiData`
    } catch (error) {
      console.error("[fetchCurrencyData]:", error); // Menangani dan mencetak error pada konsol
    }
  };

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.container}>
        {
          Object.keys(currencies).map((currencyKey) => {
            return (
              <div key={currencyKey} style={{ width: "100%" }}>
                <h1 style={{ color: "white", marginBottom: "10px" }}>
                  {currencies[currencyKey].title}
                </h1>
                {
                  currencies[currencyKey].value.map((index, value) => {
                    return (
                      <div key={`${index}-${value}`}>
                        <p style={{ marginBottom: "5px", color: "white" }}>
                          {index}
                        </p>
                      </div>
                    );
                  })
                }
              </div>
            );
          })
        }
      </section>
    </main>
  );
}

export default App;
