import { useState, useEffect } from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import CardExampleCard from "./CardExampleCard";
import axios from "axios";
function Weather() {
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [data, setData] = useState([]);
  const [ipAddress, setIpAddress] = useState("");
  const API_KEY = process.env.REACT_APP_API_KEY.replace(";", "");
  const IP_API_KEY = process.env.REACT_APP_IP_API_KEY.replace(";", "");
  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log(position);
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        },
        async (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            console.log("User denined the location");
            await fetch("https://api.ipify.org/?format=json")
              .then((response) => response.json())
              .then((data) => {
                console.log(data.ip);
                setIpAddress(data.ip);
              })
              .catch((err) => {
                console.log(err);
              });
            try {
              console.log(ipAddress);
              const response = await axios.get(
                `http://api.ipstack.com/${ipAddress}?access_key=${IP_API_KEY}`,
                { crossdomain: true }
              );
              const location = response.data;
              if (typeof location?.latitude != "undefined") {
                setLat(location.latitude);
                setLong(location.longitude);
              } else {
                console.log("could not fetch the location from IP address");
              }
            } catch (error) {
              console.log(error);
            }
          } else {
            console.log("Error occured when retrieving the location");
          }
        }
      );
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${API_KEY}
        `
      )
        .then((res) => res.json())
        .then((result) => {
          setData(result);
        });
    };
    fetchData();
  }, [lat, long]);
  return (
    <div className="App">
      {typeof data.main != "undefined" ? (
        <CardExampleCard weatherData={data} ipAddress={ipAddress} />
      ) : (
        <div>
          <Dimmer active>
            <Loader>Loading..</Loader>
          </Dimmer>
        </div>
      )}
    </div>
  );
}
export default Weather;
